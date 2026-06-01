import { defineField, defineType } from 'sanity'

export const service = defineType({
  name: 'service',
  title: 'Service',
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
      name: 'parent', type: 'reference', to: [{ type: 'service' }],
      description: 'Leave empty for top-level services (Niyabat Ziarat, Zakat, etc.)',
      group: 'content',
    }),
    defineField({ name: 'order', type: 'number', title: 'Display Order (among siblings)', group: 'content' }),

    /* ── Card content ── */
    defineField({
      name: 'excerpt', type: 'text', title: 'Short Description (used on cards)',
      rows: 2, group: 'content',
    }),
    defineField({ name: 'icon', type: 'image', title: 'Card / Cover Image', options: { hotspot: true }, group: 'content' }),

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

    /* ── Booking ── */
    defineField({ name: 'isBookable', type: 'boolean', title: 'Can users request this service?', initialValue: false, group: 'content' }),
    defineField({ name: 'price', type: 'string', placeholder: 'e.g. Contact for pricing', group: 'content' }),

    /* ── SEO ── */
    defineField({ name: 'seoTitle',       type: 'string', group: 'seo' }),
    defineField({ name: 'seoDescription', type: 'text', rows: 2, group: 'seo' }),
  ],
  preview: {
    select: { title: 'title', parent: 'parent.title', media: 'icon' },
    prepare({ title, parent, media }) {
      return { title, subtitle: parent ? `Under: ${parent}` : 'Top-level', media }
    },
  },
})
