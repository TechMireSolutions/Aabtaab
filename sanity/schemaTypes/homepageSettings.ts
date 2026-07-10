import { defineField, defineType } from "sanity";

export const homepageSettings = defineType({
  name: "homepageSettings",
  title: "Homepage Settings",
  type: "document",
  fields: [
    defineField({
      name: "heroArabicText",
      type: "string",
      title: "Arabic Bismillah / Header Text",
      initialValue: "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ",
    }),
    defineField({
      name: "heroTitle",
      type: "string",
      title: "Hero Headline",
      initialValue: "AABTAAB",
    }),
    defineField({
      name: "heroSubtitle",
      type: "text",
      title: "Hero Subtitle",
      rows: 3,
    }),
    defineField({
      name: "heroImage",
      type: "image",
      title: "Hero Background Image",
      options: { hotspot: true },
    }),
    defineField({
      name: "heroBadgeText",
      type: "string",
      title: "Hero Badge Text",
      description: "Small badge above the headline (e.g. \"Enrolling Now\"). Leave empty to hide it.",
      initialValue: "Enrolling Now",
    }),
    defineField({
      name: "heroCta1Label",
      type: "string",
      title: "Primary CTA Label",
      initialValue: "Explore Courses",
    }),
    defineField({
      name: "heroCta1Link",
      type: "string",
      title: "Primary CTA Link",
      initialValue: "/online-courses",
    }),
    defineField({
      name: "heroCta2Label",
      type: "string",
      title: "Secondary CTA Label",
      initialValue: "Our Services",
    }),
    defineField({
      name: "heroCta2Link",
      type: "string",
      title: "Secondary CTA Link",
      initialValue: "/services",
    }),
    defineField({
      name: "servicesHeading",
      type: "string",
      title: "Services Section Heading",
      initialValue: "Our Services",
    }),
    defineField({
      name: "servicesSubheading",
      type: "string",
      title: "Services Section Subheading",
    }),
    defineField({
      name: "coursesHeading",
      type: "string",
      title: "Courses Section Heading",
      initialValue: "Online Courses",
    }),
    defineField({
      name: "coursesSubheading",
      type: "string",
      title: "Courses Section Subheading",
    }),
    defineField({
      name: "articlesHeading",
      type: "string",
      title: "Articles Section Heading",
      initialValue: "Latest Articles",
    }),
    defineField({
      name: "articlesSubheading",
      type: "string",
      title: "Articles Section Subheading",
    }),
    defineField({
      name: "donateHeading",
      type: "string",
      title: "Donate CTA Heading",
      initialValue: "Support Our Mission",
    }),
    defineField({
      name: "donateText",
      type: "text",
      title: "Donate CTA Text",
      rows: 2,
    }),
    defineField({
      name: "donateCtaLabel",
      type: "string",
      title: "Donate CTA Button Label",
      initialValue: "Donate Now",
    }),
    defineField({
      name: "donateQuote",
      type: "text",
      title: "Donate Quote",
      rows: 2,
      initialValue:
        "Sadaqah extinguishes the Lord's anger and wards off an evil death.",
    }),
    defineField({
      name: "donateQuoteAttribution",
      type: "string",
      title: "Donate Quote Attribution",
      initialValue: "Imam Sadiq (A.S.)",
    }),

    // ── About Us section ──────────────────────────────────────────────────────
    defineField({
      name: "aboutEyebrow",
      type: "string",
      title: "About — Eyebrow",
      initialValue: "Who We Are",
    }),
    defineField({
      name: "aboutHeading",
      type: "string",
      title: "About — Heading",
      initialValue:
        "Bringing Shia Islamic Knowledge to Every Corner of the World",
    }),
    defineField({
      name: "aboutBody1",
      type: "text",
      title: "About — Body Paragraph 1",
      rows: 3,
      initialValue:
        "Aabtaab was founded with a single purpose — to make authentic Shia Islamic education and religious services accessible to every Muslim, regardless of location or background.",
    }),
    defineField({
      name: "aboutBody2",
      type: "text",
      title: "About — Body Paragraph 2",
      rows: 3,
      initialValue:
        "Through online courses taught by qualified scholars, and services like Niyabat Ziarat and Ijara performed with sincerity, we proudly serve thousands of families across the globe.",
    }),
    defineField({
      name: "aboutPillars",
      type: "array",
      title: "About — Pillars / Tags",
      of: [{ type: "string" }],
      initialValue: ["Faith", "Knowledge", "Access", "Sincerity"],
    }),
    defineField({
      name: "aboutCtaLabel",
      type: "string",
      title: "About — CTA Button Label",
      initialValue: "Learn About Us",
    }),
    defineField({
      name: "aboutHadithArabic",
      type: "string",
      title: "About — Hadith (Arabic)",
      initialValue: "اُطْلُبُوا الْعِلْمَ مِنَ الْمَهْدِ إِلَى اللَّحْدِ",
    }),
    defineField({
      name: "aboutHadithTranslation",
      type: "string",
      title: "About — Hadith (English)",
      initialValue: "Seek knowledge from the cradle to the grave.",
    }),
    defineField({
      name: "aboutHadithAttribution",
      type: "string",
      title: "About — Hadith Attribution",
      initialValue: "Prophet Muhammad (S.A.W.W.)",
    }),
    defineField({
      name: "aboutStat1Value",
      type: "string",
      title: "About — Stat 1 Value",
      initialValue: "500+",
    }),
    defineField({
      name: "aboutStat1Label",
      type: "string",
      title: "About — Stat 1 Label",
      initialValue: "Students",
    }),
    defineField({
      name: "aboutStat2Value",
      type: "string",
      title: "About — Stat 2 Value",
      initialValue: "10+",
    }),
    defineField({
      name: "aboutStat2Label",
      type: "string",
      title: "About — Stat 2 Label",
      initialValue: "Scholars",
    }),
    defineField({
      name: "aboutStat3Value",
      type: "string",
      title: "About — Stat 3 Value",
      initialValue: "5+",
    }),
    defineField({
      name: "aboutStat3Label",
      type: "string",
      title: "About — Stat 3 Label",
      initialValue: "Countries",
    }),
    defineField({
      name: "aboutBadgeText",
      type: "string",
      title: "About — Badge Text",
      initialValue: "Qualified Scholars",
    }),
    defineField({
      name: "aboutBadgeSubtext",
      type: "string",
      title: "About — Badge Subtext",
      initialValue: "Certified & trusted",
    }),

    // ── Testimonials section ──────────────────────────────────────────────────
    defineField({
      name: "testimonialsEyebrow",
      type: "string",
      title: "Testimonials — Eyebrow",
      initialValue: "Community",
    }),
    defineField({
      name: "testimonialsHeading",
      type: "string",
      title: "Testimonials — Heading",
      initialValue: "What Our Community Says",
    }),
  ],
  preview: {
    prepare() {
      return { title: "Homepage Settings" };
    },
  },
});
