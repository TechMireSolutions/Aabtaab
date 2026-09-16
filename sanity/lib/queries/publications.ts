import { groq } from "next-sanity";

export const allPublicationsQuery = groq`
  *[_type == "publication"] | order(_createdAt desc) {
    _id,
    title,
    "slug": slug.current,
    description,
    "fileUrl": file.asset->url,
    "fileSize": file.asset->size,
    coverImage {
      asset-> {
        _id,
        url
      },
      hotspot
    }
  }
`;
