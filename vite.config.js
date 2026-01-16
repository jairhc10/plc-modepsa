import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  server:{
    host:'0.0.0.0',
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://192.168.10.44:5000',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})