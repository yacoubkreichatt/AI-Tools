import React from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, ShieldCheck, Heart, ArrowUpRight } from 'lucide-react';
import { CATEGORIES } from '../data/categories';
import { TOOLS } from '../data/tools';

export const Footer: React.FC = () => {
  const { navigate, t } = useApp();

  return (
    <footer id="site-footer" className="bg-slate-900 text-slate-400 pt-14 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10 pb-12 border-b border-slate-800">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/10 text-white flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-indigo-400" />
              </div>
              <span className="font-bold text-lg text-white tracking-tight">AI Tools Hub</span>
            </div>
            <p className="text-sm leading-relaxed text-slate-400 max-w-sm">
              Free, high-utility AI tools engineered for creators, marketers, entrepreneurs, and job seekers. No paywalls, no login friction, built for speed and mobile efficiency.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400 pt-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>AdSense Ready • Privacy First • Local Storage Only</span>
            </div>
          </div>

          {/* Quick Tools */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3.5">
              Popular Tools
            </h4>
            <ul className="space-y-2 text-xs">
              {TOOLS.slice(0, 5).map((tool) => (
                <li key={tool.slug}>
                  <button
                    onClick={() => navigate(`/tools/${tool.slug}`)}
                    className="hover:text-white transition-colors text-left"
                  >
                    {tool.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3.5">
              Categories
            </h4>
            <ul className="space-y-2 text-xs">
              {CATEGORIES.map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => navigate(`/categories/${cat.id}`)}
                    className="hover:text-white transition-colors text-left"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Company */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3.5">
              Policies & Legal
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => navigate('/about')} className="hover:text-white transition-colors">
                  {t('nav.about')}
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/contact')} className="hover:text-white transition-colors">
                  {t('nav.contact')}
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/privacy-policy')} className="hover:text-white transition-colors">
                  {t('footer.privacy')}
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/terms')} className="hover:text-white transition-colors">
                  {t('footer.terms')}
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/cookie-policy')} className="hover:text-white transition-colors">
                  {t('footer.cookies')}
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/disclaimer')} className="hover:text-white transition-colors">
                  {t('footer.disclaimer')}
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/affiliate-disclosure')} className="hover:text-white transition-colors">
                  {t('footer.affiliate')}
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} AI Tools Hub. {t('footer.rights')}</p>
          <p className="flex items-center gap-1.5">
            Crafted for speed, SEO performance, and production reliability.
          </p>
        </div>
      </div>
    </footer>
  );
};
