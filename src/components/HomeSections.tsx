import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TOOLS } from '../data/tools';
import { ToolIcon } from './ToolIcon';
import {
  Zap,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Lock,
  CheckCircle2,
  ChevronDown,
  ArrowRight,
  Star,
  Clock,
} from 'lucide-react';

// 1. Why AI Tools Hub?
export const WhySection: React.FC = () => {
  const { t } = useApp();

  const benefits = [
    {
      icon: Zap,
      title: 'Blazing Fast Speed',
      description: 'Zero loading delays. Instant rule & template algorithms coupled with optimized Gemini models for sub-second generation.',
    },
    {
      icon: ShieldCheck,
      title: '100% Free Forever',
      description: 'No hidden subscription traps, no credit card prompts, and no monthly credit quotas. All 10 tools are unrestricted.',
    },
    {
      icon: Lock,
      title: 'No Account Required',
      description: 'Skip the signup friction. You do not need to register, verify an email, or connect a personal social account.',
    },
    {
      icon: Smartphone,
      title: 'Mobile First Precision',
      description: 'Engineered specifically for creators on smartphones. Tested across 320px to 430px iPhone and Android screens.',
    },
    {
      icon: Sparkles,
      title: 'Practical, Real Utility',
      description: 'No gimmicks. Every generator is built around proven copywriting formulas and algorithms used by top marketing professionals.',
    },
    {
      icon: CheckCircle2,
      title: 'Commercial Rights',
      description: 'You own everything you generate. Use hooks, titles, bios, and copy commercially for clients or your own business.',
    },
  ];

  return (
    <section id="why-section" className="py-14 sm:py-20 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            {t('section.why.title')}
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            {t('section.why.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((b, i) => {
            const Icon = b.icon;
            return (
              <div
                key={i}
                className="p-6 rounded-2xl border border-slate-200/90 bg-slate-50/40 hover:bg-slate-50 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center mb-4 shadow-2xs">
                  <Icon className="w-5 h-5 text-indigo-400" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">{b.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{b.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// 2. How It Works
export const HowItWorksSection: React.FC = () => {
  const { t } = useApp();

  const steps = [
    {
      step: '01',
      title: 'Choose a tool',
      description: 'Select from our catalog of free AI tools for TikTok, Instagram, YouTube, Ads, Business, or Careers.',
    },
    {
      step: '02',
      title: 'Enter your details',
      description: 'Fill in your topic, target audience, preferred tone, and key specifications in our clean responsive form.',
    },
    {
      step: '03',
      title: 'Generate your result',
      description: 'Get tailored, high-converting content instantly. Copy all, export to TXT, print, or share with one click.',
    },
  ];

  return (
    <section id="how-it-works-section" className="py-14 sm:py-20 bg-slate-50 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            {t('section.how.title')}
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            {t('section.how.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((s, i) => (
            <div key={i} className="relative bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs">
              <span className="text-3xl font-black text-slate-200 tracking-tighter block mb-2">
                {s.step}
              </span>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{s.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// 3. FAQ Section
export const FaqSection: React.FC = () => {
  const { t } = useApp();
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Are all tools on AI Tools Hub completely free?',
      a: 'Yes, 100%. All tools are free to use without requiring subscriptions, credits, or trial periods. We plan to sustain our platform through contextual advertising and clean affiliate partnerships in the future.',
    },
    {
      q: 'Do I need to create an account or sign in?',
      a: 'No. You do not need to register, provide an email address, or create any login credentials. All tools work directly inside your browser immediately.',
    },
    {
      q: 'Can I use the generated content commercially?',
      a: 'Yes. Any content, hooks, ad copies, bio options, business names, or resumes generated by the tools are yours to use freely in commercial projects, social media accounts, and client deliverables.',
    },
    {
      q: 'Are my inputs or private data stored on your servers?',
      a: 'No personal identification is collected or stored on our servers. Your preferences, favorites, and recent tool history are saved strictly inside your own device’s browser LocalStorage and never transmitted.',
    },
    {
      q: 'How does the hybrid generation engine work?',
      a: 'Our tools use a dual-layer architecture: a fast local generative rules engine capable of running completely client-side in zero milliseconds, combined with server-side AI model integration (Gemini 3.8 Flash) for deeper text synthesis.',
    },
    {
      q: 'How do I save my favorite tools for fast access?',
      a: 'Click the star icon on any tool card. It will automatically save that tool to your Favorites section using your browser’s local storage so it is waiting for you whenever you return.',
    },
  ];

  return (
    <section id="faq-section" className="py-14 sm:py-20 bg-white border-b border-slate-200/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            {t('section.faq.title')}
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            {t('section.faq.subtitle')}
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIdx === index;
            return (
              <div
                key={index}
                className="border border-slate-200 rounded-2xl overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : index)}
                  className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                >
                  <span className="text-sm sm:text-base font-semibold text-slate-900">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-500 shrink-0 transition-transform ${
                      isOpen ? 'rotate-180 text-indigo-600' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 py-4 text-xs sm:text-sm text-slate-600 leading-relaxed bg-white border-t border-slate-100">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// 4. CTA Banner Section
export const CtaBanner: React.FC = () => {
  const { navigate } = useApp();

  return (
    <section id="cta-banner" className="py-14 sm:py-16 bg-slate-900 text-white relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-xs font-semibold text-white mb-4">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Start Creating In Under 10 Seconds</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
          Ready to supercharge your content and workflow?
        </h2>
        <p className="mt-3 text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
          Access all 10 free AI tools right now. No signup, no credit cards, zero friction.
        </p>
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => navigate('/tools')}
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-white text-slate-900 hover:bg-slate-100 font-bold text-sm rounded-xl shadow-md transition-all active:scale-98"
          >
            <span>Explore All 10 Free Tools</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};

// 5. Favorites and Recently Used Section (Conditional display)
export const FavoritesRecentsSection: React.FC = () => {
  const { favorites, recentSlugs, navigate, isFavorite, toggleFavorite } = useApp();

  if (favorites.length === 0 && recentSlugs.length === 0) return null;

  const favoriteTools = TOOLS.filter((t) => favorites.includes(t.slug));
  const recentTools = TOOLS.filter((t) => recentSlugs.includes(t.slug));

  return (
    <section id="user-history-section" className="py-8 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Favorites */}
        {favoriteTools.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
              <h3 className="text-sm font-bold text-slate-900">Your Saved Favorites</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {favoriteTools.map((tool) => (
                <div
                  key={tool.slug}
                  onClick={() => navigate(`/tools/${tool.slug}`)}
                  className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-100 cursor-pointer transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center gap-2 truncate">
                    <ToolIcon name={tool.icon} className="w-3.5 h-3.5 text-slate-700 shrink-0" />
                    <span className="text-xs font-semibold text-slate-900 truncate">{tool.name}</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(tool.slug);
                    }}
                    className="p-1 text-amber-500 hover:text-amber-600"
                    title="Remove from favorites"
                  >
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recently Used */}
        {recentTools.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-slate-500" />
              <h3 className="text-sm font-bold text-slate-900">Recently Used Tools</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {recentTools.map((tool) => (
                <div
                  key={tool.slug}
                  onClick={() => navigate(`/tools/${tool.slug}`)}
                  className="p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors flex items-center gap-2 truncate"
                >
                  <ToolIcon name={tool.icon} className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  <span className="text-xs font-medium text-slate-800 truncate">{tool.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
