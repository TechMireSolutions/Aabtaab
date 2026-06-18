import type { SeoData } from "./sanity";

export type ContactPurpose = "general" | "course" | "service" | "other";

export interface ContactFormOption {
  _id: string;
  title: string;
  parentTitle?: string;
}

export interface ContactSettings {
  email?: string;
  phone?: string;
  whatsapp?: string;
  address?: string;
  facebook?: string;
  youtube?: string;
  contactFormSubmitLabel?: string;
}

export interface ContactPageData {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  body?: unknown[];
  seo?: SeoData;
}
