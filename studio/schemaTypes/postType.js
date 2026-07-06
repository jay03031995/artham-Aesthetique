import {defineType, defineField} from 'sanity'

// Journal article — Wikipedia-style structured content (lead + sections + refs).
export const postType = defineType({
  name: 'post',
  title: 'Journal Article',
  type: 'document',
  groups: [
    {name: 'main', title: 'Main', default: true},
    {name: 'body', title: 'Body'},
    {name: 'meta', title: 'Links & Refs'},
  ],
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string', group: 'main', validation: (r) => r.required()}),
    defineField({name: 'slug', title: 'Slug', type: 'slug', options: {source: 'title'}, group: 'main', validation: (r) => r.required()}),
    defineField({name: 'category', title: 'Category', type: 'string', group: 'main'}),
    defineField({name: 'excerpt', title: 'Excerpt / description', type: 'text', rows: 2, group: 'main'}),
    defineField({name: 'cover', title: 'Cover image', type: 'mediaImage', group: 'main'}),
    defineField({name: 'date', title: 'Published date', type: 'date', group: 'main'}),
    defineField({name: 'updated', title: 'Updated date', type: 'date', group: 'main'}),
    defineField({name: 'keywords', title: 'Keywords (drive auto-backlinks)', type: 'array', of: [{type: 'string'}], options: {layout: 'tags'}, group: 'main'}),
    defineField({name: 'aliases', title: 'Aliases', type: 'array', of: [{type: 'string'}], options: {layout: 'tags'}, group: 'main'}),
    defineField({name: 'lead', title: 'Lead paragraphs', type: 'array', of: [{type: 'text'}], group: 'body'}),
    defineField({name: 'sections', title: 'Sections', type: 'array', of: [{type: 'journalSection'}], group: 'body'}),
    defineField({name: 'keyFacts', title: 'Infobox key facts', type: 'array', of: [{type: 'keyFact'}], group: 'meta'}),
    defineField({name: 'references', title: 'References', type: 'array', of: [{type: 'link'}], group: 'meta'}),
    defineField({name: 'faq', title: 'FAQ', type: 'array', of: [{type: 'qa'}], group: 'meta'}),
    defineField({name: 'furtherReading', title: 'Further reading', type: 'array', of: [{type: 'link'}], group: 'meta'}),
  ],
  preview: {select: {title: 'title', subtitle: 'category', media: 'cover.asset'}},
})
