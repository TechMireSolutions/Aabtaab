export interface SeoData {
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: { asset: { _ref: string }; alt?: string };
  canonicalUrl?: string;
  noIndex?: boolean;
  keywords?: string[];
}
