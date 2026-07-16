import {defineType, defineField} from 'sanity'

export const postType = defineType({
  name: 'post',
  title: 'Blog Post',
  type: 'document',
  groups: [
    {name: 'main', title: 'Content', default: true},
    {name: 'meta', title: 'Meta'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string', group: 'main', validation: (r) => r.required()}),
    defineField({name: 'slug', title: 'Slug', type: 'slug', options: {source: 'title'}, group: 'main', validation: (r) => r.required()}),
    defineField({name: 'cover', title: 'Featured Image', type: 'mediaImage', group: 'main'}),
    defineField({name: 'excerpt', title: 'Excerpt', type: 'text', rows: 3, group: 'main'}),
    defineField({
      name: 'content',
      title: 'Rich Content',
      type: 'array',
      group: 'main',
      of: [
        {type: 'block'},
        {type: 'image', options: {hotspot: true}},
      ],
    }),
    defineField({name: 'category', title: 'Category', type: 'reference', to: [{type: 'category'}], group: 'meta'}),
    defineField({name: 'tags', title: 'Tags', type: 'array', of: [{type: 'string'}], options: {layout: 'tags'}, group: 'meta'}),
    defineField({name: 'author', title: 'Author', type: 'reference', to: [{type: 'author'}, {type: 'doctor'}], group: 'meta'}),
    defineField({name: 'publishedAt', title: 'Published Date', type: 'datetime', group: 'meta'}),
    defineField({name: 'readingTime', title: 'Reading Time', type: 'number', group: 'meta', description: 'Minutes. Leave blank to calculate from content.'}),
    defineField({name: 'featured', title: 'Featured', type: 'boolean', initialValue: false, group: 'meta'}),
    defineField({name: 'relatedBlogs', title: 'Related Blogs', type: 'array', of: [{type: 'reference', to: [{type: 'post'}]}], group: 'meta'}),
    defineField({name: 'seoTitle', title: 'SEO Title', type: 'string', group: 'seo'}),
    defineField({name: 'seoDescription', title: 'SEO Description', type: 'text', rows: 2, group: 'seo'}),
  ],
  preview: {
    select: {title: 'title', subtitle: 'category.title', media: 'cover.asset'},
    prepare: ({title, subtitle, media}) => ({title, subtitle, media}),
  },
})
