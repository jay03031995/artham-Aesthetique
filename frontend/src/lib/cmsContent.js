import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { SITE as FALLBACK_SITE } from "../data/site";
import { CATEGORIES as FALLBACK_CATEGORIES, ALL_SERVICES as FALLBACK_SERVICES } from "../data/treatments";
import { POSTS as FALLBACK_POSTS } from "../data/blog";

const PROJECT_ID = process.env.REACT_APP_SANITY_PROJECT_ID || "3goot0bo";
const DATASET = process.env.REACT_APP_SANITY_DATASET || "production";
const API_VERSION = process.env.REACT_APP_SANITY_API_VERSION || "2026-07-13";
const USE_CDN = process.env.REACT_APP_SANITY_USE_CDN !== "false";
const CMS_ENABLED = process.env.REACT_APP_SANITY_ENABLED !== "false";
const REFRESH_MS = Number(process.env.REACT_APP_SANITY_REFRESH_MS || 60000);

const endpoint = `https://${PROJECT_ID}.api${USE_CDN ? "cdn" : ""}.sanity.io/v${API_VERSION}/data/query/${DATASET}`;

const CMS_QUERY = `{
  "site": *[_type == "siteSettings"][0]{
    title, tagline, wordmarkDeva, phone, phoneDigits, hours, address, parentBrandUrl,
    "logoUrl": coalesce(logo.url, logo.asset.asset->url),
    "footerLogoUrl": coalesce(footerLogo.url, footerLogo.asset.asset->url),
    "doctorPortraitUrl": coalesce(doctorPortrait.url, doctorPortrait.asset.asset->url),
    "heroImageUrl": coalesce(heroImage.url, heroImage.asset.asset->url),
    "clinicPhotoUrl": coalesce(clinicPhoto.url, clinicPhoto.asset.asset->url, heroImage.url, heroImage.asset.asset->url),
    heroVideoUrl,
    social,
    nav,
    "megaGroups": megaGroups[]{
      heading,
      "catLink": select(defined(category->slug.current) => "/category/" + category->slug.current, "#"),
      "items": treatments[]->{
        title, short, duration, sessions,
        "name": title,
        "slug": slug.current,
        "image": coalesce(cardImage.url, cardImage.asset.asset->url, image.url, image.asset.asset->url, heroImage.url, heroImage.asset.asset->url)
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
    _id, title, intro, order,
    "name": title,
    "slug": slug.current,
    "image": coalesce(image.url, image.asset.asset->url),
    "services": *[_type == "treatment" && references(^._id) && status != "draft"]|order(order asc, title asc){
      _id, title, short, heroTitle, hero, description, overviewHeading, ctaText, ctaLink, "heroBackgroundImage": coalesce(heroBackgroundImage.url, heroBackgroundImage.asset.asset->url), "featuredImage": coalesce(featuredImage.url, featuredImage.asset.asset->url), "cardImage": coalesce(cardImage.url, cardImage.asset.asset->url), what, whoFor, duration, sessions, priceFrom, pricing, doctorNote, faqs,
      quickInfo, howItWorks,
      "symptoms": symptoms[]{title, description, "image": coalesce(image.url, image.asset.asset->url)},
      "benefits": benefits[]{title, description, "icon": coalesce(icon.url, icon.asset.asset->url)},
      relatedTreatments[]->{"slug": slug.current, "name": title, short, "image": coalesce(cardImage.url, cardImage.asset.asset->url, image.url, image.asset.asset->url)},
      "realResults": realResults[]->{title, patientAge, gender, description, sessionsInfo, note, "beforeImage": coalesce(beforeImage.url, beforeImage.asset.asset->url), "afterImage": coalesce(afterImage.url, afterImage.asset.asset->url)},
      "name": title,
      "slug": slug.current,
      "image": coalesce(cardImage.url, cardImage.asset.asset->url, image.url, image.asset.asset->url, heroImage.url, heroImage.asset.asset->url),
      "heroImage": coalesce(heroImage.url, heroImage.asset.asset->url, image.url, image.asset.asset->url),
      "category": ^.title,
      "categorySlug": ^.slug.current,
      "results": *[_type == "beforeAfter" && references(^._id)]|order(order asc){
        title, patientAge, gender, description, sessionsInfo, note,
        "beforeImage": coalesce(beforeImage.url, beforeImage.asset.asset->url),
        "afterImage": coalesce(afterImage.url, afterImage.asset.asset->url)
      }
    }
  },
  "posts": *[_type == "post"]|order(date desc){
    title, category, excerpt, date, updated, keywords, aliases, lead, sections, keyFacts, faq, references, furtherReading,
    "slug": slug.current,
    "coverImage": coalesce(cover.url, cover.asset.asset->url),
    "relatedSlugs": relatedTreatments[]->slug.current,
    "readingTimeMin": round(length(pt::text(sections[].blocks[].text)) / 900)
  },
  "results": *[_type == "beforeAfter"]|order(order asc){
    _id, title, patientAge, gender, description, sessionsInfo, note,
    "featured": coalesce(featured, false),
    "treatmentSlug": treatment->slug,
    "treatmentName": treatment->title,
    "category": category->title,
    "beforeImage": coalesce(beforeImage.url, beforeImage.asset.asset->url),
    "afterImage": coalesce(afterImage.url, afterImage.asset.asset->url)
  },
  "doctors": *[_type == "doctor"]|order(_createdAt asc){
    name, title, designation, qualifications, experience, languages, achievements, bio, education, memberships, expertise, philosophy, consultationCta,
    "slug": slug.current,
    "portrait": coalesce(portrait.url, portrait.asset.asset->url),
    "signatureServices": signatureTreatments[]->{"slug": slug.current, "name": title, short, "image": coalesce(cardImage.url, cardImage.asset.asset->url, image.url, image.asset.asset->url)}
  },
  "testimonials": *[_type == "testimonial" && featured == true]|order(order asc, _createdAt desc){
    name, area, rating, quote, review,
    "image": coalesce(image.url, image.asset.asset->url)
  },
  "home": *[_type == "homePage"][0],
  "about": *[_type == "aboutPage"][0],
  "contact": *[_type == "contactPage"][0],
  "footer": *[_type == "footerSettings"][0],
  "seo": *[_type == "seoSettings"][0]
}`;

