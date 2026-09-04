import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SeoHead } from './SeoHead';
import { ShieldCheck, Mail, CheckCircle2, FileText, Lock, Globe, Sparkles } from 'lucide-react';

// 1. About Page
export const AboutPage: React.FC = () => {
  const { navigate } = useApp();

  return (
    <div id="about-page" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <SeoHead
        title="About AI Tools Hub - Free Productivity & AI Generators"
        description="Learn more about our mission to provide high-utility, free AI tools without paywalls, login friction, or subscription fees."
        canonicalPath="/about"
      />
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 sm:p-10 space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          Our Mission
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Empowering Creators With Useful, Free AI Tools
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          <strong>AI Tools Hub</strong> was founded with a singular purpose: to remove friction from daily content creation, marketing, and business workflows. While most AI services lock basic generators behind expensive monthly subscriptions, credit walls, and complicated signup flows, we believe high-utility tools should be universally accessible directly in your web browser.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
            <h3 className="font-bold text-slate-900 text-sm mb-1">Useful First</h3>
            <p className="text-xs text-slate-500">Every generator is modeled after verified copywriting and marketing frameworks.</p>
          </div>
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
            <h3 className="font-bold text-slate-900 text-sm mb-1">Mobile First</h3>
            <p className="text-xs text-slate-500">Fast, thumb-friendly interfaces that load in milliseconds on cellular networks.</p>
          </div>
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
            <h3 className="font-bold text-slate-900 text-sm mb-1">Privacy Conscious</h3>
            <p className="text-xs text-slate-500">Your inputs stay private. Your favorites and history are stored locally in your browser.</p>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={() => navigate('/tools')}
            className="px-5 py-2.5 bg-slate-900 text-white font-semibold text-xs rounded-xl hover:bg-slate-800 transition-colors"
          >
            Explore All Free Tools
          </button>
          <button
            onClick={() => navigate('/contact')}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900"
          >
            Contact Team →
          </button>
        </div>
      </div>
    </div>
  );
};

