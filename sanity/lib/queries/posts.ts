import { SEO_FRAGMENT } from "./fragments";

export const postsQuery = `
  *[_type == "post"] | order(publishedAt desc) {
    _id, title, slug, mainImage, excerpt, publishedAt, featured,
    "categories": categories[]->{ _id, title, slug },
    "author": author->{ name, image }
  }
`;

export const postsSearchQuery = `
  *[_type == "post" && (
    title match $term + "*" ||
    defined(excerpt) && excerpt match $term + "*" ||
    pt::text(body) match $term + "*"
  )] | order(publishedAt desc) {
    _id, title, slug, mainImage, excerpt, publishedAt, featured,
    "categories": categories[]->{ _id, title, slug },
    "author": author->{ name, image }
  }
`;

export const featuredPostsQuery = `
  *[_type == "post" && featured == true] | order(publishedAt desc)[0...6] {
    _id, title, slug, mainImage, excerpt, publishedAt,
    "categories": categories[]->{ _id, title, slug },
    "author": author->{ name }
  }
`;

export const postBySlugQuery = `
  *[_type == "post" && slug.current == $slug][0] {
    _id, title, slug, mainImage, body, publishedAt, excerpt,
    "categories": categories[]->{ _id, title, slug },
    "author": author->{ name, image, bio },
    faqItems[]{ question, answer },
    ${SEO_FRAGMENT}
  }
`;

export const postSlugsQuery = `*[_type == "post" && defined(slug.current)]{ "slug": slug.current }`;
