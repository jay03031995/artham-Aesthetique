// Fill empty Sanity treatment fields from the existing treatment data.
//
// This is intentionally conservative: it only patches fields that are missing
// or empty in Sanity, so manually edited pages like Acne Treatment stay intact.
//
// Usage:
//   SANITY_TOKEN=xxxx node scripts/patch-empty-treatment-content.mjs
//   DRY_RUN=false SANITY_TOKEN=xxxx node scripts/patch-empty-treatment-content.mjs

import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const PROJECT_ID = process.env.SANITY_STUDIO_PROJECT_ID || "3goot0bo";
const DATASET = process.env.SANITY_STUDIO_DATASET || "production";
const API_VERSION = "2026-07-13";
const TOKEN = process.env.SANITY_TOKEN;
const DRY_RUN = process.env.DRY_RUN !== "false";

const root = fileURLToPath(new URL("../..", import.meta.url));
const queryUrl = `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/query/${DATASET}`;
const mutateUrl = `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/mutate/${DATASET}`;

const loadModule = async (relativePath) => {
  const source = await readFile(resolve(root, relativePath), "utf8");
  const encoded = Buffer.from(source).toString("base64");
  return import(`data:text/javascript;base64,${encoded}`);
};

const key = (prefix, index) => `${prefix}${index.toString(36)}`;
const compact = (obj) =>
  Object.fromEntries(Object.entries(obj).filter(([, value]) => value !== undefined && value !== null && value !== ""));
const cleanArray = (items) => (Array.isArray(items) ? items : items ? [items] : []).filter(Boolean);

const rowValue = (rows, label) => {
  const item = cleanArray(rows).find((row) => row?.label?.toLowerCase() === label.toLowerCase());
  return item?.value || "";
};

const quickInfoFromService = (service) =>
  compact({
    _type: "quickInfo",
    treatmentTime: rowValue(service.downtime, "Session Duration") || rowValue(service.downtime, "Treatment Time") || service.duration,
    downtime: rowValue(service.downtime, "Downtime"),
    results: rowValue(service.downtime, "Results Visible") || rowValue(service.downtime, "Results"),
    sessionsRequired: rowValue(service.downtime, "Sessions") || service.sessions,
    recoveryTime: rowValue(service.downtime, "Recovery Time"),
    anesthesia: rowValue(service.downtime, "Anesthesia"),
    suitableFor: cleanArray(service.whoFor).slice(0, 3).join(", "),
  });

const benefitItems = (benefits) =>
  cleanArray(benefits)
    .map((benefit, index) => {
      if (typeof benefit === "string") {
        return { _type: "benefitItem", _key: key("benefit", index), title: benefit };
      }
      return compact({
        _type: "benefitItem",
        _key: benefit._key || key("benefit", index),
        title: benefit.title || benefit.name,
        description: benefit.description || benefit.body,
        icon: benefit.icon,
      });
    })
    .filter((benefit) => benefit.title || benefit.description);

const iconTextItems = (items) =>
  cleanArray(items)
    .map((item, index) => {
      if (typeof item === "string") return { _type: "iconText", _key: key("symptom", index), title: item };
      return compact({
        _type: "iconText",
        _key: item._key || key("symptom", index),
        title: item.title || item.name,
        description: item.description || item.body,
        image: item.image,
      });
    })
    .filter((item) => item.title || item.description);

const stepItems = (steps) =>
  cleanArray(steps)
    .map((step, index) =>
      compact({
        _type: "step",
        _key: step._key || key("step", index),
        title: step.title,
        body: step.body || step.description,
        image: step.image,
      }),
    )
    .filter((step) => step.title || step.body);

const faqItems = (faqs) =>
  cleanArray(faqs)
    .map((faq, index) =>
      compact({
        _type: "qa",
        _key: faq._key || key("faq", index),
        q: faq.q || faq.question,
        a: faq.a || faq.answer,
      }),
    )
    .filter((faq) => faq.q && faq.a);

const headers = ({ requireToken = false } = {}) => {
  if (requireToken && !TOKEN) {
    console.error("Missing SANITY_TOKEN env var");
    process.exit(1);
  }
  return compact({
    Authorization: TOKEN ? `Bearer ${TOKEN}` : "",
    "Content-Type": "application/json",
  });
};

