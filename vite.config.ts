import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';

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
        // Custom plugin to handle /admin route and API
        {
          name: 'admin-api',
          configureServer(server) {
            // Handle /admin route - serve index.html
            server.middlewares.use((req, res, next) => {
              if (req.url === '/admin' || req.url?.startsWith('/admin/')) {
                req.url = '/index.html';
              }
              next();
            });

            // API endpoint to save site data
            server.middlewares.use('/api/save-data', async (req, res, next) => {
              if (req.method === 'POST') {
                try {
                  let body = '';
                  req.on('data', chunk => {
                    body += chunk.toString();
                  });
                  req.on('end', () => {
                    const data = JSON.parse(body);
                    const filePath = path.resolve(__dirname, 'public/site-data.json');
                    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
                    res.setHeader('Content-Type', 'application/json');
                    res.statusCode = 200;
                    res.end(JSON.stringify({ success: true, message: 'Data saved successfully' }));
                  });
                } catch (error) {
                  res.statusCode = 500;
                  res.end(JSON.stringify({ success: false, error: 'Failed to save data' }));
                }
              } else {
                next();
              }
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
      // Ensure all routes fallback to index.html for SPA routing
      build: {
        rollupOptions: {
          input: {
            main: './index.html',
          }
        }
      }
    };
});
