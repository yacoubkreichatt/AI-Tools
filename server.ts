import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { handleGenerateRequest } from './src/server/geminiHandler.js';
import { handleGenerateImageRequest, handleImprovePromptRequest } from './src/server/imageHandler.js';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

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

// API Endpoint for AI Image Generation with fallback
app.post('/api/generate-image', async (req, res) => {
  try {
    const payload = req.body || {};
    const result = await handleGenerateImageRequest(payload);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({
      success: false,
      fallback: true,
      code: 'SERVER_ERROR',
      error: 'SERVER_ERROR',
      message: 'Image generation failed due to a server error. Please try again later.',
      optimizedPrompt: '',
    });
  }
});

// API Endpoint for Prompt Optimization
app.post('/api/improve-prompt', async (req, res) => {
  try {
    const { prompt, style } = req.body || {};
    const result = await handleImprovePromptRequest(prompt, style);
    res.json(result);
  } catch (err: any) {
    res.json({ improvedPrompt: req.body?.prompt || '' });
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
