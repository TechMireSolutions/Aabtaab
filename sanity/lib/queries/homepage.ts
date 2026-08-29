import { SITE_SETTINGS_FRAGMENT } from "./fragments";

/** Hero + metadata — small payload for fast mobile LCP */
export const homepageHeroQuery = `{
  "homepage": *[_type == "homepageSettings"][0],
  "settings": *[_type == "siteSettings"][0]{ ${SITE_SETTINGS_FRAGMENT} },
  "quotes": *[_type == "quote"] | order(_createdAt asc),
  "courseCount": count(*[_type == "course" && !defined(parent)]),
  "scholarCount": count(*[_type == "scholar"]),
  "countryCount": count(*[_type == "country"])
}`;

/** Below-fold carousels — streamed after hero + about */
export const homepageCarouselsQuery = `{
  "featuredPosts": *[_type == "post" && featured == true] | order(publishedAt desc)[0...6] {
    _id, title, slug, mainImage, excerpt, publishedAt,
    "categories": categories[]->{ _id, title, slug },
    "author": author->{ name }
  },
  "courses": *[_type == "course" && !defined(parent)] | order(order asc) {
    _id, title, slug, excerpt, subject, featuredImage, price, duration, instructor,
    "childCount": count(*[_type == "course" && references(^._id)])
  },
  "services": *[_type == "service" && !defined(parent)] | order(order asc) {
    _id, title, slug, excerpt, icon, price,
    "children": *[_type == "service" && references(^._id)] | order(order asc) { title }
  },
  "homepage": *[_type == "homepageSettings"][0]{
    coursesHeading, coursesSubheading, servicesHeading, servicesSubheading,
    articlesHeading, articlesSubheading,
    testimonialsEyebrow, testimonialsHeading,
    donateHeading, donateText, donateQuote, donateQuoteAttribution,
    donateQuoteReference, donateCtaLabel
  },
  "testimonials": *[_type == "testimonial" && status == "approved"] | order(order asc) {
    _id, quote, name, role, rating
  },
  "upcomingEvents": *[_type == "event" && startDate >= now()] | order(startDate asc) {
    _id, title, slug, description, startDate, endDate,
    eventType, status, image, isFree, price,
    city, state, venueName, registrationUrl
  }
}`;
