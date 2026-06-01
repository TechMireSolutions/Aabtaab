import { defineField, defineType } from 'sanity'

export const course = defineType({
  name: 'course',
  title: 'Online Course',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content' },
    { name: 'seo',     title: 'SEO'     },
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

    /* ── Optional metadata (for filtering/display) ── */
    defineField({
      name: 'subject', type: 'string', title: 'Subject Tag (optional)',
      description: 'Used for filtering. Set on top-level subjects.',
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
    defineField({ name: 'excerpt', type: 'text', title: 'Short Description (used on cards)', rows: 2, group: 'content' }),
    defineField({ name: 'featuredImage', type: 'image', title: 'Card / Cover Image', options: { hotspot: true }, group: 'content' }),

    /* ── Single page content ── */
    defineField({
      name: 'body', type: 'array', title: 'Full Page Content',
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
        type: 'object',
        name: 'faqItem',
        fields: [
          defineField({ name: 'question', type: 'string', validation: (r) => r.required() }),
          defineField({ name: 'answer', type: 'array', of: [{ type: 'block' }] }),
        ],
        preview: { select: { title: 'question' } },
      }],
      group: 'content',
    }),

    /* ── Enrollment ── */
    defineField({ name: 'instructor',      type: 'string', title: 'Instructor Name',   group: 'content' }),
    defineField({ name: 'price',           type: 'string', placeholder: 'e.g. PKR 2,000/month or Free', group: 'content' }),
    defineField({ name: 'duration',        type: 'string', placeholder: 'e.g. 3 months', group: 'content' }),
    defineField({ name: 'enrollmentLink',  type: 'url',    title: 'Enrollment Link',   group: 'content' }),

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
