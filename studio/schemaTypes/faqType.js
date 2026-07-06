import {defineType, defineField} from 'sanity'

export const faqType = defineType({
  name: 'faq',
  title: 'FAQ (global)',
  type: 'document',
  fields: [
    defineField({name: 'q', title: 'Question', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'a', title: 'Answer', type: 'text', rows: 3}),
    defineField({name: 'order', title: 'Order', type: 'number', initialValue: 0}),
  ],
  preview: {select: {title: 'q'}},
})