const CMSContext = createContext(null);

const compact = (obj) =>
  Object.fromEntries(Object.entries(obj || {}).filter(([, value]) => value !== undefined && value !== null && value !== ""));

const mergeSite = (site = {}) => ({
  ...FALLBACK_SITE,
  ...compact(site),
  name: site.title || FALLBACK_SITE.name,
  logoUrl: site.logoUrl || FALLBACK_SITE.logoUrl,
  footerLogoUrl: site.footerLogoUrl || FALLBACK_SITE.footerLogoUrl,
  doctorPortraitUrl: site.doctorPortraitUrl || FALLBACK_SITE.doctorPortraitUrl,
  heroImageUrl: site.heroImageUrl || FALLBACK_SITE.heroImageUrl,
  clinicPhotoUrl: site.clinicPhotoUrl || FALLBACK_SITE.clinicPhotoUrl,
  heroVideoUrl: site.heroVideoUrl || FALLBACK_SITE.heroVideoUrl,
  address: { ...FALLBACK_SITE.address, ...(site.address || {}) },
  social: { ...FALLBACK_SITE.social, ...(site.social || {}) },
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
    heroDescription: service.heroDescription || service.description || "",
    overviewHeading: service.overviewHeading || "",
    ctaText: service.ctaText || "",
    ctaLink: service.ctaLink || "",
    heroBackgroundImage: service.heroBackgroundImage || "",
    featuredImage: service.featuredImage || "",
    cardImage: service.cardImage || "",
    priceFrom: service.priceFrom || "",
    pricing: service.pricing || [],
    image: service.image || service.heroImage || category?.image || FALLBACK_SITE.heroImageUrl,
    what: service.what || service.overviewDescription || service.description || "",
    whoFor: service.whoFor || [],
    benefits: (service.benefits || []).map((b) =>
      typeof b === "string"
        ? { title: b, description: "", icon: "" }
        : { title: b.title || b.text || "", description: b.description || "", icon: b.icon || "" }
    ).filter((b) => b.title),
    symptoms: (service.symptoms || []).map((s) =>
      typeof s === "string"
        ? { title: s, description: "", image: "" }
        : { title: s.title || s.text || "", description: s.description || "", image: s.image || "" }
    ).filter((s) => s.title),
    howItWorks: normalizeSteps(service.howItWorks),
    faqs: normalizeFaqs(service.faqs),
    quickInfoRows: quickInfoRows(service),
    downtime,
    relatedTreatments: service.relatedTreatments || [],
    realResults: service.realResults || [],
    results: (service.realResults && service.realResults.length) ? service.realResults : service.results || [],
  };
};

