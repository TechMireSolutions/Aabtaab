/** Unified site search across posts, courses, services, and events */
export const siteSearchQuery = `
  *[
    _type in ["post", "course", "service", "event"] &&
    (
      title match $term + "*" ||
      (defined(excerpt) && excerpt match $term + "*") ||
      (defined(description) && description match $term + "*")
    )
  ] | order(_type asc, title asc) [0...24] {
    _id,
    _type,
    title,
    excerpt,
    description,
    "slug": slug.current,
    "href": select(
      _type == "post" => "/posts/" + slug.current,
      _type == "event" => "/events/" + slug.current,
      _type == "course" => "/online-courses/" + slug.current,
      _type == "service" => "/services/" + slug.current
    ),
    "summary": coalesce(excerpt, description)
  }
`;
