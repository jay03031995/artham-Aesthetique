const SITE_URL = (process.env.SITE_URL || process.env.REACT_APP_SITE_URL || "https://www.arthamaesthetique.com").replace(/\/+$/, "");
const PROJECT_ID = process.env.SANITY_STUDIO_PROJECT_ID || process.env.REACT_APP_SANITY_PROJECT_ID || "3goot0bo";
const DATASET = process.env.SANITY_STUDIO_DATASET || process.env.REACT_APP_SANITY_DATASET || "production";
const API_VERSION = process.env.SANITY_API_VERSION || process.env.REACT_APP_SANITY_API_VERSION || "2026-07-13";
const TOKEN = process.env.SANITY_TOKEN || "";

const endpoint = `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/query/${DATASET}`;

const staticRoutes = [
  { path: "/", priority: "1.0" },
  { path: "/doctors", priority: "0.7" },
  { path: "/blog", priority: "0.7" },
  { path: "/results", priority: "0.7" },
  { path: "/about", priority: "0.7" },
  { path: "/contact", priority: "0.8" },
  { path: "/faq", priority: "0.6" },
  { path: "/careers", priority: "0.4" },
  { path: "/offers", priority: "0.6" },
  { path: "/book", priority: "0.8" },
  { path: "/policies/terms", priority: "0.3" },
  { path: "/policies/privacy", priority: "0.3" },
  { path: "/policies/refund", priority: "0.3" },
  { path: "/policies/cancellation", priority: "0.3" },
];

const query = `{
  "pages": [
    ...*[_type == "homePage" && !(_id in path("drafts.**")) && seo.noIndex != true]{
      _updatedAt,
      "path": "/",
      "priority": "1.0",
      "canonicalUrl": seo.canonicalUrl
    },
    ...*[_type == "aboutPage" && !(_id in path("drafts.**")) && seo.noIndex != true]{
      _updatedAt,
      "path": "/about",
      "priority": "0.7",
      "canonicalUrl": seo.canonicalUrl
    },
    ...*[_type == "contactPage" && !(_id in path("drafts.**")) && seo.noIndex != true]{
      _updatedAt,
      "path": "/contact",
      "priority": "0.8",
      "canonicalUrl": seo.canonicalUrl
    }
  ],
  "excludedPagePaths": [
    ...*[_type == "homePage" && !(_id in path("drafts.**")) && seo.noIndex == true]{"path": "/"},
    ...*[_type == "aboutPage" && !(_id in path("drafts.**")) && seo.noIndex == true]{"path": "/about"},
    ...*[_type == "contactPage" && !(_id in path("drafts.**")) && seo.noIndex == true]{"path": "/contact"}
  ].path,
  "categories": *[_type == "category" && !(_id in path("drafts.**")) && defined(slug.current)]|order(order asc, title asc){
    _updatedAt,
    "slug": slug.current
  },
  "treatments": *[_type == "treatment" && !(_id in path("drafts.**")) && status != "draft" && seo.noIndex != true && defined(slug.current)]|order(order asc, title asc){
    _updatedAt,
    "slug": slug.current,
    "canonicalUrl": seo.canonicalUrl
  },
  "posts": *[_type == "post" && !(_id in path("drafts.**")) && seo.noIndex != true && defined(slug.current) && (!defined(publishedAt) || publishedAt <= now())]|order(coalesce(publishedAt, _updatedAt) desc){
    _updatedAt,
    "slug": slug.current,
    "canonicalUrl": seo.canonicalUrl
  },
  "doctors": *[_type == "doctor" && !(_id in path("drafts.**")) && defined(slug.current)]|order(_createdAt asc){
    _updatedAt,
    "slug": slug.current
  }
}`;

const escapeXml = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const cleanPath = (value = "/") => {
  const pathValue = value.startsWith("/") ? value : `/${value}`;
  return pathValue === "/" ? "/" : pathValue.replace(/\/+$/, "");
};

const seoTreatmentSlug = (slug = "") => (slug && !/-in-noida$/i.test(slug) ? `${slug}-in-noida` : slug);

const urlFromPath = (pathValue) => `${SITE_URL}${cleanPath(pathValue)}`;

const urlFromCanonical = (canonicalUrl) => {
  if (!canonicalUrl) return "";

  try {
    const parsed = new URL(canonicalUrl, SITE_URL);
    const allowedHosts = new Set(["arthamaesthetique.com", "www.arthamaesthetique.com"]);
    if (!allowedHosts.has(parsed.hostname)) return "";
    return `${SITE_URL}${cleanPath(parsed.pathname)}${parsed.search}`;
  } catch (_) {
    return "";
  }
};

const resolvedUrl = (item, defaultPath) => urlFromCanonical(item.canonicalUrl) || urlFromPath(defaultPath);

async function fetchSanity() {
  const headers = TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {};
  const response = await fetch(`${endpoint}?query=${encodeURIComponent(query)}`, { headers });

  if (!response.ok) {
    throw new Error(`Sanity sitemap query failed: ${response.status} ${response.statusText}`);
  }

  const body = await response.json();
  return body.result || {};
}

function addUrl(map, loc, priority, lastmod) {
  const existing = map.get(loc);

  if (!existing || (lastmod && (!existing.lastmod || new Date(lastmod) > new Date(existing.lastmod)))) {
    map.set(loc, { loc, priority, lastmod });
  }
}

function buildEntries(result = {}) {
  const urls = new Map();
  const excluded = new Set((result.excludedPagePaths || []).map((pathValue) => urlFromPath(pathValue)));

  staticRoutes.forEach((route) => {
    const loc = urlFromPath(route.path);
    if (!excluded.has(loc)) addUrl(urls, loc, route.priority);
  });

  (result.pages || []).forEach((page) => addUrl(urls, resolvedUrl(page, page.path), page.priority, page._updatedAt));
  (result.categories || []).forEach((category) => addUrl(urls, urlFromPath(`/category/${category.slug}`), "0.8", category._updatedAt));
  (result.treatments || []).forEach((treatment) =>
    addUrl(urls, resolvedUrl(treatment, `/${seoTreatmentSlug(treatment.slug)}`), "0.7", treatment._updatedAt),
  );
  (result.posts || []).forEach((post) => addUrl(urls, resolvedUrl(post, `/blog/${post.slug}`), "0.5", post._updatedAt));
  (result.doctors || []).forEach((doctor) => addUrl(urls, urlFromPath(`/doctors/${doctor.slug}`), "0.8", doctor._updatedAt));

  return Array.from(urls.values());
}

function renderSitemap(entries) {
  const body = entries
    .map(({ loc, priority, lastmod }) => {
      const lastmodTag = lastmod ? `<lastmod>${escapeXml(new Date(lastmod).toISOString())}</lastmod>` : "";
      return `  <url><loc>${escapeXml(loc)}</loc>${lastmodTag}<priority>${priority}</priority></url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}

module.exports = async function sitemapHandler(_request, response) {
  try {
    const result = await fetchSanity();
    const sitemap = renderSitemap(buildEntries(result));

    response.setHeader("Content-Type", "application/xml; charset=utf-8");
    response.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=86400");
    response.status(200).send(sitemap);
  } catch (error) {
    console.error(error);
    response.setHeader("Content-Type", "application/xml; charset=utf-8");
    response.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300");
    response.status(200).send(renderSitemap(buildEntries({})));
  }
};
