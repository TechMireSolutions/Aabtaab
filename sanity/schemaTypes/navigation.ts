import { defineField, defineType } from 'sanity'

export const navigation = defineType({
  name: 'navigation',
  title: 'Navigation',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', title: 'Nav Location', options: {
      list: [
        { title: 'Header', value: 'header' },
        { title: 'Footer', value: 'footer' },
      ],
    }}),
    defineField({
      name: 'items', type: 'array',
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'label', type: 'string' }),
          defineField({ name: 'href', type: 'string', placeholder: '/about or https://external.com' }),
          defineField({ name: 'external', type: 'boolean', initialValue: false }),
        ],
        preview: {
          select: { title: 'label', subtitle: 'href' },
        },
      }],
    }),
  ],
})
