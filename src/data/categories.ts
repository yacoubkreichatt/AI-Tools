import { Category } from '../types/tools';

export const CATEGORIES: Category[] = [
  {
    id: 'social-media',
    name: 'Social Media',
    description: 'Engage audiences across TikTok, Instagram, YouTube, and Facebook with viral hooks and content ideas.',
    icon: 'Share2',
    subcategories: ['TikTok', 'Instagram', 'YouTube', 'Facebook', 'Pinterest'],
  },
  {
    id: 'content-creation',
    name: 'Content Creation',
    description: 'Speed up your workflow with high-converting titles, video scripts, captions, and creative hooks.',
    icon: 'Sparkles',
    subcategories: ['Hooks', 'Captions', 'Titles', 'Scripts', 'Ideas'],
  },
  {
    id: 'business',
    name: 'Business & Marketing',
    description: 'Generate memorable brand names, high-ROI ad copies, slogans, and product descriptions.',
    icon: 'Briefcase',
    subcategories: ['Business Names', 'Slogans', 'Ads', 'Product Descriptions', 'Emails'],
  },
  {
    id: 'ai-images',
    name: 'AI Image Prompts',
    description: 'Craft photorealistic prompts tailored for Midjourney, Leonardo AI, Flux, and Stable Diffusion.',
    icon: 'Image',
    subcategories: ['Image Prompts', 'Midjourney Prompts', 'Leonardo Prompts', 'Flux Prompts', 'Logo Prompts'],
  },
  {
    id: 'career',
    name: 'Career & Jobs',
    description: 'Land interviews with ATS-optimized resumes, compelling cover letters, and LinkedIn pitch content.',
    icon: 'FileText',
    subcategories: ['Resume', 'CV', 'Cover Letter', 'LinkedIn', 'Interview'],
  },
  {
    id: 'seo',
    name: 'SEO & Search',
    description: 'Boost organic search rankings with click-worthy meta titles, descriptions, and keyword clusters.',
    icon: 'Search',
    subcategories: ['Meta Titles', 'Meta Descriptions', 'Keywords', 'Content Ideas'],
  },
  {
    id: 'youtube',
    name: 'YouTube',
    description: 'Optimize and accelerate your YouTube channel with viral title generators and high-resolution thumbnail extractors.',
    icon: 'Youtube',
    subcategories: ['Thumbnails', 'Titles', 'Shorts', 'Tags', 'SEO'],
  },
];
