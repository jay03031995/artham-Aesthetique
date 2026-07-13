import { useState } from "react";
import { Link } from "react-router-dom";
import { useCmsContent } from "../lib/cmsContent";
import Seo from "../lib/seo";
import useReveal from "../hooks/useReveal";

const CATS = ["All", "Skin", "Hair", "Anti-Ageing", "Laser Hair Removal", "Body", "Bridal"];

export default function BlogIndex() {
  useReveal();
  const [cat, setCat] = useState("All");
  const { postsByCategory } = useCmsContent();
  const list = postsByCategory(cat);
  const [featured, ...rest] = list;

  return (
    <>
      <Seo title="Journal" description="Notes from the clinic — considered posts on skin, hair, ageing and wellness by Dr. Omaima Jawed." />

      {/* Hero */}
      <section className="bg-summer-peach pt-40 pb-16 lg:pt-48 lg:pb-24" data-testid="blog-hero">
        <div className="container-editorial">
          <p className="overline text-coronation-gold mb-4">The Journal</p>
          <h1 className="font-display text-5xl md:text-6xl text-armadillo leading-[1.05] mb-6">Golden tips &amp; considered notes.</h1>
          <p className="fine text-lg text-armadillo/80 max-w-2xl">Editorial writing from Dr. Omaima and the Artham team — honest, useful and unafraid to say 'no' to a trend.</p>
        </div>
      </section>

      {/* Featured */}
      {featured && (
        <section className="bg-arabian-white py-16" data-testid="blog-featured">
          <div className="container-editorial">
            <Link data-testid={`blog-featured-${featured.slug}`} to={`/blog/${featured.slug}`} className="grid lg:grid-cols-2 gap-10 items-center group">
              <div className="aspect-[16/11] overflow-hidden">
                <img src={featured.coverImage} alt={featured.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-105" />
              </div>
              <div>
                <p className="overline text-coronation-gold mb-4">Featured · {featured.category} · {featured.readingTimeMin} min</p>
                <h2 className="font-display text-3xl md:text-4xl text-armadillo group-hover:text-burma-teak transition-colors duration-500 leading-tight mb-4">{featured.title}</h2>
                <p className="fine text-armadillo/75 leading-relaxed mb-6">{featured.excerpt}</p>
                <span className="link-gold overline">Read →</span>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* Filters + grid */}
      <section className="bg-arabian-white py-24">
        <div className="container-editorial">
          <div className="flex flex-wrap gap-2 mb-12">
            {CATS.map((c) => (
              <button
                key={c}
                data-testid={`blog-filter-${c}`}
                onClick={() => setCat(c)}
                className={`fine text-xs px-4 py-2 border transition-all duration-500 ${cat === c ? "bg-burma-teak text-arabian-white border-burma-teak" : "border-coronation-gold/40 text-armadillo/80 hover:border-burma-teak"}`}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {rest.map((p, i) => (
              <Link key={p.slug} data-testid={`blog-card-${p.slug}`} to={`/blog/${p.slug}`} className="group block reveal" style={{ transitionDelay: `${i * 80}ms` }}>
                <div className="aspect-[4/3] overflow-hidden mb-5">
                  <img src={p.coverImage} alt={p.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-105" />
                </div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-coronation-gold mb-2" style={{ fontFamily: "'Raleway', sans-serif" }}>{p.category} · {p.readingTimeMin} min</p>
                <h3 className="font-display text-xl text-armadillo group-hover:text-burma-teak transition-colors duration-500 leading-tight mb-2">{p.title}</h3>
                <p className="fine text-sm text-armadillo/70 leading-relaxed">{p.excerpt}</p>
              </Link>
            ))}
            {rest.length === 0 && <p className="fine text-armadillo/60 col-span-full">No posts in this category yet.</p>}
          </div>
        </div>
      </section>
    </>
  );
}
