import { defineField, defineType } from "sanity";

export const testimonial = defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  fields: [
    defineField({
      name: "status",
      type: "string",
      title: "Status",
      options: {
        list: [
          { title: "Pending", value: "pending" },
          { title: "Approved", value: "approved" },
        ],
        layout: "radio",
      },
      initialValue: "pending",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "quote",
      type: "text",
      title: "Quote",
      rows: 3,
      validation: (r) => r.required(),
    }),
    defineField({
      name: "name",
      type: "string",
      title: "Name",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "role",
      type: "string",
      title: 'Role / Location (e.g. "Quran Student, UK")',
    }),
    defineField({
      name: "rating",
      type: "number",
      title: "Rating (1-5 stars)",
      initialValue: 5,
      validation: (r) => r.min(1).max(5).integer(),
    }),
    defineField({
      name: "order",
      type: "number",
      title: "Display Order",
      initialValue: 0,
    }),
  ],
  orderings: [
    {
      title: "Order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "name", subtitle: "role" },
  },
});
