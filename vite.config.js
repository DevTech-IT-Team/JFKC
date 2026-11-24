import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  build: {
    manifest: true,
  },
  preview: {
    allowedHosts: ['jfknowledge.com', 'www.jfknowledge.com'],

  },
})
