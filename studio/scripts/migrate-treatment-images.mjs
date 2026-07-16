// One-time migration: collapse old treatment image fields into `image`.
//
// Usage:
//   SANITY_TOKEN=xxxx node scripts/migrate-treatment-images.mjs

const PROJECT_ID = process.env.SANITY_STUDIO_PROJECT_ID || "3goot0bo";
const DATASET = process.env.SANITY_STUDIO_DATASET || "production";
const API_VERSION = "2023-05-03";
const TOKEN = process.env.SANITY_TOKEN;

if (!TOKEN) {
  console.error("Missing SANITY_TOKEN env var");
  process.exit(1);
}

const queryUrl = `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/query/${DATASET}`;
const mutateUrl = `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/mutate/${DATASET}`;
const headers = {
  Authorization: `Bearer ${TOKEN}`,
  "Content-Type": "application/json",
};

const query = `*[_type == "treatment" && (
  defined(heroImage) ||
  defined(heroBackgroundImage) ||
  defined(cardImage) ||
  defined(featuredImage)
)]{
  _id,
  image,
  cardImage,
  featuredImage,
  heroImage,
  heroBackgroundImage
}`;

const pickImage = (doc) =>
  doc.image ||
  doc.cardImage ||
  doc.featuredImage ||
  doc.heroImage ||
  doc.heroBackgroundImage;

const queryRes = await fetch(`${queryUrl}?query=${encodeURIComponent(query)}`, { headers });
if (!queryRes.ok) {
  throw new Error(`Query failed (${queryRes.status}): ${await queryRes.text()}`);
}

const docs = (await queryRes.json()).result || [];
const mutations = docs.map((doc) => {
  const patch = {
    id: doc._id,
    unset: ["heroImage", "heroBackgroundImage", "cardImage", "featuredImage"],
  };
  const image = pickImage(doc);
  if (image) patch.set = { image };
  return { patch };
});

if (!mutations.length) {
  console.log("No treatment image fields to migrate.");
  process.exit(0);
}

const mutateRes = await fetch(mutateUrl, {
  method: "POST",
  headers,
  body: JSON.stringify({ mutations }),
});

if (!mutateRes.ok) {
  throw new Error(`Mutation failed (${mutateRes.status}): ${await mutateRes.text()}`);
}

console.log(`Migrated ${mutations.length} treatment documents to the single image field.`);
