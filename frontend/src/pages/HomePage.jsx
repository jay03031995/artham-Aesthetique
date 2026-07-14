import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, ShieldCheck, HeartHandshake, BadgeCheck, Star, Clock, Quote, Phone, MessageCircle, Check, CalendarCheck } from "lucide-react";
import { useCmsContent, cmsWhatsAppLink } from "../lib/cmsContent";
import Seo from "../lib/seo";
import useReveal from "../hooks/useReveal";

const useCountUp = (target, duration = 1400) => {
  const [n, setN] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    let raf;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        const start = performance.now();
        const step = (t) => {
          const p = Math.min(1, (t - start) / duration);
          setN(Math.round(target * (0.2 + 0.8 * (1 - Math.pow(1 - p, 3)))));
          if (p < 1) raf = requestAnimationFrame(step);
          else setN(target);
        };
        raf = requestAnimationFrame(step);
        io.disconnect();
      }
    }, { threshold: 0.4 });
    io.observe(ref.current);
    return () => { io.disconnect(); if (raf) cancelAnimationFrame(raf); };
  }, [target, duration]);
  return [ref, n];
};

const ICONS = [BadgeCheck, ShieldCheck, Sparkles, HeartHandshake];
const statNumber = (value) => Number(String(value || "").replace(/[^0-9.]/g, "")) || 0;

