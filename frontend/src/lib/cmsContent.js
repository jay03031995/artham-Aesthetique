import { createContext, useContext, useEffect, useMemo, useState } from "react";

const PROJECT_ID = process.env.REACT_APP_SANITY_PROJECT_ID || "3goot0bo";
const DATASET = process.env.REACT_APP_SANITY_DATASET || "production";
const API_VERSION = process.env.REACT_APP_SANITY_API_VERSION || "2026-07-13";
const USE_CDN = process.env.REACT_APP_SANITY_USE_CDN === "true";
const CMS_ENABLED = process.env.REACT_APP_SANITY_ENABLED !== "false";
const REFRESH_MS = Number(process.env.REACT_APP_SANITY_REFRESH_MS || 15000);

const endpoint = `https://${PROJECT_ID}.api${USE_CDN ? "cdn" : ""}.sanity.io/v${API_VERSION}/data/query/${DATASET}`;

const img = (field) => `coalesce(${field}.url, ${field}.asset->url)`;

const EMPTY_SITE = {
  title: "",
  name: "",
  tagline: "",
  wordmarkDeva: "",
  phone: "",
  phoneDigits: "",
  hours: "",
  address: { line1: "", line2: "", line3: "" },
  social: {},
  logoUrl: "",
  footerLogoUrl: "",
  doctorPortraitUrl: "",
  heroImageUrl: "",
  clinicPhotoUrl: "",
  heroVideoUrl: "",
  parentBrandUrl: "",
};

const CMS_QUERY = `{
  "site": *[_type == "siteSettings"][0]{
    title, tagline, wordmarkDeva, phone, phoneDigits, hours, address, parentBrandUrl,
    headerCta, footerCta, emails, workingHours, googleMaps, whatsapp, copyright, analytics, verificationCodes,
    "logoUrl": ${img("logo")},
    "footerLogoUrl": ${img("footerLogo")},
    "doctorPortraitUrl": ${img("doctorPortrait")},
    "heroImageUrl": ${img("heroImage")},
    "clinicPhotoUrl": coalesce(${img("clinicPhoto")}, ${img("heroImage")}),
    heroVideoUrl,
    social,
    "nav": nav[]{label, href},
    "megaGroups": megaGroups[]{
      heading,
      "catLink": select(defined(category->slug.current) => "/category/" + category->slug.current, "#"),
      "items": treatments[]->{
        title, short, duration, sessions,
        "name": title,
        "slug": slug.current,
        "image": coalesce(${img("cardImage")}, ${img("image")}, ${img("heroImage")})
      }
    }
  },
  "navigation": *[_type == "navigationSettings"][0]{
    "items": items[visible != false]|order(order asc){
      label, href,
      "categorySlug": dropdownCategory->slug.current,
      "categoryTitle": dropdownCategory->title
    }
  },
  "categories": *[_type == "category"]|order(order asc, title asc){
    _id, title, intro, order, seo, breadcrumbHomeLabel, breadcrumbTreatmentsLabel, countLabel, ctaEyebrow, ctaTitle, ctaText, ctaButtonText,
    "name": title,
    "slug": slug.current,
    "image": ${img("image")},
    "icon": ${img("icon")},
    "services": *[_type == "treatment" && references(^._id) && status != "draft"]|order(order asc, title asc){
      _id, title, short, heroTitle, hero, description, ctaText, ctaLink, whatsappLabel, whatsappMessage,
      what, overviewHeading, whoFor, duration, sessions, downtime, priceFrom, pricing,
      processEyebrow, processTitle, benefitsEyebrow, benefitsTitle, expectationsEyebrow, expectationsTitle,
      doctorNoteEyebrow, doctorNote, faqEyebrow, faqTitle, relatedEyebrow, relatedTitle, relatedLinkText, faqs, seo,
      quickInfo, howItWorks[]{title, body, "image": ${img("image")}},
      "symptoms": symptoms[]{title, description, "image": ${img("image")}},
      "benefits": benefits[]{title, description, "image": ${img("image")}},
      relatedTreatments[]->{"slug": slug.current, "name": title, short, "image": coalesce(${img("cardImage")}, ${img("image")}, ${img("heroImage")})},
      "name": title,
      "slug": slug.current,
      "image": coalesce(${img("cardImage")}, ${img("image")}, ${img("heroImage")}),
      "heroImage": coalesce(${img("heroImage")}, ${img("image")}),
      "heroBackgroundImage": ${img("heroBackgroundImage")},
      "category": ^.title,
      "categorySlug": ^.slug.current,
      "results": *[_type == "beforeAfter" && references(^._id)]|order(order asc){
        title, patientAge, gender, description, sessionsInfo, note,
        "beforeImage": ${img("beforeImage")},
        "afterImage": ${img("afterImage")}
      }
    }
  },
  "posts": *[_type == "post"]|order(date desc){
    title, category, excerpt, date, updated, keywords, aliases, lead, sections, keyFacts, faq, references, furtherReading, author, tags, seo,
    "slug": slug.current,
    "coverImage": ${img("cover")},
    "relatedSlugs": relatedTreatments[]->slug.current,
    "readingTimeMin": round(length(pt::text(sections[].blocks[].text)) / 900)
  },
  "doctors": *[_type == "doctor"]|order(_createdAt asc){
    name, title, designation, qualifications, experience, languages, achievements, bio, education, memberships, expertise, philosophy, consultationCta,
    "slug": slug.current,
    "portrait": ${img("portrait")},
    "signatureServices": signatureTreatments[]->{"slug": slug.current, "name": title, short, "image": coalesce(${img("cardImage")}, ${img("image")}, ${img("heroImage")})}
  },
  "testimonials": *[_type == "testimonial"]|order(order asc, _createdAt desc){
    name, area, rating, quote, review,
    featured,
    "image": ${img("image")},
    "treatment": treatment->{"slug": slug.current, "name": title}
  },
  "home": *[_type == "homePage"][0]{
    ..., "heroImageUrl": ${img("heroImage")},
    "featuredTreatments": featuredTreatments[]->{"slug": slug.current, "name": title, short, duration, sessions, "image": coalesce(${img("cardImage")}, ${img("image")}, ${img("heroImage")})},
    "doctor": doctor->{name, title, designation, qualifications, philosophy, bio, consultationCta, "slug": slug.current, "portrait": ${img("portrait")}},
    "testimonials": testimonials[]->{name, area, rating, quote, review, "image": ${img("image")}},
    "realResults": realResults[]->{title, description, sessionsInfo, "beforeImage": ${img("beforeImage")}, "afterImage": ${img("afterImage")}}
  },
  "about": *[_type == "aboutPage"][0]{..., "heroImageUrl": ${img("heroImage")}, "galleryUrls": gallery[]{"url": coalesce(url, asset->url), alt}},
  "contact": *[_type == "contactPage"][0]{..., "heroImageUrl": ${img("heroImage")}},
  "footer": *[_type == "footerSettings"][0],
  "seo": *[_type == "seoSettings"][0]{
    ..., "defaultOpenGraphImageUrl": ${img("defaultOpenGraphImage")}, "faviconUrl": ${img("favicon")}, "appleTouchIconUrl": ${img("appleTouchIcon")}
  },
  "faqs": *[_type == "faq"]|order(order asc, _createdAt asc){q, a},
  "offers": *[_type == "offer" && active != false]|order(validTill asc, _createdAt desc){
    title, blurb, terms, validTill, "slug": slug.current, "image": ${img("image")}
  },
  "policies": *[_type == "policyPage"]|order(title asc){
    title, intro, eyebrow, sections, updatedText, contactLink, seo, "slug": slug.current
  },
  "careers": *[_type == "careersPage"][0]{..., seo},
  "booking": *[_type == "bookingSettings"][0],
  "chatbot": *[_type == "chatbotSettings"][0],
  "mobileBar": *[_type == "mobileBarSettings"][0]{
    "items": items[]|order(order asc){label, icon, action, href, highlight, order}
  }
}`;

