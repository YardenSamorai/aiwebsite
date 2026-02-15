import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 5005,
        host: '0.0.0.0',
        // Handle client-side routing - redirect all routes to index.html
        middlewareMode: false,
      },
      plugins: [
        react(),
        // Custom plugin to handle /admin route
        {
          name: 'admin-route',
          configureServer(server) {
            server.middlewares.use((req, res, next) => {
              // If requesting /admin, serve index.html
              if (req.url === '/admin' || req.url?.startsWith('/admin/')) {
                req.url = '/index.html';
              }
              next();
            });
          }
        }
      ],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.VITE_ADMIN_PASSWORD': JSON.stringify(env.VITE_ADMIN_PASSWORD)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
    };
});
