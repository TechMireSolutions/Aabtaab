import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({ name: "siteName", type: "string", initialValue: "Aabtaab" }),
    defineField({ name: "logo", type: "image", options: { hotspot: true } }),
    defineField({
      name: "favicon",
      type: "image",
      title: "Favicon",
      description: "Square image recommended — 256×256 or 512×512 PNG/ICO",
    }),
    defineField({ name: "tagline", type: "string" }),
    defineField({
      name: "description",
      type: "text",
      rows: 3,
      title: "Site Meta Description",
    }),
    defineField({ name: "email", type: "string" }),
    defineField({ name: "phone", type: "string" }),
    defineField({ name: "address", type: "text", rows: 3 }),
    defineField({ name: "facebook", type: "url" }),
    defineField({ name: "youtube", type: "url" }),
    defineField({ name: "whatsapp", type: "string", title: "WhatsApp Number" }),
    defineField({
      name: "darulQuranUrl",
      type: "url",
      title: "Dar Ul Quran Website URL",
    }),
    defineField({
      name: "donateUrl",
      type: "url",
      title: "Donate / Payment Link",
    }),

    // ── Shared UI labels ──────────────────────────────────────────────────────
    defineField({
      name: "searchPlaceholder",
      type: "string",
      title: "Search Placeholder Text",
      initialValue: "Search articles…",
    }),
    defineField({
      name: "faqHeading",
      type: "string",
      title: "FAQ Section Heading",
      initialValue: "Frequently Asked Questions",
    }),
    defineField({
      name: "serviceBookCtaLabel",
      type: "string",
      title: "Service — Book CTA Label",
      initialValue: "Book This Service",
    }),
    defineField({
      name: "serviceAllCtaLabel",
      type: "string",
      title: "Service — Back Link Label",
      initialValue: "All Services",
    }),
    defineField({
      name: "courseEnrollCtaLabel",
      type: "string",
      title: "Course — Enroll CTA Label",
      initialValue: "Enroll Now",
    }),
    defineField({
      name: "courseAllCtaLabel",
      type: "string",
      title: "Course — Back Link Label",
      initialValue: "All Courses",
    }),
    defineField({
      name: "courseInstructorLabel",
      type: "string",
      title: 'Course — "Instructor" Label',
      initialValue: "Instructor",
    }),

    // ── Contact page content ──────────────────────────────────────────────────
    defineField({
      name: "contactFormSubjects",
      type: "array",
      title: "Contact — Form Subject Options",
      of: [{ type: "string" }],
      initialValue: [
        "General Inquiry",
        "Course Enrollment",
        "Service Request",
        "Donation",
      ],
    }),
    defineField({
      name: "contactFormSubmitLabel",
      type: "string",
      title: "Contact — Submit Button Label",
      initialValue: "Send Message",
    }),

    // ── Donate page content ───────────────────────────────────────────────────
    defineField({
      name: "donateArabicVerse",
      type: "string",
      title: "Donate — Arabic Verse",
      initialValue: "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ",
    }),
    defineField({
      name: "donateHowToHeading",
      type: "string",
      title: 'Donate — "How to Donate" Heading',
      initialValue: "How to Donate",
    }),
    defineField({
      name: "donateHowToText",
      type: "text",
      title: 'Donate — "How to Donate" Body',
      rows: 2,
      initialValue:
        "Contact us for bank transfer details or use the online payment link below.",
    }),
    defineField({
      name: "donateClosingMessage",
      type: "string",
      title: "Donate — Closing Message",
      initialValue: "Jazakallah Khair — May Allah (SWT) accept your donations.",
    }),
    defineField({
      name: "donatePayOnlineLabel",
      type: "string",
      title: 'Donate — "Pay Online" Button Label',
      initialValue: "Pay Online",
    }),
    defineField({
      name: "donateContactLabel",
      type: "string",
      title: 'Donate — "Contact Us" Button Label',
      initialValue: "Contact Us",
    }),
    defineField({
      name: "donateCauses",
      type: "array",
      title: "Donate — Cause Cards",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "title",
              type: "string",
              title: "Cause Title",
            }),
            defineField({
              name: "desc",
              type: "string",
              title: "Cause Description",
            }),
          ],
        },
      ],
      initialValue: [
        {
          title: "General Donation",
          desc: "Support the overall mission of Aabtaab",
        },
        {
          title: "Quran Education",
          desc: "Fund free Quran classes for children",
        },
        {
          title: "Muharram Programs",
          desc: "Help organise Majalis and Aza events",
        },
        {
          title: "Dar Ul Quran Support",
          desc: "Contribute to our sister Quranic institute",
        },
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: "Site Settings" };
    },
  },
});
