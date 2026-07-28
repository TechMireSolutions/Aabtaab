import { SEO_FRAGMENT } from "./fragments";

export const postsQuery = `
  *[_type == "post"] | order(publishedAt desc) {
    _id, title, slug, mainImage, excerpt, publishedAt, featured,
    "categories": categories[]->{ _id, title, slug },
    "author": author->{ name, image }
  }
`;

export const postBySlugQuery = `
  *[_type == "post" && slug.current == $slug][0] {
    _id, title, slug, mainImage, body, publishedAt,
    "updatedAt": coalesce(_updatedAt, publishedAt),
    excerpt,
    "categories": categories[]->{ _id, title, slug },
    "author": author->{ name, image, bio },
    faqItems[]{ question, answer },
    ${SEO_FRAGMENT}
  }
`;

export const postSlugsQuery = `*[_type == "post" && defined(slug.current) && coalesce(seo.noIndex, false) != true]{
  "slug": slug.current,
  "lastModified": coalesce(_updatedAt, publishedAt, _createdAt)
}`;
