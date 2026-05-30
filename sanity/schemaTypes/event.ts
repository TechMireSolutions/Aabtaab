import { defineField, defineType } from 'sanity'

export const event = defineType({
  name: 'event',
  title: 'Event / Majlis',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'title' } }),
    defineField({ name: 'eventDate', type: 'datetime', title: 'Date & Time', validation: (r) => r.required() }),
    defineField({ name: 'location', type: 'string', title: 'Location' }),
    defineField({ name: 'topic', type: 'string', title: 'Topic' }),
    defineField({ name: 'speaker', type: 'reference', to: [{ type: 'scholar' }] }),
    defineField({ name: 'description', type: 'array', of: [{ type: 'block' }] }),
    defineField({ name: 'image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'isOnline', type: 'boolean', title: 'Online Event', initialValue: false }),
    defineField({ name: 'streamLink', type: 'url', title: 'Stream Link (if online)' }),
  ],
  preview: {
    select: { title: 'title', date: 'eventDate', media: 'image' },
    prepare({ title, date, media }) {
      return {
        title,
        subtitle: date ? new Date(date).toLocaleDateString('en-PK') : '',
        media,
      }
    },
  },
})
