import { spawn } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import http from 'node:http'
import net from 'node:net'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// Starts `vite preview` and checks every sitemap URL in both slash forms.
// A trailing slash must 301 to the slashless URL. After that redirect, the
// page's canonical must equal the sitemap <loc>. Legacy paths must 301 to
// the current page, and unknown URLs must stay 404.

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const viteBin = path.join(root, 'node_modules', 'vite', 'bin', 'vite.js')

const readCanonical = (html) => {
  const tags = html.match(/<link\b[^>]*>/gi) || []
  for (const tag of tags) {
    if (!/rel=["']canonical["']/i.test(tag)) continue
    return (tag.match(/href=["']([^"']+)["']/i)?.[1] || '').replace(/&amp;/g, '&')
  }
  return ''
}

const readTitle = (html) => {
  const raw = html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.trim() || ''
  return raw
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
}

const sitemapLocs = () => {
  const built = path.join(root, 'dist', 'sitemap.xml')
  const source = path.join(root, 'public', 'sitemap.xml')
  const file = existsSync(built) ? built : source
  const xml = readFileSync(file, 'utf8')
  const locs = [...xml.matchAll(/<loc>\s*([^<]+)\s*<\/loc>/g)].map((match) => match[1].trim())
  if (!locs.length) throw new Error(`No <loc> entries in ${path.relative(root, file)}.`)
  return locs
}

const freePort = () =>
  new Promise((resolve, reject) => {
    const server = net.createServer()
    server.once('error', reject)
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address()
      server.close(() => resolve(port))
    })
  })

const request = (port, requestPath) =>
  new Promise((resolve, reject) => {
    const req = http.get({ hostname: '127.0.0.1', port, path: requestPath }, (res) => {
      const chunks = []
      res.on('data', (chunk) => chunks.push(chunk))
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          location: res.headers.location || '',
          body: Buffer.concat(chunks).toString('utf8'),
        })
      })
    })
    req.setTimeout(15000, () => req.destroy(new Error(`timeout ${requestPath}`)))
    req.on('error', reject)
  })

const locationPath = (location) => {
  if (!location) return ''
  if (location.startsWith('/')) return location
  const url = new URL(location)
  return `${url.pathname}${url.search}`
}

const follow = async (port, requestPath) => {
  let current = requestPath
  const hops = []
  for (let i = 0; i < 5; i += 1) {
    const res = await request(port, current)
    hops.push({ path: current, status: res.status, location: res.location })
    if (res.status >= 300 && res.status < 400 && res.location) {
      current = locationPath(res.location)
      continue
    }
    return { ...res, hops, finalPath: current }
  }
  throw new Error(`too many redirects from ${requestPath}`)
}

const waitForPreview = async (port, child, logs) => {
  const started = Date.now()
  while (Date.now() - started < 30000) {
    if (child.exitCode !== null) {
      throw new Error(`vite preview exited ${child.exitCode}\n${logs()}`)
    }
    try {
      const res = await request(port, '/')
      if (res.status === 200 && readCanonical(res.body)) return
    } catch {
      // Preview is not accepting connections yet.
    }
    await new Promise((resolve) => setTimeout(resolve, 200))
  }
  throw new Error(`vite preview did not become ready\n${logs()}`)
}

const legacyCases = [
  ['/about-us', '/about'],
  ['/about-us?utm_source=google', '/about?utm_source=google'],
  ['/about-us-menu/company', '/about'],
  ['/about-us-menu/team/jane?ref=1', '/about?ref=1'],
  ['/term_conditions', '/terms'],
  ['/term_conditions/privacy-old?lang=en', '/terms?lang=en'],
  ['/careers', '/career'],
  ['/careers/openings/engineer?src=1', '/career?src=1'],
  ['/product_detail/42', '/products'],
  ['/product_detail/lms/module?x=1&y=2', '/products?x=1&y=2'],
]

const notFoundCases = [
  '/does-not-exist',
  '/does-not-exist/',
  '/blog/a/b',
  '/blog/a/b/',
  '/about-us/',
  '/about-us-menu',
  '/about-us-menu/',
  '/product_detail',
  '/product_detail/',
  '/careers/',
  '/term_conditions/',
]

