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
