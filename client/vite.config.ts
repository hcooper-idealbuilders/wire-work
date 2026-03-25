import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './', // critical for SharePoint: relative asset paths
  server: {
    port: 5173,
  },
  build: {
    outDir: 'dist',
  },
})
