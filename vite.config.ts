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
  server: {
    host: '0.0.0.0', // Bind to all network interfaces
    port: 5173, // Default Vite port
    strictPort: true, // Fail if port is already in use
  },
})
