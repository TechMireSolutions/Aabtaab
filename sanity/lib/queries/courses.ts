import { SEO_FRAGMENT } from "./fragments";

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

    "parent": parent->{
      _id, title, "slug": slug.current,
      "parent": parent->{
        _id, title, "slug": slug.current,
        "parent": parent->{
          _id, title, "slug": slug.current
        }
      }
    },
    "children": *[_type == "course" && references(^._id)] | order(order asc) {
      _id, title, "slug": slug.current, excerpt, featuredImage, price, duration,
      "childCount": count(*[_type == "course" && references(^._id)])
    },
    ${SEO_FRAGMENT}
  }
`;

export const allCoursePathsQuery = `
  *[_type == "course" && defined(slug.current)] {
    "slug": slug.current,
    "parent": parent->{
      "slug": slug.current,
      "parent": parent->{
        "slug": slug.current,
        "parent": parent->{ "slug": slug.current }
      }
    }
  }
`;

export const courseSlugsQuery = `*[_type == "course" && defined(slug.current)]{ "slug": slug.current }`;
