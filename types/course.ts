import type { ContentAncestor, SeoData } from "./sanity";

export interface CourseChild {
  _id: string;
  slug: string;
  title: string;
  featuredImage?: { asset: { _ref: string } };
  excerpt?: string;
  price?: string;
  duration?: string;
  childCount?: number;
}

export interface LabeledDescription {
  title?: string;
  description?: string;
}

export interface LabeledStep {
  label?: string;
  description?: string;
}

export interface CourseDetail {
  title: string;
  excerpt?: string;
  subject?: string;
  duration?: string;
  instructor?: string;
  featuredImage?: { asset: { _ref: string }; alt?: string };
  enrollmentLink?: string;
  heroSubtitle?: string;
  heroCtaLabel?: string;
  overviewHeading?: string;
  overviewBody?: string;
  outcomesHeading?: string;
  outcomes?: LabeledDescription[];
  whyUsHeading?: string;
  whyUs?: LabeledDescription[];
  howItWorksHeading?: string;
  howItWorks?: LabeledStep[];
  pricingHeading?: string;
  pricingTables?: Array<{
    label?: string;
    rows?: Array<{
      plan?: string;
      weeklyFrequency?: string;
      monthlyClasses?: string;
      feePerClass?: string;
      monthlyTotal?: string;
    }>;
  }>;
  ctaHeading?: string;
  ctaSubtitle?: string;
  ctaPrimaryLabel?: string;
  ctaSecondaryLabel?: string;
  promiseHeading?: string;
  promiseBody?: string;
  faqHeading?: string;
  faqItems?: Array<{ question?: string; answer?: unknown[] }>;
  body?: unknown[];
  children?: CourseChild[];
  parent?: ContentAncestor;
  seo?: SeoData;
}
