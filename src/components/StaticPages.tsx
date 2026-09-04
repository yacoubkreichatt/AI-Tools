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
      title="Privacy Policy — AI Tools Hub"
      description="Read the official Privacy Policy for AI Tools Hub (https://technologyhze.online). Complete details on data handling, AI processing, cookies, Google AdSense, and user rights."
      canonicalPath="/privacy-policy"
    />
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 sm:p-12 space-y-8 text-slate-700 text-sm leading-relaxed">
      <header className="border-b border-slate-100 pb-6">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full mb-3">
          Official Policy
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Privacy Policy</h1>
        <p className="text-xs text-slate-400 mt-2">
          Effective Date: January 1, 2026 • Last updated: September 4, 2026 • Website:{' '}
          <a href="https://technologyhze.online" className="text-indigo-600 hover:underline">
            https://technologyhze.online
          </a>
        </p>
      </header>

      {/* 1. Introduction */}
      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900">1. Introduction</h2>
        <p>
          Welcome to <strong>AI Tools Hub</strong> (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;, or the &quot;Website&quot;), accessible at{' '}
          <a href="https://technologyhze.online" className="text-indigo-600 hover:underline">
            https://technologyhze.online
          </a>. We provide free web-based utility tools, including AI text generators, YouTube thumbnail downloaders, and creative assistants for content creators, marketers, founders, and professionals.
        </p>
        <p>
          We are committed to operating with complete transparency regarding privacy and data protection. This Privacy Policy explains our practices concerning data collection, transmission, processing, retention, and the rights you retain under applicable international data protection standards, including the General Data Protection Regulation (GDPR) and the California Consumer Privacy Act (CCPA/CPRA).
        </p>
      </section>

      {/* 2. Information We Collect */}
      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900">2. Information We Collect</h2>
        <p>
          We deliberately design our tools with a <strong>privacy-first, registration-free architecture</strong>. You are never required to create an account, register an email address, or provide credit card information to use any of our web utilities.
        </p>
        
        <h3 className="text-base font-semibold text-slate-900 pt-1">A. Information Users Explicitly Provide</h3>
        <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
          <li>
            <strong>Tool Inputs & Prompts:</strong> Text queries, keywords, channel niches, topics, or public URLs (such as YouTube video links) entered directly into tool fields.
          </li>
          <li>
            <strong>Contact Form Messages:</strong> If you voluntarily reach out through our Contact page, we receive your name, email address, and message content to respond to your inquiry.
          </li>
        </ul>

        <h3 className="text-base font-semibold text-slate-900 pt-1">B. Automatically Collected Information</h3>
        <p>
          Like most standard web services, our web hosting infrastructure automatically logs basic technical communication metadata when your browser requests pages:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
          <li><strong>Internet Protocol (IP) Addresses:</strong> Used strictly for network transmission, DDoS mitigation, and regional routing. IP addresses are not merged with personal profiles.</li>
          <li><strong>Browser & Device Details:</strong> Browser family, version, operating system, preferred language, and screen resolution to render responsive layouts correctly.</li>
          <li><strong>Referrer Headers & Page Requests:</strong> The requesting URL and timestamp of page loads for performance telemetry.</li>
        </ul>

        <h3 className="text-base font-semibold text-slate-900 pt-1">C. Local Storage (On-Device Memory)</h3>
        <p>
          We utilize client-side <strong>HTML5 LocalStorage</strong> strictly on your device to persist user convenience settings without tracking:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
          <li><strong>Favorite Tools:</strong> Slugs of tools you have starred for quick access.</li>
          <li><strong>Recently Used Tools:</strong> A list of your last five accessed tools.</li>
          <li><strong>Interface Language Preference:</strong> Your selected display language (e.g. English or Arabic).</li>
        </ul>
        <p className="text-xs text-slate-500 italic">
          Note: LocalStorage data resides exclusively on your local device and is never transmitted to our database or synchronized to external third parties. You can clear this data at any time through your browser settings.
        </p>
      </section>

      {/* 3. Cookies & Tracking Technologies */}
      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900">3. Cookies and Web Storage</h2>
        <p>
          A cookie is a small text file placed on your device by a web server. We categorize cookies and storage on our Website into:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
          <li>
            <strong>Essential First-Party Storage:</strong> HTML5 LocalStorage keys for UI preferences. These do not require cookie consent under EU ePrivacy guidelines as they are strictly necessary to deliver user-requested preferences.
          </li>
          <li>
            <strong>Third-Party Advertising Cookies (Google AdSense):</strong> Third-party advertising partners place cookies to serve advertisements based on your prior visits to our Website or other sites across the internet.
          </li>
        </ul>
      </section>

      {/* 4. How We Use Your Information */}
      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900">4. How We Use Collected Information</h2>
        <p>We use the minimal data collected strictly for the following legitimate purposes:</p>
        <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
          <li>Executing real-time content generation and utility functions requested by you.</li>
          <li>Serving optimized high-resolution thumbnail images requested via public YouTube URLs.</li>
          <li>Maintaining server stability, troubleshooting technical errors, and defending against automated abuse.</li>
          <li>Responding to support tickets, user feedback, and inquiries submitted via our contact channels.</li>
        </ul>
      </section>

      {/* 5. AI Tool Processing & Security */}
      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900">5. AI Tool Processing & Ephemeral Handling</h2>
        <p>
          When you interact with our AI-powered features (such as TikTok Hook Generator, YouTube Title Generator, or AI Image Generator):
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
          <li>
            <strong>Ephemeral Real-Time Processing:</strong> Your inputs are transmitted securely to our server-side API proxy, which communicates directly with Google Gemini models.
          </li>
          <li>
            <strong>No Persistent Prompt Storage:</strong> We do not log, sell, or retain your generation prompts in permanent databases.
          </li>
          <li>
            <strong>Enterprise Model Terms:</strong> API interactions utilize paid/commercial developer interfaces where user queries are not used to train or refine public foundational AI models without authorization.
          </li>
          <li>
            <strong>Client-Side Local Fallback:</strong> Tools support high-speed local generation algorithms that execute completely inside your browser using mathematical templates without making external API requests.
          </li>
        </ul>
      </section>

      {/* 6. Third-Party Services & Google AdSense */}
      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900">6. Third-Party Services & Advertising Disclosure</h2>
        <p>We work with trusted industry providers for infrastructure and monetization:</p>
        
        <h3 className="text-base font-semibold text-slate-900 pt-1">A. Google Services</h3>
        <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
          <li><strong>Google Gemini API:</strong> Powers server-side AI natural language understanding and image generation workflows.</li>
          <li><strong>Google Fonts:</strong> Web typography loaded via Google CDN servers.</li>
        </ul>

        <h3 className="text-base font-semibold text-slate-900 pt-1">B. Google AdSense & Advertising Networks</h3>
        <p>
          We may display advertisements served by Google AdSense and its certified advertising partners to support the free operation of our tools. Google&apos;s use of advertising cookies enables it and its partners to serve ads based on your visit to our sites and/or other sites on the Internet:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
          <li>
            Users may opt out of personalized advertising by visiting{' '}
            <a href="https://adssettings.google.com/" target="_blank" rel="noopener noreferrer" className="text-indigo-600 underline">
              Google Ads Settings
            </a>.
          </li>
          <li>
            Alternatively, you can opt out of a third-party vendor&apos;s use of cookies for personalized advertising by visiting{' '}
            <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-indigo-600 underline">
              www.aboutads.info
            </a>.
          </li>
        </ul>

        <h3 className="text-base font-semibold text-slate-900 pt-1">C. Analytics Telemetry Disclosure</h3>
        <p>
          We prioritize privacy. We do not operate intrusive third-party fingerprinting trackers or invasive session replay scripts. Any analytical metrics are aggregate, anonymized server-side request counts used solely to determine which tools are most helpful.
        </p>
      </section>

      {/* 7. YouTube Thumbnail Downloader Specifics */}
      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900">7. YouTube Thumbnail Downloader Data Handling</h2>
        <p>
          When you use our YouTube Thumbnail Downloader:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
          <li>The tool parses the public YouTube video ID from the URL you provide.</li>
          <li>The thumbnail image is retrieved directly from YouTube&apos;s publicly accessible CDN (<code className="text-xs bg-slate-100 px-1 py-0.5 rounded">img.youtube.com</code> / <code className="text-xs bg-slate-100 px-1 py-0.5 rounded">i.ytimg.com</code>).</li>
          <li>We do not download, store, scrape, or stream the underlying video file or any private channel data.</li>
        </ul>
      </section>

      {/* 8. Log Data & Server Telemetry */}
      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900">8. Log Data & Server Telemetry</h2>
        <p>
          Server log files record technical requests containing IP addresses, user agents, referrers, and HTTP response codes. These logs are maintained strictly for security monitoring (e.g. rate-limiting, blocking malicious DDoS attacks) and are automatically rotated and deleted on a standard 30-day lifecycle.
        </p>
      </section>

      {/* 9. Data Retention & Security */}
      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900">9. Data Retention and Security Measures</h2>
        <p>
          Because we do not maintain registered user accounts, we retain virtually no personal user data:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
          <li><strong>Prompts and Outputs:</strong> Discarded immediately after generation response delivery.</li>
          <li><strong>Communication Inquiries:</strong> Retained only as long as necessary to address your feedback.</li>
          <li><strong>Encryption:</strong> All web traffic is encrypted in transit using industry-standard TLS 1.3 / HTTPS encryption.</li>
        </ul>
      </section>

      {/* 10. Children's Privacy */}
      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900">10. Children&apos;s Privacy (COPPA Compliance)</h2>
        <p>
          Our Website and tools are designed for general audiences and are not directed to children under the age of 13. We do not knowingly collect personal identifiable information from children under 13. If you believe a child has provided us with personal information, please contact us immediately so we can promptly remove such data.
        </p>
      </section>

      {/* 11. External Links */}
      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900">11. External Links</h2>
        <p>
          Our Website may contain links to external websites (such as YouTube, ad networks, or social media platforms). We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites.
        </p>
      </section>

      {/* 12. User Rights */}
      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900">12. User Legal Rights (GDPR & CCPA/CPRA)</h2>
        <p>
          Depending on your geographical jurisdiction, you possess specific statutory rights regarding your personal data:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
          <li><strong>Right of Access & Portability:</strong> You may request confirmation of whether any personal data concerning you is processed.</li>
          <li><strong>Right to Erasure (&quot;Right to be Forgotten&quot;):</strong> You may request deletion of any contact messages you have submitted.</li>
          <li><strong>Right to Rectification:</strong> You may ask us to correct inaccurate contact details.</li>
          <li><strong>Right to Object & Opt-Out:</strong> You may object to personalized advertising by configuring cookie controls as described in Section 6.</li>
          <li><strong>Non-Discrimination:</strong> We will never discriminate against you for exercising any of your privacy rights.</li>
        </ul>
      </section>

      {/* 13. Changes & Contact */}
      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900">13. Changes to this Privacy Policy & Contact</h2>
        <p>
          We reserve the right to update this Privacy Policy periodically to reflect technological changes, legal requirements, or service enhancements. Material changes will be noted by updating the &quot;Last updated&quot; date at the top of this document.
        </p>
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-2 mt-4">
          <h3 className="font-bold text-slate-900">Contact Us Regarding Privacy</h3>
          <p className="text-slate-600">
            For inquiries, data requests, or questions regarding this Privacy Policy, please contact our privacy compliance team via our official{' '}
            <a href="/contact" className="text-indigo-600 font-semibold hover:underline">
              Contact Page
            </a>{' '}
            or by emailing us at{' '}
            <a href="mailto:privacy@technologyhze.online" className="text-indigo-600 font-semibold hover:underline">
              privacy@technologyhze.online
            </a>.
          </p>
        </div>
      </section>
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
