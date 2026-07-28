export const SEO_FRAGMENT = `
  "seo": {
    "metaTitle":      coalesce(seo.metaTitle, title),
    "metaDescription": coalesce(seo.metaDescription, excerpt, subtitle),
    "ogImage":        seo.ogImage,
    "canonicalUrl":   seo.canonicalUrl,
    "noIndex":        seo.noIndex,
    "keywords":       seo.keywords
  }
`;

/** Shared site settings projection (hero + settings fetches) */
export const SITE_SETTINGS_FRAGMENT = `
  siteName, description, favicon, logo, tagline,
  siteUrl, twitterHandle,
  email, phone, address, addressLink, workingHours, city, state, country,
  facebook, youtube, whatsapp, darulQuranUrl, donateUrl,
  searchPlaceholder, contactFormSubjects, contactFormSubmitLabel,
  donateArabicVerse, donateHowToHeading, donateHowToText,
  donateClosingMessage, donatePayOnlineLabel, donateContactLabel,
  donateCauses[]{ title, description }
`;

/** Three-level parent chain used by course and service deep queries */
export const PARENT_ANCESTRY_FRAGMENT = `
  "parent": parent->{
    _id, title, "slug": slug.current,
    "parent": parent->{
      _id, title, "slug": slug.current,
      "parent": parent->{
        _id, title, "slug": slug.current
      }
    }
  }
`;

/** Slug-only parent chain for sitemap path building */
export const PARENT_SLUG_CHAIN_FRAGMENT = `
  "parent": parent->{
    "slug": slug.current,
    "parent": parent->{
      "slug": slug.current,
      "parent": parent->{ "slug": slug.current }
    }
  }
`;
