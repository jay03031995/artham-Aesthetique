import {defineType, defineField} from 'sanity'

const pageHeroFields = [
  defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string'}),
  defineField({name: 'heroTitle', title: 'Hero title', type: 'string'}),
  defineField({name: 'heroDescription', title: 'Hero description', type: 'text', rows: 3}),
  defineField({name: 'heroImage', title: 'Hero image', type: 'mediaImage'}),
  defineField({name: 'seoTitle', title: 'SEO title', type: 'string'}),
  defineField({name: 'metaDescription', title: 'Meta description', type: 'text', rows: 2}),
]

export const homePageType = defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  groups: [
    {name: 'hero', title: 'Hero', default: true},
    {name: 'sections', title: 'Sections'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string', initialValue: 'Home Page', group: 'hero'}),
    ...pageHeroFields.map((field) => ({...field, group: field.name.startsWith('seo') || field.name === 'metaDescription' ? 'seo' : 'hero'})),
    defineField({name: 'heroVideoUrl', title: 'Hero video URL', type: 'string', group: 'hero'}),
    defineField({name: 'featuredTreatments', title: 'Featured treatments', type: 'array', of: [{type: 'reference', to: [{type: 'treatment'}]}], group: 'sections'}),
    defineField({name: 'whyChooseUs', title: 'Why choose us', type: 'array', of: [{type: 'iconText'}], group: 'sections'}),
    defineField({name: 'doctor', title: 'Doctor section', type: 'reference', to: [{type: 'doctor'}], group: 'sections'}),
    defineField({name: 'testimonials', title: 'Testimonials', type: 'array', of: [{type: 'reference', to: [{type: 'testimonial'}]}], group: 'sections'}),
    defineField({name: 'realResults', title: 'Real results', type: 'array', of: [{type: 'reference', to: [{type: 'beforeAfter'}]}], group: 'sections'}),
    defineField({name: 'faqs', title: 'FAQs', type: 'array', of: [{type: 'qa'}], group: 'sections'}),
    defineField({name: 'ctaTitle', title: 'CTA title', type: 'string', group: 'sections'}),
    defineField({name: 'ctaText', title: 'CTA text', type: 'text', rows: 2, group: 'sections'}),
    defineField({name: 'banners', title: 'Promotional banners', type: 'array', of: [{type: 'iconText'}], group: 'sections'}),
    defineField({name: 'statistics', title: 'Statistics / counters', type: 'array', of: [{type: 'keyFact'}], group: 'sections'}),
    defineField({name: 'seo', title: 'Full SEO', type: 'seoFields', group: 'seo'}),
  ],
  preview: {prepare: () => ({title: 'Home Page'})},
})

export const aboutPageType = defineType({
  name: 'aboutPage',
  title: 'About Page',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string', initialValue: 'About Page'}),
    ...pageHeroFields,
    defineField({name: 'storyEyebrow', title: 'Story eyebrow', type: 'string'}),
    defineField({name: 'storyTitle', title: 'Story title', type: 'string'}),
    defineField({name: 'storyBody', title: 'Story paragraphs', type: 'array', of: [{type: 'text'}]}),
    defineField({name: 'mission', title: 'Mission', type: 'text', rows: 3}),
    defineField({name: 'vision', title: 'Vision', type: 'text', rows: 3}),
    defineField({name: 'timeline', title: 'Timeline', type: 'array', of: [{type: 'keyFact'}]}),
    defineField({name: 'clinicHighlights', title: 'Clinic highlights', type: 'array', of: [{type: 'iconText'}]}),
    defineField({name: 'statistics', title: 'Statistics / counters', type: 'array', of: [{type: 'keyFact'}]}),
    defineField({name: 'gallery', title: 'Gallery', type: 'array', of: [{type: 'mediaImage'}]}),
    defineField({name: 'videoUrl', title: 'Video URL', type: 'url'}),
    defineField({name: 'ctaTitle', title: 'CTA title', type: 'string'}),
    defineField({name: 'ctaText', title: 'CTA text', type: 'text', rows: 2}),
    defineField({name: 'ctaLabel', title: 'CTA button label', type: 'string'}),
    defineField({name: 'ctaLink', title: 'CTA button link', type: 'string'}),
    defineField({name: 'seo', title: 'Full SEO', type: 'seoFields'}),
  ],
  preview: {prepare: () => ({title: 'About Page'})},
})

