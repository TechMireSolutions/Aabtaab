import { defineField, defineType } from "sanity";
import { GraduationCap } from "lucide-react";

export const scholar = defineType({
  name: "scholar",
  title: "Scholars",
  type: "document",
  icon: GraduationCap,
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "qualifications",
      title: "Qualifications",
      type: "array",
      of: [{ type: "string" }],
      description: "e.g., 'Ph.D. in Islamic Studies', 'Hawza Graduate'",
    }),
    defineField({
      name: "contactDetails",
      title: "Contact Details",
      type: "string",
      description: "Optional email or public contact link",
    }),
    defineField({
      name: "bio",
      title: "Bio",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      initialValue: 0,
    }),
  ],
  preview: {
    select: { title: "name", media: "image" },
  },
});
