export type CategoryId =
  | 'social-media'
  | 'content-creation'
  | 'business'
  | 'ai-images'
  | 'career'
  | 'seo'
  | 'youtube';

export interface Category {
  id: CategoryId;
  name: string;
  description: string;
  icon: string;
  subcategories: string[];
}

export type InputType =
  | 'text'
  | 'textarea'
  | 'select'
  | 'number'
  | 'range';

export interface InputFieldOption {
  label: string;
  value: string;
}

export interface InputField {
  name: string;
  label: string;
  type: InputType;
  placeholder?: string;
  defaultValue?: string | number;
  options?: InputFieldOption[];
  min?: number;
  max?: number;
  step?: number;
  rows?: number;
  helpText?: string;
  required?: boolean;
}

export type OutputType =
  | 'list'           // Single list of items with individual copy
  | 'grouped-lists' // Groups of lists (e.g. High/Medium/Niche hashtags)
  | 'cards'         // Cards with multiple fields (e.g. Reel Ideas, Bios)
  | 'ad-variations' // Multi-part ad copies (Primary, Headline, Desc, CTA)
  | 'document';     // Formatted document (Resume, Cover Letter) with print/download

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ToolExample {
  title: string;
  inputs: Record<string, string | number>;
  outputSummary: string;
}

export interface ToolDefinition {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  category: CategoryId;
  description: string;
  icon: string;
  inputs: InputField[];
  outputType: OutputType;
  defaultEngine: 'local' | 'ai' | 'hybrid';
  seoTitle: string;
  seoDescription: string;
  seo?: {
    title?: string;
    description?: string;
  };
  relatedToolSlugs: string[];
  isPopular?: boolean;
  isFeatured?: boolean;
  whoIsItFor: string[];
  howItWorks: string[];
  proTips: string[];
  faqs: FAQItem[];
  examples: ToolExample[];
}

export interface AdCopyVariation {
  id: string;
  angle: string;
  primaryText: string;
  headline: string;
  description: string;
  callToAction: string;
}

export interface ReelIdea {
  id: string;
  hook: string;
  concept: string;
  cta: string;
  formatSuggestion?: string;
}

export interface HashtagGroups {
  highVolume: string[];
  mediumVolume: string[];
  niche: string[];
}

export interface InstagramBioOption {
  id: string;
  style: string;
  bio: string;
  characterCount: number;
}

export interface BusinessNameOption {
  id: string;
  name: string;
  category: string;
  rationale: string;
}

export interface GenerationResult {
  rawText?: string;
  list?: string[];
  groupedHashtags?: HashtagGroups;
  bios?: InstagramBioOption[];
  businessNames?: BusinessNameOption[];
  reelIdeas?: ReelIdea[];
  adVariations?: AdCopyVariation[];
  documentTitle?: string;
  documentBody?: string;
  metadata?: {
    engineUsed: 'ai' | 'local';
    generatedAt: string;
    model?: string;
  };
}
