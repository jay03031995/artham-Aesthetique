import {defineType, defineField} from 'sanity'

export const offerType = defineType({
  name: 'offer',
  title: 'Offer',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'slug', title: 'Slug', type: 'slug', options: {source: 'title'}}),
    defineField({name: 'blurb', title: 'Blurb', type: 'text', rows: 3}),
    defineField({name: 'terms', title: 'Terms', type: 'text', rows: 2}),
    defineField({name: 'validTill', title: 'Valid till', type: 'date'}),
    defineField({name: 'active', title: 'Active', type: 'boolean', initialValue: true}),
    defineField({name: 'image', title: 'Image', type: 'mediaImage'}),
  ],
  preview: {select: {title: 'title', subtitle: 'blurb'}},
})
