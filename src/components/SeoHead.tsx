import React, { useEffect } from 'react';
import { FAQItem } from '../types/tools';

interface SeoHeadProps {
  title?: string;
  description?: string;
  canonicalPath?: string;
  toolName?: string;
  categoryName?: string;
  faqs?: FAQItem[];
  breadcrumbs?: { name: string; path: string }[];
}

export const SeoHead: React.FC<SeoHeadProps> = ({
  title = 'AI Tools Hub - Free Online AI Generators',
  description = 'Free AI tools for creators and businesses.',
  canonicalPath = '',
  toolName,
  categoryName,
  faqs,
  breadcrumbs,
}) => {
  const safeTitle = title || 'AI Tools Hub - Free Online AI Generators';
  const safeDescription = description || 'Free AI tools for creators and businesses.';
  const siteOrigin = (import.meta.env.VITE_SITE_URL as string) ||
    (typeof window !== 'undefined' && window.location.origin && !window.location.origin.includes('localhost') && !window.location.origin.includes('127.0.0.1')
      ? window.location.origin
      : 'https://technologyhze.online');
  const fullUrl = `${siteOrigin}${canonicalPath}`;

  useEffect(() => {
    // Update Title
    document.title = safeTitle;

    // Update Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', safeDescription);

    // Update Canonical
    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.setAttribute('rel', 'canonical');
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute('href', fullUrl);

    // Update Open Graph tags
    const setMetaTag = (property: string, content: string) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('property', property);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    setMetaTag('og:title', safeTitle);
    setMetaTag('og:description', safeDescription);
    setMetaTag('og:url', fullUrl);

    // Update Twitter Cards
    const setTwitterTag = (name: string, content: string) => {
      let tag = document.querySelector(`meta[name="${name}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('name', name);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    setTwitterTag('twitter:title', safeTitle);
    setTwitterTag('twitter:description', safeDescription);

    // Structured Data: WebApplication or Website
    const existingScript = document.getElementById('json-ld-schema');
    if (existingScript) {
      existingScript.remove();
    }

    const schemas: any[] = [];

    // WebApplication schema if this is a tool page
    if (toolName) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: toolName,
        url: fullUrl,
        applicationCategory: categoryName || 'UtilityApplication',
        operatingSystem: 'All',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        description: safeDescription,
      });
    }

    // BreadcrumbList schema
    if (breadcrumbs && breadcrumbs.length > 0) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbs.map((bc, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          name: bc.name,
          item: `${siteOrigin}${bc.path}`,
        })),
      });
    }

    // FAQPage schema
    if (faqs && faqs.length > 0) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((f) => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: f.answer,
          },
        })),
      });
    }

    if (schemas.length > 0) {
      const script = document.createElement('script');
      script.id = 'json-ld-schema';
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(schemas.length === 1 ? schemas[0] : schemas);
      document.head.appendChild(script);
    }

    return () => {
      const s = document.getElementById('json-ld-schema');
      if (s) s.remove();
    };
  }, [title, description, fullUrl, toolName, categoryName, faqs, breadcrumbs]);

  return null;
};
