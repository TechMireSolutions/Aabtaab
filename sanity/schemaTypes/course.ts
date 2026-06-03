import { defineField, defineType } from 'sanity'

export const course = defineType({
  name: 'course',
  title: 'Online Course',
  type: 'document',
  groups: [
    { name: 'content',  title: 'Content'       },
    { name: 'sections', title: 'Page Sections'  },
    { name: 'seo',      title: 'SEO'            },
  ],
  fields: [
    /* ── Identity ── */
    defineField({ name: 'title', type: 'string', validation: (r) => r.required(), group: 'content' }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'title' }, validation: (r) => r.required(), group: 'content' }),
    defineField({
      name: 'parent', type: 'reference', to: [{ type: 'course' }],
      description: 'Leave empty for top-level subjects (Quran, Jurisprudence, etc.)',
      group: 'content',
    }),
    defineField({ name: 'order', type: 'number', title: 'Display Order', group: 'content' }),

    /* ── Optional metadata ── */
    defineField({
      name: 'subject', type: 'string', title: 'Subject Tag (optional)',
      options: {
        list: [
          { title: 'Quran',                value: 'quran' },
          { title: 'Nejul Balagha',        value: 'nejul-balagha' },
          { title: 'Jurisprudence (Fiqh)', value: 'jurisprudence' },
          { title: 'Ethics (Akhlaq)',      value: 'ethics' },
          { title: 'History',              value: 'history' },
        ],
      },
      group: 'content',
    }),

    /* ── Card content ── */
    defineField({ name: 'excerpt',       type: 'text',  title: 'Short Description (cards)', rows: 2,        group: 'content' }),
    defineField({ name: 'featuredImage', type: 'image', title: 'Card / Hero Image',          options: { hotspot: true }, group: 'content' }),

    /* ── Enrollment ── */
    defineField({ name: 'instructor',     type: 'string', title: 'Instructor Name',                                      group: 'content' }),
    defineField({ name: 'price',          type: 'string', placeholder: 'e.g. PKR 2,000/month or Free',                  group: 'content' }),
    defineField({ name: 'duration',       type: 'string', placeholder: 'e.g. 3 months',                                  group: 'content' }),
    defineField({ name: 'enrollmentLink', type: 'url',    title: 'Enrollment / Join Link',                               group: 'content' }),

    /* ── Rich text body ── */
    defineField({
      name: 'body', type: 'array', title: 'Additional Page Content (Rich Text)',
      of: [
        { type: 'block' },
        { type: 'image', options: { hotspot: true }, fields: [defineField({ name: 'alt', type: 'string' })] },
      ],
      group: 'content',
    }),

    /* ── FAQs ── */
    defineField({
      name: 'faq', type: 'array', title: 'FAQs',
      of: [{
        type: 'object', name: 'faqItem',
        fields: [
          defineField({ name: 'question', type: 'string', validation: (r) => r.required() }),
          defineField({ name: 'answer',   type: 'array', of: [{ type: 'block' }] }),
        ],
        preview: { select: { title: 'question' } },
      }],
      group: 'content',
    }),

    /* ── Hero ── */
    defineField({ name: 'heroSubtitle', type: 'string', title: 'Hero — Subtitle',         group: 'sections' }),
    defineField({ name: 'heroCtaLabel', type: 'string', title: 'Hero — CTA Button Label', group: 'sections' }),

    /* ── Overview ── */
    defineField({ name: 'overviewHeading', type: 'string', title: 'Overview — Heading',   group: 'sections' }),
    defineField({ name: 'overviewBody',    type: 'text',   title: 'Overview — Body Text', rows: 4, group: 'sections' }),

    /* ── What You'll Achieve ── */
    defineField({ name: 'outcomesHeading', type: 'string', title: '"What You\'ll Achieve" — Heading', group: 'sections' }),
    defineField({
      name: 'outcomes', type: 'array', title: 'Outcomes',
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'title', type: 'string' }),
          defineField({ name: 'desc',  type: 'string' }),
        ],
        preview: { select: { title: 'title', subtitle: 'desc' } },
      }],
      group: 'sections',
    }),

    /* ── Why Learn with Us ── */
    defineField({ name: 'whyUsHeading', type: 'string', title: '"Why Learn with Us" — Heading', group: 'sections' }),
    defineField({
      name: 'whyUs', type: 'array', title: '"Why Learn with Us" — Points',
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'title', type: 'string' }),
          defineField({ name: 'desc',  type: 'string' }),
        ],
        preview: { select: { title: 'title', subtitle: 'desc' } },
      }],
      group: 'sections',
    }),

    /* ── How It Works ── */
    defineField({ name: 'howItWorksHeading', type: 'string', title: '"How It Works" — Heading', group: 'sections' }),
    defineField({
      name: 'howItWorks', type: 'array', title: '"How It Works" — Steps',
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'label', type: 'string', title: 'Step Label (e.g. Sign Up)' }),
          defineField({ name: 'desc',  type: 'string', title: 'Step Description' }),
        ],
        preview: { select: { title: 'label', subtitle: 'desc' } },
      }],
      group: 'sections',
    }),

    /* ── Pricing Plans ── */
    defineField({ name: 'pricingHeading', type: 'string', title: 'Pricing — Section Heading', group: 'sections' }),
    defineField({
      name: 'pricingTables', type: 'array', title: 'Pricing — Tables',
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'label', type: 'string', title: 'Table Label (e.g. National Students — PKR)' }),
          defineField({
            name: 'rows', type: 'array', title: 'Rows',
            of: [{
              type: 'object',
              fields: [
                defineField({ name: 'plan',            type: 'string', title: 'Study Plan' }),
                defineField({ name: 'weeklyFrequency', type: 'string', title: 'Weekly Frequency' }),
                defineField({ name: 'monthlyClasses',  type: 'string', title: 'Monthly Classes' }),
                defineField({ name: 'feePerClass',     type: 'string', title: 'Fee Per Class' }),
                defineField({ name: 'monthlyTotal',    type: 'string', title: 'Monthly Total' }),
              ],
              preview: { select: { title: 'plan', subtitle: 'monthlyTotal' } },
            }],
          }),
        ],
        preview: { select: { title: 'label' } },
      }],
      group: 'sections',
    }),

    /* ── CTA Banner ── */
    defineField({ name: 'ctaHeading',   type: 'string', title: 'CTA Banner — Heading',                group: 'sections' }),
    defineField({ name: 'ctaSubtitle',  type: 'string', title: 'CTA Banner — Subtitle',               group: 'sections' }),
    defineField({ name: 'ctaBtn1Label', type: 'string', title: 'CTA Banner — Button 1 Label',         group: 'sections' }),
    defineField({ name: 'ctaBtn2Label', type: 'string', title: 'CTA Banner — Button 2 (WhatsApp) Label', group: 'sections' }),

    /* ── Our Promise ── */
    defineField({ name: 'promiseHeading', type: 'string', title: '"Our Promise" — Heading',   group: 'sections' }),
    defineField({ name: 'promiseBody',    type: 'text',   title: '"Our Promise" — Body Text', rows: 3, group: 'sections' }),

    /* ── FAQ section heading override ── */
    defineField({ name: 'faqSectionHeading', type: 'string', title: 'FAQ — Section Heading (overrides global)', group: 'sections' }),

    /* ── SEO ── */
    defineField({ name: 'seoTitle',       type: 'string', group: 'seo' }),
    defineField({ name: 'seoDescription', type: 'text', rows: 2, group: 'seo' }),
  ],
  preview: {
    select: { title: 'title', parent: 'parent.title', media: 'featuredImage' },
    prepare({ title, parent, media }) {
      return { title, subtitle: parent ? `Under: ${parent}` : 'Top-level', media }
    },
  },
})
