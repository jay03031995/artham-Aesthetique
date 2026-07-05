import { useState } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { ChevronDown, ChevronRight, CalendarCheck, MessageCircle, ArrowRight } from "lucide-react";
import { findService, findCategory, RELATED } from "../data/treatments";
import { SITE, whatsAppLink } from "../data/site";
import Seo from "../lib/seo";
import useReveal from "../hooks/useReveal";

export default function ServicePage({ onOpenBooking }) {
  useReveal();
  const { slug } = useParams();
  const s = findService(slug);
  const [openFaq, setOpenFaq] = useState(null);
  if (!s) return <Navigate to="/" replace />;
  const cat = findCategory(s.categorySlug);
  const related = RELATED(s.categorySlug, s.slug);

  const bookThis = () => onOpenBooking(s.slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalProcedure",
    name: s.name,
    description: s.what,
    bodyLocation: s.category,
    performerType: "Dermatologist",
    performer: { "@type": "Physician", name: "Dr. Omaima Jawed" },
  };

  return (
    <>
      <Seo
        title={`${s.name} in Noida`}
        description={s.short}
        jsonLd={jsonLd}
        ogImage={s.image}
      />

      {/* HERO */}
      <section className="relative bg-summer-peach pt-40 pb-16 lg:pt-48 lg:pb-24" data-testid="service-hero">
        <div className="container-editorial">
          <nav className="fine text-xs text-armadillo/60 flex items-center gap-2 mb-8 flex-wrap" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-burma-teak">Home</Link>
            <ChevronRight size={12} />
            <Link to={`/category/${cat.slug}`} className="hover:text-burma-teak">{cat.name}</Link>
            <ChevronRight size={12} />
            <span className="text-armadillo">{s.name}</span>
          </nav>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="overline text-coronation-gold mb-4">{cat.name}</p>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-armadillo leading-[1.05] mb-6">{s.name}</h1>
              <p className="fine text-lg text-armadillo/85 mb-8 leading-relaxed">{s.hero}</p>
              <div className="flex flex-wrap gap-3">
                <button data-testid="svc-book-btn" onClick={bookThis} className="btn-primary flex items-center gap-2"><CalendarCheck size={14} /> Book {s.name}</button>
                <a data-testid="svc-wa-btn" href={whatsAppLink(`Hello, I'd like to know more about ${s.name}.`)} target="_blank" rel="noreferrer" className="btn-secondary flex items-center gap-2"><MessageCircle size={14} /> WhatsApp</a>
              </div>
            </div>
            <div className="aspect-[4/5] overflow-hidden">
              <img src={s.image} alt={s.name} className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* WHAT IS */}
      <section className="bg-arabian-white py-24 lg:py-28" data-testid="svc-what">
        <div className="container-editorial grid lg:grid-cols-5 gap-16">
          <div className="lg:col-span-2 reveal">
            <p className="overline text-coronation-gold mb-4">What is {s.name}</p>
            <h2 className="font-display text-3xl md:text-4xl text-armadillo leading-tight">A quiet primer — <em className="italic font-light">before you book.</em></h2>
          </div>
          <div className="lg:col-span-3 reveal" style={{ transitionDelay: "120ms" }}>
            <p className="fine text-armadillo/85 leading-[1.9] mb-8">{s.what}</p>
            {s.whoFor.length > 0 && (
              <>
                <p className="overline text-armadillo/60 mb-4">Who it's for</p>
                <div className="flex flex-wrap gap-2">
                  {s.whoFor.map((w) => (
                    <span key={w} className="fine text-sm px-4 py-1.5 border border-coronation-gold/50 text-armadillo/80">{w}</span>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-summer-peach py-24 lg:py-28" data-testid="svc-how">
        <div className="container-editorial">
          <div className="max-w-xl mb-14 reveal">
            <p className="overline text-coronation-gold mb-4">How it works</p>
            <h2 className="font-display text-3xl md:text-4xl text-armadillo">A calm, mapped protocol.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-10 lg:gap-14 relative">
            {s.howItWorks.map((step, i) => (
              <div key={i} className="reveal" style={{ transitionDelay: `${i * 100}ms` }}>
                <div className="flex items-center gap-4 mb-4">
                  <span className="font-display text-4xl text-coronation-gold">0{i + 1}</span>
                  <div className="h-px flex-1 bg-coronation-gold/40" />
                </div>
                <h3 className="font-display text-2xl text-armadillo mb-3">{step.title}</h3>
                <p className="fine text-armadillo/75 leading-relaxed">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFITS + DOWNTIME TABLE */}
      <section className="bg-arabian-white py-24 lg:py-28" data-testid="svc-benefits">
        <div className="container-editorial grid lg:grid-cols-2 gap-16">
          <div className="reveal">
            <p className="overline text-coronation-gold mb-4">Benefits</p>
            <h2 className="font-display text-3xl md:text-4xl text-armadillo mb-8">Small changes, meaningfully.</h2>
            <ul className="space-y-4">
              {s.benefits.map((b) => (
                <li key={b} className="flex items-start gap-3 fine text-armadillo/85 leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-coronation-gold mt-2.5 shrink-0" />{b}
                </li>
              ))}
            </ul>
          </div>
          <div className="reveal" style={{ transitionDelay: "120ms" }}>
            <p className="overline text-coronation-gold mb-4">Expectations</p>
            <h2 className="font-display text-3xl md:text-4xl text-armadillo mb-8">Time, downtime, and results.</h2>
            <dl className="divide-y divide-coronation-gold/30 border-y border-coronation-gold/30">
              {s.downtime.map((row) => (
                <div key={row.label} className="flex justify-between py-4">
                  <dt className="overline text-armadillo/60">{row.label}</dt>
                  <dd className="fine text-sm text-armadillo">{row.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* DOCTOR'S NOTE */}
      <section className="bg-armadillo text-arabian-white py-24 lg:py-28" data-testid="svc-doctor-note">
        <div className="container-editorial max-w-3xl reveal">
          <p className="overline text-coronation-gold mb-6">A note from Dr. Omaima</p>
          <blockquote className="font-display text-2xl md:text-4xl italic leading-snug mb-8">"{s.doctorNote}"</blockquote>
          <div className="flex items-center gap-4">
            <div className="w-12 h-px bg-coronation-gold" />
            <div>
              <div className="font-display">Dr. Omaima Jawed</div>
              <div className="overline text-coronation-gold text-[10px]">Dermatologist · Artham Aesthetique</div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-arabian-white py-24 lg:py-28" data-testid="svc-faqs">
        <div className="container-editorial grid lg:grid-cols-5 gap-16">
          <div className="lg:col-span-2 reveal">
            <p className="overline text-coronation-gold mb-4">FAQs</p>
            <h2 className="font-display text-3xl md:text-4xl text-armadillo">What patients ask, honestly.</h2>
          </div>
          <div className="lg:col-span-3 divide-y divide-coronation-gold/30 border-y border-coronation-gold/30 reveal" style={{ transitionDelay: "120ms" }}>
            {s.faqs.map((f, i) => {
              const open = openFaq === i;
              return (
                <div key={i}>
                  <button
                    data-testid={`svc-faq-${i}`}
                    onClick={() => setOpenFaq(open ? null : i)}
                    className="w-full flex items-center justify-between py-6 text-left"
                  >
                    <span className="font-display text-lg text-armadillo pr-4">{f.q}</span>
                    <ChevronDown size={18} className={`text-burma-teak transition-transform duration-500 ${open ? "rotate-180" : ""}`} />
                  </button>
                  <div className={`grid transition-all duration-500 ${open ? "grid-rows-[1fr] pb-6" : "grid-rows-[0fr]"}`}>
                    <div className="overflow-hidden">
                      <p className="fine text-armadillo/75 leading-relaxed">{f.a}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* FAQ schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: s.faqs.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
              })),
            }),
          }}
        />
      </section>

      {/* RELATED */}
      {related.length > 0 && (
        <section className="bg-summer-peach py-24 lg:py-28" data-testid="svc-related">
          <div className="container-editorial">
            <div className="flex items-end justify-between mb-12 gap-6 flex-wrap">
              <div>
                <p className="overline text-coronation-gold mb-4">Related</p>
                <h2 className="font-display text-3xl md:text-4xl text-armadillo">You may also consider</h2>
              </div>
              <Link to={`/category/${cat.slug}`} className="link-gold overline">All {cat.name} →</Link>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  data-testid={`svc-related-${r.slug}`}
                  to={`/services/${r.slug}`}
                  className="group block"
                >
                  <div className="aspect-square overflow-hidden mb-4">
                    <img src={r.image} alt={r.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-105" />
                  </div>
                  <h3 className="font-display text-lg text-armadillo group-hover:text-burma-teak transition-colors duration-500 mb-1">{r.name}</h3>
                  <p className="fine text-xs text-armadillo/60">{r.short}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* STICKY MOBILE BOTTOM CTA (over sticky mobile bar) */}
      <div className="lg:hidden fixed bottom-16 left-0 right-0 z-20 pointer-events-none">
        <div className="container-editorial pb-2 pointer-events-auto">
          <button data-testid="svc-sticky-book" onClick={bookThis} className="btn-primary w-full shadow-lg">Book {s.name}</button>
        </div>
      </div>
    </>
  );
}
