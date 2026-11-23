import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

const allowedHosts = ['jfknowledge.com', 'www.jfknowledge.com']

export default defineConfig({
  plugins: [
    tailwindcss(),
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