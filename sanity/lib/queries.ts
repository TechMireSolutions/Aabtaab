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

export const coursesQuery = `
  *[_type == "course"] | order(order asc) {
    _id, title, slug, subject, quranType, description, featuredImage, price, duration, enrollmentLink, instructor,
    "levels": *[_type == "courseLevel" && references(^._id)] | order(title asc) {
      _id, title, description, duration
    }
  }
`

export const courseBySlugQuery = `
  *[_type == "course" && slug.current == $slug][0] {
    _id, title, slug, subject, quranType, description, featuredImage, price, duration, enrollmentLink, instructor,
    "levels": *[_type == "courseLevel" && references(^._id)] | order(title asc) {
      _id, title, description, curriculum, duration, prerequisites
    }
  }
`

export const courseSlugsQuery = `*[_type == "course" && defined(slug.current)]{ "slug": slug.current }`

// ─── Services ────────────────────────────────────────────────────────────────

/* Top-level listing page (/services) */
export const topLevelServicesQuery = `
  *[_type == "service" && !defined(parent)] | order(order asc) {
    _id, title, slug, excerpt, icon, price,
    "childCount": count(*[_type == "service" && references(^._id)])
  }
`

/* Catch-all route — fetch by slug with full ancestry (4 levels deep) + children */
export const serviceBySlugDeepQuery = `
  *[_type == "service" && slug.current == $slug][0] {
    _id, title, slug, excerpt, body, icon, isBookable, price, faq,
    "seoTitle": seoTitle, "seoDescription": seoDescription,
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

/* Used by generateStaticParams — full ancestry per service */
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

/* Keep for any other references */
export const serviceSlugsQuery = `*[_type == "service" && defined(slug.current)]{ "slug": slug.current }`

// ─── Pages (About, Donate, Contact) ──────────────────────────────────────────

export const pageBySlugQuery = `
  *[_type == "page" && slug.current == $slug][0] {
    _id, title, slug, body, seoTitle, seoDescription
  }
`

// ─── Homepage ────────────────────────────────────────────────────────────────

export const homepageSettingsQuery = `*[_type == "homepageSettings"][0]`

// ─── Site Settings ───────────────────────────────────────────────────────────

export const siteSettingsQuery = `*[_type == "siteSettings"][0]`
