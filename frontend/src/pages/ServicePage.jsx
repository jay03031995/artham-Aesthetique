import { useMemo, useState } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { ChevronDown, ChevronRight, CalendarCheck, MessageCircle, Clock, Repeat, Sparkles } from "lucide-react";
import { useCmsContent, cmsWhatsAppLink } from "../lib/cmsContent";
import Seo from "../lib/seo";
import useReveal from "../hooks/useReveal";
import ImageLightbox from "../components/ImageLightbox";
import { TREATMENT_KEYWORDS, baseTreatmentSlug, serviceCanonical, servicePath } from "../data/seoKeywords";

export default function ServicePage({ onOpenBooking }) {
  useReveal();
  const { slug } = useParams();
  const { site: SITE, findService, findCategory, related: getRelated } = useCmsContent();
  const s = findService(slug);
  const [openFaq, setOpenFaq] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const resultImages = useMemo(
    () =>
      (s?.results || [])
        .map((item) => {
        const title = item.title || item.treatmentName || s?.name || "Treatment result";
        const images = [
          item.beforeImage ? { src: item.beforeImage, alt: `${title} before`, label: "Before" } : null,
          item.afterImage ? { src: item.afterImage, alt: `${title} after`, label: "After" } : null,
        ].filter(Boolean);
        return images.length ? { src: images[0].src, alt: title, caption: title, images } : null;
      })
        .filter(Boolean),
    [s],
  );
  if (!s) return <Navigate to="/" replace />;
  const canonicalPath = servicePath(s.slug);
  if (`/${slug}` !== canonicalPath) return <Navigate to={canonicalPath} replace />;

  const cat = findCategory(s.categorySlug) || { slug: s.categorySlug || "skin", name: s.category || "Treatments" };
  const related = s.relatedTreatments?.length ? s.relatedTreatments : getRelated(s.categorySlug, s.slug);
  const keywordSlug = baseTreatmentSlug(s.slug);
  const seoKeywords = s.seo?.keywords?.length ? s.seo.keywords : TREATMENT_KEYWORDS[s.slug] || TREATMENT_KEYWORDS[keywordSlug] || [];
  const seoTitle = s.seo?.title || `${s.name} in Noida`;
  const seoDescription = s.seo?.description || s.short;
  const canonicalUrl = s.seo?.canonicalUrl || serviceCanonical(s.slug);
  const hydrafacialCostLine =
    baseTreatmentSlug(s.slug) === "hydrafacial-treatment"
      ? "Cost of Hydrafacial treatment in Noida ranges from Rs. 2,000 to Rs. 6,000 per session."
      : "";
  const heroCostCopy = hydrafacialCostLine || s.priceFrom || s.costDescription;

  const bookThis = () => onOpenBooking(s.slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalProcedure",
    name: s.name,
    description: s.what,
    bodyLocation: s.category,
    performerType: "Dermatologist",
    performer: { "@type": "Physician", name: "Dr. Omaima Jawed" },
    url: canonicalUrl,
    keywords: seoKeywords.join(", "),
  };

  return (
    
    <>
   
      <Seo
        title={seoTitle}
        description={seoDescription}
        canonical={canonicalUrl}
        keywords={seoKeywords}
        jsonLd={jsonLd}
        ogImage={s.seo?.openGraphImage || s.image}
        noIndex={s.seo?.noIndex}
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
              <h1 className="font-display leading-[1.05] text-[#3D2F23] mb-4" style={{ fontSize: "clamp(2.25rem, 4.5vw, 3.5rem)" }}>{s.pageTitle || `${s.name} in Noida`}</h1>
              {s.heroTitle && <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#7A5A2E] mb-3">{s.heroTitle}</p>}
              <p className="text-body-lg text-[#5C4A38] mb-4">{s.hero}</p>
              {s.heroDescription && <p className="fine text-armadillo/75 leading-relaxed mb-6">{s.heroDescription}</p>}

              {/* Quick facts row */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 py-6 border-y border-[#b8894a]/30">
                {(s.quickInfoRows || []).slice(0, 4).map((row) => (
                  <div key={row.label}>
                    <div className="flex items-center gap-2 text-[#7A5A2E]"><span className="overline text-[10px] mb-0">{row.label}</span></div>
                    <p className="text-[14px] font-semibold text-[#3D2F23] mt-1">{row.value}</p>
                  </div>
                ))}
              </div>
              {heroCostCopy && (
                <div className="mb-8 border border-[#b8894a]/30 bg-white/40 px-5 py-4 shadow-[0_18px_45px_-30px_rgba(122,62,29,0.55)]">
                  <p className="overline text-[10px] text-[#7A5A2E] mb-2">{s.costHeading || "Treatment Cost"}</p>
                  <p className="text-[15px] md:text-[16px] font-semibold italic text-[#3D2F23] leading-relaxed">
                    {heroCostCopy}
                  </p>
                </div>
              )}

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
            <div className="h-[420px] rounded-3xl overflow-hidden">
              <img src={s.image} alt={s.name} className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* WHAT IS */}
      <section className="bg-arabian-white py-24 lg:py-28" data-testid="svc-what">
        <div className="container-editorial grid lg:grid-cols-5 gap-16">
          <div className="lg:col-span-2 reveal">
            <p className="overline text-coronation-gold mb-4">{s.whatHeading || `What is ${s.name}`}</p>
            <h2 className="font-display text-3xl md:text-4xl text-armadillo leading-tight">
              {s.overviewHeading || `${s.name} treatment, explained simply.`}
            </h2>
          </div>
          <div className="lg:col-span-3 reveal" style={{ transitionDelay: "120ms" }}>
            <p className="fine text-armadillo/85 leading-[1.9] mb-8">{s.what}</p>
            {s.whoFor.length > 0 && (
              <>
                <p className="overline text-armadillo/60 mb-4">{s.idealCandidateHeading || "Ideal candidate for the treatment"}</p>
                <div className="flex flex-wrap gap-2 mb-8">
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
    <div className="max-w-xl mb-14">
      <p className="overline text-coronation-gold mb-4">
        {s.procedureHeading || `Procedures of ${s.name}`}
      </p>
      <h2 className="font-display text-3xl md:text-4xl text-armadillo">
        {s.processHeading || `A Step-by-Step Approach to ${s.name}`}
      </h2>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
      {s.howItWorks.map((step, i) => (
        <div key={i} className="min-h-[220px]">
          <div className="flex items-center gap-4 mb-4">
            <span className="font-display text-4xl text-coronation-gold">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="h-px flex-1 bg-coronation-gold/40" />
          </div>

          <h3 className="font-display text-2xl text-armadillo mb-3">
            {step.title}
          </h3>

          <p className="fine text-armadillo/75 leading-relaxed">
            {step.body || step.description}
          </p>
        </div>
      ))}
    </div>
  </div>
</section>

      {/* BENEFITS + DOWNTIME TABLE */}
      <section className="bg-arabian-white py-24 lg:py-28" data-testid="svc-benefits">
        <div className="container-editorial">
          <div className="reveal">
            <p className="overline text-coronation-gold mb-4">Benefits</p>
            <h2 className="font-display text-3xl md:text-4xl text-armadillo mb-8">{s.benefitsHeading || `Benefits of ${s.name}`}</h2>
            
           <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
  {(s.benefits || []).map((b, i) => {
    const title = typeof b === "string" ? b : b.title || "";
    const description = typeof b === "object" ? b.description : "";

    const iconUrl =
      b?.icon?.url ||
      b?.icon?.asset?.url ||
      b?.icon?.asset?.asset?.url ||
      "";

    return (
      <div
        key={i}
        className="h-full rounded-2xl border border-[#b8894a]/20 bg-[#FFF8EE] p-5 shadow-sm"
      >
        {iconUrl && (
          <img
            src={iconUrl}
            alt={title}
            className="w-12 h-12 object-contain mb-4"
          />
        )}

        <div>
          <h3 className="font-semibold text-lg text-armadillo mb-1">
            {title}
          </h3>

          {description && (
            <p className="text-armadillo/70 leading-relaxed">
              {description}
            </p>
          )}
        </div>
      </div>
    );
  })}
</div>
          </div>
        </div>
      </section>

      {s.symptoms?.length > 0 && (
        <section className="bg-summer-peach py-24 lg:py-28" data-testid="svc-concerns">
          <div className="container-editorial">
            <div className="max-w-2xl mb-12 reveal">
              <p className="overline text-coronation-gold mb-4">Concerns</p>
              <h2 className="font-display text-3xl md:text-4xl text-armadillo">
                Concerns that {s.name} covers
              </h2>
            </div>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {s.symptoms.map((symptom, index) => {
                const title = typeof symptom === "string" ? symptom : symptom.title || "Concern";
                const description = typeof symptom === "object" ? symptom.description : "";
                const imageUrl =
                  symptom?.image?.url ||
                  symptom?.image?.asset?.url ||
                  symptom?.image?.asset?.asset?.url ||
                  "";

                return (
                  <div key={index} className="flex items-start gap-4 rounded-3xl bg-[#FFF8EE] border border-[#E7D2B8] p-5 reveal" style={{ transitionDelay: `${index * 40}ms` }}>
                    {imageUrl && (
                      <img src={imageUrl} alt={title} className="w-12 h-12 rounded-full object-cover flex-shrink-0" />
                    )}
                    <div>
                      <h3 className="text-xl font-semibold text-[#3D2F23] mb-2">{title}</h3>
                      {description && <p className="text-base leading-7 text-[#6A5A4A]">{description}</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {(s.priceFrom || s.costHeading || s.costDescription || (s.pricing || []).length > 0) && (
        <section className="bg-arabian-white py-24 lg:py-28" data-testid="svc-cost">
          <div className="container-editorial grid lg:grid-cols-5 gap-16">
            <div className="lg:col-span-2 reveal">
              <p className="overline text-coronation-gold mb-4">Cost</p>
              <h2 className="font-display text-3xl md:text-4xl text-armadillo leading-tight">{s.costHeading || `Cost of ${s.name}`}</h2>
            </div>
            <div className="lg:col-span-3 reveal" style={{ transitionDelay: "120ms" }}>
              {s.costDescription && <p className="fine text-armadillo/80 leading-[1.9] mb-8">{s.costDescription}</p>}
              {s.priceFrom && (
                <div className="rounded-3xl bg-[#f7f0e4] p-6 border border-[#b8894a]/20 mb-6">
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
                      {item.description && <p className="fine text-xs text-armadillo/65 leading-relaxed mt-2">{item.description}</p>}
                    </div>
                  ))}
                </dl>
              )}
            </div>
          </div>
        </section>
      )}

      {/* BEFORE / AFTER RESULTS */}
     {s.results?.length > 0 && (
  <section
    className="bg-summer-peach py-24 lg:py-28"
    data-testid="svc-results"
  >
    <div className="container-editorial">
      {/* Heading */}
      <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
        <div>
          <p className="overline text-coronation-gold mb-3">
            Before & After
          </p>
          <h2 className="font-display text-3xl md:text-4xl text-armadillo">
            {s.resultsHeading || "Before after results"}
          </h2>
        </div>

        <Link to="/results" className="link-gold overline">
          View all results →
        </Link>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {s.results.map((item, index) => {
          const resultIndex = s.results
            .slice(0, index)
            .filter((result) => result.beforeImage || result.afterImage).length;
          return (
          <article
            key={item._id || index}
            className="rounded-2xl overflow-hidden border border-[#b8894a]/20 bg-white shadow-sm hover:shadow-lg transition-all duration-300"
          >
            <div className="grid grid-cols-2 gap-[2px]">
              {item.beforeImage && (
                <button
                  type="button"
                  onClick={() => setLightboxIndex(resultIndex)}
                  className="block w-full cursor-zoom-in focus:outline-none focus:ring-2 focus:ring-coronation-gold"
                  aria-label={`Open before image for ${item.title || item.treatmentName || s.name}`}
                >
                  <img
                    src={item.beforeImage}
                    alt="Before"
                    className="block w-full h-52 object-cover"
                  />
                </button>
              )}

              {item.afterImage && (
                <button
                  type="button"
                  onClick={() => setLightboxIndex(resultIndex)}
                  className="block w-full cursor-zoom-in focus:outline-none focus:ring-2 focus:ring-coronation-gold"
                  aria-label={`Open after image for ${item.title || item.treatmentName || s.name}`}
                >
                  <img
                    src={item.afterImage}
                    alt="After"
                    className="block w-full h-52 object-cover"
                  />
                </button>
              )}
            </div>

            <div className="p-5">
              <h3 className="font-display text-xl text-armadillo mb-2">
                {item.title || item.treatmentName}
              </h3>

              {item.sessionsInfo && (
                <p className="text-armadillo/70 text-sm mb-3">
                  {item.sessionsInfo}
                </p>
              )}

              <div className="flex justify-between text-sm text-armadillo/70">
                {item.patientAge && (
                  <span>
                    <strong>Age:</strong> {item.patientAge}
                  </span>
                )}

                {item.gender && (
                  <span>
                    <strong>Gender:</strong> {item.gender}
                  </span>
                )}
              </div>
            </div>
          </article>
        );
        })}
      </div>
      <div className="mt-10 text-center">
        <Link to="/results" className="btn-secondary inline-flex items-center gap-2">
          View all results <ChevronRight size={15} />
        </Link>
      </div>
    </div>
  </section>
)}

      {(s.whyChooseHeading || s.whyChooseDescription || s.whyChooseItems?.length > 0) && (
        <section className="bg-summer-peach py-24 lg:py-28 border-t border-[#b8894a]/25" data-testid="svc-why-choose">
          <div className="container-editorial grid lg:grid-cols-5 gap-16">
            <div className="lg:col-span-2 reveal">
              <p className="overline text-coronation-gold mb-4">Why Choose Us</p>
              <h2 className="font-display text-3xl md:text-4xl text-armadillo leading-tight">
                {s.whyChooseHeading || `Why Choose Artham Aesthetics for ${s.name}`}
              </h2>
            </div>
            <div className="lg:col-span-3 reveal" style={{ transitionDelay: "120ms" }}>
              {s.whyChooseDescription && <p className="fine text-armadillo/80 leading-[1.9] mb-8">{s.whyChooseDescription}</p>}
              {s.whyChooseItems?.length > 0 && (
                <div className="grid sm:grid-cols-2 gap-4">
                  {s.whyChooseItems.map((item) => (
                    <div key={item} className="rounded-2xl border border-[#b8894a]/20 bg-[#FFF8EE] p-5">
                      <p className="fine text-sm text-armadillo/80 leading-relaxed">{item}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {(s.specialistHeading || s.specialistDescription || s.specialistHighlights?.length > 0) && (
        <section className="bg-summer-peach py-24 lg:py-28" data-testid="svc-specialist">
          <div className="container-editorial grid lg:grid-cols-5 gap-16 items-start">
            <div className="lg:col-span-2 reveal">
              <p className="overline text-coronation-gold mb-4">Doctor Expertise</p>
              <h2 className="font-display text-3xl md:text-4xl text-armadillo leading-tight">
                {s.specialistHeading || `Best Skin Doctor for ${s.name}`}
              </h2>
            </div>
            <div className="lg:col-span-3 reveal" style={{ transitionDelay: "120ms" }}>
              {s.specialistDescription && <p className="fine text-armadillo/80 leading-[1.9] mb-8">{s.specialistDescription}</p>}
              {s.specialistHighlights?.length > 0 && (
                <ul className="space-y-3">
                  {s.specialistHighlights.map((item) => (
                    <li key={item} className="fine text-sm text-armadillo/80 border-b border-coronation-gold/25 pb-3">{item}</li>
                  ))}
                </ul>
              )}
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
            <h2 className="font-display text-3xl md:text-4xl text-armadillo">{s.faqHeading || "Frequently Asked Question (FAQs)"}</h2>
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
                  to={servicePath(r.slug)}
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
      <ImageLightbox
        images={resultImages}
        currentIndex={lightboxIndex || 0}
        open={lightboxIndex !== null}
        onClose={() => setLightboxIndex(null)}
        onNavigate={setLightboxIndex}
      />
    </>
  );
}
