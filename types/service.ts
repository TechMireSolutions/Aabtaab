import type { ContentAncestor } from "./sanity";
import type {
  LabeledDescription,
  LabeledStep,
  NestedContentDetail,
} from "./content-sections";

export interface ServiceChild {
  _id: string;
  slug: string;
  title: string;
  excerpt?: string;
  icon?: { asset: { _ref: string } };
  price?: string;
  childCount?: number;
}

export interface ServiceDetail extends NestedContentDetail {
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
  children?: ServiceChild[];
  parent?: ContentAncestor;
}
