import { GoogleGenAI } from '@google/genai';

let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || typeof apiKey !== 'string' || !apiKey.trim()) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: apiKey.trim(),
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

export interface GenerateImagePayload {
  prompt: string;
  negativePrompt?: string;
  style?: string;
  aspectRatio?: string;
  imageSize?: '512px' | '1K' | '2K' | '4K';
}

export function generateOptimizedPromptText(
  rawPrompt: string,
  style = 'Photorealistic',
  aspectRatio = '1:1',
  negativePrompt = ''
): string {
  const styleModifiers: Record<string, string> = {
    Photorealistic:
      'hyper-realistic photography, 8k resolution, shot on 85mm f/1.4 lens, natural soft lighting, hyper-detailed textures, realistic depth of field',
    Cinematic:
      'cinematic movie still, 35mm anamorphic lens, volumetric golden light, dramatic atmosphere, color graded, ultra-detailed',
    '3D Render':
      'octane 3D render, ray tracing, subsurface scattering, ambient occlusion, polished finish, unreal engine 5 aesthetic',
    Anime:
      'studio ghibli and modern anime aesthetic, vibrant color palette, crisp line art, beautiful atmospheric lighting, detailed background',
    Illustration:
      'editorial vector illustration, clean lines, minimalist composition, balanced color harmony, flat design with depth',
    'Digital Art':
      'digital concept art, trending on ArtStation, dynamic lighting, high fantasy detailing, rich brushstrokes',
    'Product Photography':
      'commercial studio product shot, softbox lighting, clean white gradient backdrop, reflections, commercial advertising grade',
    Fantasy:
      'epic dark fantasy landscape, mystical glowing elements, ethereal mist, ancient architecture, magical realism',
    Minimalist:
      'minimalist composition, abundant negative space, refined geometric harmony, subdued elegant palette',
    Custom: 'masterpiece quality, ultra-detailed composition',
  };

  const modifier = styleModifiers[style] || styleModifiers.Photorealistic;
  let fullPrompt = `${rawPrompt.trim()}, ${modifier}`;

  if (aspectRatio && aspectRatio !== '1:1') {
    fullPrompt += `, --ar ${aspectRatio}`;
  }

  if (negativePrompt && negativePrompt.trim()) {
    fullPrompt += ` --no ${negativePrompt.trim()}`;
  }

  return fullPrompt;
}

