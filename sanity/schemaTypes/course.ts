import { defineField, defineType } from 'sanity'

export const course = defineType({
  name: 'course',
  title: 'Online Course',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'title' }, validation: (r) => r.required() }),
    defineField({ name: 'subject', type: 'string', title: 'Subject', options: {
      list: [
        { title: 'Quran',                   value: 'quran' },
        { title: 'Nejul Balagha',           value: 'nejul-balagha' },
        { title: 'Jurisprudence (Fiqh)',    value: 'jurisprudence' },
        { title: 'Ethics (Akhlaq)',         value: 'ethics' },
        { title: 'History',                 value: 'history' },
      ],
    }, validation: (r) => r.required() }),
    defineField({
      name: 'quranType', type: 'string', title: 'Quran Course Type',
      description: 'Only for Quran subject',
      options: {
        list: [
          { title: 'Hifz',    value: 'hifz' },
          { title: 'Nazra',   value: 'nazra' },
          { title: 'Tajweed', value: 'tajweed' },
          { title: 'Qarat',   value: 'qarat' },
        ],
      },
      hidden: ({ document }) => document?.subject !== 'quran',
    }),
    defineField({ name: 'description', type: 'array', of: [{ type: 'block' }] }),
    defineField({ name: 'instructor', type: 'string', title: 'Instructor Name' }),
    defineField({ name: 'featuredImage', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'price', type: 'string', placeholder: 'e.g. PKR 2,000/month or Free' }),
    defineField({ name: 'duration', type: 'string', placeholder: 'e.g. 3 months' }),
    defineField({ name: 'enrollmentLink', type: 'url', title: 'Enrollment Link' }),
    defineField({ name: 'order', type: 'number', title: 'Display Order' }),
  ],
  preview: {
    select: { title: 'title', subject: 'subject', media: 'featuredImage' },
    prepare({ title, subject, media }) {
      return { title, subtitle: subject, media }
    },
  },
})
