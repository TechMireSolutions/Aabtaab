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
      title: "PDF File",
      options: { accept: ".pdf" },
    }),
    defineField({
      name: "description",
      type: "text",
      title: "Short Description",
    }),
  ],
});
