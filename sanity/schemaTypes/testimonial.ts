import { defineField, defineType } from 'sanity'

export const testimonial = defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  fields: [
    defineField({ name: 'quote', type: 'text', title: 'Quote', rows: 3, validation: r => r.required() }),
    defineField({ name: 'name',  type: 'string', title: 'Name', validation: r => r.required() }),
    defineField({ name: 'role',  type: 'string', title: 'Role / Location (e.g. "Quran Student, UK")' }),
    defineField({ name: 'order', type: 'number', title: 'Display Order', initialValue: 0 }),
  ],
  orderings: [{ title: 'Order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
  preview: {
    select: { title: 'name', subtitle: 'role' },
  },
})
