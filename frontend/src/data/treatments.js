// Treatment taxonomy — matches Dermapuritys structure exactly.
// Six categories, ~37 treatments total. Each has full service-page content.
// Images are curated Unsplash/Pexels stand-ins from design guidelines — replace with real clinic photos when available.

const IMG = {
  skin1: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=1600&q=80",
  skin2: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1600&q=80",
  skin3: "https://images.unsplash.com/photo-1512290746430-3ea326d9f5c8?auto=format&fit=crop&w=1600&q=80",
  facial: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1600&q=80",
  botanical: "https://images.unsplash.com/photo-1781948237644-4bb872b37c79?auto=format&fit=crop&w=1600&q=80",
  spa: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1600&q=80",
  hands: "https://images.unsplash.com/photo-1612239395391-dab5de40aa0f?auto=format&fit=crop&w=1600&q=80",
  woman1: "https://images.unsplash.com/photo-1552693673-1bf958298935?auto=format&fit=crop&w=1600&q=80",
  woman2: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=1600&q=80",
  hair1: "https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&w=1600&q=80",
  hair2: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=1600&q=80",
  laser: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1600&q=80",
  body: "https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=1600&q=80",
  bridal: "https://images.unsplash.com/photo-1585951237318-9ea5e175b891?auto=format&fit=crop&w=1600&q=80",
  antiage: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=1600&q=80",
  peach: "https://images.pexels.com/photos/27544685/pexels-photo-27544685.jpeg?auto=compress&w=1600",
};

// Content generators for consistency
const doctorNote = (n) =>
  n ||
  "Every skin has a story. Before we begin, we listen — to your history, your goals, and the way your skin actually behaves through the year. Only then do we design a protocol you can trust.";

const baseFaqs = (name) => [
  { q: `Who is a good candidate for ${name}?`, a: `Most adults with generally healthy skin can consider ${name}. During your consultation, Dr. Omaima reviews your history, medications and goals to confirm it's right for you.` },
  { q: `How many sessions will I need?`, a: `It depends on your concern and skin type. We share an honest plan with the number of sessions and interval only after examining you — never as a fixed sales package.` },
  { q: `Is there downtime?`, a: `Downtime for ${name} is minimal for most people, but individual responses vary. Full aftercare instructions are shared at your visit.` },
  { q: `When will I see results?`, a: `Some benefits are visible immediately; deeper improvements build over 2–8 weeks as the skin remodels.` },
  { q: `Is the treatment safe?`, a: `Yes — we use FDA-approved technology and single-use consumables, and every protocol is dermatologist-led.` },
];

const serviceTemplate = (over) => ({
  slug: "",
  name: "",
  short: "",
  hero: "",
  image: IMG.facial,
  what: "",
  whoFor: [],
  howItWorks: [],
  benefits: [],
  duration: "45–60 min",
  sessions: "Personalised plan",
  priceFrom: "₹4,500",
  downtime: [
    { label: "Session Duration", value: "45–60 minutes" },
    { label: "Downtime", value: "Minimal" },
    { label: "Sessions", value: "Personalised plan" },
    { label: "Results Visible", value: "1–2 weeks" },
  ],
  pricing: [
    { label: "Single Session", value: "₹4,500 onwards" },
    { label: "Series of 3", value: "10% off — from consult" },
    { label: "Series of 6", value: "15% off — from consult" },
  ],
  doctorNote: doctorNote(),
  faqs: [],
  ...over,
});

