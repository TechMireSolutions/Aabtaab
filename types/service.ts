import type { ContentAncestor, SeoData } from "./sanity";
import type { LabeledDescription, LabeledStep } from "./course";

export interface ServiceChild {
  _id: string;
  slug: string;
  title: string;
  excerpt?: string;
  icon?: { asset: { _ref: string } };
  price?: string;
  childCount?: number;
}

export interface ServiceDetail {
  title: string;
  excerpt?: string;
  price?: string;
  heroImage?: { asset: { _ref: string }; alt?: string };
  whyUsImage?: { asset: { _ref: string }; alt?: string };
  heroSubtitle?: string;
  heroBody?: string;
  whyUsHeading?: string;
  whyUs?: LabeledDescription[];
  commitmentHeading?: string;
  commitment?: LabeledDescription[];
  howItWorksHeading?: string;
  howItWorks?: LabeledStep[];
  ctaHeading?: string;
  ctaSubtitle?: string;
  ctaPrimaryLabel?: string;
  ctaSecondaryLabel?: string;
  faqHeading?: string;
  faqItems?: Array<{ question?: string; answer?: unknown[] }>;
  body?: unknown[];
  children?: ServiceChild[];
  parent?: ContentAncestor;
  seo?: SeoData;
}
