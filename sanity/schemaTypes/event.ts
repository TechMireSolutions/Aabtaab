import { defineField, defineType } from "sanity";

// Event document — outputs schema.org/Event JSON-LD for Google Events carousel
// Target queries: "Muharram events near me", "Shia Islamic events [city] 2026"
export const event = defineType({
  name: "event",
  title: "Event",
  type: "document",
  groups: [
    { name: "details", title: "Event Details", default: true },
    { name: "location", title: "Location" },
    { name: "organizer", title: "Organizer" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    // ── Core ────────────────────────────────────────────────────────────────
    defineField({
      name: "title",
      type: "string",
      title: "Event Title",
      group: "details",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      title: "Slug",
      group: "details",
      options: { source: "title" },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "description",
      type: "text",
      title: "Short Description",
      rows: 3,
      group: "details",
      description:
        "Used in event cards and as the JSON-LD description. Keep under 200 characters.",
    }),
    defineField({
      name: "body",
      type: "array",
      title: "Full Event Details",
      group: "details",
      of: [
        { type: "block" },
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              type: "string",
              title: "Alt Text",
              validation: (r) => r.required(),
            }),
          ],
        },
      ],
    }),
    defineField({
      name: "eventType",
      type: "string",
      title: "Event Type",
      group: "details",
      description: "Used in structured data as schema.org eventAttendanceMode",
      options: {
        list: [
          { title: "In Person", value: "OfflineEventAttendanceMode" },
          { title: "Online Only", value: "OnlineEventAttendanceMode" },
          { title: "Hybrid (Both)", value: "MixedEventAttendanceMode" },
        ],
        layout: "radio",
      },
      initialValue: "OfflineEventAttendanceMode",
    }),
    defineField({
      name: "status",
      type: "string",
      title: "Event Status",
      group: "details",
      options: {
        list: [
          { title: "Scheduled", value: "EventScheduled" },
          { title: "Cancelled", value: "EventCancelled" },
          { title: "Postponed", value: "EventPostponed" },
          { title: "Rescheduled", value: "EventRescheduled" },
        ],
        layout: "radio",
      },
      initialValue: "EventScheduled",
    }),

    // ── Dates ────────────────────────────────────────────────────────────────
    defineField({
      name: "startDate",
      type: "datetime",
      title: "Start Date & Time",
      group: "details",
      options: { dateFormat: "MMMM Do YYYY", timeFormat: "h:mm A" },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "endDate",
      type: "datetime",
      title: "End Date & Time",
      group: "details",
      options: { dateFormat: "MMMM Do YYYY", timeFormat: "h:mm A" },
    }),

    // ── Media ────────────────────────────────────────────────────────────────
    defineField({
      name: "image",
      type: "image",
      title: "Event Image",
      group: "details",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          type: "string",
          title: "Alt text",
          validation: (r) => r.required(),
        }),
      ],
    }),

    // ── Location ─────────────────────────────────────────────────────────────
    defineField({
      name: "venueName",
      type: "string",
      title: "Venue Name",
      group: "location",
      description: 'e.g. "Islamic Center of America"',
    }),
    defineField({
      name: "streetAddress",
      type: "string",
      title: "Street Address",
      group: "location",
    }),
    defineField({
      name: "city",
      type: "string",
      title: "City",
      group: "location",
    }),
    defineField({
      name: "state",
      type: "string",
      title: "State (e.g. MI, TX, CA)",
      group: "location",
    }),
    defineField({
      name: "postalCode",
      type: "string",
      title: "ZIP / Postal Code",
      group: "location",
    }),
    defineField({
      name: "country",
      type: "string",
      title: "Country Code",
      group: "location",
      initialValue: "US",
    }),
    defineField({
      name: "onlineUrl",
      type: "url",
      title: "Online Stream / Meeting URL",
      group: "location",
      description: "Required for Online or Hybrid events",
    }),

    // ── Organizer ────────────────────────────────────────────────────────────
    defineField({
      name: "organizerName",
      type: "string",
      title: "Organizer Name",
      group: "organizer",
    }),
    defineField({
      name: "organizerUrl",
      type: "url",
      title: "Organizer Website",
      group: "organizer",
    }),

    // ── Registration ─────────────────────────────────────────────────────────
    defineField({
      name: "registrationUrl",
      type: "url",
      title: "Registration / Tickets URL",
      group: "details",
    }),
    defineField({
      name: "isFree",
      type: "boolean",
      title: "Free Event",
      group: "details",
      initialValue: true,
    }),
    defineField({
      name: "price",
      type: "string",
      title: "Price (if paid)",
      group: "details",
      description: 'e.g. "$10" or "Free – $25"',
    }),

    // ── SEO ──────────────────────────────────────────────────────────────────
    defineField({
      name: "seo",
      type: "seoObject",
      title: "SEO Settings",
      group: "seo",
    }),
  ],
  orderings: [
    {
      title: "Start Date (soonest first)",
      name: "startDateAsc",
      by: [{ field: "startDate", direction: "asc" }],
    },
    {
      title: "Start Date (latest first)",
      name: "startDateDesc",
      by: [{ field: "startDate", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "title", date: "startDate", media: "image", city: "city" },
    prepare({ title, date, media, city }) {
      const formatted = date
        ? new Date(date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : "No date";
      return {
        title,
        subtitle: `${formatted}${city ? ` · ${city}` : ""}`,
        media,
      };
    },
  },
});
