const SITE_SETTINGS_FRAGMENT = `*[_type == "siteSettings"][0]{
  siteName, description, favicon, logo, tagline,
  siteUrl, twitterHandle,
  email, phone, address, city, state, country,
  facebook, youtube, whatsapp, darulQuranUrl, donateUrl,
  searchPlaceholder, contactFormSubjects, contactFormSubmitLabel,
  donateArabicVerse, donateHowToHeading, donateHowToText,
  donateClosingMessage, donatePayOnlineLabel, donateContactLabel,
  donateCauses[]{ title, description }
}`;

/** Hero + metadata — small payload for fast mobile LCP */
export const homepageHeroQuery = `{
  "homepage": *[_type == "homepageSettings"][0],
  "settings": ${SITE_SETTINGS_FRAGMENT},
  "quotes": *[_type == "quote"] | order(_createdAt asc)
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
    donateCtaLabel
  },
  "testimonials": *[_type == "testimonial"] | order(order asc) {
    _id, quote, name, role
  },
  "upcomingEvents": *[_type == "event" && startDate >= now()] | order(startDate asc) {
    _id, title, slug, description, startDate, endDate,
    eventType, status, image, isFree, price,
    city, state, venueName, registrationUrl
  }
}`;

/** @deprecated Use homepageCarouselsQuery — kept for migrations/scripts */
export const homepageSectionsQuery = homepageCarouselsQuery;

export const homepageDataQuery = `{
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
  "homepage": *[_type == "homepageSettings"][0],
  "testimonials": *[_type == "testimonial"] | order(order asc) {
    _id, quote, name, role
  },
  "upcomingEvents": *[_type == "event" && startDate >= now()] | order(startDate asc) {
    _id, title, slug, description, startDate, endDate,
    eventType, status, image, isFree, price,
    city, state, venueName, registrationUrl
  },
  "settings": ${SITE_SETTINGS_FRAGMENT},
  "quotes": *[_type == "quote"] | order(_createdAt asc)
}`;
