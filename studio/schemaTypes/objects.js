import {defineType, defineField} from 'sanity'

// Reusable image: an uploaded asset OR a plain URL (seeded content uses url).
export const mediaImage = defineType({
  name: 'mediaImage',
  title: 'Image',
  type: 'object',
  fields: [
    defineField({name: 'asset', title: 'Uploaded image', type: 'image', options: {hotspot: true}}),
    defineField({name: 'url', title: '…or paste an image URL', type: 'url'}),
    defineField({name: 'alt', title: 'Alt text', type: 'string'}),
  ],
  preview: {select: {media: 'asset', title: 'alt', subtitle: 'url'}},
})

export const qa = defineType({
  name: 'qa',
  title: 'Q&A',
  type: 'object',
  fields: [
    defineField({name: 'q', title: 'Question', type: 'string'}),
    defineField({name: 'a', title: 'Answer', type: 'text', rows: 3}),
  ],
  preview: {select: {title: 'q'}},
})

export const step = defineType({
  name: 'step',
  title: 'Step',
  type: 'object',
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string'}),
    defineField({name: 'body', title: 'Body', type: 'text', rows: 2}),
    defineField({name: 'image', title: 'Image', type: 'mediaImage'}),
  ],
  preview: {select: {title: 'title', subtitle: 'body'}},
})

export const link = defineType({
  name: 'link',
  title: 'Link',
  type: 'object',
  fields: [
    defineField({name: 'label', title: 'Label', type: 'string'}),
    defineField({name: 'url', title: 'URL', type: 'url'}),
  ],
  preview: {select: {title: 'label', subtitle: 'url'}},
})

export const seoFields = defineType({
  name: 'seoFields',
  title: 'SEO',
  type: 'object',
  fields: [
    defineField({name: 'title', title: 'SEO title', type: 'string'}),
    defineField({name: 'description', title: 'Meta description', type: 'text', rows: 2}),
    defineField({name: 'keywords', title: 'Meta keywords', type: 'array', of: [{type: 'string'}], options: {layout: 'tags'}}),
    defineField({name: 'canonicalUrl', title: 'Canonical URL', type: 'url'}),
    defineField({name: 'openGraphImage', title: 'Open Graph image', type: 'mediaImage'}),
    defineField({name: 'schema', title: 'Structured data / schema JSON', type: 'text', rows: 5}),
    defineField({name: 'noIndex', title: 'No index', type: 'boolean', initialValue: false}),
  ],
})

export const quickInfo = defineType({
  name: 'quickInfo',
  title: 'Quick Information',
  type: 'object',
  fields: [
    defineField({name: 'treatmentTime', title: 'Treatment time', type: 'string'}),
    defineField({name: 'downtime', title: 'Downtime', type: 'string'}),
    defineField({name: 'results', title: 'Results', type: 'string'}),
    defineField({name: 'sessionsRequired', title: 'Sessions required', type: 'string'}),
    defineField({name: 'painLevel', title: 'Pain level', type: 'string'}),
    defineField({name: 'recoveryTime', title: 'Recovery time', type: 'string'}),
    defineField({name: 'anesthesia', title: 'Anesthesia', type: 'string'}),
    defineField({name: 'suitableFor', title: 'Suitable for', type: 'string'}),
  ],
})

export const iconText = defineType({
  name: 'iconText',
  title: 'Icon Text Item',
  type: 'object',
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string'}),
    defineField({name: 'description', title: 'Description', type: 'text', rows: 2}),
    defineField({name: 'image', title: 'Icon / image', type: 'mediaImage'}),
  ],
  preview: {select: {title: 'title', subtitle: 'description', media: 'image.asset'}},
})

export const keyFact = defineType({
  name: 'keyFact',
  title: 'Key fact',
  type: 'object',
  fields: [
    defineField({name: 'label', title: 'Label', type: 'string'}),
    defineField({name: 'value', title: 'Value', type: 'string'}),
  ],
  preview: {select: {title: 'label', subtitle: 'value'}},
})

export const tableRow = defineType({
  name: 'tableRow',
  title: 'Row',
  type: 'object',
  fields: [defineField({name: 'cells', title: 'Cells', type: 'array', of: [{type: 'string'}]})],
  preview: {
    select: {cells: 'cells'},
    prepare: ({cells}) => ({title: (cells || []).join(' · ')}),
  },
})

// One block of a Wikipedia-style journal section.
export const journalBlock = defineType({
  name: 'journalBlock',
  title: 'Block',
  type: 'object',
  fields: [
    defineField({
      name: 'type',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          {title: 'Paragraph', value: 'p'},
          {title: 'Bullet list', value: 'ul'},
          {title: 'Numbered list', value: 'ol'},
          {title: 'Table', value: 'table'},
          {title: 'Quote', value: 'quote'},
        ],
        layout: 'radio',
      },
      initialValue: 'p',
    }),
    defineField({
      name: 'text',
      title: 'Text (paragraph / quote)',
      type: 'text',
      rows: 3,
      hidden: ({parent}) => !['p', 'quote'].includes(parent?.type),
    }),
    defineField({
      name: 'items',
      title: 'List items',
      type: 'array',
      of: [{type: 'string'}],
      hidden: ({parent}) => !['ul', 'ol'].includes(parent?.type),
    }),
    defineField({
      name: 'head',
      title: 'Table header cells',
      type: 'array',
      of: [{type: 'string'}],
      hidden: ({parent}) => parent?.type !== 'table',
    }),
    defineField({
      name: 'rows',
      title: 'Table rows',
      type: 'array',
      of: [{type: 'tableRow'}],
      hidden: ({parent}) => parent?.type !== 'table',
    }),
  ],
  preview: {
    select: {type: 'type', text: 'text'},
    prepare: ({type, text}) => ({title: `[${type}] ${text || ''}`.slice(0, 60)}),
  },
})

export const journalSection = defineType({
  name: 'journalSection',
  title: 'Section',
  type: 'object',
  fields: [
    defineField({name: 'heading', title: 'Heading', type: 'string'}),
    defineField({name: 'level', title: 'Level (2 = H2, 3 = H3)', type: 'number', initialValue: 2}),
    defineField({name: 'id', title: 'Anchor id (auto if blank)', type: 'string'}),
    defineField({name: 'blocks', title: 'Blocks', type: 'array', of: [{type: 'journalBlock'}]}),
  ],
  preview: {
    select: {title: 'heading', subtitle: 'level'},
    prepare: ({title, subtitle}) => ({title, subtitle: `H${subtitle || 2}`}),
  },
})

export const objectTypes = [
  mediaImage,
  qa,
  step,
  link,
  seoFields,
  quickInfo,
  iconText,
  keyFact,
  tableRow,
  journalBlock,
  journalSection,
]
