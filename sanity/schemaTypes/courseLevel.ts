import { defineField, defineType } from 'sanity'

export const courseLevel = defineType({
  name: 'courseLevel',
  title: 'Course Level',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', options: {
      list: [
        { title: "Beginner's Level", value: 'beginner' },
        { title: 'Intermediate Level', value: 'intermediate' },
        { title: 'Advanced Level', value: 'advanced' },
      ],
    }, validation: (r) => r.required() }),
    defineField({ name: 'course', type: 'reference', to: [{ type: 'course' }], validation: (r) => r.required() }),
    defineField({ name: 'description', type: 'array', of: [{ type: 'block' }] }),
    defineField({ name: 'curriculum', type: 'array', of: [{ type: 'block' }] }),
    defineField({ name: 'duration', type: 'string' }),
    defineField({ name: 'prerequisites', type: 'text', rows: 2 }),
  ],
  preview: {
    select: { title: 'title', course: 'course.title' },
    prepare({ title, course }) {
      return { title, subtitle: course }
    },
  },
})
