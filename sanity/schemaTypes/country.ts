import { defineField, defineType } from "sanity";
import { Globe } from "lucide-react";

export const country = defineType({
  name: "country",
  title: "Countries",
  type: "document",
  icon: Globe,
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "flagImage",
      title: "Flag Image (Recommended)",
      type: "image",
      description: "Upload a clean SVG or PNG of the country's flag.",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "flagIcon",
      title: "Flag Icon (Emoji or Text Fallback)",
      type: "string",
      description: "Paste a flag emoji (e.g. 🇺🇸, 🇵🇰) or short text if you don't have an image.",
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      initialValue: 0,
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "flagIcon" },
  },
});
