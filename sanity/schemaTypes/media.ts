import { defineField, defineType } from 'sanity'

export const media = defineType({
  name: 'media',
  title: 'Media (Nauhay / Bayan / Audio)',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'title' } }),
    defineField({ name: 'type', type: 'string', options: {
      list: [
        { title: 'Nauha', value: 'nauha' },
        { title: 'Marsiya', value: 'marsiya' },
        { title: 'Bayan / Lecture', value: 'bayan' },
        { title: 'Dua', value: 'dua' },
        { title: 'Quran Recitation', value: 'quran' },
      ],
      layout: 'radio',
    }, validation: (r) => r.required() }),
    defineField({ name: 'reciter', type: 'reference', to: [{ type: 'scholar' }], title: 'Reciter / Speaker' }),
    defineField({ name: 'language', type: 'string', options: {
      list: ['Urdu', 'Arabic', 'English', 'Farsi', 'Punjabi'],
    }}),
    defineField({ name: 'audioUrl', type: 'url', title: 'Audio URL (SoundCloud / direct link)' }),
    defineField({ name: 'videoUrl', type: 'url', title: 'Video URL (YouTube / Vimeo)' }),
    defineField({ name: 'coverImage', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'publishedAt', type: 'datetime' }),
    defineField({ name: 'occasion', type: 'string', title: 'Occasion', placeholder: 'e.g. Muharram 1446' }),
  ],
  preview: {
    select: { title: 'title', type: 'type', media: 'coverImage' },
    prepare({ title, type, media }) {
      return { title, subtitle: type, media }
    },
  },
})
