import {defineType, defineField} from 'sanity'

export const testimonialType = defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  fields: [
    defineField({name: 'name', title: 'Guest name', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'area', title: 'Area / location', type: 'string'}),
    defineField({name: 'image', title: 'Guest image', type: 'mediaImage'}),
    defineField({name: 'quote', title: 'Short quote', type: 'text', rows: 3}),
    defineField({name: 'review', title: 'Full review', type: 'text', rows: 5}),
    defineField({name: 'treatment', title: 'Treatment', type: 'reference', to: [{type: 'treatment'}]}),
    defineField({name: 'rating', title: 'Rating (1-5)', type: 'number', initialValue: 5, validation: (r) => r.min(1).max(5)}),
    defineField({name: 'featured', title: 'Featured', type: 'boolean', initialValue: false}),
    defineField({name: 'order', title: 'Order', type: 'number', initialValue: 0}),
  ],
  preview: {select: {title: 'name', subtitle: 'quote', media: 'image.asset'}},
})
