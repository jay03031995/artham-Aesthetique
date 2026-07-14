import { useState } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { ChevronDown, ChevronRight, CalendarCheck, MessageCircle, Clock, Repeat, Sparkles } from "lucide-react";
import { useCmsContent, cmsWhatsAppLink } from "../lib/cmsContent";
import Seo from "../lib/seo";
import useReveal from "../hooks/useReveal";

export default function ServicePage({ onOpenBooking }) {
  useReveal();
  const { slug } = useParams();
  const { site: SITE, findService, findCategory, related: getRelated } = useCmsContent();
  const s = findService(slug);
  const [openFaq, setOpenFaq] = useState(null);
  if (!s) return <Navigate to="/" replace />;
  const cat = findCategory(s.categorySlug) || { slug: s.categorySlug || "skin", name: s.category || "Treatments" };
  const related = s.relatedTreatments?.length ? s.relatedTreatments : getRelated(s.categorySlug, s.slug);

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
      <section className="relative bg-[#f5e6d0] pt-16 pb-14 lg:pt-24 lg:pb-20" data-testid="service-hero">
        <div className="container-editorial">
          <nav className="text-[13px] text-[#5C4A38] flex items-center gap-2 mb-8 flex-wrap" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-[#7A3E1D]">Home</Link>
            <ChevronRight size={12} />
            <Link to={`/category/${cat.slug}`} className="hover:text-[#7A3E1D]">{cat.name}</Link>
            <ChevronRight size={12} />
            <span className="text-[#3D2F23] font-medium">{s.name}</span>
          </nav>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="overline mb-3">{cat.name}</p>
              <h1 className="font-display leading-[1.05] text-[#3D2F23] mb-4" style={{ fontSize: "clamp(2.25rem, 4.5vw, 3.5rem)" }}>{s.name}</h1>
              {s.heroTitle && <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#7A5A2E] mb-3">{s.heroTitle}</p>}
              <p className="text-body-lg text-[#5C4A38] mb-4">{s.hero}</p>
              {s.heroDescription && <p className="fine text-armadillo/75 leading-relaxed mb-6">{s.heroDescription}</p>}

              {/* Quick facts row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 py-6 border-y border-[#b8894a]/30">
                {(s.quickInfoRows || []).slice(0, 3).map((row) => (
                  <div key={row.label}>
                    <div className="flex items-center gap-2 text-[#7A5A2E]"><span className="overline text-[10px] mb-0">{row.label}</span></div>
                    <p className="text-[14px] font-semibold text-[#3D2F23] mt-1">{row.value}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-3">
                <button data-testid="svc-book-btn" onClick={bookThis} className="btn-primary flex items-center gap-2"><CalendarCheck size={15} /> Book {s.name}</button>
                <a data-testid="svc-wa-btn" href={cmsWhatsAppLink(SITE, `Hello, I'd like to know more about ${s.name}.`)} target="_blank" rel="noreferrer" className="btn-secondary flex items-center gap-2"><MessageCircle size={15} /> WhatsApp</a>
                {s.ctaText && s.ctaLink && (s.ctaLink.startsWith('/') ? (
                  <Link to={s.ctaLink} className="btn-tertiary flex items-center gap-2">{s.ctaText}</Link>
                ) : (
                  <a href={s.ctaLink} target="_blank" rel="noreferrer" className="btn-tertiary flex items-center gap-2">{s.ctaText}</a>
                ))}
              </div>
            </div>
            <div className="aspect-[4/5] rounded-lg overflow-hidden">
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
            <h2 className="font-display text-3xl md:text-4xl text-armadillo leading-tight">
              {s.overviewHeading || "A quiet primer — "}
              {!s.overviewHeading && <em className="italic font-light">before you book.</em>}
            </h2>
          </div>
          <div className="lg:col-span-3 reveal" style={{ transitionDelay: "120ms" }}>
            <p className="fine text-armadillo/85 leading-[1.9] mb-8">{s.what}</p>
            {s.whoFor.length > 0 && (
              <>
                <p className="overline text-armadillo/60 mb-4">Who it's for</p>
                <div className="flex flex-wrap gap-2 mb-8">
                  {s.whoFor.map((w) => (
                    <span key={w} className="fine text-sm px-4 py-1.5 border border-coronation-gold/50 text-armadillo/80">{w}</span>
                  ))}
                </div>
              </>
            )}
            {s.symptoms?.length > 0 && (
              <div>
                <p className="overline text-armadillo/60 mb-4">Symptoms</p>
                <div className="grid gap-4 sm:grid-cols-2">
                  {s.symptoms.map((symptom, index) => {
                    const title = typeof symptom === "string" ? symptom : symptom.title || symptom.description || "Symptom";
                    const description = typeof symptom === "object" && symptom.description ? symptom.description : null;
                    const imageUrl = typeof symptom === "object" ? symptom.image?.url || symptom.image?.asset?.asset?.url : null;
                    return (
                      <div key={`${title}-${index}`} className="rounded-3xl border border-[#b8894a]/20 bg-[#FFF8EE] p-5">
                        {imageUrl && (
                          <div className="mb-3 h-12 w-12 overflow-hidden rounded-full bg-white">
                            <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
                          </div>
                        )}
                        <h3 className="font-semibold text-armadillo mb-2">{title}</h3>
                        {description && <p className="fine text-armadillo/75 leading-relaxed">{description}</p>}
                      </div>
                    );
                  })}
                </div>
              </div>
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
                  <p className="fine text-armadillo/75 leading-relaxed">{step.body || step.description}</p>
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
              {(s.benefits || []).map((b, i) => {
                const text = typeof b === "string" ? b : b.title || b.description || b.text || "";
                return (
                  <li key={`${text}-${i}`} className="flex items-start gap-3 fine text-armadillo/85 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-coronation-gold mt-2.5 shrink-0" />{text}
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="reveal" style={{ transitionDelay: "120ms" }}>
            <p className="overline text-coronation-gold mb-4">Expectations</p>
            <h2 className="font-display text-3xl md:text-4xl text-armadillo mb-8">Time, downtime, and results.</h2>
            <dl className="divide-y divide-coronation-gold/30 border-y border-coronation-gold/30">
              {(s.downtime || []).map((row) => (
                <div key={row.label} className="flex justify-between py-4 gap-4 flex-wrap">
                  <dt className="overline text-armadillo/60">{row.label}</dt>
                  <dd className="fine text-sm text-armadillo">{row.value}</dd>
                </div>
              ))}
            </dl>
            {(s.priceFrom || (s.pricing || []).length > 0) && (
              <div className="mt-8 space-y-6">
                {s.priceFrom && (
                  <div className="rounded-3xl bg-[#f7f0e4] p-6 border border-[#b8894a]/20">
                    <p className="overline text-armadillo/60 mb-2">Starting price</p>
                    <p className="text-2xl font-semibold text-armadillo">{s.priceFrom}</p>
                  </div>
                )}
                {(s.pricing || []).length > 0 && (
                  <dl className="grid gap-4 sm:grid-cols-2">
                    {s.pricing.map((item, index) => (
                      <div key={`${item.label || item.value}-${index}`} className="rounded-3xl border border-[#b8894a]/20 bg-[#FFF8EE] p-4">
                        {item.label && <dt className="overline text-armadillo/60 mb-2 block">{item.label}</dt>}
                        <dd className="fine text-sm text-armadillo">{item.value}</dd>
                      </div>
                    ))}
                  </dl>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* BEFORE / AFTER RESULTS */}
      {s.results?.length > 0 && (
        <section className="bg-summer-peach py-24 lg:py-28" data-testid="svc-results">
          <div className="container-editorial">
            <div className="flex items-end justify-between mb-12 gap-6 flex-wrap">
              <div>
                <p className="overline text-coronation-gold mb-4">Before & After</p>
                <h2 className="font-display text-3xl md:text-4xl text-armadillo">Real patient results.</h2>
              </div>
              <Link to="/results" className="link-gold overline">View all results →</Link>
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              {s.results.map((item, index) => (
                <article key={item._id || index} className="rounded-3xl overflow-hidden border border-[#b8894a]/20 bg-white shadow-sm">
                  <div className="grid gap-2 lg:grid-cols-2">
                    {item.beforeImage && (
                      <figure className="overflow-hidden bg-[#f7f0e4]">
                        <img src={item.beforeImage} alt={`${item.title || "Before"} before`} loading="lazy" className="w-full h-full object-cover" />
                      </figure>
                    )}
                    {item.afterImage && (
                      <figure className="overflow-hidden bg-[#f7f0e4]">
                        <img src={item.afterImage} alt={`${item.title || "After"} after`} loading="lazy" className="w-full h-full object-cover" />
                      </figure>
                    )}
                  </div>
                  <div className="p-6">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-coronation-gold mb-2">{item.category || item.treatmentName}</p>
                    <h3 className="font-display text-xl text-armadillo mb-3">{item.title || item.treatmentName || "Treatment result"}</h3>
                    {item.sessionsInfo && <p className="fine text-armadillo/75 mb-3">{item.sessionsInfo}</p>}
                    <div className="grid gap-2 text-sm text-armadillo/75">
                      {item.patientAge && (
                        <div className="flex justify-between">
                          <span>Age</span>
                          <span>{item.patientAge}</span>
                        </div>
                      )}
                      {item.gender && (
                        <div className="flex justify-between">
                          <span>Gender</span>
                          <span>{item.gender}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* DOCTOR'S NOTE */}
      <section className="bg-arabian-white py-24 lg:py-28" data-testid="svc-doctor-note">
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
            {(s.faqs || []).map((f, i) => {
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
