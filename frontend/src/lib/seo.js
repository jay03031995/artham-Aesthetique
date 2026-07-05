import { useEffect } from "react";

const APP_NAME = "Artham Aesthetique";

export default function Seo({ title, description, canonical, ogImage, jsonLd }) {
  useEffect(() => {
    const fullTitle = title ? `${title} — ${APP_NAME}` : `${APP_NAME} — Where Science meets Soulful Care`;
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

    set("name", "description", description || "Dermatologist-led skin, hair and body wellness in Noida. Editorial care by Dr. Omaima Jawed.");
    set("property", "og:title", fullTitle);
    set("property", "og:description", description || "");
    if (ogImage) set("property", "og:image", ogImage);
    set("name", "twitter:title", fullTitle);
    set("name", "twitter:description", description || "");

    // canonical
    if (canonical) {
      let link = document.head.querySelector('link[rel="canonical"]');
      if (!link) {
        link = document.createElement("link");
        link.setAttribute("rel", "canonical");
        document.head.appendChild(link);
      }
      link.setAttribute("href", canonical);
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
  }, [title, description, canonical, ogImage, jsonLd]);

  return null;
}
