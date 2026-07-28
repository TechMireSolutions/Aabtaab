import type { SanityImage } from "./sanity";

export interface Scholar {
  _id: string;
  name: string;
  slug?: { current: string };
  image?: SanityImage;
  qualifications?: string[];
  contactDetails?: string;
  bio?: unknown[];
}
