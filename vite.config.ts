import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { cpSync, copyFileSync, mkdirSync, rmSync } from 'fs'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    {
      name: 'copy-landing-and-brand',
      closeBundle() {
        // Copy landing page as the root index.html
        copyFileSync('landing/index.html', 'dist/index.html')
        // Copy brand assets so /brand/logo.svg etc. resolve
        cpSync('brand', 'dist/brand', { recursive: true })
      },
    },
  ],
  base: '/app/',
  build: {
    outDir: 'dist/app',
    emptyOutDir: true,
  },
})
