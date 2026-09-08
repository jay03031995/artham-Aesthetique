import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.resolve(__dirname, "../public");
const SITEMAP_PATH = path.join(PUBLIC_DIR, "sitemap.xml");

const SITE_URL = (process.env.SITE_URL || process.env.REACT_APP_SITE_URL || "https://www.arthamaesthetique.com").replace(/\/+$/, "");
const PROJECT_ID = process.env.SANITY_STUDIO_PROJECT_ID || process.env.REACT_APP_SANITY_PROJECT_ID || "3goot0bo";
const DATASET = process.env.SANITY_STUDIO_DATASET || process.env.REACT_APP_SANITY_DATASET || "production";
const API_VERSION = process.env.SANITY_API_VERSION || process.env.REACT_APP_SANITY_API_VERSION || "2026-07-13";
const TOKEN = process.env.SANITY_TOKEN || process.env.REACT_APP_SANITY_TOKEN || "";

const endpoint = `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/query/${DATASET}`;

const STATIC_ROUTES = [
  { path: "/", priority: "1.0" },
  { path: "/doctors", priority: "0.7" },
  { path: "/doctors/dr-omaima-jawed", priority: "0.8" },
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
    ...*[_type == "homePage" && !(_id in path("drafts.**")) && seo.noIndex != true]{_updatedAt, "path": "/", "priority": "1.0"},
    ...*[_type == "aboutPage" && !(_id in path("drafts.**")) && seo.noIndex != true]{_updatedAt, "path": "/about", "priority": "0.7"},
    ...*[_type == "contactPage" && !(_id in path("drafts.**")) && seo.noIndex != true]{_updatedAt, "path": "/contact", "priority": "0.8"}
  ],
  "excludedPagePaths": [
    ...*[_type == "homePage" && !(_id in path("drafts.**")) && seo.noIndex == true]{"path": "/"},
    ...*[_type == "aboutPage" && !(_id in path("drafts.**")) && seo.noIndex == true]{"path": "/about"},
    ...*[_type == "contactPage" && !(_id in path("drafts.**")) && seo.noIndex == true]{"path": "/contact"}
  ].path,
  "categories": *[_type == "category" && !(_id in path("drafts.**")) && seo.noIndex != true && defined(slug.current)]|order(order asc, title asc){
    _updatedAt,
    "slug": slug.current
  },
  "treatments": *[_type == "treatment" && !(_id in path("drafts.**")) && status != "draft" && seo.noIndex != true && defined(slug.current)]|order(order asc, title asc){
    _updatedAt,
    "slug": slug.current
  },
  "posts": *[_type == "post" && !(_id in path("drafts.**")) && seo.noIndex != true && defined(slug.current) && (!defined(publishedAt) || publishedAt <= now())]|order(coalesce(publishedAt, _updatedAt) desc){
    _updatedAt,
    "slug": slug.current
  },
  "doctors": *[_type == "doctor" && !(_id in path("drafts.**")) && seo.noIndex != true && defined(slug.current)]|order(_createdAt asc){
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

const toUrl = (urlPath) => `${SITE_URL}${cleanPath(urlPath)}`;

async function sanityFetch() {
  const headers = TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {};
  const res = await fetch(`${endpoint}?query=${encodeURIComponent(query)}`, { headers });
  if (!res.ok) throw new Error(`Sanity sitemap query failed: ${res.status} ${res.statusText}`);
  const body = await res.json();
  return body.result || {};
}

function addUrl(map, pathValue, priority, lastmod) {
  const loc = toUrl(pathValue);
  const existing = map.get(loc);
  if (!existing || (lastmod && (!existing.lastmod || new Date(lastmod) > new Date(existing.lastmod)))) {
    map.set(loc, { loc, priority, lastmod });
  }
}

function buildEntries(result = {}) {
  const urls = new Map();
  const excludedPaths = new Set((result.excludedPagePaths || []).map((pathValue) => toUrl(pathValue)));

  STATIC_ROUTES.forEach((route) => {
    if (!excludedPaths.has(toUrl(route.path))) addUrl(urls, route.path, route.priority);
  });
  (result.pages || []).forEach((page) => addUrl(urls, page.path, page.priority, page._updatedAt));
  (result.categories || []).forEach((category) => addUrl(urls, `/category/${category.slug}`, "0.8", category._updatedAt));
  (result.treatments || []).forEach((treatment) => addUrl(urls, `/${seoTreatmentSlug(treatment.slug)}`, "0.7", treatment._updatedAt));
  (result.posts || []).forEach((post) => addUrl(urls, `/blog/${post.slug}`, "0.5", post._updatedAt));
  (result.doctors || []).forEach((doctor) => addUrl(urls, `/doctors/${doctor.slug}`, "0.8", doctor._updatedAt));

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

try {
  const result = await sanityFetch();
  const entries = buildEntries(result);
  await mkdir(PUBLIC_DIR, { recursive: true });
  await writeFile(SITEMAP_PATH, renderSitemap(entries));
  console.log(`Generated sitemap.xml with ${entries.length} URLs from Sanity.`);
} catch (error) {
  console.warn(`${error.message}. Keeping static fallback routes in sitemap.xml.`);
  const entries = buildEntries({});
  await mkdir(PUBLIC_DIR, { recursive: true });
  await writeFile(SITEMAP_PATH, renderSitemap(entries));
  console.log(`Generated fallback sitemap.xml with ${entries.length} URLs.`);
}
