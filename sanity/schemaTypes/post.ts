import { defineField, defineType } from 'sanity'

export const post = defineType({
  name: 'post',
  title: 'Article',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', title: 'Title', validation: (r) => r.required() }),
    defineField({ name: 'slug', type: 'slug', title: 'Slug', options: { source: 'title' }, validation: (r) => r.required() }),
    defineField({ name: 'author', type: 'reference', to: [{ type: 'author' }] }),
    defineField({
      name: 'mainImage', type: 'image', title: 'Main Image',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', type: 'string', title: 'Alt text' })],
    }),
    defineField({ name: 'categories', type: 'array', of: [{ type: 'reference', to: { type: 'category' } }] }),
    defineField({ name: 'publishedAt', type: 'datetime', title: 'Published At' }),
    defineField({ name: 'excerpt', type: 'text', title: 'Excerpt', rows: 3 }),
    defineField({ name: 'featured', type: 'boolean', title: 'Featured Article', initialValue: false }),
    defineField({
      name: 'body', type: 'array', title: 'Body',
      of: [
        { type: 'block' },
        { type: 'image', options: { hotspot: true }, fields: [defineField({ name: 'alt', type: 'string' })] },
      ],
    }),
    defineField({ name: 'seoTitle', type: 'string', title: 'SEO Title', group: 'seo' }),
    defineField({ name: 'seoDescription', type: 'text', title: 'SEO Description', rows: 2, group: 'seo' }),
  ],
  groups: [{ name: 'seo', title: 'SEO' }],
  preview: {
    select: { title: 'title', author: 'author.name', media: 'mainImage' },
    prepare({ title, author, media }) {
      return { title, subtitle: author ? `by ${author}` : '', media }
    },
  },
})
