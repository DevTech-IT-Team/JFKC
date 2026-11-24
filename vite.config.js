import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { previewPrerenderedRoutes } from './scripts/preview-prerendered-routes.mjs'

const allowedHosts = ['jfknowledge.com', 'www.jfknowledge.com']

export default defineConfig({
  plugins: [
    tailwindcss(),
    previewPrerenderedRoutes(),
  ],
  server: {
    allowedHosts,
  },
  preview: {
    allowedHosts,
  },
  build: {
    manifest: true,
  },
})
