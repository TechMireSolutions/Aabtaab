import { SEO_FRAGMENT } from "./fragments";

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

    "parent": parent->{
      _id, title, "slug": slug.current,
      "parent": parent->{
        _id, title, "slug": slug.current,
        "parent": parent->{
          _id, title, "slug": slug.current
        }
      }
    },
    "children": *[_type == "service" && references(^._id)] | order(order asc) {
      _id, title, "slug": slug.current, excerpt, icon, price,
      "childCount": count(*[_type == "service" && references(^._id)])
    },
    ${SEO_FRAGMENT}
  }
`;

export const allServicePathsQuery = `
  *[_type == "service" && defined(slug.current)] {
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

export const serviceSlugsQuery = `*[_type == "service" && defined(slug.current)]{ "slug": slug.current }`;