// ---- SKIN (15) ----
const SKIN = [
  serviceTemplate({
    slug: "hello-bright-zo-obagi", name: "Hello Bright by ZO Obagi", short: "The ZO Skin Health signature brightening protocol.",
    hero: "A ZO Skin Health signature — targeted, physician-grade brightening.", image: IMG.skin1,
    what: "Hello Bright by ZO Obagi is a physician-supervised brightening ritual that combines ZO's medical-grade formulations with an in-clinic protocol tailored to your pigmentation pattern. It works quietly — layer by layer — to soften sun damage, melasma undertones and post-acne marks, while restoring an even, luminous finish.",
    whoFor: ["Uneven tone", "Sun damage", "Post-acne marks", "Dull, tired skin", "Melasma-prone skin"],
    howItWorks: [
      { title: "Skin mapping", body: "A close read of your pigmentation, barrier and history — with woods-lamp assessment when needed." },
      { title: "In-clinic protocol", body: "Cleanse, dual-exfoliation, ZO's proprietary brightening layers, calming mask." },
      { title: "At-home partnership", body: "Personalised ZO regimen bridged with your daily rhythm; sun ritual re-set." },
    ],
    benefits: ["Visibly brighter tone", "Softens pigmentation", "Refined texture", "Non-inflammatory", "Physician-supervised"],
    faqs: baseFaqs("Hello Bright"),
  }),
  serviceTemplate({
    slug: "derma-genesis-facial", name: "Derma Genesis Facial", short: "A layered ritual for glow, hydration and firm surface.",
    hero: "A layered, editorial facial engineered for a lit-from-within finish.", image: IMG.facial,
    what: "Derma Genesis is our signature glow facial — a slow, layered treatment that ends every visit at Artham. Gentle exfoliation, targeted actives and a warm cocoon of massage leave skin softer, brighter and clearly rested.",
    whoFor: ["Dullness", "Dehydration", "Pre-event glow", "Sensitive skin"],
    howItWorks: [
      { title: "Cleanse and read", body: "Double cleanse; a short read of what the skin needs today." },
      { title: "Actives layer", body: "Enzyme or gentle acid pass, then a tailored booster." },
      { title: "Massage & finish", body: "Sculpting massage, sheet or cream mask, SPF and mist to close." },
    ],
    benefits: ["Immediate glow", "Softer texture", "Calmer redness", "Zero downtime"],
    faqs: baseFaqs("Derma Genesis"),
  }),
  serviceTemplate({
    slug: "hydrafacial-treatment", name: "HydraFacial Treatment", short: "Cleanse, extract, hydrate — in one calm hour.",
    hero: "The gold-standard three-step facial for clean, plump, camera-ready skin.", image: IMG.skin2,
    duration: "60 min", sessions: "1–6 sessions", priceFrom: "₹5,500",
    pricing: [
      { label: "Signature (Single)", value: "₹5,500" },
      { label: "Elite (Single)", value: "₹8,500" },
      { label: "Signature × 3", value: "₹14,850 (save 10%)" },
    ],
    what: "HydraFacial uses patented vortex technology to lift debris from pores while simultaneously infusing serums that hydrate and soothe. It is dermatologist-loved because it works for almost every skin — teen or mature, oily or dry — and requires no downtime.",
    whoFor: ["Congested pores", "Dullness", "Fine lines", "Pre-event", "Every skin type"],
    howItWorks: [
      { title: "Vortex cleanse", body: "Gentle exfoliation to lift dead cells and prep the skin." },
      { title: "Painless extractions", body: "Vortex suction clears blackheads and sebum without squeezing." },
      { title: "Antioxidant infusion", body: "Peptides and hyaluronic acid delivered directly into fresh skin." },
    ],
    benefits: ["Instant glow", "Softer, cleaner pores", "Deep hydration", "No downtime", "Safe for all skin types"],
    faqs: baseFaqs("HydraFacial"),
  }),
  serviceTemplate({
    slug: "acne-treatment", name: "Acne Treatment", short: "A medical-grade, root-cause plan for calm, clear skin.",
    hero: "A dermatologist-led plan — not a facial. Built for the way your acne actually behaves.", image: IMG.hands,
    what: "Acne is not one condition — it's several, layered together. At Artham we begin with a proper diagnosis (hormonal, congestive, inflammatory or scarring), then combine in-clinic procedures with a simple, sustainable home regimen. The goal is quiet, resilient skin — not a temporary reset.",
    whoFor: ["Active breakouts", "Cystic / hormonal acne", "Post-acne marks", "Oily, congested skin", "Teen and adult acne"],
    howItWorks: [
      { title: "Diagnosis", body: "History, examination and, when needed, hormonal or metabolic workup." },
      { title: "In-clinic care", body: "Medical peels, comedone extractions, blue-light or LED, targeted injections for cysts." },
      { title: "Home partnership", body: "A short, kind routine you can actually follow." },
    ],
    benefits: ["Fewer active breakouts", "Reduced scarring risk", "Balanced oil control", "Long-term skin health"],
    faqs: baseFaqs("acne treatment"),
  }),
  serviceTemplate({
    slug: "preime-dermafacial", name: "Preime DermaFacial Treatment", short: "A modular, machine-assisted deep facial.",
    hero: "A multi-modal facial that reads your skin and adapts each step.", image: IMG.spa,
    what: "Preime DermaFacial combines hydrodermabrasion, ultrasonic infusion, cryo-therapy and micro-current in one calibrated session. Each step can be dialled up or down depending on what the skin asks for that day.",
    whoFor: ["Dullness", "Congestion", "Puffiness", "Loss of firmness"],
    howItWorks: [
      { title: "Read", body: "Skin scan and short consult." },
      { title: "Layer", body: "Hydro-exfoliation, infusion, micro-current lift, cryo-close." },
      { title: "Finish", body: "Sculpting massage, SPF, next-visit note." },
    ],
    benefits: ["Immediate glow", "Sculpted look", "Better product absorption", "Zero downtime"],
    faqs: baseFaqs("Preime DermaFacial"),
  }),
  serviceTemplate({
    slug: "pdrn-skin-boosters", name: "PDRN Skin Boosters", short: "Salmon-DNA boosters for regeneration and glass finish.",
    hero: "Micro-injected regeneration — quietly rebuilds skin from within.", image: IMG.botanical,
    what: "PDRN (polydeoxyribonucleotide) is a regenerative molecule delivered as very small, superficial injections. It supports cellular repair, improves hydration and gradually reveals the smooth, reflective finish often called 'glass skin'.",
    whoFor: ["Dullness", "Dehydration", "Early fine lines", "Post-inflammatory marks"],
    howItWorks: [
      { title: "Numb", body: "Topical anaesthetic for comfort." },
      { title: "Micro-inject", body: "A grid of tiny, superficial injections across the treatment area." },
      { title: "Recover", body: "Cool masks, aftercare notes, minimal downtime." },
    ],
    benefits: ["Glass-skin finish", "Improved elasticity", "Deep hydration", "Gentle regeneration"],
    faqs: baseFaqs("PDRN boosters"),
  }),
  serviceTemplate({
    slug: "permanent-makeup", name: "Permanent Makeup", short: "Softly enhanced brows, lips and lash line.",
    hero: "Semi-permanent artistry — never obvious, always yours.", image: IMG.woman1,
    what: "Permanent makeup places pigment gently within the upper skin to enhance brows, lash lines and lips. Done well, it looks like you — on a very good day — and saves you time every morning.",
    whoFor: ["Sparse brows", "Faded lip colour", "Uneven lash line", "Busy mornings"],
    howItWorks: [
      { title: "Design", body: "Mapping and pigment selection — always in daylight." },
      { title: "Application", body: "Pigment placed with a fine, sterile hand-tool." },
      { title: "Touch-up", body: "One follow-up refines colour and edges." },
    ],
    benefits: ["Effortless mornings", "Natural-looking", "Long-lasting", "Individual pigment match"],
    faqs: baseFaqs("permanent makeup"),
  }),
  serviceTemplate({
    slug: "good-gene-therapy", name: "Good Gene Therapy", short: "Cellular-level rejuvenation via growth factors.",
    hero: "A growth-factor protocol that helps skin behave younger.", image: IMG.skin3,
    what: "Good Gene Therapy uses growth factors and signal peptides to encourage skin cells to behave the way they did years ago — repairing quicker, producing collagen and holding hydration. It layers well with facials, peels and lasers.",
    whoFor: ["Dullness", "Early ageing", "Post-procedure skin", "Compromised barrier"],
    howItWorks: [
      { title: "Prep", body: "Cleanse and a very light exfoliation." },
      { title: "Delivery", body: "Growth factors introduced via micro-channels." },
      { title: "Seal", body: "Barrier-repair mask and calming closure." },
    ],
    benefits: ["Faster repair", "Softer, plumper skin", "Complements peels/lasers", "Minimal downtime"],
    faqs: baseFaqs("Good Gene Therapy"),
  }),
  serviceTemplate({
    slug: "nad-iv-infusion", name: "NAD+ IV Infusion Therapy", short: "Slow drip for cellular energy, clarity and skin resilience.",
    hero: "A physician-monitored IV that supports how your cells make energy.", image: IMG.spa,
    what: "NAD+ (nicotinamide adenine dinucleotide) is a coenzyme central to how your cells produce energy. A slow, physician-monitored infusion is used by our patients seeking better skin resilience, brain clarity and recovery — always alongside a proper medical review.",
    whoFor: ["Adults 25+", "Post-illness recovery", "Wellness protocols", "Skin longevity focus"],
    howItWorks: [
      { title: "Medical review", body: "Full history and eligibility screen." },
      { title: "Slow infusion", body: "A quiet 60–90 minute drip in a private lounge." },
      { title: "Aftercare", body: "Hydration and simple next-day guidance." },
    ],
    benefits: ["Cellular energy support", "Skin resilience", "Mental clarity", "Physician-monitored"],
    faqs: baseFaqs("NAD+ IV"),
  }),
  serviceTemplate({
    slug: "vampire-facial-prp", name: "Vampire Facial / PRP Booster", short: "Your own plasma, gently returned to your skin.",
    hero: "Small draw, big rebuild — regeneration using your own platelets.", image: IMG.hands,
    what: "The Vampire Facial (PRP) takes a small blood sample, spins it to concentrate your growth-factor-rich plasma, and returns it to your skin via micro-needling. It's a slow, respectful protocol — and one of the most trusted regenerative facials in dermatology.",
    whoFor: ["Dull skin", "Fine lines", "Acne scars", "Thinning hair (scalp PRP)"],
    howItWorks: [
      { title: "Small blood draw", body: "10–20 ml from the arm — like any routine test." },
      { title: "Spin & concentrate", body: "Plasma is separated and concentrated in a sterile centrifuge." },
      { title: "Return to skin", body: "Delivered via fine micro-needling across the treatment area." },
    ],
    benefits: ["Natural regeneration", "Softer texture", "Reduced scarring", "Uses your own biology"],
    faqs: baseFaqs("Vampire Facial"),
  }),
  serviceTemplate({
    slug: "hydrafacial-elite", name: "HydraFacial Elite", short: "The elevated HydraFacial protocol with LED and lymphatic.",
    hero: "HydraFacial's most complete protocol — six steps, one hour.", image: IMG.facial,
    what: "HydraFacial Elite extends the classic three-step ritual with lymphatic drainage, LED light therapy and a personalised booster serum. It's the version we recommend before events or long journeys.",
    whoFor: ["Pre-event", "Dull, tired skin", "Puffy mornings", "Every skin type"],
    howItWorks: [
      { title: "Lymphatic drainage", body: "Gentle vacuum-based drainage de-puffs the face and neck." },
      { title: "Classic HydraFacial", body: "Cleanse, extract, hydrate — the signature three steps." },
      { title: "LED close", body: "Red/near-IR light to calm and finish." },
    ],
    benefits: ["De-puffed look", "Deep clean", "Softer lines", "No downtime"],
    faqs: baseFaqs("HydraFacial Elite"),
  }),
  serviceTemplate({
    slug: "microdermabrasion", name: "Microdermabrasion", short: "Fine crystal or diamond-tip resurfacing.",
    hero: "A gentle mechanical resurfacing for a smoother, brighter finish.", image: IMG.woman2,
    what: "Microdermabrasion uses a fine diamond tip (or micro-crystal spray) to lightly sand the outermost layer of skin. It's an old, well-loved procedure — quick, no-downtime, and lovely before an event.",
    whoFor: ["Dullness", "Blackheads", "Rough texture", "Pre-event"],
    howItWorks: [
      { title: "Cleanse", body: "Skin prepped, sensitive zones mapped." },
      { title: "Resurface", body: "Diamond-tip pass, low-suction lift-off." },
      { title: "Hydrate", body: "Calming serum, SPF." },
    ],
    benefits: ["Immediate smoothness", "Brighter finish", "Zero downtime", "Comfortable"],
    faqs: baseFaqs("microdermabrasion"),
  }),
  serviceTemplate({
    slug: "chemical-peel", name: "Chemical Peel", short: "From soft to medical — a spectrum of resurfacing peels.",
    hero: "A calibrated peel — light, medium or medical — chosen for your skin.", image: IMG.peach,
    what: "Chemical peels use precise concentrations of AHAs, BHAs, retinoids or TCA to gently resurface, brighten and reset the skin. At Artham, we begin at the lightest effective depth — and only step up when the skin says it's ready.",
    whoFor: ["Pigmentation", "Post-acne marks", "Dullness", "Fine lines", "Rough texture"],
    howItWorks: [
      { title: "Consult", body: "Peel depth chosen by history, tone and season." },
      { title: "Layer", body: "Peel applied in short, measured passes." },
      { title: "Neutralise & aftercare", body: "Barrier-repair, strict SPF, gentle home routine." },
    ],
    benefits: ["Brighter, even tone", "Softer texture", "Fewer breakouts", "Personalised depth"],
    faqs: baseFaqs("chemical peel"),
  }),
  serviceTemplate({
    slug: "micro-needling", name: "Micro Needling", short: "Collagen induction for scars, pores and firm surface.",
    hero: "Controlled micro-injury that asks the skin to rebuild — beautifully.", image: IMG.skin1,
    what: "Micro-needling uses very fine, sterile needles to create controlled micro-channels in the skin. These channels signal collagen and elastin repair — softening acne scars, refining pores and firming surface tone over 6–12 weeks.",
    whoFor: ["Acne scars", "Enlarged pores", "Fine lines", "Loss of firmness"],
    howItWorks: [
      { title: "Numb", body: "Topical anaesthetic for a comfortable session." },
      { title: "Treat", body: "Micro-channels created across the treatment area." },
      { title: "Recover", body: "Cool masks, growth-factor topicals, simple aftercare." },
    ],
    benefits: ["Softer scars", "Refined pores", "Firmer surface", "Uses natural repair"],
    faqs: baseFaqs("micro-needling"),
  }),
  serviceTemplate({
    slug: "4d-clearlift", name: "4D ClearLift Treatment", short: "Non-ablative laser lift, lunch-break friendly.",
    hero: "A non-ablative laser lift — designed to be quiet, quick and effective.", image: IMG.woman1,
    what: "4D ClearLift is a non-ablative Q-switched laser protocol that treats under the skin surface without disrupting the barrier above. It works quietly across pigmentation, pore-size and early firmness — with almost no downtime.",
    whoFor: ["Early ageing", "Pigmentation", "Enlarged pores", "Lunch-hour treatments"],
    howItWorks: [
      { title: "Cleanse", body: "Skin prepped, protective eyewear on." },
      { title: "4D pass", body: "Four laser passes targeting depth, pigment, vessels and surface." },
      { title: "Close", body: "Calming serum, SPF, back to work." },
    ],
    benefits: ["Lifted, brighter look", "Refined pores", "No visible downtime", "Comfortable"],
    faqs: baseFaqs("4D ClearLift"),
  }),
];

