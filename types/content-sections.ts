import type { ContentAncestor, SeoData } from "./sanity";

export interface LabeledDescription {
  title?: string;
  description?: string;
}

export interface LabeledStep {
  label?: string;
  description?: string;
}

export interface CtaBlockFields {
  ctaHeading?: string;
  ctaSubtitle?: string;
  ctaPrimaryLabel?: string;
  ctaSecondaryLabel?: string;
}

export interface FaqBlockFields {
  faqHeading?: string;
  faqItems?: Array<{ question?: string; answer?: unknown[] | string }>;
}

export interface NestedContentDetail extends CtaBlockFields, FaqBlockFields {
  title: string;
  excerpt?: string;
  body?: unknown[];
  parent?: ContentAncestor;
  seo?: SeoData;
}
