import { defineField, defineType } from "sanity";

// Reusable SEO object — embed in any document via { type: 'seoObject' }
// Covers: meta tags, OpenGraph, canonical, indexing control, and focus keywords
export const seoObject = defineType({
  name: "seoObject",
  title: "SEO",
  type: "object",
  fields: [
    defineField({
      name: "metaTitle",
      type: "string",
      title: "Meta Title",
      description:
        "Ideal: 50–60 characters. Shown as the browser tab title and search headline.",
      validation: (r) =>
        r.max(60).warning("Keep under 60 characters for full display in SERPs"),
    }),
    defineField({
      name: "metaDescription",
      type: "text",
      title: "Meta Description",
      rows: 3,
      description:
        "Ideal: 150–160 characters. This text appears under your title in search results.",
      validation: (r) => r.max(160).warning("Keep under 160 characters"),
    }),
    defineField({
      name: "ogImage",
      type: "image",
      title: "OpenGraph / Social Share Image",
      description:
        "Recommended: 1200 × 630 px. Used when the page is shared on social media.",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          type: "string",
          title: "Alt text for the OG image",
        }),
      ],
    }),
    defineField({
      name: "canonicalUrl",
      type: "url",
      title: "Canonical URL",
      description:
        "Leave blank to default to the page URL. Use only to point to a preferred duplicate.",
    }),
    defineField({
      name: "noIndex",
      type: "boolean",
      title: "Hide from search engines (noindex)",
      description:
        "Enable only for drafts, thank-you pages, or duplicate content.",
      initialValue: false,
    }),
    defineField({
      name: "keywords",
      type: "array",
      title: "Focus Keywords",
      description:
        "Primary and secondary keywords — used for editorial guidance, not meta keywords tag.",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
  ],
  preview: {
    select: { title: "metaTitle" },
    prepare({ title }) {
      return { title: title || "(No meta title set)" };
    },
  },
});
