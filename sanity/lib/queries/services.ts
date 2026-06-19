import { PARENT_ANCESTRY_FRAGMENT, PARENT_SLUG_CHAIN_FRAGMENT, SEO_FRAGMENT } from "./fragments";

export const topLevelServicesQuery = `
  *[_type == "service" && !defined(parent)] | order(order asc) {
    _id, title, slug, excerpt, icon, price,
    "childCount": count(*[_type == "service" && references(^._id)])
  }
`;

export const serviceBySlugDeepQuery = `
  *[_type == "service" && slug.current == $slug][0] {
    _id, title, slug, excerpt, body, icon, isBookable, price, faqItems,

    heroImage, heroSubtitle, heroBody,
    whyUsHeading, whyUsImage, whyUs[]{ title, description },
    commitmentHeading, commitment[]{ title, description },
    howItWorksHeading, howItWorks[]{ label, description },
    ctaHeading, ctaSubtitle, ctaPrimaryLabel, ctaSecondaryLabel,
    faqHeading,

    ${PARENT_ANCESTRY_FRAGMENT},
    "children": *[_type == "service" && references(^._id)] | order(order asc) {
      _id, title, "slug": slug.current, excerpt, icon, price,
      "childCount": count(*[_type == "service" && references(^._id)])
    },
    ${SEO_FRAGMENT}
  }
`;

export const allServicePathsQuery = `
  *[_type == "service" && defined(slug.current) && coalesce(seo.noIndex, false) != true] {
    "slug": slug.current,
    "lastModified": coalesce(_updatedAt, _createdAt),
    ${PARENT_SLUG_CHAIN_FRAGMENT}
  }
`;

export const serviceSlugsQuery = `*[_type == "service" && defined(slug.current)]{ "slug": slug.current }`;