// ---- ANTI-AGEING (7) ----
const ANTIAGE = [
  serviceTemplate({
    slug: "dermal-fillers", name: "Dermal Fillers", short: "Hyaluronic-acid volume, placed with restraint.",
    hero: "Volume returned — never added. Sculpted with restraint.", image: IMG.antiage,
    duration: "45–60 min", sessions: "1 session (touch-up 2 wks)", priceFrom: "₹22,000 / syringe",
    pricing: [
      { label: "Per Syringe (0.55 ml)", value: "₹22,000 – ₹28,000" },
      { label: "Per Full Syringe (1.0 ml)", value: "₹32,000 – ₹42,000" },
      { label: "Consult", value: "Complimentary 15-min" },
    ],
    what: "Dermal fillers are FDA-approved hyaluronic acid gels used to gently restore volume and support facial structure. At Artham we practise minimal-touch aesthetics — the goal is a rested version of you, not a different face.",
    whoFor: ["Volume loss", "Under-eye hollows", "Lip refinement", "Jawline definition"],
    howItWorks: [
      { title: "Consult", body: "Facial mapping, expression review, honest expectations." },
      { title: "Numb", body: "Topical and pinpoint anaesthesia for comfort." },
      { title: "Micro-placement", body: "Small volumes placed precisely, reviewed as we work." },
    ],
    benefits: ["Immediate, subtle result", "Reversible", "Restores structure", "Long-lasting"],
    faqs: baseFaqs("dermal fillers"),
  }),
  serviceTemplate({
    slug: "mesobotox", name: "Mesobotox", short: "Micro-dosed botulinum for glass finish and pore refinement.",
    hero: "Very small doses of botulinum, placed across the skin surface — for a soft, refined finish.", image: IMG.woman2,
    what: "Mesobotox (or 'baby botox') uses very small doses of botulinum toxin, placed superficially across the skin — not deep into muscle. It calms sebaceous activity, softens pores and gives a smooth, glass-like finish without freezing expression.",
    whoFor: ["Oily skin", "Enlarged pores", "Fine surface lines", "Pre-event glow"],
    howItWorks: [
      { title: "Map", body: "Skin mapped for surface treatment zones." },
      { title: "Micro-dose", body: "Very fine, superficial micro-injections." },
      { title: "Recover", body: "Zero downtime; instructions to avoid heat/pressure for 4 hours." },
    ],
    benefits: ["Glass finish", "Softer pores", "Retains expression", "Fast, comfortable"],
    faqs: baseFaqs("Mesobotox"),
  }),
  serviceTemplate({
    slug: "opus-plasma", name: "Opus Plasma", short: "Fractional plasma resurfacing for scars and tone.",
    hero: "Fractional plasma energy — the resurfacing power of a laser, on the timeline of a peel.", image: IMG.skin2,
    what: "Opus Plasma delivers fractional plasma energy through fine tips, creating micro-injury patterns that trigger collagen renewal. It's used for acne scars, wrinkles and texture — with faster recovery than most ablative lasers.",
    whoFor: ["Acne scars", "Fine lines", "Enlarged pores", "Uneven texture"],
    howItWorks: [
      { title: "Numb", body: "Strong topical anaesthetic, plus cool air." },
      { title: "Treat", body: "Micro-fractional plasma passes across the area." },
      { title: "Recover", body: "Barrier-repair balm, strict SPF, 3–5 days of pinkness." },
    ],
    benefits: ["Softer scars", "Refined surface", "Faster than ablative laser", "Long-lasting"],
    faqs: baseFaqs("Opus Plasma"),
  }),
  serviceTemplate({
    slug: "hifu", name: "HIFU", short: "High-intensity focused ultrasound lift.",
    hero: "Non-surgical lifting from deeper layers — no incision, no downtime.", image: IMG.woman1,
    what: "HIFU (High-Intensity Focused Ultrasound) delivers focused energy to the SMAS layer beneath the skin — the same layer surgeons address in a facelift — to prompt tightening and lift over the following weeks.",
    whoFor: ["Loose jawline", "Brow heaviness", "Neck laxity", "Post-30s firming"],
    howItWorks: [
      { title: "Consult", body: "Suitability, expectations, mapping." },
      { title: "Treat", body: "Ultrasound applicator delivered along mapped lines." },
      { title: "Result over time", body: "Tightening continues quietly for 8–12 weeks." },
    ],
    benefits: ["Non-surgical lift", "No downtime", "Gradual, natural result", "Long-lasting"],
    faqs: baseFaqs("HIFU"),
  }),
  serviceTemplate({
    slug: "hydration-injections", name: "Hydration Injections", short: "Micro-injected hyaluronic acid for plumped, glass-finish skin.",
    hero: "Deep, injected hydration — from within the skin.", image: IMG.botanical,
    what: "Hydration injections (skin boosters) place small, uncrosslinked hyaluronic acid droplets into the skin. It's the difference between hydrating from the outside — and hydrating from within.",
    whoFor: ["Dehydration", "Dullness", "Fine lines", "Post-30s glow"],
    howItWorks: [
      { title: "Numb", body: "Topical anaesthetic." },
      { title: "Micro-inject", body: "A grid of very small, superficial injections." },
      { title: "Set", body: "Cool mask, minimal downtime." },
    ],
    benefits: ["Plumped, glass look", "Longer-lasting hydration", "Softer lines", "Gentle"],
    faqs: baseFaqs("hydration injections"),
  }),
  serviceTemplate({
    slug: "morpheus", name: "Morpheus", short: "Radiofrequency micro-needling — remodels from within.",
    hero: "Radiofrequency + micro-needling — deep collagen remodelling, quietly.", image: IMG.skin1,
    what: "Morpheus8 combines micro-needling with radiofrequency to reach deeper layers of the skin — remodelling collagen and gently tightening surface tone. It is one of the most versatile devices for combined skin quality and firmness concerns.",
    whoFor: ["Acne scars", "Loose skin", "Early jowls", "Neck laxity"],
    howItWorks: [
      { title: "Numb", body: "Topical anaesthetic across treatment zones." },
      { title: "Treat", body: "Micro-needle pass with calibrated RF depth." },
      { title: "Recover", body: "Redness for 24–72 hours, resume routine day 3–4." },
    ],
    benefits: ["Firmer surface", "Softer scars", "Long-lasting collagen response", "Adjustable depth"],
    faqs: baseFaqs("Morpheus"),
  }),
  serviceTemplate({
    slug: "skin-tightening", name: "Skin Tightening", short: "Radio-frequency skin tightening, calm and cumulative.",
    hero: "Comfortable, cumulative firming with radio-frequency energy.", image: IMG.hands,
    what: "Radio-frequency tightening warms the deeper layers of skin to prompt contraction and gradual collagen remodelling. It's a lunch-hour, cumulative treatment — best in a series of 4–6.",
    whoFor: ["Early laxity", "Post-30s firming", "Neck, jawline, arms"],
    howItWorks: [
      { title: "Prep", body: "Skin cleansed, glide gel applied." },
      { title: "Warm", body: "RF applicator moved in slow, mapped passes." },
      { title: "Series", body: "Repeat every 2–3 weeks for best cumulative response." },
    ],
    benefits: ["Firmer surface", "Zero downtime", "Comfortable", "Gradual, natural"],
    faqs: baseFaqs("skin tightening"),
  }),
];

