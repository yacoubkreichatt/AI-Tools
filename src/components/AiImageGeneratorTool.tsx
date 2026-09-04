import React, { useState, useEffect } from 'react';
import { ToolDefinition } from '../types/tools';
import { useApp } from '../context/AppContext';
import { SeoHead } from './SeoHead';
import { copyToClipboard } from '../utils/clipboard';
import { generateOptimizedPromptText } from '../server/imageHandler';
import {
  Image as ImageIcon,
  Sparkles,
  Download,
  Copy,
  Check,
  RotateCw,
  Sliders,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  Wand2,
  Share2,
  ExternalLink,
  ArrowRight,
  Maximize2,
  CheckCircle2,
  Layers,
  FileCode,
} from 'lucide-react';

interface AiImageGeneratorToolProps {
  tool: ToolDefinition;
}

const STYLES = [
  { id: 'Photorealistic', label: 'Photorealistic', desc: '8k photography with natural bokeh and depth' },
  { id: 'Cinematic', label: 'Cinematic', desc: 'Movie still with volumetric lighting and lens flares' },
  { id: '3D Render', label: '3D Render', desc: 'Octane & Unreal Engine 5 ray-traced look' },
  { id: 'Anime', label: 'Anime / Ghibli', desc: 'Hand-drawn aesthetic with vivid color grading' },
  { id: 'Illustration', label: 'Vector Illustration', desc: 'Clean editorial lines and modern flat design' },
  { id: 'Digital Art', label: 'Digital Concept Art', desc: 'ArtStation trending high-fantasy brushwork' },
  { id: 'Product Photography', label: 'Product Photography', desc: 'Commercial studio softbox illumination' },
  { id: 'Fantasy', label: 'Dark Fantasy', desc: 'Mystical realism, ancient runes, and ethereal mist' },
  { id: 'Minimalist', label: 'Minimalist', desc: 'Spacious composition and geometric serenity' },
  { id: 'Custom', label: 'Custom / Raw', desc: 'Pure conceptual description without heavy presets' },
];

const ASPECT_RATIOS = [
  { id: '1:1', label: '1:1 (Square / Instagram Post)' },
  { id: '16:9', label: '16:9 (Landscape / YouTube / Desktop)' },
  { id: '9:16', label: '9:16 (Story / TikTok / Reels)' },
  { id: '4:5', label: '4:5 (Portrait / Social Feed)' },
];

