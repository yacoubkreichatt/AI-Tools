import React from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/categories';
import { ToolIcon } from './ToolIcon';
import { ArrowRight } from 'lucide-react';

export const CategoriesSection: React.FC = () => {
  const { navigate, t } = useApp();

  return (
    <section id="categories-section" className="py-12 sm:py-16 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            {t('section.categories.title')}
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            {t('section.categories.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              id={`cat-card-${cat.id}`}
              onClick={() => navigate(`/categories/${cat.id}`)}
              className="group p-5 rounded-2xl border border-slate-200/90 hover:border-slate-300 hover:shadow-md transition-all cursor-pointer bg-slate-50/50 hover:bg-white flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-2xs group-hover:bg-indigo-600 transition-colors">
                    <ToolIcon name={cat.icon} className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {cat.name}
                    </h3>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {cat.subcategories.length} Specialized Areas
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {cat.description}
                </p>

                {/* Subcategories tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {cat.subcategories.map((sub) => (
                    <span
                      key={sub}
                      className="px-2 py-0.5 rounded-md bg-slate-100 text-[11px] font-medium text-slate-600"
                    >
                      {sub}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">
                <span>Explore {cat.name}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
