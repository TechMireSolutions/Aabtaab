import { groq } from "next-sanity";
import { SEO_FRAGMENT } from "./fragments";

export const allPublicationsQuery = groq`
  *[_type == "publication"] | order(_createdAt desc) {
    _id,
    title,
    "slug": slug.current,
    author,
    description,
    language,
    pages,
    publishedYear,
    _createdAt,
    _updatedAt,
    "fileUrl": coalesce(pdfUrl, file.asset->url),
    "fileSize": file.asset->size,
    coverImage {
      asset-> {
        _id,
        url
      },
      alt,
      hotspot
    }
  }
`;

export const publicationBySlugQuery = groq`
  *[_type == "publication" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    author,
    description,
    language,
    pages,
    publishedYear,
    _createdAt,
    _updatedAt,
    "fileUrl": coalesce(pdfUrl, file.asset->url),
    "fileSize": file.asset->size,
    coverImage {
      asset-> {
        _id,
        url
      },
      alt,
      hotspot
    },
    body,
    ${SEO_FRAGMENT}
  }
`;

export const publicationSlugsQuery = groq`
  *[_type == "publication" && defined(slug.current) && coalesce(seo.noIndex, false) != true] {
    "slug": slug.current,
    "lastModified": coalesce(_updatedAt, _createdAt)
  }
`;

