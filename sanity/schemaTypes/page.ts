import { defineField, defineType } from 'sanity'

export const page = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  fields: [
    defineField({ name: 'title',    type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'slug',     type: 'slug', options: { source: 'title' }, validation: (r) => r.required() }),
    defineField({ name: 'eyebrow',  type: 'string', title: 'Eyebrow Label', description: 'Small label shown above the page title (e.g. "Our Story", "Knowledge")' }),
    defineField({ name: 'subtitle', type: 'string', title: 'Subtitle / Description', description: 'Short description shown below the page title' }),
    defineField({
      name: 'body', type: 'array',
      of: [
        { type: 'block' },
        { type: 'image', options: { hotspot: true }, fields: [defineField({ name: 'alt', type: 'string' })] },
      ],
    }),
    defineField({ name: 'seoTitle', type: 'string' }),
    defineField({ name: 'seoDescription', type: 'text', rows: 2 }),
  ],
})
