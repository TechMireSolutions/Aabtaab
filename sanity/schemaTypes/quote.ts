import { defineField, defineType } from "sanity";

export const quote = defineType({
  name: "quote",
  title: "Inspiration Quotes (Quran / Hadith)",
  type: "document",
  fields: [
    defineField({ name: "arabic", type: "string", title: "Arabic Text" }),
    defineField({ name: "translation", type: "text", title: "Translation" }),
    defineField({ 
      name: "attribution", 
      type: "string", 
      title: "Attribution", 
      description: "e.g., Prophet Muhammad (S.A.W.W.) or Surah Al-Baqarah" 
    }),
    defineField({ 
      name: "reference", 
      type: "string", 
      title: "Reference", 
      description: "e.g., Bihar al-Anwar, Vol 1, Page 22 or Quran 2:255" 
    }),
  ],
  preview: {
    select: { title: "attribution", subtitle: "translation" },
  },
});
