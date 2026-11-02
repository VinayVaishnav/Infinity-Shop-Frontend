import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import type { ProxyOptions } from 'vite'

const API_TARGET = 'http://localhost:8080'

/** Proxy API calls to Spring; do not proxy browser reloads (SPA document requests). */
function proxyApi(pathPrefix: string): ProxyOptions {
  return {
    target: API_TARGET,
    changeOrigin: true,
    bypass(req) {
      const accept = req.headers.accept ?? ''
      const isDocumentNavigation =
        req.method === 'GET' && accept.includes('text/html')
      if (isDocumentNavigation) {
        return '/index.html'
      }
      if (req.url && !req.url.startsWith(pathPrefix)) {
        return false
      }
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss()],
  appType: 'spa',
  server: {
    proxy: {
      '/options': proxyApi('/options'),
      '/logout': proxyApi('/logout'),
      '/login': proxyApi('/login'),
      '/signin': proxyApi('/signin'),
      '/auth': proxyApi('/auth'),
      '/user': proxyApi('/user'),
      '/admin': proxyApi('/admin'),
    },
  },
})
