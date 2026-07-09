/** Shared Sanity document shapes used across the app */

export interface SeoData {
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: { asset: { _ref: string }; alt?: string };
  canonicalUrl?: string;
  noIndex?: boolean;
  keywords?: string[];
}

export interface SiteSettings {
  siteName?: string;
  description?: string;
  favicon?: { asset: { _ref: string } };
  logo?: { asset: { _ref: string }; alt?: string };
  tagline?: string;
  siteUrl?: string;
  twitterHandle?: string;
  facebook?: string;
  youtube?: string;
  whatsapp?: string;
  darulQuranUrl?: string;
  donateUrl?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  searchPlaceholder?: string;
  contactFormSubmitLabel?: string;
  donateArabicVerse?: string;
  donatePayOnlineLabel?: string;
  donateContactLabel?: string;
  donateClosingMessage?: string;
  donateHowToHeading?: string;
  donateHowToText?: string;
  donateCauses?: { title: string; description: string }[];
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface Post {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt?: string;
  mainImage?: { asset: { _ref: string }; alt?: string };
  publishedAt?: string;
  updatedAt?: string;
  categories?: Array<{ _id: string; title: string; slug: { current: string } }>;
  author?: {
    name: string;
    image?: { asset: { _ref: string } };
    bio?: unknown[];
  };
  body?: unknown[];
  faqItems?: FaqItem[];
  seo?: SeoData;
}

export interface SanityImage {
  asset: { _ref: string };
  alt?: string;
}

export interface SlugParent {
  slug?: string;
  parent?: SlugParent | null;
  title?: string;
}

export interface ContentAncestor {
  title: string;
  slug: string;
  parent?: unknown;
}
