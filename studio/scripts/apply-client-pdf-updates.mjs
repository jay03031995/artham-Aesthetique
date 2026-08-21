// Applies the client PDF content updates for the homepage and Hydrafacial page.
//
// Usage:
//   SANITY_TOKEN=xxxx node scripts/apply-client-pdf-updates.mjs

const PROJECT_ID = process.env.SANITY_STUDIO_PROJECT_ID || "3goot0bo";
const DATASET = process.env.SANITY_STUDIO_DATASET || "production";
const API_VERSION = "2026-07-13";
const TOKEN = process.env.SANITY_TOKEN;

if (!TOKEN) {
  console.error("Missing SANITY_TOKEN env var");
  process.exit(1);
}

const queryUrl = `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/query/${DATASET}`;
const mutateUrl = `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/mutate/${DATASET}`;

const key = (prefix, index) => `${prefix}${index.toString(36)}`;

const qa = (index, q, a) => ({ _type: "qa", _key: key("homeFaq", index), q, a });
const iconText = (prefix, index, title, description) => ({
  _type: "iconText",
  _key: key(prefix, index),
  title,
  description,
});
const step = (index, title, body) => ({ _type: "step", _key: key("hydraStep", index), title, body });
const benefit = (index, title, description) => ({ _type: "benefitItem", _key: key("hydraBenefit", index), title, description });
const costItem = (index, label, value, description) => ({
  _type: "costItem",
  _key: key("hydraCost", index),
  label,
  value,
  description,
});

const headers = {
  Authorization: `Bearer ${TOKEN}`,
  "Content-Type": "application/json",
};

const sharedSectionImage = {
  _type: "mediaImage",
  url: "https://arthamaesthetic.com/og-image.jpeg",
  alt: "Artham Aesthetics clinic interior",
};

