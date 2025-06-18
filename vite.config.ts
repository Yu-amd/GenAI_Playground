import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.md'],
  publicDir: 'public',
  build: {
    assetsInlineLimit: 0,
  },
})
