/** Unified site search across posts, courses, services, and events */
export const siteSearchQuery = `
  *[
    _type in ["post", "course", "service", "event"] &&
    (
      // Standard search: specific term matches, and if a category was named, restrict to that category
      (
        $hasTerm && 
        (
          title match $term + "*" ||
          (defined(excerpt) && excerpt match $term + "*") ||
          (defined(description) && description match $term + "*")
        ) && 
        (length($matchTypes) == 0 || _type in $matchTypes)
      )
      ||
      // Generic search: no specific term, just return the category named
      (!$hasTerm && _type in $matchTypes)
      ||
      // Fallback: it matches the raw term (e.g. a blog post titled "Tajweed Course")
      (
        title match $rawTerm + "*" ||
        (defined(excerpt) && excerpt match $rawTerm + "*") ||
        (defined(description) && description match $rawTerm + "*")
      )
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
