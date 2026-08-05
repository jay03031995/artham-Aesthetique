// Updates treatment-page SEO/readability fields directly in Sanity.
//
// Usage:
//   SANITY_TOKEN=xxxx node scripts/apply-treatment-page-content-updates.mjs

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

const doctorName = 'Dr. Omaima Jawed'
const doctorCredentials = 'MBBS, MD Dermatology and Cosmetic Dermatology Fellowship'

const cleanTitle = (title = '') => title.replace(/\s+in\s+Noida$/i, '').trim()

const treatmentTitle = (title) => {
  const base = cleanTitle(title)
  return /\b(treatment|therapy|facial|peel|boosters?|fillers?|botox|transplant|makeup|blush|tint|lamination|micropigmentation|microblading|nanoblading)\b/i.test(base)
    ? base
    : `${base} Treatment`
}

const genericFields = (title) => {
  const base = cleanTitle(title)
  const treatment = treatmentTitle(base)
  return {
    pageTitle: `${treatment} in Noida`,
    whatHeading: `What is ${treatment}`,
    overviewHeading: `${treatment}, explained simply`,
    idealCandidateHeading: 'Ideal candidate for the treatment',
    procedureHeading: `Procedures of ${treatment}`,
    processHeading: `A Step-by-Step Approach to ${treatment}`,
    benefitsHeading: `Benefits of ${treatment}`,
    resultsHeading: 'Before after results',
    whyChooseHeading: `Why Choose Artham Aesthetics for ${treatment}`,
    whyChooseDescription: `Artham Aesthetics follows a consultation-first approach for ${treatment}. Each plan is selected after understanding your concern, skin or hair history, comfort level and expected outcome.`,
    whyChooseItems: [
      'Doctor-led assessment before treatment planning.',
      'Personalised protocols instead of one-size-fits-all packages.',
      'Modern, clinically selected technology and sterile treatment standards.',
      'Clear aftercare guidance and follow-up support.',
    ],
    specialistHeading: `Best Skin Specialist for ${treatment}`,
    specialistDescription: `${doctorName} (${doctorCredentials}) leads treatment planning at Artham Aesthetics. Her experience in medical dermatology, lasers, injectables and aesthetic procedures helps patients choose the right approach with confidence.`,
    specialistHighlights: [
      `${doctorName} personally guides suitability and treatment planning.`,
      'Expertise across acne, pigmentation, hair loss, lasers, injectables and regenerative aesthetics.',
      'Focus on natural-looking, medically appropriate and patient-friendly outcomes.',
    ],
    faqHeading: 'Frequently Asked Question (FAQs)',
  }
}

const acneFields = {
  pageTitle: 'Acne Treatment in Noida',
  whatHeading: 'What is Acne Treatment',
  overviewHeading: 'Acne Treatment, explained simply',
  idealCandidateHeading: 'Ideal candidate for the treatment',
  procedureHeading: 'Procedures of Acne Treatment',
  processHeading: 'A Step-by-Step Approach to Clearer Skin',
  benefitsHeading: 'Benefits of Acne Treatments',
  resultsHeading: 'Before after results',
  whyChooseHeading: 'Why Choose Artham Aesthetics for Acne Treatment',
  whyChooseDescription:
    'Artham Aesthetics offers doctor-led acne care that focuses on the cause of breakouts, not just temporary surface clearing. The plan may include medical assessment, in-clinic procedures, skincare guidance and follow-up support.',
  whyChooseItems: [
    'Experienced dermatology-led acne assessment.',
    'Personalised acne plans based on skin type, acne pattern and lifestyle.',
    'Clinic protocols may include peels, extractions, LED, prescription care and scar-prevention guidance.',
    'Patient-focused care with simple instructions and clear follow-up.',
  ],
  specialistHeading: 'Best Skin Doctor for Acne Treatment',
  specialistDescription:
    `${doctorName} (${doctorCredentials}) leads acne treatment planning at Artham Aesthetics. Her expertise in medical dermatology, acne management, pigmentation, peels, lasers and regenerative skin care helps patients receive clear, practical and trustworthy guidance.`,
  specialistHighlights: [
    `${doctorName} reviews acne type, skin history and triggers before planning treatment.`,
    'Expertise in active acne, hormonal acne, post-acne marks and acne-scar prevention.',
    'Treatment plans are designed to be simple, understandable and easy to follow.',
  ],
  faqHeading: 'Frequently Asked Question (FAQs)',
}

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
  const query = '*[_type == "treatment"]{_id, title, "slug": slug.current}'
  const {result: treatments = []} = await sanityFetch(`${QUERY_API}?query=${encodeURIComponent(query)}`)
  const mutations = treatments.map((doc) => ({
    patch: {
      id: doc._id,
      set: doc.slug === 'acne-treatment' ? acneFields : genericFields(doc.title),
    },
  }))

  if (!mutations.length) {
    console.log('No treatment documents found.')
    return
  }

  await sanityFetch(MUTATE_API, {mutations})
  console.log(`Updated SEO/readability CMS fields for ${mutations.length} treatment pages.`)
}

run().catch((error) => {
  console.error(error.message || error)
  process.exit(1)
})
