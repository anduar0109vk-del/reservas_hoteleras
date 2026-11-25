import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5171,
    allowedHosts: ['host.docker.internal'],
    proxy: {
      '/api': {
        target: 'http://localhost:39000',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