// ---- LASER HAIR REMOVAL (3) ----
const LASER = [
  serviceTemplate({
    slug: "laser-hair-removal", name: "Laser Hair Removal", short: "FDA-approved lasers, skin-tone-safe protocols.",
    hero: "Long-term, thoughtful hair reduction — for every skin tone.", image: IMG.laser,
    what: "Laser hair removal uses selective wavelengths to reduce hair follicle activity over a series of sessions. At Artham we use FDA-approved diode + Nd:YAG platforms, which are safe for South Asian and darker skin tones when settings and cooling are correctly calibrated.",
    whoFor: ["Unwanted body/facial hair", "Ingrown hairs", "PCOD-related hair growth"],
    howItWorks: [
      { title: "Test patch", body: "Small area first, response noted." },
      { title: "Session series", body: "6–8 sessions spaced by growth cycle." },
      { title: "Maintenance", body: "Occasional top-ups after the core series." },
    ],
    benefits: ["Long-term reduction", "Skin-tone safe protocols", "Reduced ingrowns", "Smoother finish"],
    faqs: baseFaqs("laser hair removal"),
  }),
  serviceTemplate({
    slug: "laser-hair-removal-men", name: "Laser Hair Removal for Men", short: "Beard shaping, back, chest — thoughtful and precise.",
    hero: "Beard sculpting, back, chest, shoulders — precise, private and calm.", image: IMG.laser,
    what: "For men, laser hair removal is often as much about shape as reduction — cleaner beard lines, less bulk on chest and back, or fully clearing dense areas. We work with strong, cooling-assisted lasers designed for coarse hair.",
    whoFor: ["Beard shaping", "Back / shoulders", "Chest", "Full-body reduction"],
    howItWorks: [
      { title: "Design", body: "Lines and areas mapped with you." },
      { title: "Treat", body: "Cooling-assisted laser series across the mapped area." },
      { title: "Maintain", body: "Top-up sessions as needed, once a year." },
    ],
    benefits: ["Cleaner shape", "Reduced density", "Comfortable", "Private, calm space"],
    faqs: baseFaqs("laser hair removal for men"),
  }),
  serviceTemplate({
    slug: "laser-hair-removal-women", name: "Laser Hair Removal for Women", short: "Face, arms, legs, bikini — kind, safe, effective.",
    hero: "A kinder, longer-lasting alternative to waxing — for every skin tone.", image: IMG.laser,
    what: "Our full-body laser hair removal programme is designed for South Asian skin — safe, effective and quietly private. Sessions are quick, comfortable and staffed only by trained female technicians.",
    whoFor: ["Face", "Arms and legs", "Bikini / Brazilian", "Underarms", "Full body"],
    howItWorks: [
      { title: "Test patch", body: "Small area first, response reviewed." },
      { title: "Series", body: "6–8 sessions in a private, female-only room." },
      { title: "Maintenance", body: "Occasional top-ups after the core series." },
    ],
    benefits: ["Long-lasting reduction", "No waxing ingrowns", "Female-only staff", "Skin-tone safe"],
    faqs: baseFaqs("laser hair removal for women"),
  }),
];

