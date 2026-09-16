import type { SanityImage } from "./sanity";

export interface Publication {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  fileUrl?: string;
  fileSize?: number;
  coverImage?: SanityImage;
}
