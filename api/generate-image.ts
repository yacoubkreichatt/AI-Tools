import { handleGenerateImageRequest } from '../src/server/imageHandler';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({
      success: false,
      code: 'METHOD_NOT_ALLOWED',
      error: 'Method Not Allowed',
      message: 'Only POST requests are supported.',
    });
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
      code: 'SERVER_ERROR',
      error: 'INTERNAL_SERVER_ERROR',
      message: 'Image generation failed due to a server error. Please try again later.',
    });
  }
}
