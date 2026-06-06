import { defineField, defineType } from 'sanity'

export const contactSubmission = defineType({
  name: 'contactSubmission',
  title: 'Contact Submissions',
  type: 'document',
  fields: [
    defineField({ name: 'firstName', title: 'First Name', type: 'string' }),
    defineField({ name: 'lastName',  title: 'Last Name',  type: 'string' }),
    defineField({ name: 'email',     title: 'Email',      type: 'string' }),
    defineField({ name: 'phone',     title: 'Phone',      type: 'string' }),
    defineField({ name: 'country',   title: 'Country',    type: 'string' }),
    defineField({ name: 'city',      title: 'City',       type: 'string' }),
    defineField({
      name: 'purpose',
      title: 'Purpose',
      type: 'string',
      options: {
        list: [
          { title: 'General Inquiry',    value: 'general'  },
          { title: 'Course Enrollment',  value: 'course'   },
          { title: 'Service Request',    value: 'service'  },
          { title: 'Other',              value: 'other'    },
        ],
        layout: 'radio',
      },
    }),
    defineField({ name: 'appliedFor',  title: 'Course / Service Applied For', type: 'string' }),
    defineField({ name: 'message',     title: 'Message',      type: 'text' }),
    defineField({ name: 'submittedAt', title: 'Submitted At', type: 'datetime' }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'New',     value: 'new'     },
          { title: 'Read',    value: 'read'    },
          { title: 'Replied', value: 'replied' },
        ],
        layout: 'radio',
      },
      initialValue: 'new',
    }),
  ],
  orderings: [
    {
      title: 'Newest First',
      name: 'submittedAtDesc',
      by: [{ field: 'submittedAt', direction: 'desc' }],
    },
  ],
  preview: {
    select: { firstName: 'firstName', lastName: 'lastName', email: 'email', purpose: 'purpose', appliedFor: 'appliedFor', status: 'status' },
    prepare({ firstName, lastName, email, purpose, appliedFor, status }) {
      const badge      = status === 'new' ? '🔴' : status === 'read' ? '🟡' : '🟢'
      const name       = [firstName, lastName].filter(Boolean).join(' ')
      const purposeMap: Record<string, string> = { general: 'General', course: 'Course', service: 'Service', other: 'Other' }
      const tag        = purposeMap[purpose] || purpose || ''
      const detail     = appliedFor ? ` — ${appliedFor}` : ''
      return { title: `${badge} ${name}`, subtitle: `${tag}${detail} · ${email}` }
    },
  },
})
