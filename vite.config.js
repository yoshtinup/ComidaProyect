// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/', // importante para rutas internas
  server: {
    host: true, // permite acceso desde red externa
    port: 5173, // o el que uses
    strictPort: true,
    cors: true, // por si haces llamadas entre front y back local
    allowedHosts: ['d4803062c935.ngrok-free.app']
  }
})