// ---- HAIR (3) ----
const HAIR = [
  serviceTemplate({
    slug: "advanced-hair-transplant", name: "Advanced Hair Transplant", short: "FUE hair transplant with dense, natural hairlines.",
    hero: "Surgical FUE — a natural, permanent solution for pattern hair loss.", image: IMG.hair1,
    duration: "6–8 hours", sessions: "1 (single-day)", priceFrom: "₹80,000",
    pricing: [
      { label: "Up to 1,500 grafts", value: "₹80,000 – ₹1,20,000" },
      { label: "1,500 – 3,000 grafts", value: "₹1,20,000 – ₹2,20,000" },
      { label: "3,000 – 4,500 grafts", value: "₹2,20,000 – ₹3,20,000" },
    ],
    what: "Advanced hair transplant at Artham uses FUE (follicular unit extraction) — where individual grafts are harvested from a healthy donor zone and placed one by one along a natural hairline. Good hairlines look like they were always there — that's our benchmark.",
    whoFor: ["Male pattern hair loss", "Female thinning at parting", "Post-scarring hair loss"],
    howItWorks: [
      { title: "Design", body: "Hairline drawn with you, in daylight, before we begin." },
      { title: "FUE harvest", body: "Individual grafts taken from donor zone under local anaesthesia." },
      { title: "Placement", body: "Grafts placed in the direction and density of natural hair." },
    ],
    benefits: ["Permanent result", "Natural hairline", "Minimal scarring", "Same-day discharge"],
    faqs: baseFaqs("hair transplant"),
    downtime: [
      { label: "Procedure Duration", value: "6–8 hours" },
      { label: "Downtime", value: "3–5 days rest" },
      { label: "Result Visible", value: "6–12 months" },
      { label: "Anaesthesia", value: "Local" },
    ],
  }),
  serviceTemplate({
    slug: "hair-loss-treatment", name: "Hair Loss Treatment", short: "Non-surgical protocols — PRP, growth factors and topicals.",
    hero: "A non-surgical, dermatologist-led plan — PRP, growth factors and honest expectations.", image: IMG.hair2,
    what: "Non-surgical hair loss treatment at Artham combines scalp PRP, growth-factor mesotherapy, targeted topicals and — when appropriate — oral medications. It is most effective when hair loss is caught early and treated as a medical condition, not a cosmetic one.",
    whoFor: ["Diffuse thinning", "Early male/female pattern loss", "Post-Covid shedding", "PCOD-related thinning"],
    howItWorks: [
      { title: "Diagnose", body: "Scalp mapping, tricoscopy, medical workup." },
      { title: "In-clinic care", body: "PRP or growth-factor mesotherapy at scheduled intervals." },
      { title: "Home partnership", body: "A simple, evidence-based home routine." },
    ],
    benefits: ["Reduced shedding", "Improved density", "Non-surgical", "Personalised"],
    faqs: baseFaqs("hair loss treatment"),
  }),
  serviceTemplate({
    slug: "hair-patch-treatment", name: "Hair Patch Treatment", short: "Non-surgical hair systems — natural, quick, reversible.",
    hero: "A well-crafted hair system — natural-looking, immediate, non-surgical.", image: IMG.hair1,
    what: "Hair patch (or hair system) treatment is a non-surgical option for people who want an immediate, dense look without transplant surgery. Modern systems use breathable, skin-matched bases and are attached and refreshed by our technicians every 4–6 weeks.",
    whoFor: ["Advanced hair loss", "Those not ready for surgery", "Rapid result before an event"],
    howItWorks: [
      { title: "Colour and density match", body: "System customised to your hair and scalp tone." },
      { title: "Attachment", body: "Medical-grade adhesive; skin base cut and blended." },
      { title: "Refresh", body: "Repositioned and refreshed every 4–6 weeks." },
    ],
    benefits: ["Immediate result", "Non-surgical", "Reversible", "Custom-matched"],
    faqs: baseFaqs("hair patch"),
  }),
];

