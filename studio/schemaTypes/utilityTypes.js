import {defineType, defineField} from 'sanity'

export const bookingSettingsType = defineType({
  name: 'bookingSettings',
  title: 'Booking Modal',
  type: 'document',
  fields: [
    defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string'}),
    defineField({name: 'stepLabels', title: 'Step labels', type: 'array', of: [{type: 'string'}]}),
    defineField({name: 'chooseTreatmentTitle', title: 'Choose treatment title', type: 'string'}),
    defineField({name: 'chooseTimeTitle', title: 'Choose date/time title', type: 'string'}),
    defineField({name: 'detailsTitle', title: 'Details title', type: 'string'}),
    defineField({name: 'confirmedTitle', title: 'Confirmed title', type: 'string'}),
    defineField({name: 'searchPlaceholder', title: 'Search placeholder', type: 'string'}),
    defineField({name: 'emptySearchText', title: 'Empty search text', type: 'string'}),
    defineField({name: 'treatmentLabel', title: 'Treatment label', type: 'string'}),
    defineField({name: 'doctorPrefix', title: 'Doctor prefix', type: 'string'}),
    defineField({name: 'dateLabel', title: 'Date label', type: 'string'}),
    defineField({name: 'timeLabel', title: 'Time label', type: 'string'}),
    defineField({name: 'summaryLabel', title: 'Summary label', type: 'string'}),
    defineField({name: 'nameLabel', title: 'Name label', type: 'string'}),
    defineField({name: 'phoneLabel', title: 'Phone label', type: 'string'}),
    defineField({name: 'emailLabel', title: 'Email label', type: 'string'}),
    defineField({name: 'noteLabel', title: 'Note label', type: 'string'}),
    defineField({name: 'termsText', title: 'Terms text', type: 'text', rows: 2}),
    defineField({name: 'continueLabel', title: 'Continue label', type: 'string'}),
    defineField({name: 'submitLabel', title: 'Submit label', type: 'string'}),
    defineField({name: 'submittingLabel', title: 'Submitting label', type: 'string'}),
    defineField({name: 'requiredError', title: 'Required fields error', type: 'string'}),
    defineField({name: 'successToast', title: 'Success toast', type: 'string'}),
    defineField({name: 'errorToast', title: 'Error toast', type: 'string'}),
    defineField({name: 'confirmationText', title: 'Confirmation text', type: 'text', rows: 3}),
    defineField({name: 'confirmationFollowup', title: 'Confirmation follow-up', type: 'text', rows: 2}),
    defineField({name: 'referenceLabel', title: 'Reference label', type: 'string'}),
    defineField({name: 'whatsappLabel', title: 'WhatsApp confirmation label', type: 'string'}),
    defineField({name: 'closeLabel', title: 'Close label', type: 'string'}),
    defineField({name: 'whatsappMessage', title: 'WhatsApp confirmation message', type: 'text', rows: 2}),
    defineField({name: 'timeSlots', title: 'Time slots', type: 'array', of: [{type: 'string'}]}),
  ],
  preview: {prepare: () => ({title: 'Booking Modal'})},
})

export const chatbotSettingsType = defineType({
  name: 'chatbotSettings',
  title: 'Chatbot',
  type: 'document',
  fields: [
    defineField({name: 'assistantName', title: 'Assistant name', type: 'string'}),
    defineField({name: 'statusText', title: 'Status text', type: 'string'}),
    defineField({name: 'systemPrompt', title: 'System prompt', type: 'text', rows: 10}),
    defineField({name: 'initialMessage', title: 'Initial message', type: 'text', rows: 4}),
    defineField({name: 'fallbackMessage', title: 'Fallback message', type: 'text', rows: 3}),
    defineField({name: 'inputPlaceholder', title: 'Input placeholder', type: 'string'}),
    defineField({
      name: 'quickReplies',
      title: 'Quick replies',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          defineField({name: 'label', title: 'Label', type: 'string'}),
          defineField({name: 'message', title: 'Message', type: 'text', rows: 2}),
          defineField({
            name: 'action',
            title: 'Action',
            type: 'string',
            options: {list: ['send-message', 'open-booking', 'open-whatsapp']},
            initialValue: 'send-message',
          }),
        ],
        preview: {select: {title: 'label', subtitle: 'action'}},
      }],
    }),
  ],
  preview: {prepare: () => ({title: 'Chatbot'})},
})

export const mobileBarSettingsType = defineType({
  name: 'mobileBarSettings',
  title: 'Mobile Sticky Bar',
  type: 'document',
  fields: [
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          defineField({name: 'label', title: 'Label', type: 'string'}),
          defineField({
            name: 'icon',
            title: 'Icon',
            type: 'string',
            options: {list: ['home', 'treatments', 'book', 'call', 'chat']},
          }),
          defineField({
            name: 'action',
            title: 'Action',
            type: 'string',
            options: {list: ['link', 'booking', 'call', 'whatsapp']},
          }),
          defineField({name: 'href', title: 'Link', type: 'string'}),
          defineField({name: 'highlight', title: 'Highlight', type: 'boolean', initialValue: false}),
          defineField({name: 'order', title: 'Order', type: 'number'}),
        ],
        preview: {select: {title: 'label', subtitle: 'action'}},
      }],
    }),
  ],
  preview: {prepare: () => ({title: 'Mobile Sticky Bar'})},
})

export const policyPageType = defineType({
  name: 'policyPage',
  title: 'Policy Page',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'slug', title: 'Slug', type: 'slug', options: {source: 'title'}, validation: (r) => r.required()}),
    defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string'}),
    defineField({name: 'intro', title: 'Intro', type: 'text', rows: 3}),
    defineField({name: 'sections', title: 'Sections', type: 'array', of: [{type: 'textSection'}]}),
    defineField({name: 'updatedText', title: 'Updated/contact text', type: 'string'}),
    defineField({name: 'contactLink', title: 'Contact link', type: 'link'}),
    defineField({name: 'seo', title: 'SEO', type: 'seoFields'}),
  ],
  preview: {select: {title: 'title', subtitle: 'slug.current'}},
})

export const careersPageType = defineType({
  name: 'careersPage',
  title: 'Careers Page',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string', initialValue: 'Careers Page'}),
    defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string'}),
    defineField({name: 'heroTitle', title: 'Hero title', type: 'string'}),
    defineField({name: 'heroDescription', title: 'Hero description', type: 'text', rows: 3}),
    defineField({name: 'sections', title: 'Sections', type: 'array', of: [{type: 'textSection'}]}),
    defineField({name: 'cta', title: 'CTA link', type: 'link'}),
    defineField({name: 'seo', title: 'SEO', type: 'seoFields'}),
  ],
  preview: {prepare: () => ({title: 'Careers Page'})},
})
