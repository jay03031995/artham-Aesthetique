import {defineType, defineField} from 'sanity'

export const authorType = defineType({
  name: 'author',
  title: 'Author',
  type: 'document',
  fields: [
    defineField({name: 'name', title: 'Name', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'slug', title: 'Slug', type: 'slug', options: {source: 'name'}}),
    defineField({name: 'designation', title: 'Designation', type: 'string'}),
    defineField({name: 'portrait', title: 'Portrait', type: 'mediaImage'}),
  ],
  preview: {select: {title: 'name', subtitle: 'designation', media: 'portrait.asset'}},
})
