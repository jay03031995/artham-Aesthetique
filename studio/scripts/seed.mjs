// Seed the Sanity `production` dataset from the existing static data files.
// No dependencies — uses Node 18+ global fetch + the Sanity HTTP Mutations API.
//
// Usage:
//   SANITY_TOKEN=xxxx node scripts/seed.mjs
//
// The data files are copied to ./_data/*.mjs (see the runner) so Node can import
// them as ES modules regardless of the frontend's CommonJS package.json.

import { CATEGORIES } from "./_data/treatments.mjs";
import { POSTS } from "./_data/blog.mjs";
import { SITE } from "./_data/site.mjs";

const PROJECT_ID = process.env.SANITY_STUDIO_PROJECT_ID || "3goot0bo";
const DATASET = process.env.SANITY_STUDIO_DATASET || "production";
const API = `https://${PROJECT_ID}.api.sanity.io/v2023-05-03/data/mutate/${DATASET}`;
const TOKEN = process.env.SANITY_TOKEN;

if (!TOKEN) {
  console.error("✗ Missing SANITY_TOKEN env var");
  process.exit(1);
}

let keyN = 0;
const key = () => `k${(keyN++).toString(36)}${Math.random().toString(36).slice(2, 6)}`;
// add _key to every object in an array (required by Sanity for object arrays)
const keyed = (arr) => (arr || []).map((o) => ({ _key: key(), ...o }));
const img = (url) => (url ? { url } : undefined);
const catId = (slug) => `category-${slug}`;
const ref = (id) => ({ _type: "reference", _ref: id });

const docs = [];

/* ---------- Site settings (singleton) ---------- */
docs.push({
  _id: "siteSettings",
  _type: "siteSettings",
  title: SITE.name,
  tagline: SITE.tagline,
  wordmarkDeva: SITE.wordmarkDeva,
  phone: SITE.phone,
  phoneDigits: SITE.phoneDigits,
  hours: SITE.hours,
  address: { ...SITE.address },
  logo: img(SITE.logoUrl),
  footerLogo: img(SITE.footerLogoUrl),
  doctorPortrait: img(SITE.doctorPortraitUrl),
  heroImage: img(SITE.heroImageUrl),
  heroVideoUrl: SITE.heroVideoUrl,
  social: { ...SITE.social },
  nav: keyed([
    { _type: "navItem", label: "Home", href: "/" },
    { _type: "navItem", label: "Treatments", href: "/category/skin" },
    { _type: "navItem", label: "Results", href: "/results" },
    { _type: "navItem", label: "Doctor", href: "/doctors/dr-omaima-jawed" },
    { _type: "navItem", label: "Journal", href: "/blog" },
    { _type: "navItem", label: "About", href: "/about" },
    { _type: "navItem", label: "Contact", href: "/contact" },
  ]),
  megaGroups: keyed(
    CATEGORIES.map((c) => ({
      _type: "megaGroup",
      heading: c.name,
      category: ref(catId(c.slug)),
      treatments: keyed(c.services.slice(0, 6).map((s) => ({ _type: "reference", _ref: `treatment-${s.slug}` }))),
    }))
  ),
});

/* ---------- Categories + Treatments ---------- */
CATEGORIES.forEach((c, ci) => {
  docs.push({
    _id: catId(c.slug),
    _type: "category",
    title: c.name,
    slug: { _type: "slug", current: c.slug },
    intro: c.intro,
    image: img(c.image),
    order: ci,
  });

  c.services.forEach((s, si) => {
    docs.push({
      _id: `treatment-${s.slug}`,
      _type: "treatment",
      title: s.name,
      slug: { _type: "slug", current: s.slug },
      category: ref(catId(c.slug)),
      short: s.short,
      hero: s.hero,
      image: img(s.image),
      featured: ["hydrafacial-treatment", "pdrn-skin-boosters", "hifu", "dermal-fillers", "micro-needling", "coolsculpting"].includes(s.slug),
      order: si,
      what: s.what,
      whoFor: s.whoFor || [],
      benefits: s.benefits || [],
      duration: s.duration,
      sessions: s.sessions,
      downtime: (s.downtime || []).map((d) => (typeof d === "string" ? d : d.body || d.title || "")).filter(Boolean),
      howItWorks: keyed((s.howItWorks || []).map((h) => ({ _type: "step", title: h.title, body: h.body }))),
      doctorNote: s.doctorNote,
      faqs: keyed((s.faqs || []).map((f) => ({ _type: "qa", q: f.q, a: f.a }))),
    });
  });
});

