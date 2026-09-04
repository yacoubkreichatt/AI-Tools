import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TOOLS } from '../data/tools';
import { CATEGORIES } from '../data/categories';
import { ToolIcon } from './ToolIcon';
import { ArrowRight, Star, Sparkles, Filter, Search } from 'lucide-react';
import { CategoryId } from '../types/tools';

interface ToolsGridProps {
  initialCategory?: CategoryId | 'all';
  hideTitle?: boolean;
}

export const ToolsGrid: React.FC<ToolsGridProps> = ({
  initialCategory = 'all',
  hideTitle = false,
}) => {
  const { navigate, t, isFavorite, toggleFavorite } = useApp();
  const [selectedCat, setSelectedCat] = useState<CategoryId | 'all'>(initialCategory);
  const [filterQuery, setFilterQuery] = useState('');

  const filteredTools = TOOLS.filter((tool) => {
    const matchesCategory = selectedCat === 'all' || tool.category === selectedCat;
    const matchesSearch =
      !filterQuery.trim() ||
      tool.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
      tool.tagline.toLowerCase().includes(filterQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(filterQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="all-tools-grid-section" className="py-12 sm:py-16 bg-slate-50 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {!hideTitle && (
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              {t('section.alltools.title')}
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              {t('section.alltools.subtitle')}
            </p>
          </div>
        )}

        {/* Filter Controls: Category tabs and search */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            <button
              onClick={() => setSelectedCat('all')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-colors ${
                selectedCat === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              All Tools ({TOOLS.length})
            </button>
            {CATEGORIES.map((cat) => {
              const count = TOOLS.filter((t) => t.category === cat.id).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCat(cat.id)}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-colors ${
                    selectedCat === cat.id
                      ? 'bg-slate-900 text-white'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {cat.name} ({count})
                </button>
              );
            })}
          </div>

          {/* Inline Filter Search */}
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Filter these tools..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-white border border-slate-200 focus:outline-hidden focus:border-slate-800 text-slate-800 placeholder-slate-400"
            />
          </div>
        </div>

        {/* Tools Cards Grid */}
        {filteredTools.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredTools.map((tool) => {
              const favorited = isFavorite(tool.slug);
              return (
                <div
                  key={tool.slug}
                  id={`tool-card-${tool.slug}`}
                  onClick={() => navigate(`/tools/${tool.slug}`)}
                  className="group relative bg-white rounded-2xl p-6 border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    {/* Header line inside card */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-11 h-11 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                        <ToolIcon name={tool.icon} className="w-5 h-5" />
                      </div>

                      <div className="flex items-center gap-2">
                        {tool.isPopular && (
                          <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-bold uppercase tracking-wider">
                            Popular
                          </span>
                        )}
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
                          aria-label="Toggle Favorite"
                        >
                          <Star className={`w-4 h-4 ${favorited ? 'fill-amber-400' : ''}`} />
                        </button>
                      </div>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors mb-2 leading-snug">
                      {tool.name}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-3 mb-4">
                      {tool.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-[11px] font-medium text-slate-400 capitalize">
                      {tool.inputs.length} inputs • Free
                    </span>
                    <span className="inline-flex items-center gap-1 font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      <span>Launch Tool</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-16 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
            <Sparkles className="w-8 h-8 mx-auto mb-2 text-slate-300" />
            <p className="text-sm font-semibold text-slate-700">No tools found matching your filter</p>
            <p className="text-xs text-slate-400 mt-1">Try resetting the category filter or searching for another term</p>
            <button
              onClick={() => {
                setSelectedCat('all');
                setFilterQuery('');
              }}
              className="mt-4 px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-xl"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
