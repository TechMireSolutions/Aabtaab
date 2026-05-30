import { defineField, defineType } from 'sanity'

export const service = defineType({
  name: 'service',
  title: 'Service',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'title' }, validation: (r) => r.required() }),
    defineField({
      name: 'parent',
      type: 'reference',
      to: [{ type: 'service' }],
      description: 'Leave empty for top-level services (Niyabat Ziarat, Zakat, etc.)',
    }),
    defineField({ name: 'description', type: 'array', of: [{ type: 'block' }] }),
    defineField({ name: 'icon', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'order', type: 'number', title: 'Display Order (among siblings)' }),
    defineField({ name: 'isBookable', type: 'boolean', title: 'Can users request this service?', initialValue: false }),
    defineField({ name: 'price', type: 'string', placeholder: 'e.g. Contact for pricing' }),
    defineField({ name: 'seoTitle', type: 'string', group: 'seo' }),
    defineField({ name: 'seoDescription', type: 'text', rows: 2, group: 'seo' }),
  ],
  groups: [{ name: 'seo', title: 'SEO' }],
  preview: {
    select: { title: 'title', parent: 'parent.title', media: 'icon' },
    prepare({ title, parent, media }) {
      return { title, subtitle: parent ? `Under: ${parent}` : 'Top-level', media }
    },
  },
})