const CMSContext = createContext(null);

const compact = (obj) =>
  Object.fromEntries(Object.entries(obj || {}).filter(([, value]) => value !== undefined && value !== null && value !== ""));

const mergeSite = (site = {}) => ({
  ...EMPTY_SITE,
  ...compact(site),
  name: site.title || "",
  address: { ...EMPTY_SITE.address, ...(site.address || {}) },
  social: { ...(site.social || {}) },
});

const normalizeSteps = (steps = []) =>
  steps.map((step, index) => ({
    title: step.title,
    body: step.body || step.description,
    image: step.image,
    stepNumber: step.stepNumber || index + 1,
  })).filter((step) => step.title || step.body);

const normalizeFaqs = (faqs = []) =>
  faqs.map((faq) => ({ q: faq.q || faq.question, a: faq.a || faq.answer })).filter((faq) => faq.q && faq.a);

const quickInfoRows = (service = {}) => {
  const quick = service.quickInfo || {};
  const rows = [
    ["Treatment Time", quick.treatmentTime || service.duration],
    ["Downtime", quick.downtime || (Array.isArray(service.downtime) ? null : service.downtime)],
    ["Results", quick.results],
    ["Sessions Required", quick.sessionsRequired || service.sessions],
    ["Pain Level", quick.painLevel],
    ["Recovery Time", quick.recoveryTime],
    ["Anesthesia", quick.anesthesia],
    ["Suitable For", quick.suitableFor],
  ];
  return rows.filter(([, value]) => value).map(([label, value]) => ({ label, value }));
};

