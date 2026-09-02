import type { SanityImage } from "./sanity";

export interface HomePostSummary {
  _id: string;
  title: string;
  slug: { current: string };
  mainImage?: SanityImage;
  excerpt?: string;
  categories?: { title: string }[];
}

export interface HomeCourseSummary {
  _id: string;
  title: string;
  slug: { current: string };
  featuredImage?: { asset: { _ref: string } };
  price?: string;
  duration?: string;
  subject?: string;
  childCount?: number;
}

export interface HomeServiceSummary {
  _id: string;
  title: string;
  slug: { current: string };
  icon?: { asset: { _ref: string } };
  price?: string;
  children?: { title: string }[];
}

export interface HomepageSettings {
  heroImage?: { asset: { _ref: string } };
  heroArabicText?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  heroBadgeText?: string;
  heroCta1Label?: string;
  heroCta1Link?: string;
  heroCta2Label?: string;
  heroCta2Link?: string;
  aboutEyebrow?: string;
  aboutHeading?: string;
  aboutBody1?: string;
  aboutBody2?: string;
  aboutPillars?: string[];
  aboutCtaLabel?: string;
  aboutStat1Value?: string;
  aboutStat1Label?: string;
  aboutStat2Value?: string;
  aboutStat2Label?: string;
  aboutStat3Value?: string;
  aboutStat3Label?: string;
  aboutBadgeText?: string;
  aboutBadgeSubtext?: string;
  coursesHeading?: string;
  coursesSubheading?: string;
  servicesHeading?: string;
  servicesSubheading?: string;
  articlesHeading?: string;
  articlesSubheading?: string;
  testimonialsEyebrow?: string;
  testimonialsHeading?: string;
  donateHeading?: string;
  donateText?: string;
  donateQuote?: string;
  donateQuoteAttribution?: string;
  donateQuoteReference?: string;
  donateCtaLabel?: string;
}
