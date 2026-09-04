import React, { createContext, useContext, useState, useEffect } from 'react';
import { LanguageCode, translations, SUPPORTED_LANGUAGES } from '../i18n/translations';

interface AppContextType {
  currentPath: string;
  navigate: (path: string) => void;
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string) => string;
  favorites: string[];
  toggleFavorite: (slug: string) => void;
  isFavorite: (slug: string) => boolean;
  recentSlugs: string[];
  addRecent: (slug: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Routing based on window.location.pathname
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });

  // Language state
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    const saved = localStorage.getItem('aitoolshub_lang');
    return (saved as LanguageCode) || 'en';
  });

  // Favorites state
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('aitoolshub_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Recent tools state
  const [recentSlugs, setRecentSlugs] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('aitoolshub_recents');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Search query
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  // Sync with browser history back/forward
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    if (path !== currentPath) {
      window.history.pushState({}, '', path);
      setCurrentPath(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    localStorage.setItem('aitoolshub_lang', lang);
    const langInfo = SUPPORTED_LANGUAGES.find((l) => l.code === lang);
    if (langInfo) {
      document.documentElement.lang = lang;
      document.documentElement.dir = langInfo.dir;
    }
  };

  useEffect(() => {
    const langInfo = SUPPORTED_LANGUAGES.find((l) => l.code === language);
    if (langInfo) {
      document.documentElement.lang = language;
      document.documentElement.dir = langInfo.dir;
    }
  }, [language]);

  const t = (key: string): string => {
    return translations[language]?.[key] || translations.en[key] || key;
  };

  const toggleFavorite = (slug: string) => {
    setFavorites((prev) => {
      const next = prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug];
      try {
        localStorage.setItem('aitoolshub_favorites', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const isFavorite = (slug: string) => favorites.includes(slug);

  const addRecent = (slug: string) => {
    setRecentSlugs((prev) => {
      const filtered = prev.filter((s) => s !== slug);
      const updated = [slug, ...filtered].slice(0, 8);
      try {
        localStorage.setItem('aitoolshub_recents', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  return (
    <AppContext.Provider
      value={{
        currentPath,
        navigate,
        language,
        setLanguage,
        t,
        favorites,
        toggleFavorite,
        isFavorite,
        recentSlugs,
        addRecent,
        searchQuery,
        setSearchQuery,
        isSearchOpen,
        setIsSearchOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export function useApp(): AppContextType {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
