import { defineField, defineType } from "sanity";

export const publication = defineType({
  name: "publication",
  title: "Publication (eBook/PDF)",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title" },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "coverImage",
      type: "image",
      title: "Cover Image",
      options: { hotspot: true },
    }),
    defineField({
      name: "file",
      type: "file",
      title: "PDF File (Upload)",
      options: { accept: ".pdf" },
      description: "Upload a PDF file directly from your computer.",
    }),
    defineField({
      name: "pdfUrl",
      type: "url",
      title: "PDF File (Direct Link)",
      description: "Alternatively, paste a direct link to a PDF (e.g., from Google Drive). If both are provided, the direct link may take precedence depending on the frontend implementation.",
    }),
    defineField({
      name: "description",
      type: "text",
      title: "Short Description",
    }),
  ],
});
