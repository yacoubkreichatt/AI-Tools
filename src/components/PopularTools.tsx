import React from 'react';
import { useApp } from '../context/AppContext';
import { TOOLS } from '../data/tools';
import { ToolIcon } from './ToolIcon';
import { ArrowRight, Star, Zap } from 'lucide-react';

export const PopularTools: React.FC = () => {
  const { navigate, t, isFavorite, toggleFavorite } = useApp();

  const popularTools = TOOLS.filter((tool) => tool.isPopular).slice(0, 5);

  return (
    <section id="popular-tools-section" className="py-12 sm:py-16 bg-slate-50 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-100/80 text-amber-800 text-[11px] font-bold uppercase tracking-wider mb-2">
              <Zap className="w-3.5 h-3.5" />
              <span>Trending</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              {t('section.popular.title')}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {t('section.popular.subtitle')}
            </p>
          </div>
          <button
            onClick={() => navigate('/popular')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-900 hover:text-indigo-600 transition-colors self-start sm:self-auto"
          >
            <span>View All Popular</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {popularTools.map((tool) => {
            const favorited = isFavorite(tool.slug);
            return (
              <div
                key={tool.slug}
                id={`popular-card-${tool.slug}`}
                onClick={() => navigate(`/tools/${tool.slug}`)}
                className="group relative bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3.5">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-colors">
                      <ToolIcon name={tool.icon} className="w-5 h-5" />
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(tool.slug);
                      }}
                      className={`p-1.5 rounded-lg transition-colors ${
                        favorited
                          ? 'text-amber-500 hover:bg-amber-50'
                          : 'text-slate-300 hover:text-amber-400 hover:bg-slate-50'
                      }`}
                      title={favorited ? 'Remove Favorite' : 'Save Favorite'}
                      aria-label="Toggle Favorite"
                    >
                      <Star className={`w-4 h-4 ${favorited ? 'fill-amber-400' : ''}`} />
                    </button>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors mb-1.5 leading-snug">
                    {tool.name}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {tool.tagline}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-700 group-hover:text-indigo-600 transition-colors">
                  <span>Use Tool</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
