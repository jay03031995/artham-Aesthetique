import { useEffect } from "react";

const APP_NAME = "Artham Aesthetique";
const DEFAULT_OG_IMAGE = "https://arthamaesthetic.com/og.jpeg";

export default function Seo({ title, description, canonical, ogImage, jsonLd, keywords, noIndex }) {
  useEffect(() => {
    const fullTitle = title ? `${title} — ${APP_NAME}` : `${APP_NAME} — Where Science meets Soulful Care`;
    const resolvedOgImage = ogImage || DEFAULT_OG_IMAGE;
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
    const remove = (attr, key) => {
      const el = document.head.querySelector(`meta[${attr}="${key}"]`);
      if (el) el.remove();
    };

    set("name", "description", description || "Dr-led skin, hair and body wellness in Noida. Editorial care by Dr. Omaima Jawed.");
    if (Array.isArray(keywords) && keywords.length) set("name", "keywords", keywords.join(", "));
    else remove("name", "keywords");
    if (noIndex) set("name", "robots", "noindex, nofollow");
    else remove("name", "robots");
    set("property", "og:title", fullTitle);
    set("property", "og:description", description || "");
    set("property", "og:image", resolvedOgImage);
    set("property", "og:image:secure_url", resolvedOgImage);
    set("property", "og:image:type", "image/jpeg");
    set("property", "og:image:width", "1200");
    set("property", "og:image:height", "630");
    set("name", "twitter:title", fullTitle);
    set("name", "twitter:description", description || "");
    set("name", "twitter:card", "summary_large_image");
    set("name", "twitter:image", resolvedOgImage);

    // canonical
    if (canonical) {
      let link = document.head.querySelector('link[rel="canonical"]');
      if (!link) {
        link = document.createElement("link");
        link.setAttribute("rel", "canonical");
        document.head.appendChild(link);
      }
      link.setAttribute("href", canonical);
    } else {
      const link = document.head.querySelector('link[rel="canonical"]');
      if (link) link.remove();
    }

    // JSON-LD (single script per page)
    const existing = document.getElementById("jsonld-page");
    if (existing) existing.remove();
    if (jsonLd) {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.id = "jsonld-page";
      script.text = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }
  }, [title, description, canonical, ogImage, jsonLd, keywords, noIndex]);

  return null;
}
