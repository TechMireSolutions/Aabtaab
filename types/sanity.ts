/** Shared CMS image / ancestry shapes used across domains */

export interface SanityImage {
  asset: { _ref: string };
  alt?: string;
}

export interface SlugParent {
  slug?: string;
  parent?: SlugParent | null;
  title?: string;
}

export interface ContentAncestor {
  title: string;
  slug: string;
  parent?: unknown;
}
