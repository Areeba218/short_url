import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Dev mein /url ki requests backend (port 8001) ko forward hoti hain,
// is liye backend mein CORS lagane ki zaroorat nahi.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: { '/url': 'http://localhost:8001' },
  },
})
