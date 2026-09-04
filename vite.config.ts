import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';

function apiPlugin(): Plugin {
  return {
    name: 'api-generator-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url?.split('?')[0];

        if (url === '/api/generate' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', async () => {
            try {
              const parsed = JSON.parse(body || '{}');
              const { handleGenerateRequest } = await import('./src/server/geminiHandler.ts');
              const result = await handleGenerateRequest(parsed.toolSlug, parsed.inputs || {});
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(result));
            } catch (err: any) {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ fallback: true, error: err?.message || 'Server error' }));
            }
          });
          return;
        }

        if (url === '/api/generate-image' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', async () => {
            try {
              const parsed = JSON.parse(body || '{}');
              const { handleGenerateImageRequest } = await import('./src/server/imageHandler.ts');
              const result = await handleGenerateImageRequest(parsed);
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(result));
            } catch (err: any) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(
                JSON.stringify({
                  success: false,
                  fallback: true,
                  code: 'SERVER_ERROR',
                  message: 'Image generation failed due to a server error.',
                })
              );
            }
          });
          return;
        }

        if (url === '/api/improve-prompt' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', async () => {
            try {
              const parsed = JSON.parse(body || '{}');
              const { handleImprovePromptRequest } = await import('./src/server/imageHandler.ts');
              const result = await handleImprovePromptRequest(parsed.prompt, parsed.style);
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(result));
            } catch {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ improvedPrompt: '' }));
            }
          });
          return;
        }

        next();
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), apiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
