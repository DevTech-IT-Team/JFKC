import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
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
  server: {
    allowedHosts: ['jfknowledge.com', 'www.jfknowledge.com', 'localhost', '127.0.0.1'],
  },
  preview: {
    allowedHosts: ['jfknowledge.com', 'www.jfknowledge.com', 'localhost', '127.0.0.1'],
    port: 4173,
    host: true,
  },
})