// 2. Contact Page
export const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div id="contact-page" className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <SeoHead
        title="Contact Us - AI Tools Hub"
        description="Have a tool request, feedback, or partnership inquiry? Reach out to the AI Tools Hub team."
        canonicalPath="/contact"
      />
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 sm:p-10 space-y-6">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Contact Us</h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          Have a suggestion for a new AI tool, feedback on generation quality, or a general question? We would love to hear from you. Fill out the form below.
        </p>

        {submitted ? (
          <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
            <h3 className="text-base font-bold text-emerald-900">Message Received!</h3>
            <p className="text-xs text-emerald-700">Thank you for contacting us. We will get back to you shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Your Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Morgan"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@yourdomain.com"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Message or Tool Request</label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us what tool you would like to see or your feedback..."
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-slate-900"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 transition-colors"
            >
              Send Message
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

// 3. Privacy Policy
export const PrivacyPolicyPage: React.FC = () => (
  <div id="privacy-policy-page" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
    <SeoHead
      title="Privacy Policy - AI Tools Hub"
      description="Read the privacy policy of AI Tools Hub. Transparent, safe, and compliant with privacy standards."
      canonicalPath="/privacy-policy"
    />
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 sm:p-10 space-y-6 text-slate-700 text-xs sm:text-sm leading-relaxed">
      <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Privacy Policy</h1>
      <p className="text-xs text-slate-400">Last updated: {new Date().toLocaleDateString()}</p>

      <h2 className="text-lg font-bold text-slate-900 pt-2">1. Overview</h2>
      <p>
        AI Tools Hub (&quot;we&quot;, &quot;our&quot;, or &quot;the website&quot;) respects your personal privacy. This Privacy Policy outlines what information we collect, how it is used, and your rights regarding data when you utilize our suite of free tools.
      </p>

      <h2 className="text-lg font-bold text-slate-900 pt-2">2. Information Collection and Storage</h2>
      <p>
        Our tools are deliberately designed to function with zero mandatory user registration. We do not require you to provide personal credentials, emails, or phone numbers to use any of our 10 generators.
      </p>
      <p>
        <strong>Local Storage:</strong> Features such as your tool Favorites and Recently Used history are saved strictly within your browser&apos;s local memory (HTML5 LocalStorage). This data never leaves your device and is not synchronized to external servers.
      </p>

      <h2 className="text-lg font-bold text-slate-900 pt-2">3. Advertising and Cookies</h2>
      <p>
        We may display advertisements provided by third-party ad networks, including Google AdSense. Third-party vendors use cookies to serve ads based on prior visits to our website or other websites on the internet. You may opt out of personalized advertising by visiting Google&apos;s Ads Settings or <a href="https://aboutads.info" target="_blank" rel="noopener noreferrer" className="text-indigo-600 underline">aboutads.info</a>.
      </p>

      <h2 className="text-lg font-bold text-slate-900 pt-2">4. AI Generation Processing</h2>
      <p>
        When you submit prompts or inputs into tools configured to use AI models, those inputs are processed in real-time to generate your response. Inputs are not stored permanently in persistent profile databases.
      </p>

      <h2 className="text-lg font-bold text-slate-900 pt-2">5. Contact Information</h2>
      <p>
        If you have questions regarding this Privacy Policy, you may contact us through our Contact Page.
      </p>
    </div>
  </div>
);

// 4. Terms of Service
export const TermsPage: React.FC = () => (
  <div id="terms-page" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
    <SeoHead
      title="Terms of Service - AI Tools Hub"
      description="Terms and conditions for using AI Tools Hub free tools and generators."
      canonicalPath="/terms"
    />
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 sm:p-10 space-y-6 text-slate-700 text-xs sm:text-sm leading-relaxed">
      <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Terms of Service</h1>
      <p className="text-xs text-slate-400">Last updated: {new Date().toLocaleDateString()}</p>

      <h2 className="text-lg font-bold text-slate-900 pt-2">1. Acceptance of Terms</h2>
      <p>
        By accessing and using AI Tools Hub, you agree to comply with and be bound by these Terms of Service. If you do not agree, please do not use our services.
      </p>

      <h2 className="text-lg font-bold text-slate-900 pt-2">2. Permitted Use & Ownership</h2>
      <p>
        All generated content produced by our tools (including titles, hooks, bios, slogans, and resume text) is granted to you for both personal and commercial use. You are solely responsible for ensuring your final published content conforms to legal standards and does not infringe upon third-party copyrights or trademarks.
      </p>

      <h2 className="text-lg font-bold text-slate-900 pt-2">3. Disclaimer of Warranties</h2>
      <p>
        The tools and generators are provided &quot;as is&quot; without warranties of any kind. AI Tools Hub does not guarantee specific commercial or financial results from the use of generated content.
      </p>
    </div>
  </div>
);

// 5. Cookie Policy
export const CookiePolicyPage: React.FC = () => (
  <div id="cookie-policy-page" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
    <SeoHead
      title="Cookie Policy - AI Tools Hub"
      description="How AI Tools Hub utilizes cookies and local storage."
      canonicalPath="/cookie-policy"
    />
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 sm:p-10 space-y-6 text-slate-700 text-xs sm:text-sm leading-relaxed">
      <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Cookie Policy</h1>
      <p className="text-xs text-slate-400">Last updated: {new Date().toLocaleDateString()}</p>
      <p>
        This Cookie Policy explains how AI Tools Hub uses cookies and similar technologies to enhance user experience, remember language preferences, and deliver relevant advertisements through services such as Google AdSense.
      </p>
      <h2 className="text-lg font-bold text-slate-900 pt-2">Types of Cookies Used</h2>
      <ul className="list-disc pl-5 space-y-2">
        <li><strong>Essential & Functional:</strong> Local storage items to save your preferred language and tool favorites.</li>
        <li><strong>Analytics:</strong> Aggregated, anonymous traffic telemetry to identify which tools are most helpful.</li>
        <li><strong>Advertising:</strong> Third-party advertising cookies used by Google AdSense to serve contextual ads.</li>
      </ul>
    </div>
  </div>
);

// 6. AI Disclaimer
export const DisclaimerPage: React.FC = () => (
  <div id="disclaimer-page" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
    <SeoHead
      title="AI Disclaimer - AI Tools Hub"
      description="Important disclaimer regarding the use of AI generated content."
      canonicalPath="/disclaimer"
    />
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 sm:p-10 space-y-6 text-slate-700 text-xs sm:text-sm leading-relaxed">
      <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">AI & Content Disclaimer</h1>
      <p className="text-xs text-slate-400">Last updated: {new Date().toLocaleDateString()}</p>
      <p>
        AI Tools Hub provides generative tools designed to assist in creative writing, marketing brainstorming, and document drafting. Generative algorithms and artificial intelligence models may occasionally produce unexpected, inaccurate, or outdated outputs.
      </p>
      <p>
        <strong>Human Verification Required:</strong> Users are advised to review and fact-check all generated resumes, cover letters, ad headlines, and company names prior to formal legal filing, commercial publishing, or job applications.
      </p>
    </div>
  </div>
);

// 7. Affiliate Disclosure
export const AffiliateDisclosurePage: React.FC = () => (
  <div id="affiliate-disclosure-page" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
    <SeoHead
      title="Affiliate Disclosure - AI Tools Hub"
      description="Transparency and FTC compliance disclosure regarding affiliate partnerships."
      canonicalPath="/affiliate-disclosure"
    />
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 sm:p-10 space-y-6 text-slate-700 text-xs sm:text-sm leading-relaxed">
      <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Affiliate Disclosure</h1>
      <p className="text-xs text-slate-400">Last updated: {new Date().toLocaleDateString()}</p>
      <p>
        In compliance with FTC guidelines, please note that AI Tools Hub may occasionally include referral or affiliate links to reputable hosting providers (such as Hostinger), domain registrars, or AI software platforms.
      </p>
      <p>
        If you choose to click an affiliate link and make a purchase, we may receive a small commission at zero additional cost to you. This support helps keep our core suite of 10 AI tools 100% free for everyone.
      </p>
    </div>
  </div>
);