// ---- BODY (8) ----
const BODY = [
  serviceTemplate({
    slug: "med-contour", name: "Med Contour", short: "Ultrasound-cavitation body contouring.",
    hero: "Ultrasound + drainage — for a smoother, sculpted silhouette.", image: IMG.body,
    what: "Med Contour uses low-frequency ultrasound cavitation combined with lymphatic drainage to soften fat pockets and refine body outline. It's non-invasive, comfortable and works best in a series.",
    whoFor: ["Localised fat", "Post-partum contour", "Love handles", "Thigh refinement"],
    howItWorks: [
      { title: "Assess", body: "Areas mapped and measurements noted." },
      { title: "Treat", body: "Ultrasound plus drainage in a private lounge." },
      { title: "Series", body: "6–10 sessions for a full protocol." },
    ],
    benefits: ["Non-invasive", "Improved outline", "Zero downtime", "Comfortable"],
    faqs: baseFaqs("Med Contour"),
  }),
  serviceTemplate({
    slug: "body-shaping-figure-correction", name: "Body Shaping & Figure Correction", short: "A multi-modal plan for measurable outline change.",
    hero: "A calm, multi-modal plan for real, measurable outline change.", image: IMG.body,
    what: "Our body shaping programme layers cavitation, RF tightening, EMS toning and nutrition guidance into a single plan — designed with your goals, medical history and calendar in mind.",
    whoFor: ["Post-partum recovery", "Weight-loss loose skin", "Localised fat", "Figure correction"],
    howItWorks: [
      { title: "Consult", body: "Body scan, medical review, goals aligned." },
      { title: "Plan", body: "Weekly session mix designed across 8–12 weeks." },
      { title: "Track", body: "Photos and measurements re-taken every 4 weeks." },
    ],
    benefits: ["Measurable change", "Non-surgical", "Medically-supervised", "Sustainable"],
    faqs: baseFaqs("body shaping"),
  }),
  serviceTemplate({
    slug: "contour-cheeks", name: "Contour Cheeks", short: "Refined mid-face contour with soft filler or thread.",
    hero: "A restrained mid-face refinement — never hollowed, never overdone.", image: IMG.woman1,
    what: "Contour Cheeks is our restrained mid-face protocol — small volumes of filler or fine PDO threads placed to lift and refine cheek shape, without changing the way you look. Always subtle. Always reversible.",
    whoFor: ["Flat mid-face", "Post-30s volume loss", "Asymmetry refinement"],
    howItWorks: [
      { title: "Map", body: "Cheek anatomy and expression reviewed." },
      { title: "Refine", body: "Small volumes placed precisely; response reviewed." },
      { title: "Follow up", body: "One touch-up review in 2 weeks." },
    ],
    benefits: ["Rested, lifted look", "Reversible", "Subtle", "Long-lasting"],
    faqs: baseFaqs("contour cheeks"),
  }),
  serviceTemplate({
    slug: "coolsculpting", name: "CoolSculpting", short: "Cryolipolysis fat freezing — FDA-cleared.",
    hero: "FDA-cleared fat freezing — for the pockets that never move.", image: IMG.body,
    duration: "35–60 min / area", sessions: "1–2 per area", priceFrom: "₹28,000 / area",
    pricing: [
      { label: "Small Area", value: "₹28,000" },
      { label: "Large Area", value: "₹42,000" },
      { label: "Full Belly Protocol", value: "From ₹95,000" },
    ],
    what: "CoolSculpting (cryolipolysis) uses controlled cooling to gradually reduce fat cells in specific pockets — belly, love handles, upper arms, inner thighs. It is non-surgical, non-invasive, and the reduction is permanent.",
    whoFor: ["Localised fat pockets", "Post-30 outline changes", "Diet & exercise plateau"],
    howItWorks: [
      { title: "Assess", body: "Fat pinch, mapping, applicator sizing." },
      { title: "Freeze", body: "Applicator engaged for 35–60 minutes per area." },
      { title: "Massage", body: "Post-treatment massage improves response." },
    ],
    benefits: ["Non-surgical", "FDA-cleared", "Permanent reduction", "No downtime"],
    faqs: baseFaqs("CoolSculpting"),
  }),
  serviceTemplate({
    slug: "weight-loss-treatment", name: "Weight Loss Treatment", short: "Medically-supervised, sustainable weight loss.",
    hero: "A medical, kind, sustainable weight-loss plan.", image: IMG.spa,
    what: "Our weight-loss programme is dermatologist-led and includes nutrition, movement guidance, in-clinic body treatments and — when medically appropriate — prescription support. We do not sell 'quick fixes'.",
    whoFor: ["Sustainable weight loss", "PCOD-linked weight gain", "Post-partum reshaping"],
    howItWorks: [
      { title: "Medical review", body: "Full history, labs when needed." },
      { title: "Personalised plan", body: "Weekly plan of food, movement, in-clinic sessions." },
      { title: "Track", body: "Fortnightly check-ins for 12 weeks." },
    ],
    benefits: ["Physician-supervised", "Sustainable", "Personalised", "Layered plan"],
    faqs: baseFaqs("weight loss"),
  }),
  serviceTemplate({
    slug: "chin-enhancement", name: "Chin Enhancement", short: "Fillers, thread or profile balancing for a defined chin.",
    hero: "A defined chin — the quiet backbone of a balanced profile.", image: IMG.woman2,
    what: "Chin enhancement uses small volumes of filler (or, in some cases, PDO threads) to add definition and balance to the lower face. It's a small change that changes a great deal in profile photos.",
    whoFor: ["Retruded chin", "Weak profile", "Jaw-chin balance"],
    howItWorks: [
      { title: "Map", body: "Chin and jaw balance reviewed in profile." },
      { title: "Refine", body: "Small volumes placed precisely; response reviewed." },
      { title: "Follow up", body: "Two-week review." },
    ],
    benefits: ["Balanced profile", "Reversible", "Subtle", "Long-lasting"],
    faqs: baseFaqs("chin enhancement"),
  }),
  serviceTemplate({
    slug: "jawline-definition", name: "Jawline Definition", short: "Sharper, cleaner jawline with restraint.",
    hero: "A sharper jawline — placed with restraint.", image: IMG.woman1,
    what: "Jawline definition uses very small volumes of filler along the mandibular angle and body — restoring the line that softens with age or looked less defined in the first place. The goal is a rested, elegant profile.",
    whoFor: ["Soft jawline", "Early jowls", "Profile refinement"],
    howItWorks: [
      { title: "Design", body: "Jaw line drawn with you, in daylight." },
      { title: "Refine", body: "Small volumes placed at key anchor points." },
      { title: "Review", body: "Two-week touch-up review." },
    ],
    benefits: ["Elegant definition", "Reversible", "Subtle", "Long-lasting"],
    faqs: baseFaqs("jawline definition"),
  }),
  serviceTemplate({
    slug: "face-lifting", name: "Face Lifting", short: "Non-surgical face lift protocols — threads, HIFU, RF.",
    hero: "A non-surgical face lift — layered, calm, cumulative.", image: IMG.woman2,
    what: "Our non-surgical face lift combines HIFU, RF tightening, PDO threads and, when appropriate, small filler volumes. It's a whole-face programme — thoughtful, reversible, and layered across a few weeks.",
    whoFor: ["Post-30 laxity", "Jowls, brow heaviness", "Neck softening"],
    howItWorks: [
      { title: "Plan", body: "Full-face assessment, session mix designed." },
      { title: "Layered treatments", body: "HIFU / RF / threads / filler, in the right order." },
      { title: "Review", body: "Progress reviewed at 4 and 8 weeks." },
    ],
    benefits: ["Non-surgical", "Cumulative lift", "Personalised", "Long-lasting"],
    faqs: baseFaqs("face lifting"),
  }),
];

