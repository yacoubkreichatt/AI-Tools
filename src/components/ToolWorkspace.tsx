import React, { useState, useEffect } from 'react';
import { ToolDefinition, GenerationResult } from '../types/tools';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/categories';
import { TOOLS } from '../data/tools';
import { generateContent } from '../services/aiService';
import { copyToClipboard } from '../utils/clipboard';
import { SeoHead } from './SeoHead';
import { ToolIcon } from './ToolIcon';
import { ShareModal } from './ShareModal';
import {
  Sparkles,
  Copy,
  Check,
  RotateCw,
  Download,
  Printer,
  Share2,
  Star,
  Zap,
  ArrowRight,
  ChevronDown,
  Info,
  Sliders,
  FileText,
} from 'lucide-react';

interface ToolWorkspaceProps {
  tool: ToolDefinition;
}

export const ToolWorkspace: React.FC<ToolWorkspaceProps> = ({ tool }) => {
  const { navigate, isFavorite, toggleFavorite, addRecent, t } = useApp();

  // Inputs state initialized with default values from tool definition
  const [formInputs, setFormInputs] = useState<Record<string, any>>(() => {
    const initial: Record<string, any> = {};
    tool.inputs.forEach((input) => {
      initial[input.name] = input.defaultValue ?? '';
    });
    return initial;
  });

  // Engine preference: 'ai' vs 'local'
  const [enginePreference, setEnginePreference] = useState<'ai' | 'local'>('ai');

  // Generation state
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [copiedItemIndex, setCopiedItemIndex] = useState<number | string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Mark recent on mount
  useEffect(() => {
    addRecent(tool.slug);
    // Reset result when tool changes
    setResult(null);
    setFormError(null);
    const initial: Record<string, any> = {};
    tool.inputs.forEach((input) => {
      initial[input.name] = input.defaultValue ?? '';
    });
    setFormInputs(initial);
  }, [tool.slug]);

  const category = CATEGORIES.find((c) => c.id === tool.category);
  const favorited = isFavorite(tool.slug);

  const handleInputChange = (name: string, value: any) => {
    if (formError) setFormError(null);
    setFormInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    // Check required inputs
    const missing = tool.inputs.find((i) => i.required && !formInputs[i.name]);
    if (missing) {
      setFormError(`Please fill in "${missing.label}" to generate.`);
      return;
    }
    setFormError(null);

    setLoading(true);
    try {
      const res = await generateContent(tool.slug, formInputs, {
        enginePreference,
      });
      setResult(res);

      // Smooth scroll down to results on mobile
      setTimeout(() => {
        const el = document.getElementById('generation-results-container');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Helper to copy text to clipboard with feedback
  const handleCopyText = async (text: string, identifier: number | string) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopiedItemIndex(identifier);
      setTimeout(() => setCopiedItemIndex(null), 2000);
    }
  };

  // Helper to get formatted text for copying and downloading
  const getFormattedResultText = (): string => {
    if (!result) return '';
    if (result.groupedHashtags) {
      return [
        '# High Volume:\n' + result.groupedHashtags.highVolume.join(' '),
        '# Medium Volume:\n' + result.groupedHashtags.mediumVolume.join(' '),
        '# Niche:\n' + result.groupedHashtags.niche.join(' '),
      ].join('\n\n');
    }
    if (result.rawText) return result.rawText;
    if (result.documentBody) return result.documentBody;
    if (result.list) return result.list.join('\n\n');
    if (result.bios) {
      return result.bios.map((b) => `[${b.style}]\n${b.bio}`).join('\n\n---\n\n');
    }
    if (result.businessNames) {
      return result.businessNames
        .map((b) => `${b.name} (${b.category}): ${b.rationale}${b.domainIdea ? ` [${b.domainIdea}]` : ''}`)
        .join('\n');
    }
    if (result.reelIdeas) {
      return result.reelIdeas
        .map((r, i) => `#${i + 1} Hook: ${r.hook}\nConcept: ${r.concept}\nCTA: ${r.cta}`)
        .join('\n\n---\n\n');
    }
    if (result.adVariations) {
      return result.adVariations
        .map((a) => `[${a.angle}]\nHeadline: ${a.headline}\nText:\n${a.primaryText}\nCTA: ${a.callToAction}`)
        .join('\n\n---\n\n');
    }
    return '';
  };

  // Helper to copy entire result
  const handleCopyAll = async () => {
    const fullText = getFormattedResultText();
    if (!fullText) return;
    const success = await copyToClipboard(fullText);
    if (success) {
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    }
  };

  // Helper to download TXT
  const handleDownloadTxt = () => {
    const textToDownload = getFormattedResultText();
    if (!textToDownload) return;

    const blob = new Blob([textToDownload], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${tool.slug}-result.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Helper to print document
  const handlePrint = () => {
    window.print();
  };

  // Related tools in same category or popular
  const relatedTools = TOOLS.filter(
    (t) => t.slug !== tool.slug && (t.category === tool.category || t.isPopular)
  ).slice(0, 4);

  return (
    <div id={`tool-page-${tool.slug}`} className="min-h-screen bg-slate-50/60 pb-20">
      {/* Dynamic SEO Head */}
      <SeoHead
        title={tool.seoTitle || tool.seo?.title || `${tool.name} - Free AI Generator`}
        description={tool.seoDescription || tool.seo?.description || tool.description}
        canonicalPath={`/tools/${tool.slug}`}
        toolName={tool.name}
        categoryName={category?.name}
        faqs={tool.faqs}
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Tools', path: '/tools' },
          { name: category?.name || 'Category', path: `/categories/${tool.category}` },
          { name: tool.name, path: `/tools/${tool.slug}` },
        ]}
      />

      {/* Share Modal Dialog */}
      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        toolName={tool.name}
        toolUrl={`${
          (import.meta.env.VITE_SITE_URL as string) ||
          (typeof window !== 'undefined' && window.location.origin && !window.location.origin.includes('localhost') && !window.location.origin.includes('127.0.0.1')
            ? window.location.origin
            : 'https://YOUR-DOMAIN.com')
        }/tools/${tool.slug}`}
      />

      {/* Header Breadcrumbs & Tool Hero */}
      <div className="bg-white border-b border-slate-200/80 pt-6 pb-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500 mb-4 flex-wrap">
            <button onClick={() => navigate('/')} className="hover:text-slate-900 transition-colors">
              Home
            </button>
            <span>/</span>
            <button onClick={() => navigate('/tools')} className="hover:text-slate-900 transition-colors">
              AI Tools
            </button>
            <span>/</span>
            <button
              onClick={() => navigate(`/categories/${tool.category}`)}
              className="hover:text-slate-900 transition-colors capitalize"
            >
              {category?.name || tool.category}
            </button>
            <span>/</span>
            <span className="font-semibold text-slate-900 truncate max-w-xs">{tool.name}</span>
          </nav>

          {/* Tool Title, Description, and Actions */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-xs">
                <ToolIcon name={tool.icon} className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    {tool.name}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold uppercase tracking-wider">
                    Free
                  </span>
                </div>
                <p className="mt-1 text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
                  {tool.description}
                </p>
              </div>
            </div>

            {/* Quick Actions (Share, Favorite) */}
            <div className="flex items-center gap-2 self-start md:self-center shrink-0">
              <button
                id="tool-favorite-btn"
                onClick={() => toggleFavorite(tool.slug)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  favorited
                    ? 'bg-amber-50 border-amber-300 text-amber-800 shadow-2xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Star className={`w-4 h-4 ${favorited ? 'fill-amber-400 text-amber-500' : 'text-slate-400'}`} />
                <span>{favorited ? 'Favorited' : 'Save Tool'}</span>
              </button>

              <button
                id="tool-share-btn"
                onClick={() => setShareModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <Share2 className="w-4 h-4 text-slate-500" />
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Workspace: Form & Results */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Generator Form (5 cols on lg) */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Sliders className="w-4 h-4 text-slate-700" />
                Configuration
              </h2>
              <span className="text-[11px] text-slate-400 font-medium">Step 1 of 2</span>
            </div>

            {/* Form */}
            <form onSubmit={handleGenerate} className="space-y-4">
              {tool.inputs.map((input) => {
                const val = formInputs[input.name] ?? '';

                return (
                  <div key={input.name} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor={`input-${input.name}`}
                        className="block text-xs font-bold text-slate-700"
                      >
                        {input.label} {input.required && <span className="text-rose-500">*</span>}
                      </label>
                      {input.helpText && (
                        <span className="text-[10px] text-slate-400">{input.helpText}</span>
                      )}
                    </div>

                    {input.type === 'text' && (
                      <input
                        id={`input-${input.name}`}
                        type="text"
                        value={val}
                        onChange={(e) => handleInputChange(input.name, e.target.value)}
                        placeholder={input.placeholder}
                        required={input.required}
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50/70 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all text-slate-900 placeholder-slate-400"
                      />
                    )}

                    {input.type === 'textarea' && (
                      <textarea
                        id={`input-${input.name}`}
                        rows={3}
                        value={val}
                        onChange={(e) => handleInputChange(input.name, e.target.value)}
                        placeholder={input.placeholder}
                        required={input.required}
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50/70 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all text-slate-900 placeholder-slate-400 resize-y"
                      />
                    )}

                    {input.type === 'select' && (
                      <div className="relative">
                        <select
                          id={`input-${input.name}`}
                          value={val}
                          onChange={(e) => handleInputChange(input.name, e.target.value)}
                          className="w-full appearance-none px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50/70 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all text-slate-900 pr-9"
                        >
                          {input.options?.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    )}

                    {input.type === 'number' && (
                      <input
                        id={`input-${input.name}`}
                        type="number"
                        min={input.min || 1}
                        max={input.max || 50}
                        value={val}
                        onChange={(e) => handleInputChange(input.name, e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50/70 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all text-slate-900"
                      />
                    )}
                  </div>
                );
              })}

              {/* Engine Toggle */}
              <div className="pt-2 pb-1">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-indigo-600" />
                    <div>
                      <div className="font-semibold text-slate-900">Execution Mode</div>
                      <div className="text-[10px] text-slate-500">
                        {enginePreference === 'ai' ? 'Gemini 3.8 Flash + Local Fallback' : 'Instant Template Engine'}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setEnginePreference(enginePreference === 'ai' ? 'local' : 'ai')}
                    className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    {enginePreference === 'ai' ? 'Switch to Local' : 'Switch to AI'}
                  </button>
                </div>
              </div>

              {/* Validation error message */}
              {formError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-semibold flex items-center gap-2">
                  <Info className="w-4 h-4 shrink-0 text-rose-500" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Submit CTA */}
              <button
                id="generate-btn"
                type="submit"
                disabled={loading}
                className="w-full min-h-[46px] py-3 px-5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <RotateCw className="w-4 h-4 animate-spin text-indigo-400" />
                    <span>Generating Results...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    <span>Generate Free Output</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Column: Output Results (7 cols on lg) */}
          <div
            id="generation-results-container"
            className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 space-y-6"
          >
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-3">
              <div>
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <FileText className="w-4 h-4 text-slate-700" />
                  Generated Output
                </h2>
                {result && (
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Engine: {result.metadata?.engineUsed === 'ai' ? 'Gemini 3.8 Flash' : 'High-Speed Local Engine'}
                  </p>
                )}
              </div>

              {result && (
                <div className="flex items-center gap-2 flex-wrap">
                  {/* Copy All Button */}
                  <button
                    id="copy-all-btn"
                    onClick={handleCopyAll}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors"
                  >
                    {copiedAll ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Copied All!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy All</span>
                      </>
                    )}
                  </button>

                  {/* Regenerate Button */}
                  <button
                    id="regenerate-btn"
                    onClick={() => handleGenerate()}
                    disabled={loading}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors disabled:opacity-50"
                  >
                    <RotateCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                    <span>Regenerate</span>
                  </button>

                  {/* Download TXT */}
                  <button
                    id="download-txt-btn"
                    onClick={handleDownloadTxt}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors"
                    title="Download as text file"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>TXT</span>
                  </button>

                  {/* Print / PDF */}
                  <button
                    id="print-btn"
                    onClick={handlePrint}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors"
                    title="Print or Save to PDF"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print</span>
                  </button>
                </div>
              )}
            </div>

            {/* AI unavailable notice if user requested AI but got local fallback */}
            {result && enginePreference === 'ai' && result.metadata?.engineUsed === 'local' && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-600 shrink-0" />
                <span>AI generation is currently unavailable. Using instant generation mode.</span>
              </div>
            )}

            {/* Results Body / Renderer */}
            {loading ? (
              <div className="py-20 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-indigo-600 animate-pulse">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div className="text-sm font-semibold text-slate-800">Synthesizing High-Impact Content...</div>
                <div className="text-xs text-slate-400 max-w-sm mx-auto">
                  Applying copywriting frameworks and optimization rules for your audience.
                </div>
              </div>
            ) : result ? (
              <div className="space-y-4">
                {/* 1. LIST OUTPUT (Hooks, Titles, Prompts) */}
                {result.list && !result.groupedHashtags && (
                  <div className="space-y-2.5">
                    {result.list.map((item, index) => {
                      const isCopied = copiedItemIndex === index;
                      return (
                        <div
                          key={index}
                          className="group p-3.5 rounded-xl border border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/70 transition-all flex items-start justify-between gap-3"
                        >
                          <div className="flex items-start gap-3">
                            <span className="text-xs font-bold text-slate-400 select-none pt-0.5">
                              {(index + 1).toString().padStart(2, '0')}
                            </span>
                            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line font-medium">
                              {item}
                            </p>
                          </div>
                          <button
                            onClick={() => handleCopyText(item, index)}
                            className={`p-1.5 rounded-lg transition-colors shrink-0 ${
                              isCopied
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'text-slate-400 hover:text-slate-700 hover:bg-slate-200/70'
                            }`}
                            title="Copy this item"
                            aria-label="Copy item"
                          >
                            {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* 2. BIOS OUTPUT (Instagram Bios) */}
                {result.bios && (
                  <div className="space-y-3">
                    {result.bios.map((bio, index) => {
                      const isCopied = copiedItemIndex === bio.id;
                      return (
                        <div
                          key={bio.id}
                          className="p-4 rounded-xl border border-slate-200/90 hover:border-slate-300 transition-all space-y-3 bg-slate-50/40"
                        >
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-slate-900 bg-white px-2.5 py-1 rounded-md border border-slate-200">
                              {bio.style}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] text-slate-400">
                                {bio.characterCount} / 150 chars
                              </span>
                              <button
                                onClick={() => handleCopyText(bio.bio, bio.id)}
                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
                                  isCopied
                                    ? 'bg-emerald-100 text-emerald-700'
                                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                                }`}
                              >
                                {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                <span>{isCopied ? 'Copied' : 'Copy'}</span>
                              </button>
                            </div>
                          </div>
                          <p className="text-xs sm:text-sm text-slate-800 whitespace-pre-line font-mono bg-white p-3 rounded-lg border border-slate-100">
                            {bio.bio}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* 3. BUSINESS NAMES OUTPUT */}
                {result.businessNames && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {result.businessNames.map((bn, index) => {
                      const isCopied = copiedItemIndex === bn.id;
                      return (
                        <div
                          key={bn.id}
                          className="p-4 rounded-xl border border-slate-200/90 hover:border-slate-300 bg-slate-50/30 flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                {bn.category}
                              </span>
                              <button
                                onClick={() => handleCopyText(bn.name, bn.id)}
                                className={`p-1.5 rounded-lg transition-colors ${
                                  isCopied
                                    ? 'bg-emerald-100 text-emerald-700'
                                    : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                                }`}
                                title="Copy name"
                              >
                                {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                            <div className="text-base font-bold text-slate-900">{bn.name}</div>
                            <p className="mt-1 text-[11px] text-slate-500 leading-relaxed">{bn.rationale}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* 4. REEL IDEAS OUTPUT */}
                {result.reelIdeas && (
                  <div className="space-y-4">
                    {result.reelIdeas.map((reel, index) => {
                      const isCopied = copiedItemIndex === reel.id;
                      const copyContent = `Hook: ${reel.hook}\nConcept: ${reel.concept}\nCTA: ${reel.cta}`;
                      return (
                        <div
                          key={reel.id}
                          className="p-4 rounded-xl border border-slate-200/90 hover:border-slate-300 bg-slate-50/30 space-y-2.5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                              Idea #{index + 1} • {reel.formatSuggestion || 'Short-Form Video'}
                            </span>
                            <button
                              onClick={() => handleCopyText(copyContent, reel.id)}
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
                                isCopied
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                              }`}
                            >
                              {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                              <span>{isCopied ? 'Copied' : 'Copy Idea'}</span>
                            </button>
                          </div>

                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                              3-Second Hook
                            </span>
                            <p className="text-xs sm:text-sm font-semibold text-slate-900">&quot;{reel.hook}&quot;</p>
                          </div>

                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                              Visual Concept / Action
                            </span>
                            <p className="text-xs text-slate-600 leading-relaxed">{reel.concept}</p>
                          </div>

                          <div className="pt-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                              End Call-to-Action
                            </span>
                            <p className="text-xs text-emerald-800 font-medium">{reel.cta}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* 5. AD COPY VARIATIONS OUTPUT */}
                {result.adVariations && (
                  <div className="space-y-5">
                    {result.adVariations.map((ad) => {
                      const isCopied = copiedItemIndex === ad.id;
                      const adContent = `Headline: ${ad.headline}\n\nPrimary Text:\n${ad.primaryText}\n\nDescription: ${ad.description}\nCTA: ${ad.callToAction}`;
                      return (
                        <div
                          key={ad.id}
                          className="p-5 rounded-2xl border border-slate-200 bg-slate-50/40 space-y-3"
                        >
                          <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
                            <span className="text-xs font-bold text-slate-800 bg-white px-2.5 py-1 rounded-md border border-slate-200">
                              {ad.angle}
                            </span>
                            <button
                              onClick={() => handleCopyText(adContent, ad.id)}
                              className={`inline-flex items-center gap-1 px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
                                isCopied
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                              }`}
                            >
                              {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                              <span>{isCopied ? 'Copied Ad' : 'Copy Variation'}</span>
                            </button>
                          </div>

                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                              Headline
                            </span>
                            <p className="text-sm font-bold text-slate-900">{ad.headline}</p>
                          </div>

                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                              Primary Text
                            </span>
                            <p className="text-xs sm:text-sm text-slate-700 whitespace-pre-line leading-relaxed bg-white p-3 rounded-xl border border-slate-100 font-sans">
                              {ad.primaryText}
                            </p>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                            <div className="bg-white p-2 rounded-lg border border-slate-100">
                              <span className="text-[10px] text-slate-400 block">Link Description:</span>
                              <span className="text-slate-700 font-medium">{ad.description}</span>
                            </div>
                            <div className="bg-white p-2 rounded-lg border border-slate-100">
                              <span className="text-[10px] text-slate-400 block">Button CTA:</span>
                              <span className="text-indigo-600 font-bold">{ad.callToAction}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* 6. DOCUMENT OUTPUT (Resume, Cover Letter) */}
                {result.documentBody && (
                  <div className="space-y-3">
                    <div className="p-6 bg-slate-900 text-slate-100 rounded-2xl font-mono text-xs sm:text-xs leading-relaxed overflow-x-auto whitespace-pre-wrap selection:bg-indigo-500 selection:text-white max-h-[600px] border border-slate-800">
                      {result.documentBody}
                    </div>
                  </div>
                )}

                {/* 7. GROUPED HASHTAGS OUTPUT */}
                {result.groupedHashtags && (
                  <div className="space-y-4">
                    {/* High Volume */}
                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/40">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-slate-800">
                          High Volume / Trending (1M+ Posts)
                        </span>
                        <button
                          onClick={() =>
                            handleCopyText(result.groupedHashtags!.highVolume.join(' '), 'high-vol')
                          }
                          className="text-xs text-indigo-600 font-semibold hover:underline"
                        >
                          {copiedItemIndex === 'high-vol' ? 'Copied!' : 'Copy Group'}
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {result.groupedHashtags.highVolume.map((h, i) => (
                          <span
                            key={i}
                            className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-medium text-slate-700"
                          >
                            {h}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Medium Volume */}
                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/40">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-slate-800">
                          Targeted / Medium Volume (100k - 500k Posts)
                        </span>
                        <button
                          onClick={() =>
                            handleCopyText(result.groupedHashtags!.mediumVolume.join(' '), 'med-vol')
                          }
                          className="text-xs text-indigo-600 font-semibold hover:underline"
                        >
                          {copiedItemIndex === 'med-vol' ? 'Copied!' : 'Copy Group'}
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {result.groupedHashtags.mediumVolume.map((h, i) => (
                          <span
                            key={i}
                            className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-medium text-slate-700"
                          >
                            {h}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Niche Specific */}
                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/40">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-slate-800">
                          Niche & High-Conversion (10k - 50k Posts)
                        </span>
                        <button
                          onClick={() =>
                            handleCopyText(result.groupedHashtags!.niche.join(' '), 'niche-vol')
                          }
                          className="text-xs text-indigo-600 font-semibold hover:underline"
                        >
                          {copiedItemIndex === 'niche-vol' ? 'Copied!' : 'Copy Group'}
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {result.groupedHashtags.niche.map((h, i) => (
                          <span
                            key={i}
                            className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-medium text-slate-700"
                          >
                            {h}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Empty state before generation */
              <div className="py-20 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div className="text-sm font-semibold text-slate-700">Ready When You Are</div>
                <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                  Enter your topic or requirements in the configuration panel on the left and click &quot;Generate Free Output&quot;.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Informational Guide & FAQ for SEO (Below the Tool) */}
        <div className="mt-12 bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 sm:p-8 space-y-8">
          {/* How to use */}
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Info className="w-5 h-5 text-indigo-600" />
              How to Use the Free {tool.name}
            </h2>
            <div className="prose prose-sm text-slate-600 max-w-none space-y-2 text-xs sm:text-sm leading-relaxed">
              <p>
                Our {tool.name} is designed to eliminate writer&apos;s block and deliver ready-to-publish content in seconds. Follow these simple steps for optimal results:
              </p>
              <ol className="list-decimal pl-5 space-y-1.5">
                <li>
                  <strong>Specify your exact audience:</strong> The more defined your target viewer or customer is, the sharper the psychological resonance of the output.
                </li>
                <li>
                  <strong>Choose a fitting tone:</strong> Match the vibe to your brand voice — whether bold, funny, analytical, or luxury.
                </li>
                <li>
                  <strong>Review and adapt:</strong> Use our 1-click copy feature to test multiple variations across your campaigns.
                </li>
              </ol>
            </div>
          </div>

          {/* Tool-specific FAQs */}
          {tool.faqs && tool.faqs.length > 0 && (
            <div className="pt-6 border-t border-slate-100">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-4">
                Frequently Asked Questions About {tool.name}
              </h3>
              <div className="space-y-3">
                {tool.faqs.map((faq, i) => (
                  <div key={i} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 mb-1">{faq.question}</h4>
                    <p className="text-xs sm:text-xs text-slate-600 leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Related Tools in Same Category */}
        {relatedTools.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">Explore More Free Tools</h3>
              <button
                onClick={() => navigate('/tools')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                Browse All Tools →
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedTools.map((rel) => (
                <div
                  key={rel.slug}
                  onClick={() => navigate(`/tools/${rel.slug}`)}
                  className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0">
                      <ToolIcon name={rel.icon} className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-slate-900 line-clamp-1">{rel.name}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mb-3">{rel.tagline}</p>
                  <span className="text-[11px] font-semibold text-indigo-600 flex items-center gap-1">
                    Try Tool <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
