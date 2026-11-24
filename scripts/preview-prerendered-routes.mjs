import fs from 'node:fs'
import path from 'node:path'

// Vite preview looks up an extensionless URL as a file, then as `$uri.html`.
// It serves `$uri/index.html` only when the URL already ends with `/`.
// Prerender writes `dist/<route>/index.html`, and the sitemap URLs have no
// trailing slash, so `/about` missed `dist/about/index.html` and the SPA
// fallback rewrote it to `dist/index.html` (the homepage).
//
// This runs before that fallback. A slashless route is rewritten to its
// prerendered file. Anything that is not a real file, and not one unknown
// slug under /blog, /services, or /portfolio, is a 404 with dist/404.html.

const DYNAMIC_SLUG = /^\/(?:blog|portfolio|services)\/[^/]+\/?$/

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

        const bare = pathname.length > 1 && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname
        const rel = bare.replace(/^\/+/, '')
        const exact = rel ? asFile(distDir, rel) : null
        const indexHtml = asFile(distDir, rel ? `${rel}/index.html` : 'index.html')
        const flatHtml = rel && !path.posix.extname(rel) ? asFile(distDir, `${rel}.html`) : null
        const match = exact || indexHtml || flatHtml

        if (match) {
          const urlPath = `/${path.relative(distDir, match).split(path.sep).join('/')}`
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
