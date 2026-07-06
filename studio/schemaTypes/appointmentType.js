import {defineType, defineField} from 'sanity'

export const appointmentType = defineType({
  name: 'appointment',
  title: 'Appointment',
  type: 'document',
  fields: [
    defineField({name: 'name', title: 'Name', type: 'string'}),
    defineField({name: 'phone', title: 'Phone', type: 'string'}),
    defineField({name: 'email', title: 'Email', type: 'string'}),
    defineField({name: 'treatmentName', title: 'Treatment', type: 'string'}),
    defineField({name: 'category', title: 'Category', type: 'string'}),
    defineField({name: 'preferredDate', title: 'Preferred date', type: 'date'}),
    defineField({name: 'preferredTime', title: 'Preferred time', type: 'string'}),
    defineField({name: 'note', title: 'Note', type: 'text', rows: 2}),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          {title: 'New', value: 'new'},
          {title: 'Confirmed', value: 'confirmed'},
          {title: 'Completed', value: 'completed'},
          {title: 'Cancelled', value: 'cancelled'},
        ],
        layout: 'radio',
      },
      initialValue: 'new',
    }),
    defineField({name: 'source', title: 'Source', type: 'string', initialValue: 'website'}),
    defineField({name: 'createdAt', title: 'Created at', type: 'datetime'}),
  ],
  orderings: [{title: 'Newest', name: 'createdAtDesc', by: [{field: 'createdAt', direction: 'desc'}]}],
  preview: {
    select: {title: 'name', phone: 'phone', treatment: 'treatmentName', status: 'status', date: 'preferredDate'},
    prepare: ({title, phone, treatment, status, date}) => ({
      title: `${title || '—'} · ${phone || ''}`,
      subtitle: `${(status || 'new').toUpperCase()} · ${treatment || 'consult'} · ${date || ''}`,
    }),
  },
})
