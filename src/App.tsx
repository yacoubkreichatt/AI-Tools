import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import { PopularTools } from './components/PopularTools';
import { CategoriesSection } from './components/CategoriesSection';
import { ToolsGrid } from './components/ToolsGrid';
import {
  WhySection,
  HowItWorksSection,
  FaqSection,
  CtaBanner,
  FavoritesRecentsSection,
} from './components/HomeSections';
import { ToolWorkspace } from './components/ToolWorkspace';
import { SearchModal } from './components/SearchModal';
import { SeoHead } from './components/SeoHead';
import {
  AboutPage,
  ContactPage,
  PrivacyPolicyPage,
  TermsPage,
  CookiePolicyPage,
  DisclaimerPage,
  AffiliateDisclosurePage,
} from './components/StaticPages';
import { TOOLS } from './data/tools';
import { CATEGORIES } from './data/categories';
import { CategoryId } from './types/tools';
import { Sparkles, ArrowLeft, ArrowRight } from 'lucide-react';

const AppContent: React.FC = () => {
  const { currentPath, navigate } = useApp();

  // 1. Tool Page: /tools/:slug
  if (currentPath.startsWith('/tools/')) {
    const slug = currentPath.replace('/tools/', '').split('/')[0];
    const tool = TOOLS.find((t) => t.slug === slug);

    if (tool) {
      return <ToolWorkspace tool={tool} />;
    }

    // Tool not found (404)
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <SeoHead title="Tool Not Found - AI Tools Hub" description="The requested tool does not exist." />
        <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4 text-slate-400">
          <Sparkles className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Tool Not Found</h1>
        <p className="text-xs text-slate-500 mb-6">
          The tool you are looking for might have been moved or renamed.
        </p>
        <button
          onClick={() => navigate('/tools')}
          className="px-5 py-2.5 bg-slate-900 text-white font-semibold text-xs rounded-xl"
        >
          Browse All Available Tools
        </button>
      </div>
    );
  }

  // 2. All Tools Listing: /tools
  if (currentPath === '/tools') {
    return (
      <div className="py-8 bg-slate-50 min-h-screen">
        <SeoHead
          title="All Free AI Tools Directory - AI Tools Hub"
          description="Browse our complete catalog of 10 free AI tools for content creators, marketers, founders, and job seekers."
          canonicalPath="/tools"
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
          <div className="pt-6 pb-2">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              All Free AI Tools
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Select any generator to begin immediately. No login or credit card required.
            </p>
          </div>
        </div>
        <ToolsGrid hideTitle initialCategory="all" />
      </div>
    );
  }

  // 3. Category Page: /categories/:id
  if (currentPath.startsWith('/categories/')) {
    const catId = currentPath.replace('/categories/', '').split('/')[0] as CategoryId;
    const category = CATEGORIES.find((c) => c.id === catId);

    if (category) {
      return (
        <div className="py-8 bg-slate-50 min-h-screen">
          <SeoHead
            title={`${category.name} AI Tools - AI Tools Hub`}
            description={category.description}
            canonicalPath={`/categories/${category.id}`}
          />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
            <button
              onClick={() => navigate('/categories')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 mb-4 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to all categories</span>
            </button>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {category.name} AI Tools
            </h1>
            <p className="text-sm text-slate-500 mt-1 max-w-2xl">{category.description}</p>
          </div>
          <ToolsGrid hideTitle initialCategory={category.id} />
        </div>
      );
    }
  }

  // 4. Categories Overview: /categories
  if (currentPath === '/categories') {
    return (
      <div className="py-8 bg-white min-h-screen">
        <SeoHead
          title="Categories - Browse Free AI Generators - AI Tools Hub"
          description="Explore AI tools organized by specialty: Social Media, Content Creation, Business, AI Images, and Career."
          canonicalPath="/categories"
        />
        <CategoriesSection />
      </div>
    );
  }

  // 5. Popular Tools Page: /popular
  if (currentPath === '/popular') {
    return (
      <div className="py-8 bg-slate-50 min-h-screen">
        <SeoHead
          title="Popular AI Tools - Trending Generators - AI Tools Hub"
          description="Check out the most frequently used free AI tools by digital creators, marketers, and entrepreneurs."
          canonicalPath="/popular"
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Popular AI Tools
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            The top 5 most popular tools used across our platform this week.
          </p>
        </div>
        <PopularTools />
      </div>
    );
  }

  // 6. Static Legal & Information Pages
  if (currentPath === '/about') return <AboutPage />;
  if (currentPath === '/contact') return <ContactPage />;
  if (currentPath === '/privacy-policy') return <PrivacyPolicyPage />;
  if (currentPath === '/terms') return <TermsPage />;
  if (currentPath === '/cookie-policy') return <CookiePolicyPage />;
  if (currentPath === '/disclaimer') return <DisclaimerPage />;
  if (currentPath === '/affiliate-disclosure') return <AffiliateDisclosurePage />;

  // 7. Homepage (Strict: '/')
  if (currentPath === '/' || currentPath === '') {
    return (
      <div id="home-view">
        <SeoHead
          title="AI Tools Hub - Free Online AI Generators for Creators & Businesses"
          description="Free AI tools for TikTok hooks, Instagram bios, YouTube titles, ad copy, image prompts, and resumes. No signup required."
          canonicalPath="/"
        />
        <Hero />
        <FavoritesRecentsSection />
        <PopularTools />
        <CategoriesSection />
        <ToolsGrid />
        <WhySection />
        <HowItWorksSection />
        <FaqSection />
        <CtaBanner />
      </div>
    );
  }

  // 8. General 404 Page (Catch-all for invalid paths)
  return (
    <div id="not-found-page" className="max-w-2xl mx-auto px-4 py-20 text-center">
      <SeoHead
        title="404 - Page Not Found - AI Tools Hub"
        description="The page you requested could not be found. Explore our free AI tools directory."
      />
      <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-5 text-indigo-600">
        <Sparkles className="w-8 h-8" />
      </div>
      <div className="inline-block px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-mono font-bold mb-3">
        ERROR 404
      </div>
      <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
        Page Not Found
      </h1>
      <p className="text-sm text-slate-600 mb-8 max-w-md mx-auto leading-relaxed">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <div className="flex items-center justify-center gap-3 flex-wrap">
        <button
          onClick={() => navigate('/tools')}
          className="px-6 py-3 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 transition-colors shadow-xs"
        >
          Explore All Free Tools
        </button>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-white border border-slate-200 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-50 transition-colors"
        >
          Back to Homepage
        </button>
      </div>
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <div className="min-h-screen flex flex-col bg-white text-slate-900 antialiased selection:bg-indigo-500 selection:text-white">
        <Header />
        <main className="flex-1">
          <AppContent />
        </main>
        <Footer />
        <SearchModal />
      </div>
    </AppProvider>
  );
}

export default App;
