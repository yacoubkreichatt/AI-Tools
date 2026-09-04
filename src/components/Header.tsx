import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SUPPORTED_LANGUAGES, LanguageCode } from '../i18n/translations';
import {
  Sparkles,
  Search,
  Menu,
  X,
  Globe,
  Star,
  ChevronDown,
} from 'lucide-react';

export const Header: React.FC = () => {
  const { currentPath, navigate, language, setLanguage, t, setIsSearchOpen, favorites } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  const navLinks = [
    { label: t('nav.home'), path: '/' },
    { label: t('nav.tools'), path: '/tools' },
    { label: t('nav.categories'), path: '/categories' },
    { label: t('nav.popular'), path: '/popular' },
    { label: t('nav.about'), path: '/about' },
    { label: t('nav.contact'), path: '/contact' },
  ];

  const handleNav = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const currentLang = SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  return (
    <header id="site-header" className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <button
          id="nav-logo"
          onClick={() => handleNav('/')}
          className="flex items-center gap-2.5 text-left group focus:outline-hidden"
        >
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs group-hover:bg-slate-800 transition-colors">
            <Sparkles className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <span className="font-bold text-lg tracking-tight text-slate-900 block leading-tight">
              AI Tools Hub
            </span>
            <span className="text-[10px] text-slate-500 font-medium tracking-wide uppercase block">
              Free Online Generators
            </span>
          </div>
        </button>

        {/* Desktop Navigation */}
        <nav id="desktop-nav" className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navLinks.map((link) => {
            const isActive = currentPath === link.path;
            return (
              <button
                key={link.path}
                onClick={() => handleNav(link.path)}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'text-slate-950 bg-slate-100 font-semibold'
                    : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Right Action Icons & CTA */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Search Button */}
          <button
            id="nav-search-btn"
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors text-xs font-medium border border-slate-200 sm:border-slate-200/60"
            title="Search tools"
          >
            <Search className="w-4 h-4" />
            <span className="hidden sm:inline">Search tools...</span>
            <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 bg-slate-100 border border-slate-200 rounded-md">
              ⌘K
            </kbd>
          </button>

          {/* Language Selector Dropdown */}
          <div className="relative">
            <button
              id="language-switcher-btn"
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors text-xs font-medium border border-transparent hover:border-slate-200"
              aria-label="Change Language"
            >
              <Globe className="w-4 h-4 text-slate-500" />
              <span className="hidden sm:inline">{currentLang.nativeName}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {langMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setLangMenuOpen(false)} />
                <div
                  id="language-dropdown-menu"
                  className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 text-xs"
                >
                  <div className="px-3 py-1.5 font-semibold text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-100">
                    Select Language
                  </div>
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code as LanguageCode);
                        setLangMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-50 transition-colors ${
                        language === lang.code ? 'text-indigo-600 font-semibold bg-indigo-50/50' : 'text-slate-700'
                      }`}
                    >
                      <span>{lang.nativeName}</span>
                      <span className="text-[10px] uppercase text-slate-400">{lang.name}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Explore Tools CTA */}
          <button
            id="nav-explore-btn"
            onClick={() => handleNav('/tools')}
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-all active:scale-98"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            {t('nav.explore')}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            id="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div id="mobile-drawer" className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const isActive = currentPath === link.path;
              return (
                <button
                  key={link.path}
                  onClick={() => handleNav(link.path)}
                  className={`text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-slate-100 text-slate-950 font-semibold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={() => handleNav('/tools')}
              className="w-full flex items-center justify-center gap-2 py-3 bg-slate-900 text-white font-semibold text-sm rounded-xl"
            >
              <Sparkles className="w-4 h-4 text-indigo-400" />
              {t('nav.explore')}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
