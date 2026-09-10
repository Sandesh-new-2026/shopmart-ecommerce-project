import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://shopmart-backend-ifz0dzxny-sandesh-react-projects.vercel.app",
        changeOrigin: true,
        secure: true,
      },
    },
  },
})
