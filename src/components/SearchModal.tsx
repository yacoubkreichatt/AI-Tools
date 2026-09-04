import React, { useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { TOOLS } from '../data/tools';
import { Search, X, ArrowRight, Sparkles } from 'lucide-react';
import { ToolIcon } from './ToolIcon';

export const SearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, searchQuery, setSearchQuery, navigate } = useApp();
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut Cmd+K or Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsSearchOpen]);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  const query = searchQuery.toLowerCase().trim();

  // Search matching across name, description, category, slug, inputs
  const filteredTools = query
    ? TOOLS.filter(
        (t) =>
          t.name.toLowerCase().includes(query) ||
          t.description.toLowerCase().includes(query) ||
          t.category.toLowerCase().includes(query) ||
          t.slug.toLowerCase().includes(query) ||
          (query.includes('tiktok') && (t.slug.includes('tiktok') || t.slug.includes('reel') || t.slug.includes('hashtag')))
      )
    : TOOLS.slice(0, 6); // Show top 6 by default

  const handleSelectTool = (slug: string) => {
    navigate(`/tools/${slug}`);
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  return (
    <div
      id="search-modal-backdrop"
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/60 backdrop-blur-xs"
      onClick={() => setIsSearchOpen(false)}
    >
      <div
        id="search-modal-container"
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            id="search-modal-input"
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Type to search tools... (e.g., TikTok, Bio, Title, Resume)"
            className="w-full text-sm sm:text-base text-slate-900 placeholder-slate-400 focus:outline-hidden"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-xs text-slate-400 bg-slate-100 border border-slate-200 rounded-md">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-3 space-y-1">
          {filteredTools.length > 0 ? (
            filteredTools.map((tool) => (
              <button
                key={tool.slug}
                onClick={() => handleSelectTool(tool.slug)}
                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 text-left transition-colors group border border-transparent hover:border-slate-200/80"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                    <ToolIcon name={tool.icon} className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {tool.name}
                      </span>
                      {tool.isPopular && (
                        <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-sm bg-amber-100 text-amber-800">
                          Popular
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 truncate">{tool.tagline}</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-slate-900 shrink-0 ml-2 group-hover:translate-x-0.5 transition-all" />
              </button>
            ))
          ) : (
            <div className="py-12 text-center text-slate-400">
              <Sparkles className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <p className="text-sm font-medium text-slate-600">No tools found matching &quot;{searchQuery}&quot;</p>
              <p className="text-xs text-slate-400 mt-1">Try searching for keywords like &quot;video&quot;, &quot;copy&quot;, or &quot;resume&quot;</p>
            </div>
          )}
        </div>

        {/* Footer Hint */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span>{filteredTools.length} tool(s) found</span>
          <span>Press Enter to select</span>
        </div>
      </div>
    </div>
  );
};
