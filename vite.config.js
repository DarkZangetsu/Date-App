import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base relative : le build fonctionne aussi bien sur Netlify, Vercel que GitHub Pages.
export default defineConfig({
  base: './',
  plugins: [react()],
})
