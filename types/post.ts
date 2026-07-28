import type { SeoData } from "./seo";

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
