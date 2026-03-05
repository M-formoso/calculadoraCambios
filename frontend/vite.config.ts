import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    define: {
      'import.meta.env.VITE_API_URL': JSON.stringify(env.VITE_API_URL || 'http://localhost:8000/api/v1'),
      'import.meta.env.VITE_WHATSAPP_NUMBER': JSON.stringify(env.VITE_WHATSAPP_NUMBER || '5493511234567'),
      'import.meta.env.VITE_TELEGRAM_USER': JSON.stringify(env.VITE_TELEGRAM_USER || 'cambiocba'),
      'import.meta.env.VITE_POLLING_INTERVAL': JSON.stringify(env.VITE_POLLING_INTERVAL || '60000'),
    },
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: 'http://localhost:8000',
          changeOrigin: true,
        },
      },
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
    },
  }
})
