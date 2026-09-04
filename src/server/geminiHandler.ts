import { GoogleGenAI, Type } from '@google/genai';

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

export async function handleGenerateRequest(toolSlug: string, rawInputs: Record<string, any>) {
  // Input validation
  if (!toolSlug || typeof toolSlug !== 'string') {
    return { fallback: true, reason: 'INVALID_TOOL_SLUG' };
  }
  if (!rawInputs || typeof rawInputs !== 'object') {
    return { fallback: true, reason: 'INVALID_INPUTS' };
  }

  // Sanitize & limit string lengths to prevent abuse/oversized payloads
  const inputs: Record<string, any> = {};
  for (const [key, val] of Object.entries(rawInputs)) {
    if (typeof val === 'string') {
      inputs[key] = val.trim().slice(0, 4000); // Cap at 4k chars
    } else {
      inputs[key] = val;
    }
  }

  const ai = getAiClient();
  if (!ai) {
    return { fallback: true, reason: 'GEMINI_API_KEY_NOT_CONFIGURED' };
  }

  const model = 'gemini-3.8-flash';

  // Helper to safely parse JSON from Gemini (handling markdown fences if needed)
  const safeParseJson = (text: string | undefined, defaultVal: any) => {
    if (!text) return defaultVal;
    try {
      return JSON.parse(text);
    } catch {
      // Try stripping markdown fences ```json ... ```
      const cleaned = text.replace(/```(?:json)?/gi, '').replace(/```/g, '').trim();
      try {
        return JSON.parse(cleaned);
      } catch {
        return defaultVal;
      }
    }
  };

  try {
    switch (toolSlug) {
      case 'tiktok-hook-generator': {
        const topic = inputs.topic || 'content creation';
        const tone = inputs.tone || 'Viral & Bold';
        const audience = inputs.audience || 'creators';
        const numHooks = Number(inputs.numHooks) || 15;

        const response = await ai.models.generateContent({
          model,
          contents: `You are an expert viral TikTok creator and copywriter. Generate ${numHooks} high-retention 3-second opening hooks for a short-form video.
Topic: "${topic}"
Target Audience: "${audience}"
Tone: "${tone}"
Language: "${inputs.language || 'English'}"

Requirements:
- Each hook must stop scrolling in 3 seconds.
- Use proven hooks (curiosity gap, negative mistake, bold contrarian, visual teasers).
- Return as clean JSON array of strings.`,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
        });

        const list = safeParseJson(response.text, []);
        return {
          result: {
            list,
          },
          model,
        };
      }

      case 'instagram-bio-generator': {
        const name = inputs.name || 'Brand';
        const niche = inputs.niche || 'Digital Creator';
        const keywords = inputs.keywords || '';

        const response = await ai.models.generateContent({
          model,
          contents: `Create 6 distinct, aesthetic, high-converting Instagram bios for:
Name: "${name}"
Niche: "${niche}"
Personality: "${inputs.personality || 'Professional'}"
Keywords/Accolades: "${keywords}"
Language: "${inputs.language || 'English'}"

Return JSON array of objects with keys: id (e.g. bio-1), style (e.g. "Minimalist & Clean", "Authoritative", "Creative & Playful", "High-Converting Sales"), bio (the formatted text with clean linebreaks and emojis, max 150 chars), characterCount (number).`,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  style: { type: Type.STRING },
                  bio: { type: Type.STRING },
                  characterCount: { type: Type.INTEGER },
                },
                required: ['id', 'style', 'bio', 'characterCount'],
              },
            },
          },
        });

        const bios = safeParseJson(response.text, []);
        return {
          result: { bios },
          model,
        };
      }

      case 'youtube-title-generator': {
        const topic = inputs.videoTopic || 'Tutorial';
        const niche = inputs.channelNiche || 'General';
        const style = inputs.style || 'High CTR';

        const response = await ai.models.generateContent({
          model,
          contents: `Generate 20 high-CTR, click-worthy YouTube video titles for:
Topic: "${topic}"
Niche: "${niche}"
Style/Formula: "${style}"
Language: "${inputs.language || 'English'}"

Focus on high clickability, curiosity gap, proven YouTube formulas without misleading spam. Return JSON array of strings.`,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
        });

        const list = safeParseJson(response.text, []);
        return {
          result: { list },
          model,
        };
      }

      case 'ad-copy-generator': {
        const product = inputs.product || 'Product';
        const audience = inputs.targetAudience || 'Customers';
        const offer = inputs.offer || 'Special Discount';

        const response = await ai.models.generateContent({
          model,
          contents: `Generate 3 high-converting ad copy variations for:
Product: "${product}"
Target Audience: "${audience}"
Platform: "${inputs.platform || 'Facebook Ads'}"
Offer: "${offer}"
Framework/Tone: "${inputs.tone || 'PAS'}"
Language: "${inputs.language || 'English'}"

Return JSON array of 3 objects with:
id (string),
angle (string, e.g. "Problem - Agitate - Solve", "Hook - Story - Offer", "Direct Social Proof"),
primaryText (string, persuasive multi-paragraph body text with emojis),
headline (string, short punchy headline under 8 words),
description (string, link description),
callToAction (string, button recommendation)`,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  angle: { type: Type.STRING },
                  primaryText: { type: Type.STRING },
                  headline: { type: Type.STRING },
                  description: { type: Type.STRING },
                  callToAction: { type: Type.STRING },
                },
                required: ['id', 'angle', 'primaryText', 'headline', 'description', 'callToAction'],
              },
            },
          },
        });

        const adVariations = safeParseJson(response.text, []);
        return {
          result: { adVariations },
          model,
        };
      }

      case 'reel-ideas-generator': {
        const niche = inputs.niche || 'Business';
        const numIdeas = Number(inputs.numIdeas) || 20;

        const response = await ai.models.generateContent({
          model,
          contents: `Generate ${numIdeas} creative short-form video ideas for Instagram Reels / TikTok:
Niche: "${niche}"
Audience: "${inputs.audience || 'General'}"
Platform: "${inputs.platform || 'Reels'}"
Language: "${inputs.language || 'English'}"

Each idea must include:
id (string, e.g. "reel-1"),
hook (the first 3 seconds spoken or on-screen hook line),
concept (the physical visual action, B-roll, or demonstration on screen),
cta (the exact end call-to-action to maximize comments/shares),
formatSuggestion (e.g. "Talking Head", "Green Screen", "POV Tutorial")`,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  hook: { type: Type.STRING },
                  concept: { type: Type.STRING },
                  cta: { type: Type.STRING },
                  formatSuggestion: { type: Type.STRING },
                },
                required: ['id', 'hook', 'concept', 'cta'],
              },
            },
          },
        });

        const reelIdeas = safeParseJson(response.text, []);
        return {
          result: { reelIdeas },
          model,
        };
      }

      case 'resume-generator': {
        const response = await ai.models.generateContent({
          model,
          contents: `You are an elite executive resume writer and ATS optimization specialist.
Convert these raw career details into a comprehensive, ATS-friendly plain text resume:
Candidate: "${inputs.name}"
Target Role: "${inputs.jobTitle}"
Experience Details: "${inputs.experience}"
Skills: "${inputs.skills}"
Education: "${inputs.education}"
Achievements: "${inputs.achievements}"
Language: "${inputs.language || 'English'}"

Format with clean ASCII dividers, professional action verbs, quantified results (Google X-Y-Z formula), and clear standard headers (SUMMARY, CORE COMPETENCIES, PROFESSIONAL EXPERIENCE, ACHIEVEMENTS, EDUCATION).`,
        });

        return {
          result: {
            documentTitle: `${inputs.name || 'Candidate'} - Resume`,
            documentBody: response.text || '',
          },
          model,
        };
      }

      case 'cover-letter-generator': {
        const response = await ai.models.generateContent({
          model,
          contents: `Write an exceptional, tailored cover letter for:
Job Title: "${inputs.jobTitle}"
Company: "${inputs.company}"
Candidate Qualifications: "${inputs.skills}"
Candidate Background: "${inputs.experience}"
Job Description Snippet: "${inputs.jobDescription || ''}"
Tone: "${inputs.tone || 'Confident & Professional'}"
Language: "${inputs.language || 'English'}"

Write in professional standard business letter format with current date, formal address, engaging opening hook, 2 persuasive body paragraphs showing direct value, and professional closing.`,
        });

        return {
          result: {
            documentTitle: `Cover Letter - ${inputs.jobTitle} at ${inputs.company}`,
            documentBody: response.text || '',
          },
          model,
        };
      }

      case 'business-name-generator': {
        const businessType = inputs.businessType || 'General';
        const keywords = inputs.keywords || '';
        const style = inputs.style || 'Modern & Brandable';
        const country = inputs.country || 'Global';

        const response = await ai.models.generateContent({
          model,
          contents: `Generate 16 creative, memorable, brandable business names for:
Industry/Type: "${businessType}"
Keywords/Values: "${keywords}"
Naming Style: "${style}"
Target Market: "${country}"
Language: "${inputs.language || 'English'}"

Return a JSON array of 16 objects with keys:
id (string, e.g. "name-1"),
name (string, punchy, brandable name),
category (string, e.g. "Modern Brandable", "Compound Two-Word", "Evocative"),
rationale (string, brief 1-sentence reasoning for why this name fits and brand psychology),
domainIdea (string, e.g. "brandname.com" or "getbrandname.com")`,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  name: { type: Type.STRING },
                  category: { type: Type.STRING },
                  rationale: { type: Type.STRING },
                  domainIdea: { type: Type.STRING },
                },
                required: ['id', 'name', 'category', 'rationale'],
              },
            },
          },
        });

        const businessNames = safeParseJson(response.text, []);
        return {
          result: { businessNames },
          model,
        };
      }

      case 'image-prompt-generator': {
        const subject = inputs.subject || 'a cinematic scene';
        const aiModel = inputs.aiModel || 'Midjourney';
        const style = inputs.style || 'Photorealistic';
        const lighting = inputs.lighting || 'Golden Hour';
        const camera = inputs.camera || '85mm lens';
        const environment = inputs.environment || 'atmospheric background';
        const ar = inputs.aspectRatio || '16:9';

        const response = await ai.models.generateContent({
          model,
          contents: `You are an elite prompt engineer for AI image models (${aiModel}, Flux, DALL-E, Leonardo, Stable Diffusion).
Write 3 comprehensive, studio-grade image generation prompt variations for:
Subject: "${subject}"
Model Target: "${aiModel}"
Style: "${style}"
Lighting: "${lighting}"
Lens/Camera: "${camera}"
Environment: "${environment}"
Aspect Ratio: "${ar}"

Return a JSON array of 3 descriptive prompt strings tailored specifically for ${aiModel} with exact parameter tags (such as --ar ${ar} for Midjourney, sampler steps for Flux/SD).`,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
        });

        const list = safeParseJson(response.text, []);
        return {
          result: {
            list,
            rawText: list.join('\n\n---\n\n'),
          },
          model,
        };
      }

      case 'hashtag-generator': {
        const topic = inputs.topic || 'marketing';
        const platform = inputs.platform || 'Instagram';

        const response = await ai.models.generateContent({
          model,
          contents: `Generate 30 curated, highly targeted hashtags for ${platform} about: "${topic}".
Language: "${inputs.language || 'English'}"

Categorize them into 3 distinct sets:
1. highVolume: 10 broad discovery hashtags (1M+ reach)
2. mediumVolume: 10 targeted industry hashtags (100k-500k reach)
3. niche: 10 high-conversion community hashtags (10k-50k reach)

Each hashtag must start with "#" and contain no spaces or punctuation.`,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                highVolume: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                mediumVolume: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                niche: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
              },
              required: ['highVolume', 'mediumVolume', 'niche'],
            },
          },
        });

        const groupedHashtags = safeParseJson(response.text, {});
        return {
          result: {
            groupedHashtags,
          },
          model,
        };
      }

      default:
        return { fallback: true };
    }
  } catch (error: any) {
    // Log error internally, never expose raw error/key to client
    const errorMessage = error?.status === 429
      ? 'RATE_LIMIT_EXCEEDED'
      : error?.status === 503
      ? 'SERVICE_UNAVAILABLE'
      : 'AI_SERVICE_ERROR';
    return { fallback: true, error: errorMessage };
  }
}