async function sanityFetch(url, body) {
  const res = await fetch(url, {
    method: body ? "POST" : "GET",
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(JSON.stringify(json, null, 2));
  return json;
}

const homePatch = {
  title: "Home Page",
  expertiseEyebrow: "Explore Our Treatments",
  expertiseHeading: "Explore Our Expertise",
  expertiseDescription:
    "From the softest facials to advanced regenerative protocols - designed and supervised by Dr. Omaima Jawed.",
  whyChooseEyebrow: "Why Artham",
  whyChooseHeading: "Why Choose Artham Aesthetics?",
  whyChooseDescription:
    "At Artham Aesthetics, care is planned around your skin, your needs, and how you respond to treatment. This means your plan is adjusted based on your skin condition, your goals, and changes seen during follow-up visits.",
  whyChooseImage: sharedSectionImage,
  whyChooseUs: [
    iconText("homeWhy", 0, "Doctor-Led Care", "Dr. Omaima Jawed leads your consultation and every follow-up herself, from start to finish, ensuring continuity of care at every step."),
    iconText("homeWhy", 1, "Personalized Treatment Plan", "Your plan is based on what your skin needs this season, your calendar, and how your skin responds during treatment."),
    iconText("homeWhy", 2, "Physician-Supervised Sessions", "Every session takes place under physician oversight, using clinically selected devices and careful treatment protocols."),
    iconText("homeWhy", 3, "Only What Your Skin Needs", "Your plan includes only the treatments your skin needs. If something is not needed, it is not added."),
  ],
  faqs: [
    qa(0, "Who leads treatments at Artham Aesthetics?", "Treatments and follow-ups are planned under the guidance of Dr. Omaima Jawed, with a consultation-first approach."),
    qa(1, "Do I need a consultation before booking a treatment?", "Yes. A consultation helps the team understand your skin, goals, calendar, and suitability before recommending a treatment plan."),
    qa(2, "Are treatment plans personalized?", "Yes. Plans are adjusted based on your skin condition, treatment goals, response, and follow-up observations."),
    qa(3, "Can I see real results before choosing a treatment?", "Yes. The results page shares before-and-after cases so you can review treatment outcomes before booking."),
  ],
};

const hydrafacialPatch = {
  title: "HydraFacial",
  image: sharedSectionImage,
  pageTitle: "HydraFacial Treatment in Noida",
  hero: "The gold-standard three-step facial for clean, plump, camera-ready skin.",
  description:
    "A gentle, no-downtime treatment that deeply cleanses, exfoliates, extracts impurities, and hydrates the skin in one session.",
  whatHeading: "What is HydraFacial",
  overviewHeading: "HydraFacial Treatment, explained simply.",
  what:
    "HydraFacial treatment is a non-invasive skin rejuvenation treatment that deeply cleanses, exfoliates, extracts impurities, and hydrates the skin in one session. Using advanced vortex technology, it removes dead skin cells and unclogs pores while infusing the skin with nourishing serums containing antioxidants, peptides, and hyaluronic acid. The treatment is gentle, painless, and suitable for almost every skin type, with no downtime required. Whether you're dealing with dull skin, enlarged pores, dehydration, fine lines, or uneven skin tone, HydraFacial helps restore a healthier, smoother, and naturally radiant complexion. Many people notice refreshed, glowing skin immediately after their treatment.",
  quickInfo: {
    _type: "quickInfo",
    treatmentTime: "45-60 minutes",
    downtime: "Minimal",
    results: "1-2 weeks",
    sessionsRequired: "1 session",
  },
  duration: "45-60 minutes",
  sessions: "1 session",
  priceFrom: "Rs. 2,000 - Rs. 6,000 per session",
  costHeading: "Cost of HydraFacial Treatment in Noida",
  costDescription:
    "The cost of HydraFacial treatment in Noida varies depending on factors such as your skin concerns, the number of sessions required, and whether any specialized boosters are included in the treatment. After a detailed skin assessment, our experts recommend a personalized treatment plan and provide transparent pricing with no hidden charges. Contact us to book a consultation and receive a customized cost estimate based on your skin's needs.",
  pricing: [
    costItem(0, "HydraFacial Treatment Cost", "Rs. 2,000 - Rs. 6,000 per session", "Final pricing depends on skin concerns, boosters, and the recommended treatment plan."),
  ],
  procedureHeading: "Procedures of HydraFacial Treatment",
  processHeading: "Procedures of HydraFacial Treatment",
  howItWorks: [
    step(0, "Skin Assessment", "Your skincare specialist begins by examining your skin type and concerns, such as acne, pigmentation, dehydration, enlarged pores, or fine lines. This helps customize the HydraFacial treatment to your skin's needs."),
    step(1, "Cleansing & Exfoliation", "The skin is gently cleansed to remove dirt, oil, and makeup. Dead skin cells are then exfoliated to reveal a fresh layer of healthy skin and prepare it for the next steps."),
    step(2, "Gentle Extraction", "Using HydraFacial's vortex suction technology, blackheads, excess oil, and impurities are extracted from clogged pores without squeezing or causing discomfort."),
    step(3, "Hydration & Serum Infusion", "The skin is infused with hydrating serums enriched with antioxidants, peptides, and hyaluronic acid. These ingredients nourish the skin, improve hydration, and support a smoother, healthier complexion."),
    step(4, "Protection & Aftercare", "The treatment concludes with moisturizer and sunscreen to protect your skin. You can return to your normal routine immediately and enjoy smoother, hydrated, and glowing skin with no downtime."),
  ],
  benefitsHeading: "Benefits of HydraFacial Treatment",
  benefits: [
    benefit(0, "Deep Cleansing", "HydraFacial deeply cleanses the skin by removing dirt, excess oil, dead skin cells, and impurities from the pores, leaving your skin fresh and revitalized."),
    benefit(1, "Improves Skin Hydration", "The treatment infuses the skin with hydrating serums containing antioxidants, peptides, and hyaluronic acid to restore moisture and improve overall skin health."),
    benefit(2, "Enhances Skin Glow", "By exfoliating the skin and delivering nourishing ingredients, HydraFacial helps reveal a brighter, smoother, and naturally radiant complexion."),
    benefit(3, "Refines Skin Texture", "Regular HydraFacial sessions can improve uneven skin texture, reduce roughness, and minimize the appearance of enlarged pores."),
    benefit(4, "Reduces Fine Lines", "Hydration and antioxidant-rich serums help soften the appearance of fine lines and support healthier, younger-looking skin."),
    benefit(5, "Helps Control Oily Skin", "The treatment removes excess sebum and unclogs pores, making it beneficial for individuals with oily or acne-prone skin."),
    benefit(6, "Suitable for All Skin Types", "HydraFacial is gentle and customizable, making it suitable for dry, oily, combination, and sensitive skin without causing irritation."),
    benefit(7, "No Downtime", "As a non-invasive treatment, HydraFacial allows you to return to your daily routine immediately while enjoying refreshed and hydrated skin."),
  ],
  symptoms: [
    iconText("hydraConcern", 0, "Dull and tired-looking skin", ""),
    iconText("hydraConcern", 1, "Dehydrated or dry skin", ""),
    iconText("hydraConcern", 2, "Enlarged and clogged pores", ""),
    iconText("hydraConcern", 3, "Blackheads and whiteheads", ""),
    iconText("hydraConcern", 4, "Oily and acne-prone skin", ""),
    iconText("hydraConcern", 5, "Mild acne and congestion", ""),
    iconText("hydraConcern", 6, "Uneven skin tone", ""),
    iconText("hydraConcern", 7, "Rough or uneven skin texture", ""),
    iconText("hydraConcern", 8, "Fine lines and early signs of aging", ""),
    iconText("hydraConcern", 9, "Hyperpigmentation and sun damage", ""),
    iconText("hydraConcern", 10, "Loss of skin radiance", ""),
    iconText("hydraConcern", 11, "Minor blemishes and post-acne marks", "Since every skin type is different, HydraFacial can be customized with targeted serums and boosters to address your individual skin concerns and goals."),
  ],
  whoFor: ["Congested pores", "Dullness", "Fine lines", "Pre-event", "Every skin type"],
  resultsHeading: "Treatment Before and After",
  whyChooseHeading: "Why Choose Artham Aesthetics for HydraFacial Treatment",
  whyChooseDescription:
    "HydraFacial at Artham Aesthetics is planned after a skin assessment so the treatment can be matched to your skin type, current concerns, and goals.",
  whyChooseItems: [
    "Doctor-led consultation before treatment planning.",
    "Customizable serums and boosters based on skin concerns.",
    "Gentle, no-downtime care suitable for most skin types.",
    "Transparent guidance on cost, sessions, and aftercare.",
  ],
};

async function run() {
  const query = `{
    "home": *[_type == "homePage"][0]{_id},
    "hydrafacial": *[_type == "treatment" && slug.current in ["hydrafacial-treatment", "hydrafacial-treatment-in-noida", "hydrafacial"]][0]{_id, title, "slug": slug.current}
  }`;
  const { result } = await sanityFetch(`${queryUrl}?query=${encodeURIComponent(query)}`);

  const mutations = [];
  if (result.home?._id) {
    mutations.push({ patch: { id: result.home._id, set: homePatch } });
  } else {
    mutations.push({ create: { _id: "homePage", _type: "homePage", ...homePatch } });
  }

  if (!result.hydrafacial?._id) {
    throw new Error("Could not find Hydrafacial treatment by slug.");
  }
  mutations.push({ patch: { id: result.hydrafacial._id, set: hydrafacialPatch } });

  await sanityFetch(mutateUrl, { mutations });
  console.log(`Updated homepage and ${result.hydrafacial.slug} in ${PROJECT_ID}/${DATASET}.`);
}

run().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
