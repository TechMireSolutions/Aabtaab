import type { PortableTextBlock } from "next-sanity";
import type { SanityImage } from "./sanity";
import type { SeoData } from "./seo";

export interface Publication {
  _id: string;
  title: string;
  slug: string;
  author?: string;
  description?: string;
  fileUrl?: string;
  fileSize?: number;
  coverImage?: SanityImage & { alt?: string };
  language?: string;
  pages?: number;
  publishedYear?: string;
  _createdAt?: string;
  _updatedAt?: string;
}

export interface PublicationDetail extends Publication {
  body?: PortableTextBlock[];
  seo?: SeoData;
}

