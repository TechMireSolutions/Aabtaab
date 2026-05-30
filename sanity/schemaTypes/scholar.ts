import { defineField, defineType } from 'sanity'

export const scholar = defineType({
  name: 'scholar',
  title: 'Scholar / Speaker',
  type: 'document',
  fields: [
    defineField({ name: 'name', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'name' } }),
    defineField({ name: 'image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'title', type: 'string', title: 'Title / Designation', placeholder: 'e.g. Allama, Maulana' }),
    defineField({ name: 'bio', type: 'array', of: [{ type: 'block' }] }),
    defineField({ name: 'languages', type: 'array', of: [{ type: 'string' }], options: {
      list: ['Urdu', 'Arabic', 'English', 'Farsi', 'Punjabi'],
    }}),
  ],
  preview: {
    select: { title: 'name', subtitle: 'title', media: 'image' },
  },
})
