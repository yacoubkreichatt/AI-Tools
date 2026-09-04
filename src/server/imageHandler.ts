import { GoogleGenAI } from '@google/genai';

let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI | null {
  if (!process.env.GEMINI_API_KEY) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
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
}

export function generateOptimizedPromptText(
  rawPrompt: string,
  style = 'Photorealistic',
  aspectRatio = '1:1',
  negativePrompt = ''
): string {
  const styleModifiers: Record<string, string> = {
    Photorealistic: 'hyper-realistic photography, 8k resolution, shot on 85mm f/1.4 lens, natural soft lighting, hyper-detailed textures, realistic depth of field',
    Cinematic: 'cinematic movie still, 35mm anamorphic lens, volumetric golden light, dramatic atmosphere, color graded, ultra-detailed',
    '3D Render': 'octane 3D render, ray tracing, subsurface scattering, ambient occlusion, polished finish, unreal engine 5 aesthetic',
    Anime: 'studio ghibli and modern anime aesthetic, vibrant color palette, crisp line art, beautiful atmospheric lighting, detailed background',
    Illustration: 'editorial vector illustration, clean lines, minimalist composition, balanced color harmony, flat design with depth',
    'Digital Art': 'digital concept art, trending on ArtStation, dynamic lighting, high fantasy detailing, rich brushstrokes',
    'Product Photography': 'commercial studio product shot, softbox lighting, clean white gradient backdrop, reflections, commercial advertising grade',
    Fantasy: 'epic dark fantasy landscape, mystical glowing elements, ethereal mist, ancient architecture, magical realism',
    Minimalist: 'minimalist composition, abundant negative space, refined geometric harmony, subdued elegant palette',
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
      fallback: true,
      error: 'INVALID_REQUEST',
      message: 'Invalid request payload format.',
      optimizedPrompt: '',
    };
  }

  const rawPrompt = typeof payload.prompt === 'string' ? payload.prompt.trim().slice(0, 1000) : '';
  if (!rawPrompt) {
    return {
      success: false,
      fallback: true,
      error: 'PROMPT_REQUIRED',
      message: 'Please describe the image you want to create.',
      optimizedPrompt: '',
    };
  }

  const style = typeof payload.style === 'string' ? payload.style.slice(0, 50) : 'Photorealistic';
  const negativePrompt = typeof payload.negativePrompt === 'string' ? payload.negativePrompt.trim().slice(0, 500) : '';
  const aspectRatio = typeof payload.aspectRatio === 'string' ? payload.aspectRatio : '1:1';

  // Map ratio to API supported values: '1:1' | '3:4' | '4:3' | '9:16' | '16:9'
  const allowedRatios: Record<string, '1:1' | '3:4' | '4:3' | '9:16' | '16:9'> = {
    '1:1': '1:1',
    '16:9': '16:9',
    '9:16': '9:16',
    '4:5': '3:4', // Map 4:5 closest supported ratio
    '3:4': '3:4',
    '4:3': '4:3',
  };
  const targetRatio = allowedRatios[aspectRatio] || '1:1';

  const fullPrompt = generateOptimizedPromptText(rawPrompt, style, aspectRatio, negativePrompt);

  // 2. Check server-side Gemini API key
  const ai = getAiClient();
  if (!ai) {
    return {
      success: false,
      fallback: true,
      error: 'GEMINI_API_KEY_NOT_CONFIGURED',
      message: 'AI image generation is currently unavailable. You can still create and copy an optimized image prompt.',
      optimizedPrompt: fullPrompt,
    };
  }

  // 3. Attempt image generation with Google GenAI SDK
  try {
    // Primary model: imagen-3.0-generate-002
    const imageResponse = await ai.models.generateImages({
      model: 'imagen-3.0-generate-002',
      prompt: fullPrompt,
      config: {
        numberOfImages: 1,
        aspectRatio: targetRatio,
        outputMimeType: 'image/jpeg',
      },
    });

    const generatedImage = imageResponse.generatedImages?.[0];
    if (generatedImage?.image?.imageBytes) {
      const base64 = generatedImage.image.imageBytes;
      return {
        success: true,
        image: `data:image/jpeg;base64,${base64}`,
        mimeType: 'image/jpeg',
        prompt: fullPrompt,
      };
    }

    // If no bytes returned
    return {
      success: false,
      fallback: true,
      error: 'NO_IMAGE_DATA',
      message: 'AI image generation is currently unavailable. You can still create and copy an optimized image prompt.',
      optimizedPrompt: fullPrompt,
    };
  } catch (err: any) {
    // Safe error inspection without exposing secrets
    console.error('Image generation error:', err?.message || 'Unknown error');

    let userMessage = 'AI image generation is currently unavailable. You can still create and copy an optimized image prompt.';
    const errMsg = (err?.message || '').toLowerCase();

    if (errMsg.includes('quota') || errMsg.includes('rate limit') || errMsg.includes('429')) {
      userMessage = 'API quota or rate limit exceeded. You can still create and copy an optimized image prompt.';
    } else if (errMsg.includes('safety') || errMsg.includes('blocked')) {
      userMessage = 'The request was flagged by content safety filters. Please adjust your prompt description.';
    }

    return {
      success: false,
      fallback: true,
      error: 'GENERATION_ERROR',
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
