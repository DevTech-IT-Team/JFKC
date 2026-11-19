import fs from 'node:fs'
import path from 'node:path'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

const IMAGE_EXT = /\.(png|jpe?g|webp|gif|svg|avif)$/i

function ssrClientAssetUrls() {
  if (!process.argv.includes('--ssr')) return null
  const manifestPath = path.resolve('dist/.vite/manifest.json')
  if (!fs.existsSync(manifestPath)) return null
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'))
  const bySrc = new Map()
  for (const [key, value] of Object.entries(manifest)) {
    if (!value?.file || !IMAGE_EXT.test(value.file)) continue
    bySrc.set(key.replace(/\\/g, '/'), `/${value.file}`)
  }

  return {
    name: 'ssr-client-asset-urls',
    enforce: 'pre',
    resolveId(source, importer) {
      if (!importer || !IMAGE_EXT.test(source.split('?')[0])) return null
      const abs = path.resolve(path.dirname(importer), source.split('?')[0])
      const rel = path.relative(process.cwd(), abs).replace(/\\/g, '/')
      const url = bySrc.get(rel)
      if (!url) {
        this.error(`No client build URL for image ${rel}. Rebuild the client bundle before the SSR bundle.`)
      }
      return `\0asset-url:${url}`
    },
    load(id) {
      if (!id.startsWith('\0asset-url:')) return null
      return `export default ${JSON.stringify(id.slice('\0asset-url:'.length))};`
    },
  }
}

function previewStaticRoutes() {
  return {
    name: 'preview-static-routes',
    configurePreviewServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url || (req.method !== 'GET' && req.method !== 'HEAD')) return next()
        const [pathname, search = ''] = req.url.split('?')
        if (pathname === '/' || pathname.startsWith('/assets/') || pathname.includes('.')) return next()
        const clean = pathname.endsWith('/') ? pathname.slice(0, -1) : pathname
        const indexFile = path.join(process.cwd(), 'dist', clean, 'index.html')
        const query = search ? `?${search}` : ''
        if (fs.existsSync(indexFile)) {
          req.url = `${clean}/index.html${query}`
          return next()
        }
        req.url = `/404.html${query}`
        res.statusCode = 404
        const writeHead = res.writeHead.bind(res)
        res.writeHead = (code, ...args) => writeHead(code && code < 400 ? 404 : code, ...args)
        next()
      })
    },
  }
}

export default defineConfig({
  plugins: [tailwindcss(), ssrClientAssetUrls(), previewStaticRoutes()].filter(Boolean),
  build: {
    manifest: true,
  },
  ssr: {
    noExternal: ['react-helmet-async'],
  },
})