const query = `*[_type == "treatment"]{
  _id,
  title,
  "slug": slug.current,
  description,
  overviewHeading,
  what,
  whoFor,
  symptoms,
  benefits,
  quickInfo,
  howItWorks,
  doctorNote,
  faqs,
  seo
}`;

const [{ ALL_SERVICES }, { TREATMENT_KEYWORDS, serviceCanonical }] = await Promise.all([
  loadModule("frontend/src/data/treatments.js"),
  loadModule("frontend/src/data/seoKeywords.js"),
]);

const sourceBySlug = new Map(ALL_SERVICES.map((service) => [service.slug, service]));

const res = await fetch(`${queryUrl}?query=${encodeURIComponent(query)}`, { headers: headers() });
if (!res.ok) throw new Error(`Query failed (${res.status}): ${await res.text()}`);

const docs = (await res.json()).result || [];
const mutations = [];

for (const doc of docs) {
  const source = sourceBySlug.get(doc.slug);
  if (!source) continue;

  const set = {};
  const sourceBenefits = benefitItems(source.benefits);
  const sourceSymptoms = iconTextItems(source.symptoms);
  const sourceSteps = stepItems(source.howItWorks);
  const sourceFaqs = faqItems(source.faqs);
  const sourceQuickInfo = quickInfoFromService(source);
  const sourceKeywords = TREATMENT_KEYWORDS[source.slug] || [];

  if (!doc.description && source.hero) set.description = source.hero;
  if (!doc.overviewHeading) set.overviewHeading = `What is ${source.name}?`;
  if (!doc.what && source.what) set.what = source.what;
  if (!cleanArray(doc.whoFor).length && cleanArray(source.whoFor).length) set.whoFor = source.whoFor;
  if (!cleanArray(doc.benefits).length && sourceBenefits.length) set.benefits = sourceBenefits;
  if (!cleanArray(doc.symptoms).length && sourceSymptoms.length) set.symptoms = sourceSymptoms;
  if (!doc.quickInfo && Object.keys(sourceQuickInfo).length > 1) set.quickInfo = sourceQuickInfo;
  if (!cleanArray(doc.howItWorks).length && sourceSteps.length) set.howItWorks = sourceSteps;
  if (!doc.doctorNote && source.doctorNote) set.doctorNote = source.doctorNote;
  if (!cleanArray(doc.faqs).length && sourceFaqs.length) set.faqs = sourceFaqs;

  const seo = compact({
    ...(doc.seo || { _type: "seoFields" }),
    _type: "seoFields",
    title: doc.seo?.title || `${source.name} in Noida`,
    description: doc.seo?.description || source.short,
    canonicalUrl: doc.seo?.canonicalUrl || serviceCanonical(source.slug),
  });
  if (cleanArray(doc.seo?.keywords).length) seo.keywords = doc.seo.keywords;
  else if (sourceKeywords.length) seo.keywords = sourceKeywords;

  const needsSeo =
    !doc.seo ||
    !doc.seo.title ||
    !doc.seo.description ||
    !doc.seo.canonicalUrl ||
    (sourceKeywords.length > 0 && !cleanArray(doc.seo.keywords).length);
  if (needsSeo) {
    set.seo = seo;
  }

  if (Object.keys(set).length) {
    mutations.push({ patch: { id: doc._id, set } });
  }
}

console.log(`${DRY_RUN ? "Dry run:" : "Applying:"} ${mutations.length} treatment document patches`);
for (const mutation of mutations) {
  const fields = Object.keys(mutation.patch.set).join(", ");
  console.log(`- ${mutation.patch.id}: ${fields}`);
}

if (DRY_RUN || !mutations.length) process.exit(0);

const mutateRes = await fetch(mutateUrl, {
  method: "POST",
  headers: headers({ requireToken: true }),
  body: JSON.stringify({ mutations }),
});

if (!mutateRes.ok) throw new Error(`Mutation failed (${mutateRes.status}): ${await mutateRes.text()}`);

console.log(`Patched ${mutations.length} treatment documents in ${PROJECT_ID}/${DATASET}.`);
