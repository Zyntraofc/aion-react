import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import svgr from '@svgr/rollup';

// https://vite.dev/config/
export default defineConfig({
    plugins: [
      react(),
      tailwindcss(),
      svgr(),
    ],
    server: {
        proxy: {
            '/api': {
                target: 'https://ms-aion-jpa.onrender.com',
                changeOrigin: true,
                secure: false,
                configure: (proxy, _options) => {
                    proxy.on('proxyReq', (proxyReq, req, _res) => {
                        // Adicionar header de autorização para todas as requisições proxy
                        proxyReq.setHeader('Authorization', 'Basic ' + Buffer.from('rh:rhpass').toString('base64'))
                    })
                }
            }
        }
    }
})
