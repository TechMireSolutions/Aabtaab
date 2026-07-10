import { defineField, defineType } from "sanity";

export const post = defineType({
  name: "post",
  title: "Article",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "faqs", title: "FAQs" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    // ── Core content ─────────────────────────────────────────────────────────
    defineField({
      name: "title",
      type: "string",
      title: "Title",
      group: "content",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      title: "Slug",
      group: "content",
      options: { source: "title" },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "author",
      type: "reference",
      title: "Author",
      group: "content",
      to: [{ type: "author" }],
    }),
    defineField({
      name: "mainImage",
      type: "image",
      title: "Main Image",
      group: "content",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          type: "string",
          title: "Alt text",
          description:
            "Describe the image for screen readers and search engines.",
          validation: (r) => r.required(),
        }),
      ],
    }),
    defineField({
      name: "categories",
      type: "array",
      title: "Categories",
      group: "content",
      of: [{ type: "reference", to: { type: "category" } }],
    }),
    defineField({
      name: "publishedAt",
      type: "datetime",
      title: "Published At",
      group: "content",
    }),
    defineField({
      name: "excerpt",
      type: "text",
      title: "Excerpt",
      group: "content",
      rows: 3,
      description: "Used as fallback meta description and in article cards.",
    }),
    defineField({
      name: "featured",
      type: "boolean",
      title: "Featured Article",
      group: "content",
      initialValue: false,
    }),
    defineField({
      name: "body",
      type: "array",
      title: "Body",
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
              title: "Alt text",
              validation: (r) => r.required(),
            }),
          ],
        },
      ],
    }),

    // ── FAQs — each item outputs FAQ JSON-LD → feeds Google AI Overviews ─────
    defineField({
      name: "faqItems",
      type: "array",
      title: "FAQ Items",
      group: "faqs",
      description:
        "Each Q&A pair is rendered as FAQ structured data, boosting eligibility for Google AI Overviews and People Also Ask boxes.",
      of: [
        {
          type: "object",
          name: "faqItem",
          title: "FAQ Item",
          fields: [
            defineField({
              name: "question",
              type: "string",
              title: "Question",
              validation: (r) => r.required(),
            }),
            defineField({
              name: "answer",
              type: "text",
              title: "Answer",
              rows: 4,
              validation: (r) => r.required(),
            }),
          ],
          preview: {
            select: { title: "question" },
            prepare({ title }) {
              return { title };
            },
          },
        },
      ],
    }),

    // ── SEO — replaces flat seoTitle / seoDescription fields ─────────────────
    defineField({
      name: "seo",
      type: "seoObject",
      title: "SEO Settings",
      group: "seo",
    }),
  ],
  preview: {
    select: { title: "title", author: "author.name", media: "mainImage" },
    prepare({ title, author, media }) {
      return { title, subtitle: author ? `by ${author}` : "", media };
    },
  },
});
