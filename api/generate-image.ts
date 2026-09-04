import { handleGenerateImageRequest } from '../src/server/imageHandler';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const payload = req.body || {};
    const result = await handleGenerateImageRequest(payload);
    return res.status(200).json(result);
  } catch (error: any) {
    console.error('Server error in /api/generate-image:', error?.message);
    return res.status(500).json({
      success: false,
      fallback: true,
      error: 'INTERNAL_SERVER_ERROR',
      message: 'AI image generation is currently unavailable. You can still create and copy an optimized image prompt.',
    });
  }
}
