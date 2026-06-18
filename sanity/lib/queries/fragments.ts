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
