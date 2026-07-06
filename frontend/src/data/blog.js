// Journal — Wikipedia-style, structured articles in the Artham voice.
// Each post: lead (bold first term), headed sections (auto TOC + heading ids),
// keyFacts (infobox), keywords/aliases (auto-backlinks + see also), references,
// faq, furtherReading. Cross-references between posts trigger auto internal links.
export const POSTS = [
  {
    slug: "how-to-read-your-skin-before-a-facial",
    category: "Skin",
    title: "How to Read Your Skin Before a Facial",
    excerpt:
      "Five small, honest tells that will help your dermatologist pick the right facial for the season — and for your life this week.",
    coverImage:
      "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=1600&q=80",
    readingTimeMin: 6,
    date: "2026-01-24",
    updated: "2026-02-18",
    keywords: ["facial", "skin barrier", "HydraFacial", "salicylic peel", "skin assessment"],
    aliases: ["reading your skin"],
    keyFacts: [
      { label: "Focus", value: "Pre-facial self-assessment" },
      { label: "Time needed", value: "≈ 5 minutes" },
      { label: "Tools", value: "Clean finger, daylight, a mirror" },
      { label: "Best for", value: "Choosing the right facial" },
    ],
    relatedSlugs: ["hydrafacial-treatment", "derma-genesis-facial"],
    lead: [
      "**Reading your skin** before a facial means checking a few honest, at-home signals so your dermatologist can meet your skin where it actually is that day. Skin is not still — it shifts through the week with sleep, weather, and what you ate last night. A good facial is only good if it is matched to the skin's current state.",
      "This short assessment takes about five minutes and needs nothing more than a clean finger, good daylight, and a mirror. Bring what you notice to your consultation; it changes the depth of the conversation and of what your facial can do.",
    ],
    sections: [
      {
        id: "overview",
        heading: "Overview",
        level: 2,
        blocks: [
          {
            type: "p",
            text: "The goal of a pre-facial check is to distinguish a skin that needs hydration and barrier support from one that is ready for active pore care or exfoliation. Treating a compromised barrier as if it needs a strong peel is the most common reason a facial disappoints.",
          },
        ],
      },
      {
        id: "the-five-tells",
        heading: "The five tells",
        level: 2,
        blocks: [
          {
            type: "ul",
            items: [
              "Run a clean finger across your cheek in the morning. If it drags, your skin barrier is asking for hydration, not exfoliation. If it glides, you likely need active pore care.",
              "Check your forehead in bright daylight. Congested texture — small bumps under the skin — usually signals build-up, not oil. A HydraFacial or a light salicylic peel handles this without irritation.",
              "Look at your under-eyes. Morning puffiness is often lymphatic and responds to drainage-focused work; persistent daytime darkness is different and deserves a diagnosis, not a facial.",
              "Notice how skin behaves after cleansing. Tight and flaky within five minutes means barrier repair first, exfoliation later. Comfortable and neutral means you are ready for a deeper protocol.",
              "Check your sleep. Skin on under five hours of sleep responds badly to strong actives — reschedule, and the skin will thank you.",
            ],
          },
        ],
      },
      {
        id: "matching-the-facial",
        heading: "Matching the reading to a facial",
        level: 2,
        blocks: [
          {
            type: "table",
            head: ["What you notice", "What it suggests", "Reasonable next step"],
            rows: [
              ["Finger drags, tightness", "Barrier / hydration need", "Hydrating, barrier-first facial"],
              ["Congested forehead", "Build-up", "HydraFacial or light salicylic peel"],
              ["Morning puffiness", "Lymphatic", "Drainage-focused facial"],
              ["Dull but comfortable", "Ready for actives", "Resurfacing protocol"],
            ],
          },
          {
            type: "p",
            text: "The same principle — read first, treat second — applies well beyond facials. It is exactly how a good clinician approaches hair loss or plans laser hair removal: assessment precedes the procedure.",
          },
        ],
      },
    ],
    faq: [
      {
        q: "Should I exfoliate the day before a facial?",
        a: "Usually no. Arriving with an intact, calm barrier lets your clinician choose the right depth. Over-exfoliating beforehand can force a gentler, less effective session.",
      },
    ],
    references: [
      "American Academy of Dermatology. Skin care and skin conditions: basics of a healthy skin barrier.",
      "Draelos ZD. Cosmetic Dermatology: Products and Procedures. 2nd ed. Wiley-Blackwell.",
    ],
    furtherReading: [
      { label: "AAD — how to build a simple skincare routine" },
      { label: "Reviews of the skin barrier and transepidermal water loss" },
    ],
  },

  {
    slug: "the-quiet-case-for-restraint-in-injectables",
    category: "Anti-Ageing",
    title: "The Quiet Case for Restraint in Injectables",
    excerpt:
      "A dermatologist's view on why less filler — and better placement — almost always ages better.",
    coverImage:
      "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=1600&q=80",
    readingTimeMin: 7,
    date: "2026-01-16",
    updated: "2026-02-10",
    keywords: ["dermal fillers", "mesobotox", "hyaluronic acid", "injectables", "filler placement"],
    aliases: ["restraint in injectables"],
    keyFacts: [
      { label: "Approach", value: "Conservative injectables" },
      { label: "Typical volume", value: "0.4–1 ml per area" },
      { label: "Reversible", value: "Yes (HA fillers)" },
      { label: "Goal", value: "Natural, age-appropriate" },
    ],
    relatedSlugs: ["dermal-fillers", "mesobotox"],
    lead: [
      "**Restraint in injectables** is the clinical position that small, precisely placed volumes age better than large volumes placed for immediate impact. It is not a marketing story; it is a view about how moving, changing faces respond over time.",
      "The aim is not to freeze a face at 32, but to give it the small, quiet supports it needs to age well — so the work stays invisible a year later.",
    ],
    sections: [
      {
        id: "why-less-outlasts-more",
        heading: "Why less outlasts more",
        level: 2,
        blocks: [
          {
            type: "p",
            text: "Small volumes, placed precisely, tend to outlast large volumes placed for impact. A face has time to adapt to a well-placed 0.4 ml of dermal fillers; it rarely adapts kindly to 2 ml placed in one afternoon.",
          },
        ],
      },
      {
        id: "surface-polish-without-freezing",
        heading: "Surface polish without freezing",
        level: 2,
        blocks: [
          {
            type: "p",
            text: "Mesobotox — micro-doses placed superficially — is our answer to the 'frozen' concern. It gives the surface polish people love without erasing expression, and pairs well with conservative skin work such as a gentle HydraFacial rather than aggressive resurfacing.",
          },
        ],
      },
      {
        id: "reversibility",
        heading: "The reversibility argument",
        level: 2,
        blocks: [
          {
            type: "p",
            text: "Hyaluronic acid fillers can be dissolved [1]. The smaller and better-placed the initial work, the wider the range of choices you keep for the future. You should never leave looking 'done' — over time you should look more like yourself, rested and considered [2].",
          },
        ],
      },
    ],
    faq: [
      {
        q: "How long do conservative fillers last?",
        a: "Depending on product and area, hyaluronic acid fillers typically last 6–18 months. Smaller, well-placed volumes may need earlier top-ups but keep results looking natural.",
      },
    ],
    references: [
      "Signorini M, et al. Global Aesthetics Consensus: avoidance and management of complications from hyaluronic acid fillers. Plast Reconstr Surg. 2016.",
      "de Maio M. Myomodulation with injectable fillers: principles and practice. Aesthetic Plast Surg. 2018.",
    ],
    furtherReading: [
      { label: "Global Aesthetics Consensus Group papers on filler safety" },
      { label: "Reviews of hyaluronic-acid filler reversibility (hyaluronidase)" },
    ],
  },

  {
    slug: "laser-hair-removal-on-south-asian-skin",
    category: "Laser Hair Removal",
    title: "Laser Hair Removal on South Asian Skin — What Actually Works",
    excerpt:
      "Diode, Nd:YAG, cooling, wavelength selection — the honest, dermatologist's guide for melanated skin.",
    coverImage:
      "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=1600&q=80",
    readingTimeMin: 8,
    date: "2026-01-09",
    updated: "2026-02-05",
    keywords: ["laser hair removal", "diode laser", "Nd:YAG", "contact cooling", "test patch"],
    aliases: ["laser on Indian skin", "melanated skin laser"],
    keyFacts: [
      { label: "Devices", value: "Diode 810 nm, Nd:YAG 1064 nm" },
      { label: "Skin types", value: "Fitzpatrick IV–VI" },
      { label: "Sessions", value: "6–8, by growth phase" },
      { label: "Non-negotiable", value: "Contact cooling + test patch" },
    ],
    relatedSlugs: ["laser-hair-removal", "laser-hair-removal-women"],
    lead: [
      "**Laser hair removal** is safe on South Asian skin — but only when wavelength, energy, and cooling are chosen correctly for the specific tone. The most common question we hear is 'Is laser safe for Indian skin?', and the honest answer depends entirely on device selection.",
      "For melanated skin, the wrong settings risk burns and pigment change, while the right ones give steady, lasting reduction with minimal downtime.",
    ],
    sections: [
      {
        id: "wavelengths",
        heading: "Wavelengths that matter",
        level: 2,
        blocks: [
          {
            type: "p",
            text: "Two wavelengths dominate. Diode (around 810 nm) handles most South Asian tones well, especially with strong contact cooling. Nd:YAG (1064 nm) is the safest option for darker tones — its longer wavelength bypasses surface melanin and reaches the follicle [1].",
          },
          {
            type: "table",
            head: ["Wavelength", "Best suited to", "Note"],
            rows: [
              ["Diode 810 nm", "Fitzpatrick III–V", "Efficient with contact cooling"],
              ["Nd:YAG 1064 nm", "Fitzpatrick V–VI", "Safest for the darkest tones"],
            ],
          },
        ],
      },
      {
        id: "safety-essentials",
        heading: "Safety essentials",
        level: 2,
        blocks: [
          {
            type: "p",
            text: "The phrase your practitioner should use most is 'test patch' — a small area treated at planned settings and reviewed 48 hours later. If it is not offered, that is a signal.",
          },
          {
            type: "p",
            text: "Cooling is not optional. A device without integrated contact cooling — sapphire, cryogen, or forced air — is not the right device for melanated skin [2].",
          },
        ],
      },
      {
        id: "what-to-expect",
        heading: "What to expect",
        level: 2,
        blocks: [
          {
            type: "ul",
            items: [
              "Series length depends on area and cycle, but 6–8 sessions spaced by growth phase is reasonable; maintenance is annual, not monthly.",
              "Shave 12 hours before — not the morning of — and skip strong actives on the area for a week.",
              "Conditions unrelated to hair, such as hair loss on the scalp, are assessed and treated separately.",
            ],
          },
        ],
      },
    ],
    faq: [
      {
        q: "Does laser hair removal work on grey or blonde hair?",
        a: "Lasers target pigment in the hair, so they work best on dark hair. Grey, white, and very fair hair respond poorly regardless of skin tone.",
      },
    ],
    references: [
      "Ibrahimi OA, Kilmer SL. Laser hair removal in skin of color. Dermatol Clin. 2014.",
      "Battle EF, Hobbs LM. Laser-assisted hair removal for darker skin types. Dermatol Ther. 2004.",
    ],
    furtherReading: [
      { label: "Reviews of laser hair removal in Fitzpatrick IV–VI skin" },
      { label: "Guidance on device cooling and test patching" },
    ],
  },

  {
    slug: "hair-loss-what-actually-helps",
    category: "Hair",
    title: "Hair Loss — What Actually Helps, and What Doesn't",
    excerpt: "An honest, dr-led framework for reading, diagnosing and treating hair loss.",
    coverImage:
      "https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&w=1600&q=80",
    readingTimeMin: 9,
    date: "2025-12-30",
    updated: "2026-01-28",
    keywords: ["hair loss", "PRP", "minoxidil", "hair transplant", "mesotherapy"],
    aliases: ["hair thinning", "pattern hair loss"],
    keyFacts: [
      { label: "Causes", value: "Hormonal, nutritional, autoimmune, genetic" },
      { label: "First step", value: "Diagnosis + blood panel" },
      { label: "Early signs", value: "12–16 weeks" },
      { label: "Clear results", value: "≈ 6 months" },
    ],
    relatedSlugs: ["hair-loss-treatment", "advanced-hair-transplant"],
    lead: [
      "**Hair loss** is not one condition but at least four — hormonal, nutritional, autoimmune, and pattern (genetic) — and the treatment plan depends entirely on the diagnosis. Skipping the diagnosis is the single most common, and most expensive, mistake.",
      "The first step is never a shampoo. It is a proper consult: history, hairline map, trichoscopy, and, in many cases, a small blood panel (ferritin, vitamin D, B12, TSH, and hormones for women).",
    ],
    sections: [
      {
        id: "types",
        heading: "Types of hair loss",
        level: 2,
        blocks: [
          {
            type: "table",
            head: ["Type", "Typical driver", "Direction"],
            rows: [
              ["Pattern (genetic)", "Androgen sensitivity", "Gradual, patterned"],
              ["Nutritional", "Low ferritin, vitamin D", "Diffuse shedding"],
              ["Autoimmune", "Alopecia areata", "Patchy"],
              ["Hormonal", "Thyroid, PCOS, post-partum", "Diffuse, reversible"],
            ],
          },
        ],
      },
      {
        id: "what-helps",
        heading: "What actually helps",
        level: 2,
        blocks: [
          {
            type: "p",
            text: "For pattern loss caught early, PRP and topical minoxidil often do quiet, meaningful work — especially combined with mesotherapy. Oral therapy is added only when clinically indicated [1]. The same PRP principle is used in some facial and bridal protocols.",
          },
          {
            type: "p",
            text: "A hair transplant is a surgical option for stable pattern loss with a dense enough donor area. Timing matters: done too early, transplanted hair can look like an island around continuing loss [2].",
          },
        ],
      },
      {
        id: "what-doesnt",
        heading: "What doesn't help",
        level: 2,
        blocks: [
          {
            type: "ul",
            items: [
              "Viral scalp oils and dramatic salon 'treatments'.",
              "Any promise of 'regrowth in 30 days' — real regrowth follows the biological cycle.",
              "Shopping before diagnosing: expect first honest signs at 12–16 weeks and clear results at about six months.",
            ],
          },
        ],
      },
    ],
    faq: [
      {
        q: "Is post-partum hair loss permanent?",
        a: "Usually not. Post-partum shedding (telogen effluvium) typically recovers over several months as hormones stabilize, provided iron and thyroid status are adequate.",
      },
    ],
    references: [
      "Sinclair R, et al. Male and female pattern hair loss: diagnosis and treatment. Br J Dermatol.",
      "Gupta AK, et al. Platelet-rich plasma for androgenetic alopecia: a systematic review. 2019.",
    ],
    furtherReading: [
      { label: "Reviews of PRP and minoxidil for androgenetic alopecia" },
      { label: "Guidance on trichoscopy and the diagnostic blood panel" },
    ],
  },

  {
    slug: "coolsculpting-and-what-it-cannot-do",
    category: "Body",
    title: "CoolSculpting — and What It Cannot Do",
    excerpt: "A short, honest read on where cryolipolysis fits, and where it doesn't.",
    coverImage:
      "https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=1600&q=80",
    readingTimeMin: 6,
    date: "2025-12-14",
    updated: "2026-01-20",
    keywords: ["CoolSculpting", "cryolipolysis", "body shaping", "fat reduction"],
    aliases: ["fat freezing"],
    keyFacts: [
      { label: "Method", value: "Cryolipolysis (fat freezing)" },
      { label: "Target", value: "Discrete, pinchable fat pockets" },
      { label: "Results show", value: "6–12 weeks" },
      { label: "Not for", value: "Weight loss or loose skin" },
    ],
    relatedSlugs: ["coolsculpting", "body-shaping-figure-correction"],
    lead: [
      "**CoolSculpting** (cryolipolysis) is an excellent tool for the right problem and a poor one for the wrong problem. It reduces fat cells in discrete, pinchable pockets permanently — but it is not a weight-loss treatment.",
      "Knowing which problem you have is the whole game, so this is a short, honest read on where fat-freezing fits and where it does not.",
    ],
    sections: [
      {
        id: "what-it-does",
        heading: "What it does",
        level: 2,
        blocks: [
          {
            type: "p",
            text: "CoolSculpting works on discrete, pinchable fat pockets — love handles, small belly rolls, upper-arm bulges — reducing fat cells in that specific area permanently [1].",
          },
        ],
      },
      {
        id: "what-it-cannot-do",
        heading: "What it cannot do",
        level: 2,
        blocks: [
          {
            type: "ul",
            items: [
              "It does not do weight loss.",
              "It does not tighten loose skin.",
              "It does not fix visceral belly fat — the deeper fat behind the abdominal wall that responds to lifestyle, not applicators.",
            ],
          },
        ],
      },
      {
        id: "who-is-a-candidate",
        heading: "Who is a candidate",
        level: 2,
        blocks: [
          {
            type: "p",
            text: "Best candidates are usually within 10 kg of goal weight, with elastic skin and localised fat resistant to diet and exercise. One session per area is often enough, and reduction shows quietly over 6–12 weeks; photos at 12 weeks tell the truest story [2].",
          },
          {
            type: "p",
            text: "If the goal is broader — post-partum reshaping, weight loss, or loose skin — a layered body shaping plan serves better than freezing a single pocket, and it slots naturally into a longer bridal runway.",
          },
        ],
      },
    ],
    faq: [
      {
        q: "Is the fat reduction from CoolSculpting permanent?",
        a: "The treated fat cells are removed permanently, but remaining cells can still enlarge with weight gain. Stable weight preserves results best.",
      },
    ],
    references: [
      "Ingargiola MJ, et al. Cryolipolysis for fat reduction: a review of current status. Plast Reconstr Surg. 2015.",
      "Krueger N, et al. Cryolipolysis for noninvasive body contouring: efficacy and safety. Clin Cosmet Investig Dermatol. 2014.",
    ],
    furtherReading: [
      { label: "Reviews of cryolipolysis efficacy and safety" },
      { label: "Comparisons of non-invasive body-contouring devices" },
    ],
  },

  {
    slug: "the-six-month-bridal-runway",
    category: "Bridal",
    title: "The Six-Month Bridal Runway — a Dermatologist's Plan",
    excerpt:
      "Month-by-month, exactly what we do — and what we don't — in the six months before your wedding.",
    coverImage:
      "https://images.unsplash.com/photo-1585951237318-9ea5e175b891?auto=format&fit=crop&w=1600&q=80",
    readingTimeMin: 10,
    date: "2025-12-04",
    updated: "2026-01-12",
    keywords: ["bridal skin plan", "glow facial", "micro-needling", "PDRN", "hydration injections"],
    aliases: ["bridal runway", "wedding skin plan"],
    keyFacts: [
      { label: "Timeline", value: "6 months" },
      { label: "Structure", value: "Month-by-month" },
      { label: "Principle", value: "Less, in the right order" },
      { label: "Peak", value: "Wedding-week glow" },
    ],
    relatedSlugs: ["wedding-package", "hydrafacial-treatment"],
    lead: [
      "**The bridal runway** is a six-month, month-by-month plan to quietly repair, brighten, and calm skin before a wedding — in the right order, with time on your side. The single best gift you can give your wedding-day skin is time, not new experiments.",
      "It deliberately spans skin, hair, and body, drawing on facials, a HydraFacial, hair care, and body work so nothing is rushed in the final weeks.",
    ],
    sections: [
      {
        id: "the-timeline",
        heading: "The month-by-month timeline",
        level: 2,
        blocks: [
          {
            type: "table",
            head: ["Month", "Theme", "What we do"],
            rows: [
              ["6", "Consult", "Photos, history, full plan across skin, hair, body, and calendar"],
              ["5", "Repair", "Barrier-strengthening, gentle pigment control, home routine"],
              ["4", "Build", "Glow facials, a first light peel if ready, hair care begins"],
              ["3", "Refine", "Boosters, PDRN or hydration injections; body contouring on schedule"],
              ["2", "Polish", "A well-placed micro-needling or gentle laser, only if the plan calls for it"],
              ["1", "Settle", "No new actives or procedures — sleep, hydration, gentle facials"],
            ],
          },
        ],
      },
      {
        id: "what-we-avoid",
        heading: "What we deliberately avoid",
        level: 2,
        blocks: [
          {
            type: "p",
            text: "The final month is for settling, not experimenting: no new actives, no first-time mesobotox, no debut procedures. If hair loss or a body concern needs attention, it is handled early — never in the last weeks.",
          },
          {
            type: "p",
            text: "Fat-freezing such as CoolSculpting, when appropriate, belongs in the early months so results have time to show; laser hair removal is also completed well before the date, never rushed alongside it [1].",
          },
        ],
      },
      {
        id: "wedding-week",
        heading: "Wedding week",
        level: 2,
        blocks: [
          {
            type: "p",
            text: "A signature glow facial, lymphatic drainage, and a tiny day-of touch-up if needed — then, most importantly, rest. The runway is not about doing more; it is about doing less, in the right order [2].",
          },
        ],
      },
    ],
    faq: [
      {
        q: "What if I only have two months before the wedding?",
        a: "A shorter plan still helps — we prioritize hydration, barrier repair, and gentle glow facials, and avoid any first-time procedure close to the date.",
      },
    ],
    references: [
      "American Academy of Dermatology. Getting your skin wedding-ready: a timeline.",
      "Draelos ZD. Preparing the skin for special events. Cosmetic Dermatology.",
    ],
    furtherReading: [
      { label: "AAD guidance on event skin timelines" },
      { label: "Reviews of PDRN and skin-booster injections" },
    ],
  },
];

export const findPost = (slug) => POSTS.find((p) => p.slug === slug);
export const featuredPost = () => POSTS[0];
export const postsByCategory = (cat) =>
  cat && cat !== "All" ? POSTS.filter((p) => p.category === cat) : POSTS;