export const contactPageType = defineType({
  name: 'contactPage',
  title: 'Contact Page',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string', initialValue: 'Contact Page'}),
    ...pageHeroFields,
    defineField({name: 'email', title: 'Primary email', type: 'string'}),
    defineField({name: 'emergencyContact', title: 'Emergency contact', type: 'string'}),
    defineField({name: 'whatsappNumber', title: 'WhatsApp number', type: 'string'}),
    defineField({name: 'mapEmbed', title: 'Google map embed URL', type: 'url'}),
    defineField({name: 'mapsUrl', title: 'Google maps directions URL', type: 'url'}),
    defineField({name: 'openingHours', title: 'Opening hours', type: 'array', of: [{type: 'keyFact'}]}),
    defineField({name: 'contactCta', title: 'Contact CTA', type: 'link'}),
    defineField({name: 'seo', title: 'Full SEO', type: 'seoFields'}),
  ],
  preview: {prepare: () => ({title: 'Contact Page'})},
})

export const footerSettingsType = defineType({
  name: 'footerSettings',
  title: 'Footer',
  type: 'document',
  fields: [
    defineField({name: 'brandText', title: 'Brand text', type: 'text', rows: 3}),
    defineField({name: 'quickLinks', title: 'Quick links', type: 'array', of: [{type: 'link'}]}),
    defineField({name: 'legalLinks', title: 'Legal / support links', type: 'array', of: [{type: 'link'}]}),
    defineField({name: 'newsletterTitle', title: 'Newsletter title', type: 'string'}),
    defineField({name: 'newsletterText', title: 'Newsletter text', type: 'text', rows: 2}),
    defineField({name: 'copyrightText', title: 'Copyright text', type: 'string'}),
  ],
  preview: {prepare: () => ({title: 'Footer'})},
})

export const seoSettingsType = defineType({
  name: 'seoSettings',
  title: 'Global SEO Settings',
  type: 'document',
  fields: [
    defineField({name: 'siteTitle', title: 'Site title', type: 'string'}),
    defineField({name: 'defaultDescription', title: 'Default meta description', type: 'text', rows: 2}),
    defineField({name: 'defaultKeywords', title: 'Default keywords', type: 'array', of: [{type: 'string'}], options: {layout: 'tags'}}),
    defineField({name: 'defaultOpenGraphImage', title: 'Default Open Graph image', type: 'mediaImage'}),
    defineField({name: 'twitterCard', title: 'Twitter card', type: 'string'}),
    defineField({name: 'robots', title: 'Robots settings', type: 'string'}),
    defineField({name: 'canonicalUrl', title: 'Canonical URL', type: 'url'}),
    defineField({name: 'favicon', title: 'Favicon', type: 'mediaImage'}),
    defineField({name: 'appleTouchIcon', title: 'Apple touch icon', type: 'mediaImage'}),
    defineField({name: 'themeColor', title: 'Theme color', type: 'string'}),
    defineField({name: 'manifest', title: 'Manifest JSON', type: 'text', rows: 6}),
    defineField({name: 'structuredData', title: 'Structured data JSON', type: 'text', rows: 6}),
  ],
  preview: {prepare: () => ({title: 'Global SEO Settings'})},
})

export const navigationSettingsType = defineType({
  name: 'navigationSettings',
  title: 'Navigation',
  type: 'document',
  fields: [
    defineField({
      name: 'items',
      title: 'Menu items',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({name: 'label', title: 'Label', type: 'string'}),
            defineField({name: 'href', title: 'Internal / external link', type: 'string'}),
            defineField({name: 'order', title: 'Order', type: 'number'}),
            defineField({name: 'visible', title: 'Visible', type: 'boolean', initialValue: true}),
            defineField({name: 'dropdownCategory', title: 'Dropdown category', type: 'reference', to: [{type: 'category'}]}),
          ],
          preview: {select: {title: 'label', subtitle: 'href'}},
        },
      ],
    }),
  ],
  preview: {prepare: () => ({title: 'Navigation'})},
})
