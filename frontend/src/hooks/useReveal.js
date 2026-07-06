import { useEffect } from "react";

/**
 * Site-wide scroll-reveal.
 *
 * Auto-tags every top-level <section> inside <main> with `.reveal` (so pages
 * animate on scroll without hand-tagging each one), then reveals elements as
 * they enter the viewport. Pages that already tag their own `.reveal` blocks
 * keep that finer-grained animation — such sections are skipped.
 *
 * Pass a changing value (e.g. the route pathname) to re-scan after navigation.
 */
export default function useReveal(dep) {
  useEffect(() => {
    // 1. Auto-tag section-level blocks (skip the hero, and sections that already
    //    animate their own children). ":not(section section)" avoids nested
    //    sections such as the Journal article's internal <section>s.
    document.querySelectorAll("main section:not(section section)").forEach((sec) => {
      if (sec.getAttribute("data-testid") === "hero") return;
      if (sec.dataset.noReveal !== undefined) return;
      if (sec.classList.contains("reveal") || sec.querySelector(".reveal")) return;
      sec.classList.add("reveal");
    });

    const els = document.querySelectorAll(".reveal:not(.is-visible)");
    if (!els.length) return;

    // 2. Fallback: no IntersectionObserver → just show everything.
    if (typeof IntersectionObserver === "undefined") {
      els.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0, rootMargin: "0px 0px -60px 0px" },
    );
    els.forEach((el) => io.observe(el));

    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dep]);
}
