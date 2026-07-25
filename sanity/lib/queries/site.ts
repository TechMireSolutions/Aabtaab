import { SEO_FRAGMENT } from "./fragments";

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

export const homepageSettingsQuery = `*[_type == "homepageSettings"][0]`;

export const testimonialsQuery = `
  *[_type == "testimonial"] | order(order asc) {
    _id, quote, name, role
  }
`;

export const siteSettingsQuery = `
  *[_type == "siteSettings"][0]{
    siteName, description, favicon, logo, tagline,
    siteUrl, twitterHandle,
    email, phone, address, addressLink, workingHours, city, state, country,
    facebook, youtube, whatsapp, darulQuranUrl, donateUrl,
    searchPlaceholder, contactFormSubjects, contactFormSubmitLabel,
    donateArabicVerse, donateHowToHeading, donateHowToText,
    donateClosingMessage, donatePayOnlineLabel, donateContactLabel,
    donateCauses[]{ title, description }
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
