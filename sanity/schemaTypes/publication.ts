import { defineField, defineType } from "sanity";

export const publication = defineType({
  name: "publication",
  title: "Publication (eBook/PDF)",
  type: "document",
  groups: [
    { name: "details", title: "Details", default: true },
    { name: "file", title: "File / PDF" },
    { name: "content", title: "Content" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "title",
      type: "string",
      group: "details",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      group: "details",
      options: { source: "title" },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "author",
      type: "string",
      title: "Author / Scholar / Compiler",
      group: "details",
      description: "Name of the author, compiler, or translator.",
    }),
    defineField({
      name: "coverImage",
      type: "image",
      title: "Cover Image",
      group: "details",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          type: "string",
          title: "Alt Text",
          description: "Describe the cover image for screen readers and search engines.",
        }),
      ],
    }),
    defineField({
      name: "language",
      type: "string",
      title: "Language",
      group: "details",
      description: "e.g. English, Urdu, Arabic",
    }),
    defineField({
      name: "pages",
      type: "number",
      title: "Number of Pages",
      group: "details",
    }),
    defineField({
      name: "publishedYear",
      type: "string",
      title: "Publication Year or Date",
      group: "details",
      description: "e.g. 2024 or 1445 AH",
    }),
    defineField({
      name: "description",
      type: "text",
      title: "Short Description / Excerpt",
      group: "details",
      rows: 3,
    }),
    defineField({
      name: "file",
      type: "file",
      title: "PDF File (Upload)",
      group: "file",
      options: { accept: ".pdf" },
      description: "Upload a PDF file directly from your computer.",
    }),
    defineField({
      name: "pdfUrl",
      type: "url",
      title: "PDF File (Direct Link)",
      group: "file",
      description: "Alternatively, paste a direct link to a PDF (e.g., from Google Drive). If both are provided, the direct link may take precedence depending on the frontend implementation.",
    }),
    defineField({
      name: "body",
      type: "array",
      title: "Detailed Description / Table of Contents",
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
  preview: {
    select: { title: "title", author: "author", media: "coverImage" },
    prepare({ title, author, media }) {
      return {
        title,
        subtitle: author ? `By ${author}` : "Publication",
        media,
      };
    },
  },
});

