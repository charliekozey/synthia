import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 3000,
    // comment hmr back in for hot reload:
    // hmr: {
    //   clientPort: 5173
    // },
    // watch: {
    //   usePolling: true
    // }
  }
})
