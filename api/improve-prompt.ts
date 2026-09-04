import { handleImprovePromptRequest } from '../src/server/imageHandler';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { prompt, style } = req.body || {};
    const result = await handleImprovePromptRequest(prompt, style);
    return res.status(200).json(result);
  } catch (error: any) {
    console.error('Server error in /api/improve-prompt:', error?.message);
    return res.status(200).json({ improvedPrompt: req.body?.prompt || '' });
  }
}
