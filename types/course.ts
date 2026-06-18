import type { ContentAncestor } from "./sanity";
import type {
  LabeledDescription,
  LabeledStep,
  NestedContentDetail,
} from "./content-sections";

export type { LabeledDescription, LabeledStep } from "./content-sections";

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

export interface CourseDetail extends NestedContentDetail {
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
  promiseHeading?: string;
  promiseBody?: string;
  children?: CourseChild[];
  parent?: ContentAncestor;
}
