import { defineField, defineType } from 'sanity'

export const service = defineType({
  name: 'service',
  title: 'Service',
  type: 'document',
  groups: [
    { name: 'content',  title: 'Content'      },
    { name: 'sections', title: 'Page Sections' },
    { name: 'seo',      title: 'SEO'           },
  ],
  fields: [
    /* ── Identity ── */
    defineField({ name: 'title', type: 'string', validation: (r) => r.required(), group: 'content' }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'title' }, validation: (r) => r.required(), group: 'content' }),
    defineField({
      name: 'parent', type: 'reference', to: [{ type: 'service' }],
      description: 'Leave empty for top-level services.',
      group: 'content',
    }),
    defineField({ name: 'order', type: 'number', title: 'Display Order (among siblings)', group: 'content' }),

    /* ── Card content ── */
    defineField({ name: 'excerpt', type: 'text', title: 'Short Description (cards)', rows: 2, group: 'content' }),
    defineField({ name: 'icon', type: 'image', title: 'Card / Cover Image', options: { hotspot: true }, group: 'content' }),
    defineField({ name: 'isBookable', type: 'boolean', title: 'Can users request this service?', initialValue: false, group: 'content' }),
    defineField({ name: 'price', type: 'string', placeholder: 'e.g. Contact for pricing', group: 'content' }),

    /* ── Extra rich text (optional) ── */
    defineField({
      name: 'body', type: 'array', title: 'Additional Page Content (Rich Text)',
      of: [
        { type: 'block' },
        { type: 'image', options: { hotspot: true }, fields: [defineField({ name: 'alt', type: 'string' })] },
      ],
      group: 'content',
    }),

    /* ── FAQs ── */
    defineField({
      name: 'faq', type: 'array', title: 'FAQs',
      of: [{
        type: 'object', name: 'faqItem',
        fields: [
          defineField({ name: 'question', type: 'string', validation: (r) => r.required() }),
          defineField({ name: 'answer', type: 'array', of: [{ type: 'block' }] }),
        ],
        preview: { select: { title: 'question' } },
      }],
      group: 'content',
    }),

    /* ── 1. HERO ── */
    defineField({ name: 'heroImage',    type: 'image',  title: 'Hero — Background Image', options: { hotspot: true }, group: 'sections' }),
    defineField({ name: 'heroSubtitle', type: 'string', title: 'Hero — Bold Subtitle (e.g. "Your Sacred Duty, Simplified")', group: 'sections' }),
    defineField({ name: 'heroBody',     type: 'text',   title: 'Hero — Body Paragraph', rows: 3, group: 'sections' }),

    /* ── 2. WHY USE OUR PLATFORM ── */
    defineField({ name: 'whyUsHeading', type: 'string', title: '"Why Use Our Platform" — Heading', group: 'sections' }),
    defineField({ name: 'whyUsImage',   type: 'image',  title: '"Why Use Our Platform" — Left Side Image', options: { hotspot: true }, group: 'sections' }),
    defineField({
      name: 'whyUs', type: 'array', title: '"Why Use Our Platform" — Feature Points',
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'title', type: 'string', title: 'Bold Label (e.g. Dedicated Support)' }),
          defineField({ name: 'desc',  type: 'string', title: 'Description' }),
        ],
        preview: { select: { title: 'title', subtitle: 'desc' } },
      }],
      group: 'sections',
    }),

    /* ── 3. OUR COMMITMENT ── */
    defineField({ name: 'commitmentHeading', type: 'string', title: '"Our Commitment" — Heading', group: 'sections' }),
    defineField({
      name: 'commitment', type: 'array', title: '"Our Commitment" — Points',
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'title', type: 'string', title: 'Bold Label (e.g. Sacred Trust)' }),
          defineField({ name: 'desc',  type: 'string', title: 'Description' }),
        ],
        preview: { select: { title: 'title', subtitle: 'desc' } },
      }],
      group: 'sections',
    }),

    /* ── 4. HOW IT WORKS ── */
    defineField({ name: 'howItWorksHeading', type: 'string', title: '"How It Works" — Heading', group: 'sections' }),
    defineField({
      name: 'howItWorks', type: 'array', title: '"How It Works" — Steps',
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'label', type: 'string', title: 'Step Label (e.g. Reach Out)' }),
          defineField({ name: 'desc',  type: 'string', title: 'Step Description' }),
        ],
        preview: { select: { title: 'label', subtitle: 'desc' } },
      }],
      group: 'sections',
    }),

    /* ── 5. CTA BANNER ── */
    defineField({ name: 'ctaHeading',   type: 'string', title: 'CTA Banner — Heading',                  group: 'sections' }),
    defineField({ name: 'ctaSubtitle',  type: 'string', title: 'CTA Banner — Subtitle',                 group: 'sections' }),
    defineField({ name: 'ctaBtn1Label', type: 'string', title: 'CTA Banner — Button 1 Label',           group: 'sections' }),
    defineField({ name: 'ctaBtn2Label', type: 'string', title: 'CTA Banner — Button 2 (WhatsApp) Label', group: 'sections' }),

    /* ── FAQ section heading override ── */
    defineField({ name: 'faqSectionHeading', type: 'string', title: 'FAQ — Section Heading Override', group: 'sections' }),

    /* ── SEO ── */
    defineField({ name: 'seoTitle',       type: 'string', group: 'seo' }),
    defineField({ name: 'seoDescription', type: 'text', rows: 2, group: 'seo' }),
  ],
  preview: {
    select: { title: 'title', parent: 'parent.title', media: 'icon' },
    prepare({ title, parent, media }) {
      return { title, subtitle: parent ? `Under: ${parent}` : 'Top-level', media }
    },
  },
})
