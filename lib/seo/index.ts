export {
  getSiteUrl,
  absoluteUrl,
  buildPageMetadata,
  getDefaultOgImageUrl,
} from "./metadata";
export { resolveDocOgImage } from "./resolve-og-image";
export {
  JsonLd,
  ArticleJsonLd,
  CourseJsonLd,
  EventJsonLd,
  BreadcrumbJsonLd,
  WebSiteJsonLd,
} from "./JsonLd";
export { buildNestedContentPath, getContentAncestry, ancestryPathSegment, buildNestedBreadcrumbItems } from "@/lib/paths";
