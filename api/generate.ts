import type { IncomingMessage, ServerResponse } from 'http';
import { handleGenerateRequest } from '../src/server/geminiHandler';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { toolSlug, inputs } = req.body || {};
    const result = await handleGenerateRequest(toolSlug, inputs || {});
    return res.status(200).json(result);
  } catch (error: any) {
    console.error('Server error in /api/generate:', error?.message);
    return res.status(500).json({ fallback: true, error: 'INTERNAL_SERVER_ERROR' });
  }
}