/* ---------- Doctor (from SITE) ---------- */
docs.push({
  _id: "doctor-omaima-jawed",
  _type: "doctor",
  name: "Dr. Omaima Jawed",
  slug: { _type: "slug", current: "dr-omaima-jawed" },
  title: "MBBS · MD Dermatology · Cosmetic Dermatology Fellowship",
  portrait: img(SITE.doctorPortraitUrl),
  philosophy: "Dr-led, evidence-based aesthetics with restraint — only what your skin actually needs.",
  expertise: ["Medical dermatology", "Lasers", "Injectables", "Regenerative aesthetics"],
});

/* ---------- Journal articles ---------- */
POSTS.forEach((p) => {
  docs.push({
    _id: `post-${p.slug}`,
    _type: "post",
    title: p.title,
    slug: { _type: "slug", current: p.slug },
    category: p.category,
    excerpt: p.excerpt,
    cover: img(p.coverImage),
    date: p.date,
    updated: p.updated,
    keywords: p.keywords || [],
    aliases: p.aliases || [],
    lead: p.lead || [],
    sections: keyed(
      (p.sections || []).map((sec) => ({
        _type: "journalSection",
        heading: sec.heading,
        level: sec.level || 2,
        id: sec.id,
        blocks: keyed(
          (sec.blocks || []).map((b) => {
            const base = { _type: "journalBlock", type: b.type };
            if (b.type === "p" || b.type === "quote") base.text = b.text;
            if (b.type === "ul" || b.type === "ol") base.items = b.items || [];
            if (b.type === "table") {
              base.head = b.head || [];
              base.rows = keyed((b.rows || []).map((r) => ({ _type: "row", cells: r })));
            }
            return base;
          })
        ),
      }))
    ),
    keyFacts: keyed((p.keyFacts || []).map((k) => ({ _type: "keyFact", label: k.label, value: k.value }))),
    references: keyed((p.references || []).map((r) => ({ _type: "link", label: r.label || r.text || r.url, url: r.url }))),
    faq: keyed((p.faq || []).map((f) => ({ _type: "qa", q: f.q, a: f.a }))),
    furtherReading: keyed((p.furtherReading || []).map((r) => ({ _type: "link", label: r.label || r.url, url: r.url }))),
  });
});

/* ---------- push (single transaction so intra-batch refs resolve) ---------- */
// Referenced docs (categories, treatments) must exist before the referring doc
// in the same transaction — so put siteSettings last.
docs.sort((a, b) => (a._id === "siteSettings" ? 1 : 0) - (b._id === "siteSettings" ? 1 : 0));
const mutations = docs.map((doc) => ({ createOrReplace: doc }));

async function run() {
  const res = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${TOKEN}` },
    body: JSON.stringify({ mutations }),
  });
  const json = await res.json();
  if (!res.ok) {
    console.error("✗ Seed failed:", JSON.stringify(json, null, 2));
    process.exit(1);
  }
  console.log(`✓ Seeded ${docs.length} documents into ${PROJECT_ID}/${DATASET}`);
  const counts = docs.reduce((m, d) => ((m[d._type] = (m[d._type] || 0) + 1), m), {});
  console.log("  " + Object.entries(counts).map(([t, n]) => `${t}: ${n}`).join(", "));
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
