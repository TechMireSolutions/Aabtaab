export interface TopLevelServiceSummary {
  _id: string;
  title: string;
  slug: { current: string };
  icon?: { asset: { _ref: string } };
  excerpt?: string;
  price?: string;
  childCount?: number;
}

export interface TopLevelCourseSummary {
  _id: string;
  title: string;
  slug: { current: string };
  featuredImage?: { asset: { _ref: string } };
  excerpt?: string;
  price?: string;
  duration?: string;
  childCount?: number;
}
