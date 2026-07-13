import {defineType, defineField} from 'sanity'

export const beforeAfterType = defineType({
  name: 'beforeAfter',
  title: 'Before / After Result',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'treatment', title: 'Treatment', type: 'reference', to: [{type: 'treatment'}]}),
    defineField({name: 'linkedTreatments', title: 'Linked treatments', type: 'array', of: [{type: 'reference', to: [{type: 'treatment'}]}]}),
    defineField({name: 'category', title: 'Category', type: 'reference', to: [{type: 'category'}]}),
    defineField({name: 'beforeImage', title: 'Before image', type: 'mediaImage'}),
    defineField({name: 'afterImage', title: 'After image', type: 'mediaImage'}),
    defineField({name: 'patientAge', title: 'Patient age', type: 'number'}),
    defineField({name: 'gender', title: 'Gender', type: 'string', options: {list: ['Female', 'Male', 'Non-binary', 'Prefer not to say']}}),
    defineField({name: 'description', title: 'Description', type: 'text', rows: 3}),
    defineField({name: 'featured', title: 'Featured', type: 'boolean', initialValue: false}),
    defineField({name: 'sessionsInfo', title: 'Sessions / timeline', type: 'string'}),
    defineField({name: 'note', title: 'Note', type: 'text', rows: 3}),
    defineField({name: 'consent', title: 'Patient consent on file', type: 'boolean', initialValue: false, validation: (r) => r.required()}),
    defineField({name: 'publishedAt', title: 'Published at', type: 'datetime'}),
    defineField({name: 'order', title: 'Order', type: 'number', initialValue: 0}),
  ],
  preview: {select: {title: 'title', subtitle: 'sessionsInfo', media: 'afterImage.asset'}},
})