const normalizeService = (service, category) => {
  const downtime = Array.isArray(service.downtime) && service.downtime.length ? service.downtime : quickInfoRows(service);
  return {
    ...service,
    name: service.name || service.title,
    slug: service.slug,
    category: service.category || category?.name,
    categorySlug: service.categorySlug || category?.slug,
    short: service.short || service.shortDescription || "",
    hero: service.hero || service.heroSubtitle || service.short || "",
    image: service.image || service.heroImage || category?.image || "",
    what: service.what || service.overviewDescription || service.description || "",
    whoFor: service.whoFor || [],
    benefits: (service.benefits || []).map((b) =>
      typeof b === "string"
        ? { title: b, description: "", image: "" }
        : { title: b.title || b.text || "", description: b.description || "", image: b.image || "" }
    ).filter((b) => b.title),
    symptoms: (service.symptoms || []).map((s) =>
      typeof s === "string"
        ? { title: s, description: "", image: "" }
        : { title: s.title || s.text || "", description: s.description || "", image: s.image || "" }
    ).filter((s) => s.title),
    howItWorks: normalizeSteps(service.howItWorks),
    faqs: normalizeFaqs(service.faqs),
    downtime,
    relatedTreatments: service.relatedTreatments || [],
  };
};

const normalizeCategories = (categories = []) => {
  const sane = categories.filter((cat) => cat.slug && cat.name);
  if (!sane.length) return [];
  return sane.map((cat) => {
    const merged = {
      ...cat,
      image: cat.image || "",
      intro: cat.intro || "",
    };
    merged.services = (cat.services || []).map((service) => normalizeService(service, merged));
    return merged;
  });
};

const normalizePosts = (posts = []) =>
  posts.length
    ? posts.map((post) => ({
        ...post,
        coverImage: post.coverImage || "",
        readingTimeMin: post.readingTimeMin || 5,
        sections: (post.sections || []).map((section) => ({
          ...section,
          blocks: (section.blocks || []).map((block) => ({
            ...block,
            rows: (block.rows || []).map((row) => row.cells || row),
          })),
        })),
      }))
    : [];

const composeContent = (result = {}) => {
  const site = mergeSite(result.site);
  const categories = normalizeCategories(result.categories);
  const allServices = categories.flatMap((cat) => cat.services.map((service) => ({ ...service, category: cat.name, categorySlug: cat.slug })));
  return {
    site,
    categories,
    allServices,
    posts: normalizePosts(result.posts),
    doctors: result.doctors || [],
    testimonials: result.testimonials || [],
    home: result.home || {},
    about: result.about || {},
    contact: result.contact || {},
    footer: result.footer || {},
    seo: result.seo || {},
    faqs: result.faqs || [],
    offers: result.offers || [],
    policies: result.policies || [],
    careers: result.careers || {},
    booking: result.booking || {},
    chatbot: result.chatbot || {},
    mobileBar: result.mobileBar || {},
    megaGroups: result.site?.megaGroups || [],
    nav: result.navigation?.items || result.site?.nav || [],
    loadedFromCms: Boolean(result.site || result.categories?.length || result.posts?.length),
  };
};

const fallbackContent = composeContent({});

async function fetchCmsContent({ signal } = {}) {
  if (!CMS_ENABLED) return fallbackContent;
  const res = await fetch(`${endpoint}?query=${encodeURIComponent(CMS_QUERY)}&ts=${Date.now()}`, {
    signal,
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Sanity request failed (${res.status})`);
  const json = await res.json();
  return composeContent(json.result || {});
}

export function CMSContentProvider({ children }) {
  const [content, setContent] = useState(fallbackContent);

  useEffect(() => {
    const controller = new AbortController();
    let live = true;
    const load = async () => {
      try {
        const next = await fetchCmsContent({ signal: controller.signal });
        if (live) setContent(next);
      } catch (_) {
        if (live) setContent((current) => current || fallbackContent);
      }
    };
    load();
    const timer = REFRESH_MS > 0 ? window.setInterval(load, REFRESH_MS) : null;
    return () => {
      live = false;
      controller.abort();
      if (timer) window.clearInterval(timer);
    };
  }, []);

  const value = useMemo(() => ({
    ...content,
    findService: (slug) => content.allServices.find((service) => service.slug === slug),
    findCategory: (slug) => content.categories.find((category) => category.slug === slug),
    findPost: (slug) => content.posts.find((post) => post.slug === slug),
    postsByCategory: (category) => (category && category !== "All" ? content.posts.filter((post) => post.category === category) : content.posts),
    related: (categorySlug, currentSlug, max = 4) =>
      content.allServices.filter((service) => service.categorySlug === categorySlug && service.slug !== currentSlug).slice(0, max),
  }), [content]);

  return <CMSContext.Provider value={value}>{children}</CMSContext.Provider>;
}

export function useCmsContent() {
  return useContext(CMSContext) || {
    ...fallbackContent,
    findService: () => null,
    findCategory: () => null,
    findPost: () => null,
    postsByCategory: () => [],
    related: (categorySlug, currentSlug, max = 4) =>
      fallbackContent.allServices.filter((service) => service.categorySlug === categorySlug && service.slug !== currentSlug).slice(0, max),
  };
}

export const cmsWhatsAppLink = (site, msg = "") =>
  `https://wa.me/${site.whatsapp || site.phoneDigits || ""}?text=${encodeURIComponent(msg)}`;
