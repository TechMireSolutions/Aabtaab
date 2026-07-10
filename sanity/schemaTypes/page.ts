import { defineField, defineType } from "sanity";

export const page = defineType({
  name: "page",
  title: "Page",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (r) => r.required(),
      group: "content",
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title" },
      validation: (r) => r.required(),
      group: "content",
    }),
    defineField({
      name: "eyebrow",
      type: "string",
      title: "Eyebrow Label",
      description:
        'Small label shown above the page title (e.g. "Our Story", "Knowledge")',
      group: "content",
    }),
    defineField({
      name: "subtitle",
      type: "string",
      title: "Subtitle / Description",
      description: "Short description shown below the page title",
      group: "content",
    }),
    defineField({
      name: "body",
      type: "array",
      group: "content",
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
      name: "seo",
      type: "seoObject",
      title: "SEO Settings",
      group: "seo",
    }),
  ],
});