export async function handleGenerateImageRequest(payload: GenerateImagePayload) {
  // 1. Validation
  if (!payload || typeof payload !== 'object') {
    return {
      success: false,
      code: 'INVALID_REQUEST',
      error: 'INVALID_REQUEST',
      fallback: true,
      message: 'Invalid request payload format.',
      optimizedPrompt: '',
    };
  }

  const rawPrompt = typeof payload.prompt === 'string' ? payload.prompt.trim().slice(0, 1000) : '';
  if (!rawPrompt) {
    return {
      success: false,
      code: 'PROMPT_REQUIRED',
      error: 'PROMPT_REQUIRED',
      fallback: true,
      message: 'Please describe the image you want to create.',
      optimizedPrompt: '',
    };
  }

  const style = typeof payload.style === 'string' ? payload.style.slice(0, 50) : 'Photorealistic';
  const negativePrompt = typeof payload.negativePrompt === 'string' ? payload.negativePrompt.trim().slice(0, 500) : '';
  const aspectRatio = typeof payload.aspectRatio === 'string' ? payload.aspectRatio : '1:1';

  // Map ratio to API supported values: '1:1' | '3:4' | '4:3' | '9:16' | '16:9' | '1:4' | '1:8' | '4:1' | '8:1'
  const allowedRatios: Record<string, '1:1' | '3:4' | '4:3' | '9:16' | '16:9' | '1:4' | '1:8' | '4:1' | '8:1'> = {
    '1:1': '1:1',
    '16:9': '16:9',
    '9:16': '9:16',
    '4:5': '3:4', // Map 4:5 closest supported ratio
    '3:4': '3:4',
    '4:3': '4:3',
    '1:4': '1:4',
    '1:8': '1:8',
    '4:1': '4:1',
    '8:1': '8:1',
  };
  const targetRatio = allowedRatios[aspectRatio] || '1:1';

  const fullPrompt = generateOptimizedPromptText(rawPrompt, style, aspectRatio, negativePrompt);

  // 2. Check server-side Gemini API key
  const ai = getAiClient();
  if (!ai) {
    return {
      success: false,
      code: 'MISSING_API_KEY',
      error: 'MISSING_API_KEY',
      fallback: true,
      message:
        'AI image generation is not configured on the server. Please set GEMINI_API_KEY in your server environment variables.',
      optimizedPrompt: fullPrompt,
    };
  }

  // 3. Call Google Gemini image-generation model: gemini-3.1-flash-image
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-image',
      contents: {
        parts: [
          {
            text: fullPrompt,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: targetRatio,
          imageSize: '1K',
        },
      },
    });

    let base64Image: string | null = null;
    let mimeType = 'image/png';

    const candidates = response.candidates || [];
    for (const candidate of candidates) {
      const parts = candidate.content?.parts || [];
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
          base64Image = part.inlineData.data;
          mimeType = part.inlineData.mimeType || 'image/png';
          break;
        }
      }
      if (base64Image) break;
    }

    if (base64Image) {
      return {
        success: true,
        image: `data:${mimeType};base64,${base64Image}`,
        mimeType,
        prompt: fullPrompt,
      };
    }

    // If no image part returned
    return {
      success: false,
      code: 'NO_IMAGE_DATA',
      error: 'NO_IMAGE_DATA',
      fallback: true,
      message: 'The model completed the request but did not return image data. You can copy the optimized prompt below.',
      optimizedPrompt: fullPrompt,
    };
  } catch (err: any) {
    // Diagnostic error analysis without exposing secrets
    const errMsg = (err?.message || '').toLowerCase();
    const status = err?.status || err?.code;

    let errorCode = 'SERVER_ERROR';
    let userMessage = 'Image generation failed due to a server error. Please try again later.';

    if (
      status === 429 ||
      errMsg.includes('quota') ||
      errMsg.includes('resource_exhausted') ||
      errMsg.includes('rate limit') ||
      errMsg.includes('limit: 0')
    ) {
      errorCode = 'QUOTA_EXCEEDED';
      userMessage =
        'Image generation quota reached. The model gemini-3.1-flash-image requires a Gemini API key with billing enabled (free tier has 0 quota for image models). You can still copy the optimized prompt below.';
    } else if (status === 401 || status === 403 || errMsg.includes('unauthenticated') || errMsg.includes('api key not valid')) {
      errorCode = 'INVALID_API_KEY';
      userMessage =
        'The image generation service rejected the API credentials. Please check GEMINI_API_KEY on the server.';
    } else if (status === 404 || errMsg.includes('not found') || errMsg.includes('is not supported')) {
      errorCode = 'MODEL_ERROR';
      userMessage = 'The image generation model (gemini-3.1-flash-image) is temporarily unavailable.';
    } else if (errMsg.includes('safety') || errMsg.includes('blocked') || errMsg.includes('prohibited')) {
      errorCode = 'SAFETY_BLOCKED';
      userMessage = 'The request was flagged by content safety filters. Please adjust your prompt description.';
    }

    return {
      success: false,
      code: errorCode,
      error: errorCode,
      fallback: true,
      message: userMessage,
      optimizedPrompt: fullPrompt,
    };
  }
}

export async function handleImprovePromptRequest(prompt: string, style = 'Photorealistic') {
  if (!prompt || typeof prompt !== 'string') {
    return { improvedPrompt: generateOptimizedPromptText(prompt, style) };
  }

  const ai = getAiClient();
  if (!ai) {
    return { improvedPrompt: generateOptimizedPromptText(prompt, style) };
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `You are an expert prompt engineer for Midjourney v6, Flux.1, and Leonardo AI.
Take this user idea: "${prompt.slice(0, 500)}"
Target art style: "${style}".
Rewrite this into one singular, highly descriptive, evocative master prompt (1-3 sentences).
Specify subject details, textures, lighting setup, camera focal length/lens, atmosphere, and cinematic depth.
Do NOT output markdown fences, prefixes, or explanations. Output ONLY the raw prompt text.`,
            },
          ],
        },
      ],
    });

    const text = response.text?.trim();
    if (text) {
      return { improvedPrompt: text };
    }
  } catch {
    // Fallback to local prompt formulation
  }

  return { improvedPrompt: generateOptimizedPromptText(prompt, style) };
}
