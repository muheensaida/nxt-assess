import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/ccbp-api': {
        target: 'https://apis.ccbp.in',
        changeOrigin: true,
        secure: true,
        rewrite: path => path.replace(/^\/ccbp-api/, ''),
      },
    },
  },
})