export const AiImageGeneratorTool: React.FC<AiImageGeneratorToolProps> = ({ tool }) => {
  const { navigate, addRecent } = useApp();

  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('Photorealistic');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  // States
  const [isGenerating, setIsGenerating] = useState(false);
  const [isImproving, setIsImproving] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [activePrompt, setActivePrompt] = useState<string>('');
  const [fallbackMessage, setFallbackMessage] = useState<string | null>(null);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [faqOpenIndex, setFaqOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    addRecent('image-prompt-generator');
  }, []);

  const handleGenerateImage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim()) {
      setErrorMessage('Please enter a description of the image you want to create.');
      return;
    }

    setErrorMessage(null);
    setFallbackMessage(null);
    setIsGenerating(true);

    const calculatedPrompt = generateOptimizedPromptText(prompt, style, aspectRatio, negativePrompt);
    setActivePrompt(calculatedPrompt);

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt.trim(),
          style,
          aspectRatio,
          negativePrompt: negativePrompt.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error('Image generation server error');
      }

      const data = await response.json();

      if (data.success && data.image) {
        setGeneratedImage(data.image);
        if (data.prompt) setActivePrompt(data.prompt);
      } else {
        // Honest fallback without fake images
        setGeneratedImage(null);
        setFallbackMessage(
          data.message ||
            'AI image generation is currently unavailable. You can still create and copy an optimized image prompt.'
        );
        if (data.optimizedPrompt) setActivePrompt(data.optimizedPrompt);
      }
    } catch {
      // Network or offline fallback
      setGeneratedImage(null);
      setFallbackMessage(
        'AI image generation is currently unavailable. You can still create and copy an optimized image prompt.'
      );
      setActivePrompt(calculatedPrompt);
    } finally {
      setIsGenerating(false);
      // Smooth scroll down to results container
      setTimeout(() => {
        const el = document.getElementById('image-result-stage');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  const handleGeneratePromptOnly = () => {
    if (!prompt.trim()) {
      setErrorMessage('Please enter a concept or subject to build an optimized prompt.');
      return;
    }
    setErrorMessage(null);
    setFallbackMessage(null);
    const optimized = generateOptimizedPromptText(prompt, style, aspectRatio, negativePrompt);
    setActivePrompt(optimized);
    setGeneratedImage(null);

    setTimeout(() => {
      const el = document.getElementById('image-result-stage');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleImprovePrompt = async () => {
    if (!prompt.trim()) {
      setErrorMessage('Please enter an initial idea before improving.');
      return;
    }
    setErrorMessage(null);
    setIsImproving(true);

    try {
      const response = await fetch('/api/improve-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: prompt.trim(), style }),
      });
      const data = await response.json();
      if (data.improvedPrompt) {
        setPrompt(data.improvedPrompt);
        setActivePrompt(generateOptimizedPromptText(data.improvedPrompt, style, aspectRatio, negativePrompt));
      }
    } catch {
      // Local fallback formulation
      const local = generateOptimizedPromptText(prompt, style, aspectRatio, negativePrompt);
      setPrompt(local);
      setActivePrompt(local);
    } finally {
      setIsImproving(false);
    }
  };

  const handleCopyPrompt = async () => {
    const textToCopy = activePrompt || generateOptimizedPromptText(prompt, style, aspectRatio, negativePrompt);
    const success = await copyToClipboard(textToCopy);
    if (success) {
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 2000);
    }
  };

  const handleDownloadImage = () => {
    if (!generatedImage) return;
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `ai-image-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div id="ai-image-generator-tool" className="bg-slate-50 min-h-screen py-8 sm:py-12">
      <SeoHead
        title="Free AI Image Generator & Prompt Creator — Generate Studio Images Online"
        description="Generate photorealistic AI images and tailored prompts for Midjourney, Flux, and Leonardo. Free online AI image creator with multi-style and aspect ratio support."
        canonicalPath="/tools/image-prompt-generator"
        toolName="AI Image Generator"
        categoryName="AI Images"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <button onClick={() => navigate('/')} className="hover:text-slate-900 transition-colors">
            Home
          </button>
          <span>/</span>
          <button onClick={() => navigate('/categories/ai-images')} className="hover:text-slate-900 transition-colors">
            AI Images
          </button>
          <span>/</span>
          <span className="text-slate-900">AI Image Generator</span>
        </div>

        {/* Hero Generator Card */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-6 sm:p-10 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 shadow-2xs">
              <ImageIcon className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                AI Image Generator & Prompt Creator
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Generate real AI images or create master prompts for Midjourney, Flux, and Leonardo AI.
              </p>
            </div>
          </div>

          <form onSubmit={handleGenerateImage} className="space-y-6 mt-4">
            {/* Input 1: Description */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="image-prompt-input" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Image Description / Concept <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={handleImprovePrompt}
                  disabled={isImproving || !prompt.trim()}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 disabled:opacity-40 transition-colors"
                >
                  <Wand2 className={`w-3.5 h-3.5 ${isImproving ? 'animate-spin' : ''}`} />
                  <span>{isImproving ? 'Refining...' : 'Improve Prompt with AI'}</span>
                </button>
              </div>

              <textarea
                id="image-prompt-input"
                rows={3}
                value={prompt}
                onChange={(e) => {
                  setPrompt(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                placeholder="Describe the image you want to create (e.g., A cybernetic fox perched on a neon-lit skyscraper overlooking a rainy Tokyo skyline...)"
                className="w-full px-4 py-3 text-sm bg-slate-50/70 border border-slate-200 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-50 focus:border-indigo-500 transition-all resize-y"
              />

              {errorMessage && (
                <div className="flex items-center gap-2 mt-2 text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl p-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}
            </div>

            {/* Input 2: Visual Style */}
            <div>
              <label htmlFor="style-selector" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Artistic Style
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {STYLES.map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setStyle(st.id)}
                    className={`px-3 py-2.5 text-xs font-semibold rounded-xl border text-left transition-all ${
                      style === st.id
                        ? 'border-indigo-600 bg-indigo-50/80 text-indigo-950 font-bold shadow-2xs'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="truncate">{st.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Input 3: Aspect Ratio */}
            <div>
              <label htmlFor="aspect-ratio-selector" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Aspect Ratio
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {ASPECT_RATIOS.map((ar) => (
                  <button
                    key={ar.id}
                    type="button"
                    onClick={() => setAspectRatio(ar.id)}
                    className={`px-3 py-2.5 text-xs font-semibold rounded-xl border text-left transition-all ${
                      aspectRatio === ar.id
                        ? 'border-indigo-600 bg-indigo-50/80 text-indigo-950 font-bold shadow-2xs'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="font-mono text-xs">{ar.id}</div>
                    <div className="text-[11px] text-slate-500 truncate mt-0.5">{ar.label.split('(')[1]?.replace(')', '') || ar.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Advanced Toggle: Negative Prompt */}
            <div>
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>{showAdvanced ? 'Hide Negative Prompt' : 'Add Negative Prompt (Optional)'}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
              </button>

              {showAdvanced && (
                <div className="mt-2.5 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
                  <label htmlFor="negative-prompt-input" className="block text-xs font-medium text-slate-600">
                    What to exclude (Negative Prompt):
                  </label>
                  <input
                    id="negative-prompt-input"
                    type="text"
                    value={negativePrompt}
                    onChange={(e) => setNegativePrompt(e.target.value)}
                    placeholder="e.g., blurry, distorted faces, low quality, oversaturated"
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <button
                id="generate-image-button"
                type="submit"
                disabled={isGenerating || !prompt.trim()}
                className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-sm rounded-2xl shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Synthesizing Image...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Image</span>
                  </>
                )}
              </button>

              <button
                id="generate-prompt-only-btn"
                type="button"
                onClick={handleGeneratePromptOnly}
                className="px-5 py-3.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 font-semibold text-xs rounded-2xl shadow-2xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <FileCode className="w-4 h-4 text-slate-500" />
                <span>Generate Prompt Only</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setPrompt('Cyberpunk barista brewing espresso in a neon-lit alleyway');
                  setStyle('Photorealistic');
                  setAspectRatio('16:9');
                  setErrorMessage(null);
                }}
                className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors text-center sm:text-left py-2"
              >
                Try sample prompt
              </button>
            </div>
          </form>
        </div>

        {/* Results Workspace / Preview Stage */}
        <div id="image-result-stage" className="space-y-6">
          {/* Honest Fallback Alert (when AI image generation is unavailable or fails) */}
          {fallbackMessage && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 space-y-2">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-bold text-amber-900">Notice</h3>
                  <p className="text-xs sm:text-sm text-amber-800 mt-0.5 leading-relaxed">
                    {fallbackMessage}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Real AI Image Preview (when generated) */}
          {generatedImage && (
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-6 sm:p-10 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  AI Image Generated
                </span>
                <span className="text-xs font-medium text-slate-400">Aspect Ratio: {aspectRatio}</span>
              </div>

              <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-200/80 shadow-inner flex items-center justify-center max-h-[550px]">
                <img
                  src={generatedImage}
                  alt={prompt}
                  className="w-full h-auto object-contain max-h-[550px]"
                />
              </div>

              {/* Action Buttons for Image */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleDownloadImage}
                  className="px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-2xs flex items-center gap-2 cursor-pointer transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Image (JPG)</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyPrompt}
                  className="px-4 py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl shadow-2xs flex items-center gap-2 cursor-pointer transition-all"
                >
                  {copiedPrompt ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span className="text-emerald-700">Copied Prompt!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-slate-500" />
                      <span>Copy Prompt</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleGenerateImage}
                  disabled={isGenerating}
                  className="px-4 py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl shadow-2xs flex items-center gap-2 cursor-pointer transition-all"
                >
                  <RotateCw className={`w-4 h-4 text-slate-500 ${isGenerating ? 'animate-spin' : ''}`} />
                  <span>Generate Again</span>
                </button>
              </div>
            </div>
          )}

          {/* Optimized Prompt Card (Always accessible and copyable) */}
          {activePrompt && (
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-6 sm:p-8 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-sm text-slate-900">Optimized Master Prompt</h3>
                </div>

                <button
                  type="button"
                  onClick={handleCopyPrompt}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                >
                  {copiedPrompt ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-500" />
                      <span>Copy Prompt</span>
                    </>
                  )}
                </button>
              </div>

              <div className="p-4 bg-slate-900 rounded-2xl text-slate-100 text-xs font-mono leading-relaxed select-all">
                {activePrompt}
              </div>

              {/* Compatible AI Model Badges */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-500">
                <span className="font-semibold text-slate-700">Compatible with:</span>
                <span className="px-2 py-0.5 bg-slate-100 rounded-md">Midjourney v6</span>
                <span className="px-2 py-0.5 bg-slate-100 rounded-md">Flux.1 Dev / Schnell</span>
                <span className="px-2 py-0.5 bg-slate-100 rounded-md">Leonardo AI</span>
                <span className="px-2 py-0.5 bg-slate-100 rounded-md">DALL-E 3</span>
                <span className="px-2 py-0.5 bg-slate-100 rounded-md">Stable Diffusion XL</span>
              </div>
            </div>
          )}
        </div>

        {/* Educational Content & Guidelines */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-6 sm:p-10 space-y-8">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-500" />
              How to Generate Studio-Grade AI Images
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Generating compelling AI images requires crafting prompts that combine clear subject descriptions with lighting physics, camera focal lengths, and stylistic modifiers. Rather than generic keywords, state-of-the-art models (including Google Imagen, Flux, and Midjourney) excel when given specific contextual details such as volumetric rays, camera lenses (like 85mm f/1.4), and subtle material textures.
            </p>
          </section>

          {/* Section 2: Prompting Tips */}
          <section className="space-y-4 border-t border-slate-100 pt-6">
            <h2 className="text-xl font-bold text-slate-900">Pro Prompt Engineering Tips</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-50 border border-slate-200/70 rounded-2xl space-y-1.5">
                <h3 className="font-bold text-sm text-slate-900">Define the Lighting</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Avoid generic &quot;good lighting&quot;. Use specific terms like golden hour sunlight, chiaroscuro contrast, softbox diffusion, or volumetric neon haze.
                </p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200/70 rounded-2xl space-y-1.5">
                <h3 className="font-bold text-sm text-slate-900">Specify Camera Specs</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Mentioning 85mm portrait lenses creates creamy depth of field (bokeh), while 16mm ultra-wide lenses deliver expansive environmental drama.
                </p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200/70 rounded-2xl space-y-1.5">
                <h3 className="font-bold text-sm text-slate-900">Use Negative Prompts</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Instruct the generator on what to suppress: unnatural skin smoothing, distorted fingers, blurry backgrounds, or aggressive watermark artifacts.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3: FAQs */}
          <section className="space-y-4 border-t border-slate-100 pt-6">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-indigo-500" />
              Frequently Asked Questions (FAQ)
            </h2>

            <div className="space-y-3">
              {[
                {
                  q: 'Can I use the generated images for commercial projects?',
                  a: 'Yes. Images generated through this tool are granted for both personal and commercial use (such as blog covers, social media graphics, product concept drafts, and YouTube thumbnails). Ensure your final published works comply with applicable trademark and copyright laws.',
                },
                {
                  q: 'What happens if AI image generation is unavailable?',
                  a: 'If external API quotas or service connectivity limits prevent live image synthesis, the tool transparently provides the full optimized prompt. You can copy this prompt in one click and paste it directly into Midjourney, Leonardo, Flux, or ChatGPT.',
                },
                {
                  q: 'What aspect ratios are supported?',
                  a: 'We provide 1:1 (square for social feeds), 16:9 (horizontal landscape for YouTube videos and widescreen monitors), 9:16 (vertical for TikTok, YouTube Shorts, and Instagram Stories), and 4:5 (portrait feed format).',
                },
                {
                  q: 'Does this tool store my generated images permanently?',
                  a: 'No. To ensure maximum user privacy, images and prompts are processed ephemerally. Download your favorite images directly to your local computer or phone memory.',
                },
              ].map((faq, idx) => (
                <div key={idx} className="border border-slate-200 rounded-2xl overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setFaqOpenIndex(faqOpenIndex === idx ? null : idx)}
                    className="w-full px-5 py-4 text-left flex items-center justify-between text-sm font-bold text-slate-800 hover:bg-slate-50 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform ${
                        faqOpenIndex === idx ? 'rotate-180 text-indigo-600' : ''
                      }`}
                    />
                  </button>
                  {faqOpenIndex === idx && (
                    <div className="px-5 pb-4 text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50/50 border-t border-slate-100">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Section 4: Related Tools */}
          <section className="border-t border-slate-100 pt-6">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
              Related Creative & Visual Tools
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => navigate('/tools/youtube-thumbnail-downloader')}
                className="p-4 bg-slate-50 hover:bg-red-50/50 border border-slate-200 hover:border-red-200 rounded-2xl text-left transition-all group"
              >
                <div className="font-bold text-sm text-slate-900 group-hover:text-red-600 flex items-center justify-between">
                  <span>YouTube Thumbnail Downloader</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-red-500" />
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Extract HD thumbnails from any YouTube video in one click.
                </p>
              </button>

              <button
                type="button"
                onClick={() => navigate('/tools/youtube-title-generator')}
                className="p-4 bg-slate-50 hover:bg-indigo-50/50 border border-slate-200 hover:border-indigo-200 rounded-2xl text-left transition-all group"
              >
                <div className="font-bold text-sm text-slate-900 group-hover:text-indigo-600 flex items-center justify-between">
                  <span>YouTube Title Generator</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-500" />
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Generate 20 high-CTR video title ideas based on viral formulas.
                </p>
              </button>

              <button
                type="button"
                onClick={() => navigate('/tools/business-name-generator')}
                className="p-4 bg-slate-50 hover:bg-purple-50/50 border border-slate-200 hover:border-purple-200 rounded-2xl text-left transition-all group"
              >
                <div className="font-bold text-sm text-slate-900 group-hover:text-purple-600 flex items-center justify-between">
                  <span>Business Name Generator</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-500" />
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Brainstorm brandable startup and business names.
                </p>
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
