import { defineField, defineType } from 'sanity'

export const donateCause = defineType({
  name: 'donateCause',
  title: 'Donate Cause',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'description', type: 'text', rows: 2 }),
    defineField({ name: 'order', type: 'number', title: 'Display Order' }),
    defineField({ name: 'active', type: 'boolean', title: 'Show on site', initialValue: true }),
    defineField({ name: 'targetAmount', type: 'string', title: 'Target Amount (optional)', placeholder: 'e.g. PKR 100,000' }),
  ],
  preview: {
    select: { title: 'title', active: 'active' },
    prepare({ title, active }) {
      return { title, subtitle: active ? 'Active' : 'Hidden' }
    },
  },
})
