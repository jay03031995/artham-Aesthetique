import {defineType, defineField} from 'sanity'

export const contactSubmissionType = defineType({
  name: 'contactSubmission',
  title: 'Contact Submission',
  type: 'document',
  fields: [
    defineField({name: 'name', title: 'Name', type: 'string'}),
    defineField({name: 'phone', title: 'Phone', type: 'string'}),
    defineField({name: 'concern', title: 'Concern', type: 'text', rows: 3}),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          {title: 'New', value: 'new'},
          {title: 'Contacted', value: 'contacted'},
          {title: 'Booked', value: 'booked'},
          {title: 'Closed', value: 'closed'},
        ],
        layout: 'radio',
      },
      initialValue: 'new',
    }),
    defineField({name: 'source', title: 'Source', type: 'string', initialValue: 'contact-page'}),
    defineField({name: 'createdAt', title: 'Created at', type: 'datetime'}),
  ],
  orderings: [{title: 'Newest', name: 'createdAtDesc', by: [{field: 'createdAt', direction: 'desc'}]}],
  preview: {
    select: {title: 'name', phone: 'phone', status: 'status', date: 'createdAt'},
    prepare: ({title, phone, status, date}) => ({
      title: `${title || 'New submission'} · ${phone || ''}`,
      subtitle: `${(status || 'new').toUpperCase()} · ${date || ''}`,
    }),
  },
})
