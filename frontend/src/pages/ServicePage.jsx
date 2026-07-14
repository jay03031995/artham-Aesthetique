import { useState } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { ChevronDown, ChevronRight, CalendarCheck, MessageCircle, Clock, Repeat, Sparkles } from "lucide-react";
import { useCmsContent, cmsWhatsAppLink } from "../lib/cmsContent";
import Seo from "../lib/seo";
import useReveal from "../hooks/useReveal";

export default function ServicePage({ onOpenBooking }) {
  useReveal();
  const { slug } = useParams();
  const { site: SITE, doctors, findService, findCategory, related: getRelated } = useCmsContent();
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
    performerType: doctors?.[0]?.designation,
    performer: { "@type": "Physician", name: doctors?.[0]?.name },
  };

  return (
    <>
      <Seo
        title={s.seo?.title || s.name}
        description={s.seo?.description || s.short}
        jsonLd={jsonLd}
        ogImage={s.image}
      />

      {/* HERO */}
      <section className="relative bg-[#f5e6d0] pt-16 pb-14 lg:pt-24 lg:pb-20" data-testid="service-hero">
        <div className="container-editorial">
          <nav className="text-[13px] text-[#5C4A38] flex items-center gap-2 mb-8 flex-wrap" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-[#7A3E1D]">{SITE.title}</Link>
            <ChevronRight size={12} />
            <Link to={`/category/${cat.slug}`} className="hover:text-[#7A3E1D]">{cat.name}</Link>
            <ChevronRight size={12} />
            <span className="text-[#3D2F23] font-medium">{s.name}</span>
          </nav>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              {cat.name && <p className="overline mb-3">{cat.name}</p>}
              <h1 className="font-display leading-[1.05] text-[#3D2F23] mb-4" style={{ fontSize: "clamp(2.25rem, 4.5vw, 3.5rem)" }}>{s.heroTitle || s.name}</h1>
              <p className="text-body-lg text-[#5C4A38] mb-6">{s.hero}</p>

              {/* Quick facts row */}
              {s.downtime?.length > 0 && <div className="grid grid-cols-3 gap-4 mb-8 py-6 border-y border-[#b8894a]/30">
                {s.duration && <div>
                  <div className="flex items-center gap-2 text-[#7A5A2E]"><Clock size={14} /><span className="overline text-[10px] mb-0">Duration</span></div>
                  <p className="text-[14px] font-semibold text-[#3D2F23] mt-1">{s.duration}</p>
                </div>}
                {s.sessions && <div>
                  <div className="flex items-center gap-2 text-[#7A5A2E]"><Repeat size={14} /><span className="overline text-[10px] mb-0">Sessions</span></div>
                  <p className="text-[14px] font-semibold text-[#3D2F23] mt-1">{s.sessions}</p>
                </div>}
                {s.downtime[0]?.value && <div>
                  <div className="flex items-center gap-2 text-[#7A5A2E]"><Sparkles size={14} /><span className="overline text-[10px] mb-0">{s.downtime[0].label}</span></div>
                  <p className="text-[14px] font-semibold text-[#3D2F23] mt-1">{s.downtime[0].value}</p>
                </div>}
              </div>}

              <div className="flex flex-wrap gap-3">
                {s.ctaText && <button data-testid="svc-book-btn" onClick={bookThis} className="btn-primary flex items-center gap-2"><CalendarCheck size={15} /> {s.ctaText}</button>}
                {SITE.whatsapp && <a data-testid="svc-wa-btn" href={cmsWhatsAppLink(SITE, s.whatsappMessage || "")} target="_blank" rel="noreferrer" className="btn-secondary flex items-center gap-2"><MessageCircle size={15} /> {s.whatsappLabel}</a>}
              </div>
            </div>
            <div className="aspect-[4/5] rounded-lg overflow-hidden">
              {s.image && <img src={s.image} alt={s.name} className="w-full h-full object-cover" />}
            </div>
          </div>
        </div>
      </section>

      {/* WHAT IS */}
      {s.what && <section className="bg-arabian-white py-24 lg:py-28" data-testid="svc-what">
        <div className="container-editorial grid lg:grid-cols-5 gap-16">
          <div className="lg:col-span-2 reveal">
            {s.overviewHeading && <p className="overline text-coronation-gold mb-4">{s.overviewHeading}</p>}
          </div>
          <div className="lg:col-span-3 reveal" style={{ transitionDelay: "120ms" }}>
            <p className="fine text-armadillo/85 leading-[1.9] mb-8">{s.what}</p>
            {s.whoFor.length > 0 && (
              <>
                <div className="flex flex-wrap gap-2">
                  {s.whoFor.map((w) => (
                    <span key={w} className="fine text-sm px-4 py-1.5 border border-coronation-gold/50 text-armadillo/80">{w}</span>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </section>}

      {/* SYMPTOMS */}
      {s.symptoms?.length > 0 && (
        <section className="bg-arabian-white py-16 lg:py-20" data-testid="svc-symptoms">
          <div className="container-editorial">
            <div className="max-w-3xl mb-8 reveal">
              <p className="overline text-coronation-gold mb-4">Symptoms</p>
              <h2 className="font-display text-3xl md:text-4xl text-armadillo">Symptoms we commonly treat</h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {s.symptoms.map((sym, i) => (
                <div key={i} className="rounded-3xl border border-[#b8894a]/20 bg-[#FFF8EE] p-6 reveal">
                  {sym.image && (
                    <div className="mb-3 h-12 w-12 overflow-hidden rounded-full bg-white">
                      <img src={sym.image} alt={sym.title || ""} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <h3 className="font-semibold text-armadillo mb-2">{sym.title}</h3>
                  {sym.description && <p className="fine text-armadillo/75 leading-relaxed">{sym.description}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* HOW IT WORKS */}
      {s.howItWorks?.length > 0 && <section className="bg-summer-peach py-24 lg:py-28" data-testid="svc-how">
        <div className="container-editorial">
          <div className="max-w-xl mb-14 reveal">
            {s.processEyebrow && <p className="overline text-coronation-gold mb-4">{s.processEyebrow}</p>}
            {s.processTitle && <h2 className="font-display text-3xl md:text-4xl text-armadillo">{s.processTitle}</h2>}
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
      </section>}

      {/* BENEFITS + DOWNTIME TABLE */}
      {(s.benefits?.length > 0 || s.downtime?.length > 0) && <section className="bg-arabian-white py-24 lg:py-28" data-testid="svc-benefits">
        <div className="container-editorial grid lg:grid-cols-2 gap-16">
          <div className="reveal">
            {s.benefitsEyebrow && <p className="overline text-coronation-gold mb-4">{s.benefitsEyebrow}</p>}
            {s.benefitsTitle && <h2 className="font-display text-3xl md:text-4xl text-armadillo mb-8">{s.benefitsTitle}</h2>}
            <div className="grid gap-4 sm:grid-cols-2">
              {(s.benefits || []).map((b, i) => (
                <div key={`${b.title || b}-${i}`} className="rounded-3xl border border-[#b8894a]/20 bg-[#FFF8EE] p-5 flex gap-4 items-start">
                  {b.image ? (
                    <div className="flex-shrink-0 h-12 w-12 overflow-hidden rounded-full bg-white">
                      <img src={b.image} alt={b.title || ""} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="h-3 w-3 rounded-full bg-coronation-gold mt-3" />
                  )}
                  <div>
                    <h4 className="font-semibold text-armadillo mb-1">{b.title || b}</h4>
                    {b.description && <p className="fine text-armadillo/75 leading-relaxed">{b.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="reveal" style={{ transitionDelay: "120ms" }}>
            {s.expectationsEyebrow && <p className="overline text-coronation-gold mb-4">{s.expectationsEyebrow}</p>}
            {s.expectationsTitle && <h2 className="font-display text-3xl md:text-4xl text-armadillo mb-8">{s.expectationsTitle}</h2>}
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
      </section>}

      {/* DOCTOR'S NOTE */}
      {s.doctorNote && <section className="bg-armadillo text-arabian-white py-24 lg:py-28" data-testid="svc-doctor-note">
        <div className="container-editorial max-w-3xl reveal">
          {s.doctorNoteEyebrow && <p className="overline text-coronation-gold mb-6">{s.doctorNoteEyebrow}</p>}
          <blockquote className="font-display text-2xl md:text-4xl italic leading-snug mb-8">"{s.doctorNote}"</blockquote>
          <div className="flex items-center gap-4">
            <div className="w-12 h-px bg-coronation-gold" />
            <div>
              <div className="font-display">{doctors?.[0]?.name}</div>
              <div className="overline text-coronation-gold text-[10px]">{doctors?.[0]?.designation}</div>
            </div>
          </div>
        </div>
      </section>}

      {/* FAQ */}
      {s.faqs?.length > 0 && <section className="bg-arabian-white py-24 lg:py-28" data-testid="svc-faqs">
        <div className="container-editorial grid lg:grid-cols-5 gap-16">
          <div className="lg:col-span-2 reveal">
            {s.faqEyebrow && <p className="overline text-coronation-gold mb-4">{s.faqEyebrow}</p>}
            {s.faqTitle && <h2 className="font-display text-3xl md:text-4xl text-armadillo">{s.faqTitle}</h2>}
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
      </section>}

      {/* RELATED */}
      {related.length > 0 && (
        <section className="bg-summer-peach py-24 lg:py-28" data-testid="svc-related">
          <div className="container-editorial">
            <div className="flex items-end justify-between mb-12 gap-6 flex-wrap">
              <div>
                {s.relatedEyebrow && <p className="overline text-coronation-gold mb-4">{s.relatedEyebrow}</p>}
                {s.relatedTitle && <h2 className="font-display text-3xl md:text-4xl text-armadillo">{s.relatedTitle}</h2>}
              </div>
              {s.relatedLinkText && <Link to={`/category/${cat.slug}`} className="link-gold overline">{s.relatedLinkText}</Link>}
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
          {s.ctaText && <button data-testid="svc-sticky-book" onClick={bookThis} className="btn-primary w-full shadow-lg">{s.ctaText}</button>}
        </div>
      </div>
    </>
  );
}
