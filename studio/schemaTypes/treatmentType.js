import {defineType, defineField} from 'sanity'

export const treatmentType = defineType({
  name: 'treatment',
  title: 'Treatment',
  type: 'document',
  groups: [
    {name: 'main', title: 'Main', default: true},
    {name: 'content', title: 'Content'},
    {name: 'process', title: 'Process & FAQ'},
  ],
  fields: [
    defineField({name: 'title', title: 'Name', type: 'string', group: 'main', validation: (r) => r.required()}),
    defineField({name: 'slug', title: 'Slug', type: 'slug', options: {source: 'title'}, group: 'main', validation: (r) => r.required()}),
    defineField({name: 'category', title: 'Category', type: 'reference', to: [{type: 'category'}], group: 'main'}),
    defineField({name: 'short', title: 'Short description', type: 'text', rows: 2, group: 'main'}),
    defineField({name: 'hero', title: 'Hero line', type: 'text', rows: 2, group: 'main'}),
    defineField({name: 'image', title: 'Image', type: 'mediaImage', group: 'main'}),
    defineField({name: 'featured', title: 'Featured (signature)', type: 'boolean', initialValue: false, group: 'main'}),
    defineField({name: 'order', title: 'Order', type: 'number', initialValue: 0, group: 'main'}),
    defineField({name: 'what', title: 'What is it', type: 'text', rows: 4, group: 'content'}),
    defineField({name: 'whoFor', title: "Who it's for", type: 'array', of: [{type: 'string'}], group: 'content'}),
    defineField({name: 'benefits', title: 'Benefits', type: 'array', of: [{type: 'string'}], group: 'content'}),
    defineField({name: 'duration', title: 'Duration', type: 'string', group: 'content'}),
    defineField({name: 'sessions', title: 'Sessions', type: 'string', group: 'content'}),
    defineField({name: 'downtime', title: 'Downtime notes', type: 'array', of: [{type: 'string'}], group: 'content'}),
    defineField({name: 'howItWorks', title: 'How it works (steps)', type: 'array', of: [{type: 'step'}], group: 'process'}),
    defineField({name: 'doctorNote', title: "Doctor's note", type: 'text', rows: 3, group: 'process'}),
    defineField({name: 'faqs', title: 'FAQs', type: 'array', of: [{type: 'qa'}], group: 'process'}),
  ],
  orderings: [{title: 'Manual order', name: 'order', by: [{field: 'order', direction: 'asc'}]}],
  preview: {select: {title: 'title', subtitle: 'short', media: 'image.asset'}},
})
