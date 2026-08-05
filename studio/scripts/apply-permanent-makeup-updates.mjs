// Adds the Permanent Makeup category, procedure treatment pages, cost fields,
// and navbar mega-menu group directly to Sanity.
//
// Usage:
//   SANITY_TOKEN=xxxx node scripts/apply-permanent-makeup-updates.mjs

const PROJECT_ID = process.env.SANITY_STUDIO_PROJECT_ID || '3goot0bo'
const DATASET = process.env.SANITY_STUDIO_DATASET || 'production'
const TOKEN = process.env.SANITY_TOKEN
const API_VERSION = '2023-05-03'
const MUTATE_API = `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/mutate/${DATASET}`
const QUERY_API = `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/query/${DATASET}`

if (!TOKEN) {
  console.error('Missing SANITY_TOKEN env var')
  process.exit(1)
}

let keyN = 0
const key = () => `pm${(keyN++).toString(36)}${Math.random().toString(36).slice(2, 7)}`
const keyed = (arr) => (arr || []).map((item) => ({_key: key(), ...item}))
const ref = (_ref) => ({_type: 'reference', _ref})
const img = (url, alt) => ({_type: 'mediaImage', url, alt})

const category = {
  _id: 'category-permanent-makeup',
  _type: 'category',
  title: 'Permanent Makeup',
  slug: {_type: 'slug', current: 'permanent-makeup'},
  intro: 'Semi-permanent brow, lip, lash and scalp artistry designed around natural balance, colour theory and careful healing.',
  image: img('https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=1600&q=80', 'Permanent makeup consultation'),
  order: 6,
}

const procedures = [
  {
    title: 'Microblading',
    slug: 'microblading',
    group: 'Eyebrows',
    short: 'Fine hair-stroke brow enhancement for sparse or uneven brows.',
    cost: 'Consultation-based',
  },
  {
    title: 'Nanoblading',
    slug: 'nanoblading',
    group: 'Eyebrows',
    short: 'Ultra-fine brow strokes for a soft, feathered finish.',
    cost: 'Consultation-based',
  },
  {
    title: 'Ombre/Powder Brows',
    slug: 'ombre-powder-brows',
    group: 'Eyebrows',
    short: 'A softly shaded brow finish, from airy ombre to polished powder.',
    cost: 'Consultation-based',
  },
  {
    title: 'Combination Brows',
    slug: 'combination-brows',
    group: 'Eyebrows',
    short: 'Hair strokes and soft shading combined for fuller natural-looking brows.',
    cost: 'Consultation-based',
  },
  {
    title: 'Brows Correction (Shape/Colour)',
    slug: 'brows-correction-shape-colour',
    group: 'Eyebrows',
    short: 'Shape and pigment correction for old or uneven brow work.',
    cost: 'Consultation-based',
  },
  {
    title: 'Lip Tint',
    slug: 'lip-tint',
    group: 'Lips',
    short: 'A sheer wash of semi-permanent colour for naturally fresher lips.',
    cost: 'Consultation-based',
  },
  {
    title: 'Lip Blush',
    slug: 'lip-blush',
    group: 'Lips',
    short: 'Soft lip colour enhancement with refined border definition.',
    cost: 'Consultation-based',
  },
  {
    title: 'Lip Correction / Neutralisation',
    slug: 'lip-correction-neutralisation',
    group: 'Lips',
    short: 'Colour balancing for uneven, dark or cool-toned lips.',
    cost: 'Consultation-based',
  },
  {
    title: 'Scalp Micropigmentation',
    slug: 'scalp-micropigmentation',
    group: 'Additional Services',
    short: 'Fine pigment impressions that create the look of denser scalp coverage.',
    cost: 'Consultation-based',
  },
  {
    title: 'Permanent Beauty Mark',
    slug: 'permanent-beauty-mark',
    group: 'Additional Services',
    short: 'A small, carefully placed beauty mark tailored to your face.',
    cost: 'Consultation-based',
  },
  {
    title: 'Eyelash Lift and Tint',
    slug: 'eyelash-lift-and-tint',
    group: 'Additional Services',
    short: 'Lifted, darker-looking lashes without daily curling or mascara.',
    cost: 'Consultation-based',
  },
  {
    title: 'Eyebrow Lamination and Tint',
    slug: 'eyebrow-lamination-and-tint',
    group: 'Additional Services',
    short: 'Brow setting and tinting for a fuller, groomed shape.',
    cost: 'Consultation-based',
  },
]