// ---- BRIDAL (1) ----
const BRIDAL = [
  serviceTemplate({
    slug: "wedding-package", name: "Wedding Package", short: "Pre-bridal skin, hair and body — a 6-month editorial plan.",
    hero: "A 6-month bridal programme — for the calmest version of you on the day.", image: IMG.bridal,
    what: "The Artham Wedding Package is a 6-month, physician-led programme built around one thing: your calmest, most rested self on the day. Skin, hair, body and rest — considered together, not sold as add-ons.",
    whoFor: ["Brides & grooms", "6-month wedding runway", "Pre-shoot glow"],
    howItWorks: [
      { title: "Consult (6 months out)", body: "Full assessment, calendar, and honest plan." },
      { title: "Skin & hair track", body: "Monthly facials, targeted peels, hair care." },
      { title: "Body & rest", body: "Optional contouring, wellness IVs, sleep hygiene." },
      { title: "Wedding-week ritual", body: "Signature glow facial, gentle drainage, day-of touch-up." },
    ],
    benefits: ["6-month runway", "Physician-led", "Skin + hair + body layered", "Editorial finish"],
    faqs: baseFaqs("Wedding Package"),
    downtime: [
      { label: "Programme Length", value: "6 months" },
      { label: "Visits", value: "Monthly + wedding week" },
      { label: "Ideal Start", value: "6 months before" },
      { label: "Personalisation", value: "Full plan per couple" },
    ],
  }),
];

