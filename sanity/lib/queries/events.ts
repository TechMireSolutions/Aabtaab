import { SEO_FRAGMENT } from "./fragments";

export const allEventsQuery = `
  *[_type == "event"] | order(startDate desc) {
    _id, title, slug, description, startDate, endDate,
    eventType, status, image, isFree, price,
    city, state, venueName, registrationUrl
  }
`;

export const eventBySlugQuery = `
  *[_type == "event" && slug.current == $slug][0] {
    _id, title, slug, description, body,
    eventType, status, startDate, endDate,
    image, isFree, price, registrationUrl,
    venueName, streetAddress, city, state, postalCode, country,
    onlineUrl, organizerName, organizerUrl,
    ${SEO_FRAGMENT}
  }
`;

export const eventSlugsQuery = `*[_type == "event" && defined(slug.current) && coalesce(seo.noIndex, false) != true]{
  "slug": slug.current,
  "lastModified": coalesce(_updatedAt, startDate, _createdAt)
}`;