const procedureDocs = procedures.map((item, index) => ({
  _id: `treatment-${item.slug}`,
  _type: 'treatment',
  title: item.title,
  slug: {_type: 'slug', current: item.slug},
  category: ref(category._id),
  short: item.short,
  status: 'published',
  heroTitle: item.group,
  hero: `${item.title} is part of Artham Aesthetique's Permanent Makeup protocol, mapped for your features, undertone and everyday rhythm.`,
  description: 'Every plan begins with design, shade selection and a healing discussion so the final result feels soft, balanced and personal.',
  image: category.image,
  order: index,
  overviewHeading: `About ${item.title}`,
  what: `${item.title} uses controlled pigment placement to enhance natural definition while keeping the result soft and wearable. The appointment includes mapping, colour selection, careful application and aftercare guidance.`,
  quickInfo: {
    _type: 'quickInfo',
    treatmentTime: '60-120 minutes',
    downtime: 'Mild redness or tenderness',
    results: 'Settles over 4-6 weeks',
    sessionsRequired: 'Initial session plus touch-up if advised',
    anesthesia: 'Topical numbing',
    suitableFor: item.group,
  },
  whoFor: [item.group, 'Natural enhancement', 'Low-maintenance routines', 'Personalised pigment matching'],
  benefits: keyed([
    {_type: 'benefitItem', title: 'Natural definition', description: 'Designed to enhance your existing features rather than overpower them.'},
    {_type: 'benefitItem', title: 'Personalised pigment', description: 'Shade selection is matched to undertone, skin behaviour and healed colour goals.'},
    {_type: 'benefitItem', title: 'Time-saving', description: 'Reduces the need for daily makeup in the treated area.'},
  ]),
  duration: '60-120 minutes',
  sessions: 'Initial session plus touch-up if advised',
  downtime: ['Mild redness or tenderness may be present for a short period.', 'Healed colour settles gradually over 4-6 weeks.'],
  costHeading: `${item.title} cost`,
  costDescription: 'Final cost depends on design complexity, correction requirements and whether a touch-up is recommended after consultation.',
  priceFrom: item.cost,
  pricing: keyed([
    {
      _type: 'costItem',
      label: 'Consultation',
      value: 'Required before procedure',
      description: 'Includes mapping, eligibility check, shade discussion and personalised quote.',
    },
    {
      _type: 'costItem',
      label: 'Touch-up',
      value: 'If advised',
      description: 'Reviewed after healing because pigment retention varies by skin type and aftercare.',
    },
  ]),
  howItWorks: keyed([
    {_type: 'step', title: 'Design and mapping', body: 'Shape, placement and colour are mapped with you before pigment work begins.'},
    {_type: 'step', title: 'Pigment placement', body: 'Sterile tools and controlled technique are used for soft, even enhancement.'},
    {_type: 'step', title: 'Healing review', body: 'Aftercare is explained clearly, with touch-up planning if the healed result needs refinement.'},
  ]),
  doctorNote: 'Permanent makeup should look considered, not stamped on. We keep the design soft, balanced and guided by how pigment heals in real skin.',
  faqs: keyed([
    {_type: 'qa', q: `Is ${item.title} painful?`, a: 'Topical numbing is used for comfort. Most clients describe the sensation as manageable pressure or scratching.'},
    {_type: 'qa', q: 'How long does it last?', a: 'Longevity varies by skin type, pigment choice, lifestyle and aftercare. We explain realistic expectations during consultation.'},
    {_type: 'qa', q: 'Will it look natural?', a: 'The goal is a soft enhancement that suits your features. Shape and shade are approved before application.'},
  ]),
  seo: {
    _type: 'seoFields',
    title: `${item.title} in Noida`,
    description: `${item.short} Book a Permanent Makeup consultation at Artham Aesthetique, Noida.`,
    keywords: [item.title, 'Permanent Makeup Noida', 'Artham Aesthetique'],
  },
}))

async function sanityFetch(url, body) {
  const res = await fetch(url, {
    method: body ? 'POST' : 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${TOKEN}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  const json = await res.json()
  if (!res.ok) {
    throw new Error(JSON.stringify(json, null, 2))
  }
  return json
}

async function run() {
  const existing = await sanityFetch(`${QUERY_API}?query=${encodeURIComponent('*[_id == "siteSettings"][0]{megaGroups}')}`)
  const groups = existing.result?.megaGroups || []
  const filteredGroups = groups.filter((group) => group.heading !== 'Permanent Makeup')
  const permanentMakeupGroup = {
    _type: 'megaGroup',
    _key: key(),
    heading: 'Permanent Makeup',
    category: ref(category._id),
    treatments: keyed(procedureDocs.map((doc) => ({_type: 'reference', _ref: doc._id}))),
  }

  const mutations = [
    {createOrReplace: category},
    ...procedureDocs.map((doc) => ({createOrReplace: doc})),
    {
      patch: {
        id: 'siteSettings',
        set: {
          megaGroups: [...filteredGroups, permanentMakeupGroup],
        },
      },
    },
  ]

  await sanityFetch(MUTATE_API, {mutations})
  console.log(`Updated Sanity with ${procedureDocs.length} Permanent Makeup treatment pages and menu group.`)
}

run().catch((error) => {
  console.error(error.message || error)
  process.exit(1)
})
