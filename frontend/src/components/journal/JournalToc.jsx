import { useEffect, useState } from "react";

export default function JournalToc({ items }) {
  const [active, setActive] = useState("");

  useEffect(() => {
    const onScroll = () => {
      let current = "";
      for (const it of items) {
        const el = document.getElementById(it.id);
        if (el && el.getBoundingClientRect().top <= 140) current = it.id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [items]);

  if (!items || items.length === 0) return null;

  return (
    <nav aria-label="Contents" className="text-sm">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-coronation-gold mb-3" style={{ fontFamily: "'Raleway', sans-serif" }}>
        Contents
      </p>
      <ul className="border-l border-coronation-gold/30 space-y-1.5">
        {items.map((it) => (
          <li key={it.id} className={it.level === 3 ? "pl-6" : "pl-3"}>
            <a
              href={`#${it.id}`}
              className={`journal-toc-link block -ml-px border-l-2 pl-3 py-0.5 transition-colors ${
                active === it.id
                  ? "border-burma-teak active"
                  : "border-transparent text-armadillo/65 hover:text-burma-teak"
              }`}
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              {it.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
