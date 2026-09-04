import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { handleGenerateRequest } from './src/server/geminiHandler.js';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// API Endpoint for AI Generation with fallback
app.post('/api/generate', async (req, res) => {
  try {
    const { toolSlug, inputs } = req.body;
    const result = await handleGenerateRequest(toolSlug, inputs || {});
    res.json(result);
  } catch (err: any) {
    res.json({ fallback: true, error: err?.message || 'Generation error' });
  }
});

// Serve static frontend assets
const distPath = path.join(process.cwd(), 'dist');
app.use(express.static(distPath));

// SPA fallback for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[AI Tools Hub] Server listening on http://0.0.0.0:${PORT}`);
});
