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
    const seen = new WeakSet();
    const revealNow = (el) => el.classList.add("is-visible");

    const io = typeof IntersectionObserver !== "undefined"
      ? new IntersectionObserver(
          (entries) => {
            entries.forEach((e) => {
              if (e.isIntersecting) {
                revealNow(e.target);
                io.unobserve(e.target);
              }
            });
          },
          { threshold: 0, rootMargin: "0px 0px -60px 0px" },
        )
      : null;

    const observeReveal = (el) => {
      if (seen.has(el) || el.classList.contains("is-visible")) return;
      seen.add(el);
      if (io) io.observe(el);
      else revealNow(el);
    };

    const scan = () => {
      // Auto-tag section-level blocks (skip the hero, and sections that already
      // animate their own children). ":not(section section)" avoids nested
      // sections such as the Journal article's internal <section>s.
      document.querySelectorAll("main section:not(section section)").forEach((sec) => {
        if (sec.getAttribute("data-testid") === "hero") return;
        if (sec.dataset.noReveal !== undefined) return;
        if (sec.classList.contains("reveal") || sec.querySelector(".reveal")) return;
        sec.classList.add("reveal");
      });

      document.querySelectorAll(".reveal:not(.is-visible)").forEach(observeReveal);
    };

    scan();

    const mo = typeof MutationObserver !== "undefined"
      ? new MutationObserver(scan)
      : null;
    const main = document.querySelector("main");
    if (mo && main) {
      mo.observe(main, { childList: true, subtree: true });
    }

    return () => {
      if (mo) mo.disconnect();
      if (io) io.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dep]);
}