const main = async () => {
  if (!existsSync(path.join(root, 'dist', 'index.html'))) {
    throw new Error('dist/index.html is missing. Run npm run build first.')
  }
  if (!existsSync(viteBin)) throw new Error('vite is not installed. Run npm ci first.')

  const locs = sitemapLocs()
  const port = await freePort()
  let log = ''
  const child = spawn(process.execPath, [viteBin, 'preview', '--host', '127.0.0.1', '--port', String(port), '--strictPort'], {
    cwd: root,
    stdio: ['ignore', 'pipe', 'pipe'],
  })
  const append = (chunk) => {
    log = `${log}${chunk}`.slice(-8000)
  }
  child.stdout.on('data', append)
  child.stderr.on('data', append)

  const stop = () =>
    new Promise((resolve) => {
      if (child.exitCode !== null) return resolve()
      const timer = setTimeout(() => {
        child.kill('SIGKILL')
        resolve()
      }, 2000)
      child.once('exit', () => {
        clearTimeout(timer)
        resolve()
      })
      child.kill('SIGTERM')
    })

  const failures = []
  const report = []
  const fail = (message) => failures.push(message)

  try {
    await waitForPreview(port, child, () => log)

    for (const loc of locs) {
      const pathname = new URL(loc).pathname
      const slashless = pathname === '/' ? '/' : pathname.replace(/\/+$/, '')
      const direct = await request(port, slashless)
      const directCanonical = readCanonical(direct.body)
      const directTitle = readTitle(direct.body)
      if (direct.status !== 200) fail(`${slashless} status ${direct.status}, want 200`)
      if (directCanonical !== loc) fail(`${slashless} canonical ${directCanonical || '(none)'}, want ${loc}`)
      if (!directTitle) fail(`${slashless} is missing a title`)

      if (pathname !== '/') {
        const slashed = `${slashless}/`
        const first = await request(port, slashed)
        const target = locationPath(first.location)
        if (first.status !== 301) fail(`${slashed} status ${first.status}, want 301`)
        if (target !== slashless) fail(`${slashed} location ${first.location || '(none)'}, want ${slashless}`)
        const followed = await follow(port, `${slashed}?check=1`)
        if (followed.status !== 200) fail(`${slashed}?check=1 final status ${followed.status}, want 200`)
        if (readCanonical(followed.body) !== loc) {
          fail(`${slashed} canonical ${readCanonical(followed.body) || '(none)'}, want ${loc}`)
        }
        if (readTitle(followed.body) !== directTitle) {
          fail(`${slashed} title ${readTitle(followed.body) || '(none)'}, want ${directTitle}`)
        }
        if (followed.hops[0]?.location && locationPath(followed.hops[0].location) !== `${slashless}?check=1`) {
          fail(`${slashed}?check=1 location ${followed.hops[0].location}, want ${slashless}?check=1`)
        }
      }
    }

    const highlight = [
      '/',
      '/about',
      '/about/',
      '/blog/delayed-financial-reporting-ca-ai',
      '/blog/delayed-financial-reporting-ca-ai/',
    ]
    for (const requestPath of highlight) {
      const res = await follow(port, requestPath)
      const first = res.hops[0]
      const where = first.location ? ` -> ${locationPath(first.location)}` : ''
      report.push(
        `${requestPath} ${first.status}${where} | ${readTitle(res.body)} | ${readCanonical(res.body)}`,
      )
    }

    for (const [requestPath, expected] of legacyCases) {
      const res = await request(port, requestPath)
      const target = locationPath(res.location)
      if (res.status !== 301) fail(`${requestPath} status ${res.status}, want 301`)
      if (target !== expected) fail(`${requestPath} location ${res.location || '(none)'}, want ${expected}`)
      report.push(`${requestPath} ${res.status} -> ${target || '(none)'}`)
    }

    for (const requestPath of notFoundCases) {
      const res = await request(port, requestPath)
      if (res.status !== 404) fail(`${requestPath} status ${res.status}, want 404`)
      report.push(`${requestPath} ${res.status}`)
    }

    const unknownSlug = await request(port, '/blog/not-a-real-post')
    const unknownSlashed = await request(port, '/blog/not-a-real-post/')
    if (unknownSlug.status !== 200) fail(`/blog/not-a-real-post status ${unknownSlug.status}, want 200`)
    if (unknownSlashed.status !== 200) fail(`/blog/not-a-real-post/ status ${unknownSlashed.status}, want 200`)
    report.push(`/blog/not-a-real-post ${unknownSlug.status}`)
    report.push(`/blog/not-a-real-post/ ${unknownSlashed.status}`)

    if (failures.length) {
      process.stderr.write(`${failures.length} check${failures.length === 1 ? '' : 's'} failed:\n`)
      for (const failure of failures) process.stderr.write(`  ${failure}\n`)
      process.exitCode = 1
      return
    }

    process.stdout.write(`Checked ${locs.length} sitemap URLs in both slash forms. Canonicals match.\n`)
    for (const line of report) process.stdout.write(`${line}\n`)
  } finally {
    await stop()
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