export const CATEGORIES = [
  { slug: "skin", name: "Skin", intro: "Facials, peels, boosters and lasers — for calm, camera-ready skin.", image: IMG.skin1, services: SKIN },
  { slug: "anti-ageing", name: "Anti-Ageing", intro: "Injectables, energy devices and regenerative protocols — placed with restraint.", image: IMG.antiage, services: ANTIAGE },
  { slug: "laser-hair-removal", name: "Laser Hair Removal", intro: "Skin-tone-safe, FDA-approved lasers for long-term reduction.", image: IMG.laser, services: LASER },
  { slug: "hair", name: "Hair", intro: "From non-surgical protocols to advanced FUE transplants.", image: IMG.hair1, services: HAIR },
  { slug: "body", name: "Body Contouring & Weight", intro: "Non-invasive contouring, medical weight-loss and figure correction.", image: IMG.body, services: BODY },
  { slug: "bridal", name: "Bridal", intro: "A 6-month, physician-led pre-bridal programme.", image: IMG.bridal, services: BRIDAL },
];

export const ALL_SERVICES = CATEGORIES.flatMap((c) =>
  c.services.map((s) => ({ ...s, category: c.name, categorySlug: c.slug }))
);

export const findService = (slug) => ALL_SERVICES.find((s) => s.slug === slug);
export const findCategory = (slug) => CATEGORIES.find((c) => c.slug === slug);
export const featuredService = () => findService("hydrafacial-treatment");

export const RELATED = (categorySlug, currentSlug, max = 4) =>
  ALL_SERVICES.filter((s) => s.categorySlug === categorySlug && s.slug !== currentSlug).slice(0, max);
