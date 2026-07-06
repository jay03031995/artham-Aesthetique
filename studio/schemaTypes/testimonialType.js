import {defineType, defineField} from 'sanity'

export const testimonialType = defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  fields: [
    defineField({name: 'name', title: 'Guest name', type: 'string'}),
    defineField({name: 'quote', title: 'Quote', type: 'text', rows: 3}),
    defineField({name: 'treatment', title: 'Treatment', type: 'reference', to: [{type: 'treatment'}]}),
    defineField({name: 'rating', title: 'Rating (1–5)', type: 'number', initialValue: 5}),
    defineField({name: 'order', title: 'Order', type: 'number', initialValue: 0}),
  ],
  preview: {select: {title: 'name', subtitle: 'quote'}},
})
