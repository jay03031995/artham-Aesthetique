import { useEffect } from "react";
import { useCmsContent } from "./cmsContent";

export default function Seo({ title, description, canonical, ogImage, jsonLd }) {
  const { site, seo } = useCmsContent();

  useEffect(() => {
    const appName = seo?.siteTitle || site?.title || site?.name || "";
    const fullTitle = title && appName ? `${title} — ${appName}` : (title || appName);
    document.title = fullTitle;

    const set = (attr, key, value) => {
      if (!value) return;
      let el = document.head.querySelector(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute("content", value);
    };

    set("name", "description", description || seo?.defaultDescription || "");
    if (seo?.defaultKeywords?.length) set("name", "keywords", seo.defaultKeywords.join(", "));
    if (seo?.robots) set("name", "robots", seo.robots);
    if (seo?.themeColor) set("name", "theme-color", seo.themeColor);
    set("property", "og:title", fullTitle);
    set("property", "og:description", description || "");
    if (ogImage || seo?.defaultOpenGraphImageUrl) set("property", "og:image", ogImage || seo.defaultOpenGraphImageUrl);
    set("name", "twitter:title", fullTitle);
    set("name", "twitter:description", description || "");
    if (seo?.twitterCard) set("name", "twitter:card", seo.twitterCard);

    // canonical
    if (canonical || seo?.canonicalUrl) {
      let link = document.head.querySelector('link[rel="canonical"]');
      if (!link) {
        link = document.createElement("link");
        link.setAttribute("rel", "canonical");
        document.head.appendChild(link);
      }
      link.setAttribute("href", canonical || seo.canonicalUrl);
    }

    const setLink = (rel, href) => {
      if (!href) return;
      let link = document.head.querySelector(`link[rel="${rel}"]`);
      if (!link) {
        link = document.createElement("link");
        link.setAttribute("rel", rel);
        document.head.appendChild(link);
      }
      link.setAttribute("href", href);
    };
    setLink("icon", seo?.faviconUrl);
    setLink("apple-touch-icon", seo?.appleTouchIconUrl);
    setLink("manifest", seo?.manifestUrl);

    // JSON-LD (single script per page)
    const existing = document.getElementById("jsonld-page");
    if (existing) existing.remove();
    const schema = jsonLd || (seo?.structuredData ? safeJson(seo.structuredData) : null);
    if (schema) {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.id = "jsonld-page";
      script.text = JSON.stringify(schema);
      document.head.appendChild(script);
    }
  }, [title, description, canonical, ogImage, jsonLd, site, seo]);

  return null;
}

function safeJson(value) {
  try {
    return JSON.parse(value);
  } catch (_) {
    return null;
  }
}
