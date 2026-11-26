import fs from 'node:fs'
import path from 'node:path'

// Vite preview looks up an extensionless URL as a file, then as `$uri.html`.
// It serves `$uri/index.html` only when the URL already ends with `/`.
// Prerender writes `dist/<route>/index.html` and `dist/<route>.html`. The
// sitemap URLs and their canonicals have no trailing slash, so a request for
// `/about/` must not fall through to `dist/index.html` (the homepage).
//
// This runs before that fallback.
// - The legacy paths below 301 to the current page. The query string is kept.
// - `/route/` 301s to `/route` when that prerendered file (or another real
//   file) exists, which matches the canonical. `/` is left as it is.
// - A slashless route is rewritten to its prerendered file.
// - One unknown slug under /blog, /services, or /portfolio still boots the
//   app. Every other miss is a 404 with dist/404.html.

const DYNAMIC_SLUG = /^\/(?:blog|portfolio|services)\/[^/]+\/?$/

// Exact paths, plus at least one extra character under the old prefixes.
// `/about-us/` and `/product_detail` alone are not in this list.
const LEGACY_REDIRECTS = [
  [/^\/about-us$/, '/about'],
  [/^\/about-us-menu\/.+/, '/about'],
  [/^\/term_conditions$/, '/terms'],
  [/^\/term_conditions\/.+/, '/terms'],
  [/^\/careers$/, '/career'],
  [/^\/careers\/.+/, '/career'],
  [/^\/product_detail\/.+/, '/products'],
]

const legacyTarget = (pathname) => {
  for (const [pattern, target] of LEGACY_REDIRECTS) {
    if (pattern.test(pathname)) return target
  }
  return null
}

const isInside = (root, file) => {
  const relative = path.relative(root, file)
  return relative === '' || (!relative.startsWith(`..${path.sep}`) && relative !== '..' && !path.isAbsolute(relative))
}

const asFile = (root, relPosix) => {
  if (!relPosix || relPosix.split('/').includes('..')) return null
  const file = path.resolve(root, ...relPosix.split('/').filter(Boolean))
  if (!isInside(root, file)) return null
  try {
    if (!fs.statSync(file).isFile()) return null
  } catch {
    return null
  }
  return file
}

const sendPlainNotFound = (req, res) => {
  res.statusCode = 404
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Content-Type', 'text/plain; charset=utf-8')
  res.end(req.method === 'HEAD' ? undefined : 'Not Found')
}

const sendHtmlNotFound = (req, res, distDir) => {
  const notFound = asFile(distDir, '404.html')
  res.statusCode = 404
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  if (req.method === 'HEAD' || !notFound) {
    res.end()
    return
  }
  const stream = fs.createReadStream(notFound)
  stream.on('error', () => {
    if (!res.headersSent) res.statusCode = 404
    res.end()
  })
  stream.pipe(res)
}

const sendRedirect = (res, location) => {
  res.statusCode = 301
  res.setHeader('Location', location)
  res.end()
}

// The file a slashless path would serve: the path itself, `<path>/index.html`,
// or `<path>.html`. `/` maps to `index.html`.
const pageFile = (distDir, pathname) => {
  const bare = pathname.length > 1 && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname
  const rel = bare.replace(/^\/+/, '')
  const exact = rel ? asFile(distDir, rel) : null
  const indexHtml = asFile(distDir, rel ? `${rel}/index.html` : 'index.html')
  const flatHtml = rel && !path.posix.extname(rel) ? asFile(distDir, `${rel}.html`) : null
  return { bare, file: exact || indexHtml || flatHtml }
}

export function previewPrerenderedRoutes() {
  return {
    name: 'preview-prerendered-routes',
    configurePreviewServer(server) {
      const distDir = path.resolve(server.config.root, server.config.build.outDir)

      // Registered before Vite's static and HTML-fallback middleware.
      server.middlewares.use((req, res, next) => {
        if (req.method !== 'GET' && req.method !== 'HEAD') return next()

        const raw = req.url || '/'
        const queryAt = raw.indexOf('?')
        const pathOnly = queryAt === -1 ? raw : raw.slice(0, queryAt)
        const search = queryAt === -1 ? '' : raw.slice(queryAt)

        let pathname
        try {
          pathname = decodeURIComponent(pathOnly)
        } catch {
          res.statusCode = 400
          res.setHeader('Content-Type', 'text/plain; charset=utf-8')
          res.end('Bad Request')
          return
        }

        if (!pathname.startsWith('/') || pathname.includes('\0') || pathname.includes('\\')) {
          sendPlainNotFound(req, res)
          return
        }

        const legacy = legacyTarget(pathname)
        if (legacy) {
          sendRedirect(res, `${legacy}${search}`)
          return
        }

        // One trailing slash, and only when the slashless path is a real file.
        // Unknown URLs are not redirected; they 404 below.
        if (pathname.length > 1 && pathname.endsWith('/') && !pathname.includes('//') && !pathname.split('/').includes('..')) {
          const slashless = pathname.slice(0, -1)
          if (pageFile(distDir, slashless).file) {
            sendRedirect(res, `${slashless}${search}`)
            return
          }
        }

        const { bare, file } = pageFile(distDir, pathname)

        if (file) {
          const urlPath = `/${path.relative(distDir, file).split(path.sep).join('/')}`
          // dist/404.html is the error document. /404 must not serve it as HTTP 200.
          if (urlPath === '/404.html' && bare !== '/404.html') {
            sendHtmlNotFound(req, res, distDir)
            return
          }
          req.url = `${urlPath}${search}`
          return next()
        }

        // Unknown single-segment slugs still boot the app so the page can
        // redirect in the browser. Deeper paths and every other miss are 404.
        if (DYNAMIC_SLUG.test(pathname) && asFile(distDir, 'index.html')) {
          req.url = `/index.html${search}`
          return next()
        }

        const ext = path.posix.extname(bare)
        if (ext && ext !== '.html') {
          sendPlainNotFound(req, res)
          return
        }

        sendHtmlNotFound(req, res, distDir)
      })
    },
  }
}