export default function HomePage({ onOpenBooking }) {
  useReveal();
  const { site: SITE, categories: CATEGORIES, posts: POSTS, home } = useCmsContent();
  const cmsHomeCategories = CATEGORIES.slice(0, 4).map((cat) => ({
    name: cat.name,
    link: `/category/${cat.slug}`,
    image: cat.image,
    desc: cat.intro,
  }));
  const homeCategories = cmsHomeCategories;
  const signature = home?.featuredTreatments || [];
  const homeTestimonials = (home?.testimonials || []).map((t) => ({
    name: t.name,
    area: t.area || "",
    rating: t.rating || 5,
    quote: t.quote || t.review,
  })).filter((t) => t.name && t.quote);
  const trustItems = home?.trustItems || [];
  const whyItems = home?.whyChooseUs || [];
  const stats = home?.statistics || [];
  const doctor = home?.doctor;

  const [statsRef1, n1] = useCountUp(statNumber(stats[0]?.value));
  const [statsRef2, n2] = useCountUp(statNumber(stats[1]?.value));
  const [statsRef3, n3] = useCountUp(statNumber(stats[2]?.value));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalClinic",
    name: SITE.title,
    image: SITE.logoUrl,
    telephone: SITE.phone,
    priceRange: "$$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: `${SITE.address.line1}, ${SITE.address.line2}`,
      addressLocality: SITE.address.line2,
      addressRegion: SITE.address.line3,
      addressCountry: "IN",
    },
    openingHours: "Mo-Sa 10:00-20:00",
    medicalSpecialty: "Dermatology",
  };

  return (
    <>
      <Seo title={home?.seo?.title || home?.seoTitle || home?.heroTitle} description={home?.seo?.description || home?.metaDescription || home?.heroDescription} jsonLd={jsonLd} ogImage={home?.heroImageUrl || SITE.heroImageUrl} />

      {/* 1. HERO — clinic video with dark gradient overlay */}
      <section
        className="relative w-full overflow-hidden bg-[#3D2F23]"
        data-testid="hero"
        style={{ minHeight: "min(92vh, 900px)" }}
      >
        <video
          data-testid="hero-video"
          autoPlay muted loop playsInline
          poster={home?.heroImageUrl || SITE.clinicPhotoUrl}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ zIndex: 0 }}
        >
          <source src={SITE.heroVideoUrl} type="video/mp4" />
        </video>
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{ zIndex: 1, background: "linear-gradient(180deg, rgba(30,20,10,0.55) 0%, rgba(30,20,10,0.3) 45%, rgba(30,20,10,0.65) 100%)" }}
        />
        <div className="relative container-editorial py-20 lg:py-28 flex flex-col justify-center" style={{ zIndex: 2, minHeight: "inherit" }}>
          {home?.eyebrow && <p className="text-[13px] font-semibold text-[#F5D89C] mb-5 animate-fade-up" style={{ fontFamily: "'Raleway', sans-serif", letterSpacing: 0 }}>{home.eyebrow}</p>}
          <h1 className="font-display text-[#FFF7EC] leading-[1.15] max-w-3xl animate-fade-up" style={{ animationDelay: "120ms", fontSize: "clamp(2rem, 5.5vw, 3.5rem)", fontWeight: 600 }}>
            {home?.heroTitle}
          </h1>
          {home?.heroDescription && <p className="text-[17px] md:text-[18px] leading-[1.6] text-[#FFF7EC] max-w-xl mt-6 animate-fade-up" style={{ animationDelay: "220ms", fontFamily: "'Poppins', sans-serif" }}>{home.heroDescription}</p>}
          <div className="flex flex-wrap gap-4 mt-8 animate-fade-up" style={{ animationDelay: "320ms" }}>
            {SITE.headerCta?.label && <button data-testid="hero-book-btn" onClick={onOpenBooking} className="btn-primary">{SITE.headerCta.label}</button>}
            {home?.featuredSectionLink?.label && <Link to={home.featuredSectionLink.url || "#"} data-testid="hero-explore-btn" className="btn-outline-light">{home.featuredSectionLink.label}</Link>}
          </div>
        </div>
      </section>

      {trustItems.length > 0 && <section className="bg-[#3D2F23] py-6" data-testid="trust-bar">
        <div className="container-editorial flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[13px] md:text-[14px] text-[#FFF7EC]" style={{ fontFamily: "'Poppins', sans-serif" }}>
          {trustItems.map((item, index) => {
            const Icon = ICONS[index % ICONS.length];
            return <div key={item.title} className="flex items-center gap-2"><Icon size={16} className="text-[#F5D89C]" /> {item.title}</div>;
          })}
        </div>
      </section>}

      {homeCategories.length > 0 && <section className="bg-[#efdfc8] py-20 lg:py-28" data-testid="categories-section">
        <div className="container-editorial">
          <div className="max-w-2xl mb-14 reveal">
            {home?.categorySectionEyebrow && <p className="overline mb-3">{home.categorySectionEyebrow}</p>}
            {home?.categorySectionTitle && <h2 className="text-[36px] md:text-[44px] leading-[1.1] mb-4">{home.categorySectionTitle}</h2>}
            {home?.categorySectionText && <p className="text-body-lg text-[#5C4A38]">{home.categorySectionText}</p>}
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {homeCategories.map((cat, i) => (
              <Link
                key={cat.name}
                data-testid={`home-cat-${cat.name.replace(/\s|&/g, "").toLowerCase()}`}
                to={cat.link}
                className="group block reveal card-3d rounded-lg overflow-hidden"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img src={cat.image} alt={cat.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-[1000ms] group-hover:scale-105" />
                </div>
                <div className="p-6">
                  <h3 className="font-display text-2xl text-[#3D2F23] mb-2">{cat.name}</h3>
                  <p className="text-[14px] text-[#5C4A38] leading-relaxed mb-4">{cat.desc}</p>
                  <span className="text-[14px] font-semibold text-[#7A3E1D] flex items-center gap-2">
                    View treatments <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>}

      {signature.length > 0 && <section className="bg-[#f5e6d0] py-20 lg:py-28" data-testid="signature-treatments">
        <div className="container-editorial">
          <div className="flex items-end justify-between mb-12 gap-8 flex-wrap reveal">
            <div className="max-w-xl">
              {home?.featuredSectionEyebrow && <p className="overline mb-3">{home.featuredSectionEyebrow}</p>}
              {home?.featuredSectionTitle && <h2 className="text-[36px] md:text-[44px] leading-[1.1]">{home.featuredSectionTitle}</h2>}
            </div>
            {home?.featuredSectionLink?.label && <Link to={home.featuredSectionLink.url || "#"} className="link-gold text-[15px] font-semibold">{home.featuredSectionLink.label}</Link>}
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {signature.map((s, i) => (
              <div key={s.slug} className="card-3d rounded-lg overflow-hidden flex flex-col reveal" style={{ transitionDelay: `${i * 80}ms` }} data-testid={`sig-${s.slug}`}>
                <Link to={`/services/${s.slug}`} className="block aspect-[4/3] overflow-hidden">
                  <img src={s.image} alt={s.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-[1000ms] hover:scale-105" />
                </Link>
                <div className="p-6 flex flex-col flex-1">
                  <Link to={`/services/${s.slug}`}>
                    <h3 className="font-display text-xl text-[#3D2F23] mb-2 hover:text-[#7A3E1D] transition-colors">{s.name}</h3>
                  </Link>
                  <p className="text-[14px] text-[#5C4A38] leading-relaxed mb-4">{s.short}</p>
                  <div className="flex items-center gap-4 text-[12px] text-[#5C4A38] mb-5 pt-4 border-t border-[#b8894a]/20">
                    <span className="flex items-center gap-1.5"><Clock size={13} className="text-[#7A5A2E]" /> {s.duration}</span>
                    {s.sessions && <span className="text-[#5C4A38]">{s.sessions}</span>}
                  </div>
                  <div className="flex items-center gap-3 mt-auto">
                    <button data-testid={`sig-book-${s.slug}`} onClick={() => onOpenBooking()} className="btn-primary" style={{ padding: "10px 20px", minHeight: "40px", fontSize: "13px" }}>Book</button>
                    <Link to={`/services/${s.slug}`} className="text-[14px] font-semibold text-[#7A3E1D] hover:underline">Learn more →</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>}

      {doctor && <section className="bg-[#efdfc8] py-20 lg:py-28" data-testid="meet-doctor">
        <div className="container-editorial grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative order-2 lg:order-1 reveal">
            <div className="bg-[#f5e6d0] rounded-lg overflow-hidden aspect-[4/5] flex items-end justify-center">
              <img
                src={doctor.portrait || SITE.doctorPortraitUrl}
                alt={doctor.name || ""}
                className="w-full h-full object-contain object-bottom"
                loading="lazy"
              />
            </div>
            <div className="absolute -top-5 -right-5 bg-white px-5 py-3 rounded-lg border border-[#b8894a]/40 shadow-md hidden md:block">
              {doctor.designation && <p className="overline text-[10px] mb-1">{doctor.designation}</p>}
              <p className="font-display text-[#3D2F23] text-lg">{doctor.name}</p>
            </div>
          </div>
          <div className="order-1 lg:order-2 reveal" style={{ transitionDelay: "120ms" }}>
            {home?.doctorEyebrow && <p className="overline mb-3">{home.doctorEyebrow}</p>}
            <h2 className="text-[36px] md:text-[44px] leading-[1.1] mb-4">{doctor.name}</h2>
            {doctor.qualifications?.length > 0 && <p className="text-[15px] font-semibold text-[#7A5A2E] mb-6">{doctor.qualifications.join(" · ")}</p>}
            {doctor.philosophy && <p className="font-display text-xl text-[#5C4A38] italic mb-6 leading-snug">"{doctor.philosophy}"</p>}
            <div className="text-body space-y-4">
              {(doctor.bio || []).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
            {doctor.expertise?.length > 0 && <div className="flex flex-wrap gap-2 mt-6">
              {doctor.expertise.map((chip) => (
                <span key={chip} className="text-[13px] px-3 py-1.5 border border-[#b8894a]/50 text-[#3D2F23] rounded-full">{chip}</span>
              ))}
            </div>}
            <div className="flex flex-wrap gap-3 mt-8">
              <Link to={`/doctors/${doctor.slug}`} data-testid="home-doctor-link" className="btn-secondary">{doctor.consultationCta?.label || doctor.name}</Link>
              {SITE.headerCta?.label && <button data-testid="home-doctor-book" onClick={onOpenBooking} className="btn-primary">{SITE.headerCta.label}</button>}
            </div>
          </div>
        </div>
      </section>}

      {/* 6. TESTIMONIALS */}
      {homeTestimonials.length > 0 && <section className="bg-[#f5e6d0] py-20 lg:py-28" data-testid="testimonials">
        <div className="container-editorial">
          <div className="max-w-2xl mb-12 reveal">
            {home?.testimonialEyebrow && <p className="overline mb-3">{home.testimonialEyebrow}</p>}
            {home?.testimonialTitle && <h2 className="text-[36px] md:text-[44px] leading-[1.1]">{home.testimonialTitle}</h2>}
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {homeTestimonials.map((t, i) => (
              <figure key={t.name} className="bg-white rounded-lg p-7 border border-[#b8894a]/25 reveal" style={{ transitionDelay: `${i * 80}ms` }}>
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => <Star key={i} size={14} className="text-[#b8894a] fill-[#b8894a]" />)}
                </div>
                <Quote className="text-[#b8894a] mb-3" size={22} />
                <blockquote className="text-[15px] text-[#3D2F23] leading-relaxed mb-6">"{t.quote}"</blockquote>
                <figcaption className="flex items-center justify-between border-t border-[#b8894a]/20 pt-4">
                  <div>
                    <div className="font-semibold text-[#3D2F23]">{t.name}</div>
                    <div className="text-[12px] text-[#5C4A38]">{t.area}</div>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>}

      {/* 7. WHY ARTHAM */}
      {whyItems.length > 0 && <section className="bg-[#efdfc8] py-20 lg:py-28" data-testid="why-us">
        <div className="container-editorial">
          <div className="max-w-2xl mb-14 reveal">
            {home?.whyChooseEyebrow && <p className="overline mb-3">{home.whyChooseEyebrow}</p>}
            {home?.whyChooseTitle && <h2 className="text-[36px] md:text-[44px] leading-[1.1]">{home.whyChooseTitle}</h2>}
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyItems.map((p, i) => {
              const Icon = ICONS[i % ICONS.length];
              return (
              <div key={p.title} className="reveal" style={{ transitionDelay: `${i * 80}ms` }}>
                <div className="w-12 h-12 rounded-full bg-white border border-[#b8894a]/50 flex items-center justify-center mb-4">
                  <Icon className="text-[#7A3E1D]" size={20} />
                </div>
                <h4 className="font-display text-xl text-[#3D2F23] mb-2 leading-tight">{p.title}</h4>
                <p className="text-[15px] text-[#5C4A38] leading-relaxed">{p.description}</p>
              </div>
            )})}
          </div>
        </div>
      </section>}

      {/* 8. JOURNAL TEASER */}
      <section className="bg-white py-20 lg:py-24 border-t border-[#b8894a]/25" data-testid="latest-blog">
        <div className="container-editorial">
          <div className="flex items-end justify-between mb-10 gap-6 flex-wrap reveal">
            <div>
              <p className="overline mb-3">The Journal</p>
              <h2 className="text-[36px] md:text-[44px] leading-[1.1]">Notes from the clinic.</h2>
            </div>
            <Link to="/blog" data-testid="home-blog-all" className="link-gold text-[15px] font-semibold">Read all →</Link>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {POSTS.slice(0, 3).map((p, i) => (
              <Link
                key={p.slug}
                data-testid={`home-post-${p.slug}`}
                to={`/blog/${p.slug}`}
                className="group block reveal"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="aspect-[4/3] overflow-hidden mb-4 rounded-lg">
                  <img src={p.coverImage} alt={p.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-[1000ms] group-hover:scale-105" />
                </div>
                <p className="overline text-[11px] mb-2">{p.category} · {p.readingTimeMin} min</p>
                <h3 className="font-display text-xl text-[#3D2F23] group-hover:text-[#7A3E1D] transition-colors leading-tight mb-2">{p.title}</h3>
                <p className="text-[14px] text-[#5C4A38] leading-relaxed">{p.excerpt}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 9. CTA BAND — dermaheal "simple book" style */}
      <section className="bg-[#3D2F23] text-[#FFF7EC] py-20 lg:py-24 overflow-hidden" data-testid="cta-band">
        <div className="container-editorial reveal">
          <div className="max-w-2xl">
            {home?.ctaEyebrow && <p className="inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.22em] font-semibold text-[#F5D89C] mb-5">
              <span className="w-6 h-px bg-[#F5D89C]" aria-hidden="true" />
              {home.ctaEyebrow}
            </p>}
            {home?.ctaTitle && <h2 className="font-display text-[36px] md:text-[44px] leading-[1.1] mb-4">{home.ctaTitle}</h2>}
            {home?.ctaText && <p className="text-[17px] leading-[1.65] text-[#FFF7EC]/75 mb-8 max-w-lg">{home.ctaText}</p>}
            <div className="flex flex-wrap gap-3">
              {SITE.headerCta?.label && <button data-testid="cta-book-btn" onClick={onOpenBooking} className="btn-on-dark inline-flex items-center gap-2"><CalendarCheck size={16} /> {SITE.headerCta.label}</button>}
              {SITE.whatsapp && <a data-testid="cta-wa-btn" href={cmsWhatsAppLink(SITE)} target="_blank" rel="noreferrer" className="btn-outline-light inline-flex items-center gap-2"><MessageCircle size={15} /> WhatsApp</a>}
              <a data-testid="cta-call-btn" href={`tel:${SITE.phoneDigits}`} className="btn-outline-light inline-flex items-center gap-2"><Phone size={15} /> {SITE.phone}</a>
            </div>
            {home?.ctaBullets?.length > 0 && <div className="flex flex-wrap gap-x-7 gap-y-2 mt-8 text-[13px] text-[#F5D89C]">
              {home.ctaBullets.map((m) => (
                <span key={m} className="inline-flex items-center gap-2"><Check size={15} className="text-[#b8894a]" /> {m}</span>
              ))}
            </div>}
          </div>
        </div>
      </section>

      {/* STATS strip (small, moved after main content per revised order) */}
      {stats.length > 0 && <section className="bg-[#3D2F23] py-12" data-testid="stats-strip">
        <div className="container-editorial grid grid-cols-3 gap-6 text-center">
          <div ref={statsRef1}>
            <div className="font-display text-3xl md:text-4xl text-[#FFF7EC]">{n1}+</div>
            <div className="text-[11px] uppercase tracking-[0.14em] font-semibold text-[#F5D89C] mt-2">{stats[0]?.label}</div>
          </div>
          <div ref={statsRef2}>
            <div className="font-display text-3xl md:text-4xl text-[#FFF7EC]">{n2}+</div>
            <div className="text-[11px] uppercase tracking-[0.14em] font-semibold text-[#F5D89C] mt-2">{stats[1]?.label}</div>
          </div>
          <div ref={statsRef3}>
            <div className="font-display text-3xl md:text-4xl text-[#FFF7EC]">{n3.toLocaleString("en-IN")}+</div>
            <div className="text-[11px] uppercase tracking-[0.14em] font-semibold text-[#F5D89C] mt-2">{stats[2]?.label}</div>
          </div>
        </div>
      </section>}
    </>
  );
}