const normalizeCategories = (categories = []) => {
  const sane = categories.filter((cat) => cat.slug && cat.name);
  if (!sane.length) return FALLBACK_CATEGORIES;
  return sane.map((cat) => {
    const base = FALLBACK_CATEGORIES.find((fallback) => fallback.slug === cat.slug) || {};
    const merged = {
      ...base,
      ...cat,
      image: cat.image || base.image || FALLBACK_SITE.heroImageUrl,
      intro: cat.intro || base.intro || "",
    };
    merged.services = (cat.services || []).map((service) => normalizeService(service, merged));
    return merged;
  });
};

const normalizePosts = (posts = []) =>
  posts.length
    ? posts.map((post) => ({
        ...post,
        coverImage: post.coverImage || FALLBACK_SITE.clinicPhotoUrl,
        readingTimeMin: post.readingTimeMin || 5,
        sections: (post.sections || []).map((section) => ({
          ...section,
          blocks: (section.blocks || []).map((block) => ({
            ...block,
            rows: (block.rows || []).map((row) => row.cells || row),
          })),
        })),
      }))
    : FALLBACK_POSTS;

const composeContent = (result = {}) => {
  const site = mergeSite(result.site);
  const categories = normalizeCategories(result.categories);
  const allServices = categories.flatMap((cat) => cat.services.map((service) => ({ ...service, category: cat.name, categorySlug: cat.slug })));
  return {
    site,
    categories,
    allServices,
    posts: normalizePosts(result.posts),
    results: result.results || [],
    doctors: result.doctors || [],
    testimonials: result.testimonials || [],
    home: result.home || {},
    about: result.about || {},
    contact: result.contact || {},
    footer: result.footer || {},
    seo: result.seo || {},
    megaGroups: result.site?.megaGroups || [],
    nav: result.navigation?.items || result.site?.nav || [],
    loadedFromCms: Boolean(result.site || result.categories?.length || result.posts?.length),
  };
};

const fallbackContent = composeContent({});

async function fetchCmsContent({ signal } = {}) {
  if (!CMS_ENABLED) return fallbackContent;
  const res = await fetch(`${endpoint}?query=${encodeURIComponent(CMS_QUERY)}`, { signal });
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
    findService: (slug) => FALLBACK_SERVICES.find((service) => service.slug === slug),
    findCategory: (slug) => FALLBACK_CATEGORIES.find((category) => category.slug === slug),
    findPost: (slug) => FALLBACK_POSTS.find((post) => post.slug === slug),
    postsByCategory: (category) => (category && category !== "All" ? FALLBACK_POSTS.filter((post) => post.category === category) : FALLBACK_POSTS),
    related: (categorySlug, currentSlug, max = 4) =>
      FALLBACK_SERVICES.filter((service) => service.categorySlug === categorySlug && service.slug !== currentSlug).slice(0, max),
  };
}

export const cmsWhatsAppLink = (site, msg = "Hello Artham Aesthetique, I would like to book a consultation.") =>
  `https://wa.me/${site.phoneDigits || FALLBACK_SITE.phoneDigits}?text=${encodeURIComponent(msg)}`;
