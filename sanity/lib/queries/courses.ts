import { PARENT_ANCESTRY_FRAGMENT, PARENT_SLUG_CHAIN_FRAGMENT, SEO_FRAGMENT } from "./fragments";

export const topLevelCoursesQuery = `
  *[_type == "course" && !defined(parent)] | order(order asc) {
    _id, title, slug, excerpt, subject, featuredImage, price, duration, instructor,
    "childCount": count(*[_type == "course" && references(^._id)])
  }
`;

export const courseBySlugDeepQuery = `
  *[_type == "course" && slug.current == $slug][0] {
    _id, title, slug, excerpt, body, subject, featuredImage,
    price, duration, instructor, enrollmentLink, faqItems,

    heroSubtitle, heroCtaLabel,
    overviewHeading, overviewBody,
    outcomesHeading, outcomes[]{ title, description },
    whyUsHeading, whyUs[]{ title, description },
    howItWorksHeading, howItWorks[]{ label, description },
    pricingHeading,
    pricingTables[]{ label, rows[]{ plan, weeklyFrequency, monthlyClasses, feePerClass, monthlyTotal } },
    ctaHeading, ctaSubtitle, ctaPrimaryLabel, ctaSecondaryLabel,
    promiseHeading, promiseBody,
    faqHeading,

    ${PARENT_ANCESTRY_FRAGMENT},
    "children": *[_type == "course" && references(^._id)] | order(order asc) {
      _id, title, "slug": slug.current, excerpt, featuredImage, price, duration,
      "childCount": count(*[_type == "course" && references(^._id)])
    },
    ${SEO_FRAGMENT}
  }
`;

export const allCoursePathsQuery = `
  *[_type == "course" && defined(slug.current) && coalesce(seo.noIndex, false) != true] {
    "slug": slug.current,
    "lastModified": coalesce(_updatedAt, _createdAt),
    ${PARENT_SLUG_CHAIN_FRAGMENT}
  }
`;
