import type { SanityImage } from "./sanity";

export interface Country {
  _id: string;
  name: string;
  flagIcon?: string;
  flagImage?: SanityImage;
}
