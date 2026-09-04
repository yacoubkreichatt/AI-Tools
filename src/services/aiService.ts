import { GenerationResult } from '../types/tools';
import { runLocalGenerator } from '../engines/localGenerators';

export interface GenerateOptions {
  enginePreference?: 'ai' | 'local';
}

export async function generateContent(
  toolSlug: string,
  inputs: Record<string, any>,
  options: GenerateOptions = {}
): Promise<GenerationResult> {
  const { enginePreference = 'ai' } = options;

  // If local engine is explicitly preferred or for Type A tools that don't need API
  if (enginePreference === 'local') {
    return runLocalGenerator(toolSlug, inputs);
  }

  // Attempt server-side Gemini generation via /api/generate
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000); // 12s timeout

    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        toolSlug,
        inputs,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (data && data.result) {
        return {
          ...data.result,
          metadata: {
            ...data.result.metadata,
            engineUsed: 'ai',
            model: data.model || 'gemini-3.8-flash',
            generatedAt: new Date().toISOString(),
          },
        };
      }
    }
  } catch (err) {
    // Network error, offline, static host, or abort - gracefully fall back
    console.info('[AI Tools Hub] Server API unavailable or timed out, executing local engine fallback.');
  }

  // Fallback to local rule/template engine
  return runLocalGenerator(toolSlug, inputs);
}
