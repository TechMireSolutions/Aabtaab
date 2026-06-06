// ─── Posts / Articles ────────────────────────────────────────────────────────

export const postsQuery = `
  *[_type == "post"] | order(publishedAt desc) {
    _id, title, slug, mainImage, excerpt, publishedAt, featured,
    "categories": categories[]->{ _id, title, slug },
    "author": author->{ name, image }
  }
`

export const featuredPostsQuery = `
  *[_type == "post" && featured == true] | order(publishedAt desc)[0...6] {
    _id, title, slug, mainImage, excerpt, publishedAt,
    "categories": categories[]->{ _id, title, slug },
    "author": author->{ name }
  }
`

export const postBySlugQuery = `
  *[_type == "post" && slug.current == $slug][0] {
    _id, title, slug, mainImage, body, publishedAt, excerpt,
    "categories": categories[]->{ _id, title, slug },
    "author": author->{ name, image, bio }
  }
`

export const postSlugsQuery = `*[_type == "post" && defined(slug.current)]{ "slug": slug.current }`

// ─── Courses ─────────────────────────────────────────────────────────────────

export const topLevelCoursesQuery = `
  *[_type == "course" && !defined(parent)] | order(order asc) {
    _id, title, slug, excerpt, subject, featuredImage, price, duration, instructor,
    "childCount": count(*[_type == "course" && references(^._id)])
  }
`

export const courseBySlugDeepQuery = `
  *[_type == "course" && slug.current == $slug][0] {
    _id, title, slug, excerpt, body, subject, featuredImage,
    price, duration, instructor, enrollmentLink, faq,
    "seoTitle": seoTitle, "seoDescription": seoDescription,

    heroSubtitle, heroCtaLabel,
    overviewHeading, overviewBody,
    outcomesHeading, outcomes[]{ title, desc },
    whyUsHeading, whyUs[]{ title, desc },
    howItWorksHeading, howItWorks[]{ label, desc },
    pricingHeading,
    pricingTables[]{ label, rows[]{ plan, weeklyFrequency, monthlyClasses, feePerClass, monthlyTotal } },
    ctaHeading, ctaSubtitle, ctaBtn1Label, ctaBtn2Label,
    promiseHeading, promiseBody,
    faqSectionHeading,

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
    }
  }
`

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
`

export const courseSlugsQuery = `*[_type == "course" && defined(slug.current)]{ "slug": slug.current }`

// ─── Services ────────────────────────────────────────────────────────────────

export const topLevelServicesQuery = `
  *[_type == "service" && !defined(parent)] | order(order asc) {
    _id, title, slug, excerpt, icon, price,
    "childCount": count(*[_type == "service" && references(^._id)])
  }
`

export const serviceBySlugDeepQuery = `
  *[_type == "service" && slug.current == $slug][0] {
    _id, title, slug, excerpt, body, icon, isBookable, price, faq,
    "seoTitle": seoTitle, "seoDescription": seoDescription,

    heroImage, heroSubtitle, heroBody,
    whyUsHeading, whyUsImage, whyUs[]{ title, desc },
    commitmentHeading, commitment[]{ title, desc },
    howItWorksHeading, howItWorks[]{ label, desc },
    ctaHeading, ctaSubtitle, ctaBtn1Label, ctaBtn2Label,
    faqSectionHeading,

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
    }
  }
`

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
`

export const serviceSlugsQuery = `*[_type == "service" && defined(slug.current)]{ "slug": slug.current }`

// ─── Pages ───────────────────────────────────────────────────────────────────

export const pageBySlugQuery = `
  *[_type == "page" && slug.current == $slug][0] {
    _id, title, slug, eyebrow, subtitle, body, seoTitle, seoDescription
  }
`

// ─── Navigation ──────────────────────────────────────────────────────────────

export const headerNavQuery = `
  *[_type == "navigation" && title == "header"][0]{
    items[]{ label, href, external }
  }
`

export const footerServicesQuery = `
  *[_type == "service" && !defined(parent)] | order(order asc) {
    _id, title, "slug": slug.current
  }
`

// ─── Homepage ────────────────────────────────────────────────────────────────

export const homepageSettingsQuery = `*[_type == "homepageSettings"][0]`

export const testimonialsQuery = `
  *[_type == "testimonial"] | order(order asc) {
    _id, quote, name, role
  }
`

// ─── Site Settings ───────────────────────────────────────────────────────────

export const siteSettingsQuery = `*[_type == "siteSettings"][0]`

// ─── Contact Form — Courses & Services flat lists ─────────────────────────────

export const allCoursesForFormQuery = `
  *[_type == "course"] | order(order asc) {
    _id, title, "parentTitle": parent->title
  }
`

export const allServicesForFormQuery = `
  *[_type == "service"] | order(order asc) {
    _id, title, "parentTitle": parent->title
  }
`
