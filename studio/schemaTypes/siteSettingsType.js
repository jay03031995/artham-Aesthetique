import {defineType, defineField} from 'sanity'

export const siteSettingsType = defineType({
  name: 'siteSettings',
  title: 'Site Settings & Menu',
  type: 'document',
  groups: [
    {name: 'brand', title: 'Brand'},
    {name: 'contact', title: 'Contact'},
    {name: 'media', title: 'Media'},
    {name: 'menu', title: 'Navigation Menu'},
    {name: 'social', title: 'Social'},
  ],
  fields: [
    defineField({name: 'title', title: 'Clinic name', type: 'string', group: 'brand'}),
    defineField({name: 'tagline', title: 'Tagline', type: 'string', group: 'brand'}),
    defineField({name: 'wordmarkDeva', title: 'Devanagari wordmark', type: 'string', group: 'brand'}),
    defineField({name: 'phone', title: 'Phone (display)', type: 'string', group: 'contact'}),
    defineField({name: 'phoneDigits', title: 'Phone (digits only)', type: 'string', group: 'contact'}),
    defineField({name: 'whatsapp', title: 'WhatsApp number (digits only)', type: 'string', group: 'contact'}),
    defineField({name: 'emails', title: 'Emails', type: 'array', of: [{type: 'string'}], group: 'contact'}),
    defineField({name: 'hours', title: 'Hours', type: 'string', group: 'contact'}),
    defineField({name: 'workingHours', title: 'Working hours', type: 'array', of: [{type: 'keyFact'}], group: 'contact'}),
    defineField({name: 'googleMaps', title: 'Google Maps URL', type: 'url', group: 'contact'}),
    defineField({
      name: 'address',
      title: 'Address',
      type: 'object',
      group: 'contact',
      fields: [
        defineField({name: 'line1', title: 'Line 1', type: 'string'}),
        defineField({name: 'line2', title: 'Line 2', type: 'string'}),
        defineField({name: 'line3', title: 'Line 3', type: 'string'}),
      ],
    }),
    defineField({name: 'logo', title: 'Logo', type: 'mediaImage', group: 'media'}),
    defineField({name: 'footerLogo', title: 'Footer logo', type: 'mediaImage', group: 'media'}),
    defineField({name: 'doctorPortrait', title: 'Doctor portrait', type: 'mediaImage', group: 'media'}),
    defineField({name: 'heroImage', title: 'Hero image', type: 'mediaImage', group: 'media'}),
    defineField({name: 'clinicPhoto', title: 'Clinic photo', type: 'mediaImage', group: 'media'}),
    defineField({name: 'heroVideoUrl', title: 'Hero video URL', type: 'string', group: 'media'}),
    defineField({name: 'parentBrandUrl', title: 'Parent brand URL', type: 'url', group: 'brand'}),
    defineField({name: 'headerCta', title: 'Header CTA', type: 'link', group: 'menu'}),
    defineField({name: 'footerCta', title: 'Footer CTA', type: 'link', group: 'menu'}),
    defineField({name: 'copyright', title: 'Copyright', type: 'string', group: 'brand'}),
    defineField({
      name: 'nav',
      title: 'Primary nav items',
      type: 'array',
      group: 'menu',
      of: [
        {
          type: 'object',
          name: 'navItem',
          fields: [
            defineField({name: 'label', title: 'Label', type: 'string'}),
            defineField({name: 'href', title: 'Link (path)', type: 'string'}),
          ],
          preview: {select: {title: 'label', subtitle: 'href'}},
        },
      ],
    }),
    defineField({
      name: 'megaGroups',
      title: 'Treatments mega-menu groups',
      type: 'array',
      group: 'menu',
      of: [
        {
          type: 'object',
          name: 'megaGroup',
          fields: [
            defineField({name: 'heading', title: 'Heading', type: 'string'}),
            defineField({name: 'category', title: 'Category link', type: 'reference', to: [{type: 'category'}]}),
            defineField({
              name: 'treatments',
              title: 'Treatments shown',
              type: 'array',
              of: [{type: 'reference', to: [{type: 'treatment'}]}],
            }),
          ],
          preview: {select: {title: 'heading'}},
        },
      ],
    }),
    defineField({
      name: 'social',
      title: 'Social links',
      type: 'object',
      group: 'social',
      fields: ['instagram', 'facebook', 'x', 'linkedin', 'youtube', 'whatsapp'].map((s) =>
        defineField({name: s, title: s[0].toUpperCase() + s.slice(1), type: 'url'}),
      ),
    }),
    defineField({
      name: 'analytics',
      title: 'Analytics',
      type: 'object',
      group: 'brand',
      fields: [
        defineField({name: 'googleAnalyticsId', title: 'Google Analytics ID', type: 'string'}),
        defineField({name: 'metaPixelId', title: 'Meta Pixel ID', type: 'string'}),
      ],
    }),
    defineField({
      name: 'verificationCodes',
      title: 'Verification codes',
      type: 'object',
      group: 'brand',
      fields: [
        defineField({name: 'google', title: 'Google site verification', type: 'string'}),
        defineField({name: 'bing', title: 'Bing site verification', type: 'string'}),
        defineField({name: 'facebook', title: 'Facebook domain verification', type: 'string'}),
      ],
    }),
  ],
  preview: {prepare: () => ({title: 'Site Settings & Menu'})},
})
