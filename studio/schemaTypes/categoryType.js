import {defineType, defineField} from 'sanity'

export const categoryType = defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Name', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'slug', title: 'Slug', type: 'slug', options: {source: 'title'}, validation: (r) => r.required()}),
    defineField({name: 'intro', title: 'Intro', type: 'text', rows: 2}),
    defineField({name: 'icon', title: 'Icon / image', type: 'mediaImage'}),
    defineField({name: 'image', title: 'Image', type: 'mediaImage'}),
    defineField({name: 'breadcrumbHomeLabel', title: 'Breadcrumb home label', type: 'string'}),
    defineField({name: 'breadcrumbTreatmentsLabel', title: 'Breadcrumb treatments label', type: 'string'}),
    defineField({name: 'countLabel', title: 'Treatment count label', type: 'string'}),
    defineField({name: 'ctaEyebrow', title: 'CTA eyebrow', type: 'string'}),
    defineField({name: 'ctaTitle', title: 'CTA title', type: 'string'}),
    defineField({name: 'ctaText', title: 'CTA text', type: 'text', rows: 2}),
    defineField({name: 'ctaButtonText', title: 'CTA button text', type: 'string'}),
    defineField({name: 'seo', title: 'SEO', type: 'seoFields'}),
    defineField({name: 'order', title: 'Order', type: 'number', initialValue: 0}),
  ],
  orderings: [{title: 'Manual order', name: 'order', by: [{field: 'order', direction: 'asc'}]}],
  preview: {select: {title: 'title', subtitle: 'intro', media: 'image.asset'}},
})
