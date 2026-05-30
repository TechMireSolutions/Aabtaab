import { defineField, defineType } from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({ name: 'siteName', type: 'string', initialValue: 'Aabtaab' }),
    defineField({ name: 'logo', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'tagline', type: 'string' }),
    defineField({ name: 'description', type: 'text', rows: 3, title: 'Site Meta Description' }),
    defineField({ name: 'email', type: 'string' }),
    defineField({ name: 'phone', type: 'string' }),
    defineField({ name: 'address', type: 'text', rows: 3 }),
    defineField({ name: 'facebook', type: 'url' }),
    defineField({ name: 'youtube', type: 'url' }),
    defineField({ name: 'whatsapp', type: 'string', title: 'WhatsApp Number' }),
    defineField({ name: 'darulQuranUrl', type: 'url', title: 'Dar Ul Quran Website URL' }),
    defineField({ name: 'donateUrl', type: 'url', title: 'Donate / Payment Link' }),
  ],
  preview: {
    prepare() {
      return { title: 'Site Settings' }
    },
  },
})
