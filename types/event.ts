import type { SeoData } from "@/types/seo";

export interface EventSummary {
  _id: string;
  title: string;
  slug: { current: string };
  description?: string;
  startDate: string;
  endDate?: string;
  eventType?: string;
  status?: string;
  image?: { asset?: { _ref: string }; alt?: string };
  isFree?: boolean;
  price?: string;
  city?: string;
  state?: string;
  venueName?: string;
  registrationUrl?: string;
}

export interface EventDetail extends EventSummary {
  body?: unknown[];
  onlineUrl?: string;
  streetAddress?: string;
  postalCode?: string;
  country?: string;
  organizerName?: string;
  organizerUrl?: string;
  seo?: SeoData;
}
