import {defineType, defineField} from 'sanity'

export const doctorType = defineType({
  name: 'doctor',
  title: 'Doctor',
  type: 'document',
  fields: [
    defineField({name: 'name', title: 'Name', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'slug', title: 'Slug', type: 'slug', options: {source: 'name'}, validation: (r) => r.required()}),
    defineField({name: 'title', title: 'Title / credentials', type: 'string'}),
    defineField({name: 'designation', title: 'Designation', type: 'string'}),
    defineField({name: 'qualifications', title: 'Qualifications', type: 'array', of: [{type: 'string'}]}),
    defineField({name: 'portrait', title: 'Portrait', type: 'mediaImage'}),
    defineField({name: 'bio', title: 'Bio', type: 'array', of: [{type: 'text'}]}),
    defineField({name: 'experience', title: 'Experience', type: 'string'}),
    defineField({name: 'languages', title: 'Languages', type: 'array', of: [{type: 'string'}]}),
    defineField({name: 'achievements', title: 'Achievements', type: 'array', of: [{type: 'string'}]}),
    defineField({name: 'education', title: 'Education', type: 'array', of: [{type: 'string'}]}),
    defineField({name: 'memberships', title: 'Memberships', type: 'array', of: [{type: 'string'}]}),
    defineField({name: 'expertise', title: 'Expertise', type: 'array', of: [{type: 'string'}]}),
    defineField({name: 'philosophy', title: 'Philosophy', type: 'text', rows: 4}),
    defineField({name: 'consultationCta', title: 'Consultation CTA', type: 'link'}),
    defineField({name: 'signatureTreatments', title: "Where Dr. Omaima's Hands Show Most", type: 'array', of: [{type: 'reference', to: [{type: 'treatment'}]}]}),
  ],
  preview: {select: {title: 'name', subtitle: 'title', media: 'portrait.asset'}},
})
