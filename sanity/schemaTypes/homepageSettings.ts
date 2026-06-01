import { defineField, defineType } from 'sanity'

export const homepageSettings = defineType({
  name: 'homepageSettings',
  title: 'Homepage Settings',
  type: 'document',
  fields: [
    defineField({ name: 'heroArabicText', type: 'string', title: 'Arabic Bismillah / Header Text', initialValue: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ' }),
    defineField({ name: 'heroTitle', type: 'string', title: 'Hero Headline', initialValue: 'AABTAAB' }),
    defineField({ name: 'heroSubtitle', type: 'text', title: 'Hero Subtitle', rows: 3 }),
    defineField({ name: 'heroImage', type: 'image', title: 'Hero Background Image', options: { hotspot: true } }),
    defineField({ name: 'heroCta1Label', type: 'string', title: 'Primary CTA Label', initialValue: 'Explore Courses' }),
    defineField({ name: 'heroCta1Link', type: 'string', title: 'Primary CTA Link', initialValue: '/online-courses' }),
    defineField({ name: 'heroCta2Label', type: 'string', title: 'Secondary CTA Label', initialValue: 'Our Services' }),
    defineField({ name: 'heroCta2Link', type: 'string', title: 'Secondary CTA Link', initialValue: '/services' }),
    defineField({ name: 'servicesHeading', type: 'string', title: 'Services Section Heading', initialValue: 'Our Services' }),
    defineField({ name: 'servicesSubheading', type: 'string', title: 'Services Section Subheading' }),
    defineField({ name: 'coursesHeading', type: 'string', title: 'Courses Section Heading', initialValue: 'Online Courses' }),
    defineField({ name: 'coursesSubheading', type: 'string', title: 'Courses Section Subheading' }),
    defineField({ name: 'articlesHeading', type: 'string', title: 'Articles Section Heading', initialValue: 'Latest Articles' }),
    defineField({ name: 'articlesSubheading', type: 'string', title: 'Articles Section Subheading' }),
    defineField({ name: 'donateHeading', type: 'string', title: 'Donate CTA Heading', initialValue: 'Support Our Mission' }),
    defineField({ name: 'donateText', type: 'text', title: 'Donate CTA Text', rows: 2 }),
    defineField({ name: 'donateCtaLabel', type: 'string', title: 'Donate CTA Button Label', initialValue: 'Donate Now' }),
  ],
  preview: {
    prepare() {
      return { title: 'Homepage Settings' }
    },
  },
})
