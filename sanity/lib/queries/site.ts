import { SEO_FRAGMENT, SITE_SETTINGS_FRAGMENT } from "./fragments";

export const pageBySlugQuery = `
  *[_type == "page" && slug.current == $slug][0] {
    _id, title, slug, eyebrow, subtitle, body,
    ${SEO_FRAGMENT}
  }
`;

export const headerNavQuery = `
  *[_type == "navigation" && title == "header"][0]{
    items[]{ label, href, external }
  }
`;

export const footerNavQuery = `
  *[_type == "navigation" && title == "footer"][0]{
    items[]{ label, href, external }
  }
`;

export const footerServicesQuery = `
  *[_type == "service" && !defined(parent)] | order(order asc) {
    _id, title, "slug": slug.current
  }
`;

export const testimonialsQuery = `
  *[_type == "testimonial" && status == "approved"] | order(order asc) {
    _id, quote, name, role, rating
  }
`;

export const scholarsQuery = `
  *[_type == "scholar"] | order(order asc, name asc) {
    _id, name, slug, image, qualifications, contactDetails, bio
  }
`;

export const countriesQuery = `
  *[_type == "country"] | order(order asc, name asc) {
    _id, name, flagIcon, flagImage
  }
`;

export const catalogCountsQuery = `{
  "scholars": count(*[_type == "scholar"]),
  "events": count(*[_type == "event"]),
  "posts": count(*[_type == "post"]),
  "courses": count(*[_type == "course"]),
  "services": count(*[_type == "service"])
}`;

export const siteSettingsQuery = `
  *[_type == "siteSettings"][0]{
    ${SITE_SETTINGS_FRAGMENT}
  }
`;

export const allCoursesForFormQuery = `
  *[_type == "course"] | order(order asc) {
    _id, title, "parentTitle": parent->title
  }
`;

export const allServicesForFormQuery = `
  *[_type == "service"] | order(order asc) {
    _id, title, "parentTitle": parent->title
  }
`;
