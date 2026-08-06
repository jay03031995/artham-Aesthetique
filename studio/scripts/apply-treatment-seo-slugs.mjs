// Updates all treatment slugs to the SEO format: {treatment-slug}-in-noida.
//
// Usage:
//   SANITY_TOKEN=xxxx node scripts/apply-treatment-seo-slugs.mjs

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

const baseTreatmentSlug = (slug = '') => slug.replace(/-in-noida$/i, '')
const seoTreatmentSlug = (slug = '') => {
  const base = baseTreatmentSlug(slug)
  return base ? `${base}-in-noida` : ''
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
  const mutations = treatments
    .map((doc) => {
      const nextSlug = seoTreatmentSlug(doc.slug)
      if (!nextSlug) return null
      return {
        patch: {
          id: doc._id,
          setIfMissing: {
            seo: {_type: 'seoFields'},
          },
          set: {
            slug: {_type: 'slug', current: nextSlug},
            'seo.canonicalUrl': `https://arthamaesthetic.com/${nextSlug}`,
          },
        },
      }
    })
    .filter(Boolean)

  if (!mutations.length) {
    console.log('No treatment documents found.')
    return
  }

  await sanityFetch(MUTATE_API, {mutations})
  console.log(`Updated ${mutations.length} treatment slugs to treatment-in-noida format.`)
}

run().catch((error) => {
  console.error(error.message || error)
  process.exit(1)
})
