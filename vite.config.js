import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { previewPrerenderedRoutes } from './scripts/preview-prerendered-routes.mjs'

const allowedHosts = ['jfknowledge.com', 'www.jfknowledge.com', 'localhost', '127.0.0.1']

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
    port: 4173,
    host: true,
  },
  build: {
    manifest: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'vendor';
            }
            if (id.includes('lucide-react')) {
              return 'icons';
            }
          }
        },
      },
    },
  },
})
