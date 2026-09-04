import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, Search, ArrowRight, Zap, ShieldCheck, Smartphone } from 'lucide-react';

export const Hero: React.FC = () => {
  const { navigate, t, setIsSearchOpen, setSearchQuery } = useApp();
  const [localSearch, setLocalSearch] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localSearch.trim()) {
      setSearchQuery(localSearch.trim());
      setIsSearchOpen(true);
    }
  };

  return (
    <section id="hero-section" className="relative pt-12 pb-16 sm:pt-20 sm:pb-24 overflow-hidden border-b border-slate-200/80 bg-white">
      {/* Subtle Background Accent */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Quality Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-800 mb-6 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>{t('hero.badge')}</span>
        </div>

        {/* Main H1 Headline */}
        <h1
          id="hero-title"
          className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 max-w-4xl mx-auto leading-tight sm:leading-tight"
        >
          {t('hero.title')}
        </h1>

        {/* Subtitle Description */}
        <p
          id="hero-desc"
          className="mt-5 text-base sm:text-lg lg:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed"
        >
          {t('hero.description')}
        </p>

        {/* Quick Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <button
            id="hero-primary-cta"
            onClick={() => navigate('/tools')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm rounded-xl shadow-xs transition-all active:scale-98"
          >
            <span>{t('hero.cta.primary')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            id="hero-secondary-cta"
            onClick={() => navigate('/popular')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-100 hover:bg-slate-200/80 text-slate-800 font-semibold text-sm rounded-xl border border-slate-200 transition-colors"
          >
            <Zap className="w-4 h-4 text-amber-500" />
            <span>{t('hero.cta.secondary')}</span>
          </button>
        </div>

        {/* Big Search Bar */}
        <div className="mt-10 sm:mt-12 max-w-2xl mx-auto">
          <div className="text-left mb-2">
            <label
              htmlFor="hero-search-input"
              className="block text-xs font-semibold text-slate-700 tracking-wide uppercase"
            >
              {t('hero.search.label')}
            </label>
          </div>
          <form
            onSubmit={handleSearchSubmit}
            className="relative flex items-center shadow-md rounded-2xl bg-white border border-slate-300 focus-within:border-slate-800 focus-within:ring-2 focus-within:ring-slate-800/10 transition-all"
          >
            <div className="pl-4 text-slate-400">
              <Search className="w-5 h-5" />
            </div>
            <input
              id="hero-search-input"
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder={t('hero.search.placeholder')}
              className="w-full py-3.5 px-3 text-sm sm:text-base text-slate-900 placeholder-slate-400 focus:outline-hidden rounded-2xl"
            />
            <button
              id="hero-search-submit"
              type="submit"
              className="m-1.5 px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-xl hover:bg-slate-800 transition-colors shrink-0"
            >
              Search
            </button>
          </form>

          {/* Quick Search Chips */}
          <div className="mt-3 flex items-center justify-center flex-wrap gap-1.5 text-xs text-slate-500">
            <span className="font-medium text-slate-400">Trending:</span>
            {['TikTok Hook', 'Instagram Bio', 'YouTube Title', 'Ad Copy', 'Resume'].map((keyword) => (
              <button
                key={keyword}
                onClick={() => {
                  setSearchQuery(keyword);
                  setIsSearchOpen(true);
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
              >
                {keyword}
              </button>
            ))}
          </div>
        </div>

        {/* Value Highlights */}
        <div className="mt-12 pt-8 border-t border-slate-100 grid grid-cols-3 gap-4 max-w-xl mx-auto text-xs text-slate-500">
          <div className="flex items-center justify-center gap-1.5">
            <Zap className="w-4 h-4 text-emerald-600" />
            <span className="font-medium text-slate-700">Instant Speed</span>
          </div>
          <div className="flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="font-medium text-slate-700">No Login Needed</span>
          </div>
          <div className="flex items-center justify-center gap-1.5">
            <Smartphone className="w-4 h-4 text-emerald-600" />
            <span className="font-medium text-slate-700">Mobile First</span>
          </div>
        </div>
      </div>
    </section>
  );
};
