import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, ShieldCheck, HeartHandshake, BadgeCheck, Star, Award, Users, Clock, Quote, Phone, MessageCircle, Check, CalendarCheck } from "lucide-react";
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

// Homepage shows 4 grouped categories per spec
const HOME_CATEGORIES = [
  { name: "Skin", link: "/category/skin", image: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=900&q=80", desc: "Facials, peels, boosters and lasers — for calm, camera-ready skin." },
  { name: "Hair", link: "/category/hair", image: "https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&w=900&q=80", desc: "PRP, growth factors and FUE — a proper, evidence-led plan." },
  { name: "Body", link: "/category/body", image: "https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=900&q=80", desc: "CoolSculpting, contouring and bridal — for real, measured change." },
  { name: "Laser & Advanced", link: "/category/anti-ageing", image: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=900&q=80", desc: "Skin-tone-safe lasers, injectables and regenerative protocols." },
];

// 6 signature treatments with quick facts
const SIGNATURE_SLUGS = ["hydrafacial-treatment", "pdrn-skin-boosters", "hifu", "laser-hair-removal", "acne-treatment", "vampire-facial-prp"];

export default function HomePage({ onOpenBooking }) {
  useReveal();
  const { site: SITE, categories: CATEGORIES, allServices: ALL_SERVICES, posts: POSTS, testimonials } = useCmsContent();
  const cmsHomeCategories = CATEGORIES.slice(0, 4).map((cat) => ({
    name: cat.name,
    link: `/category/${cat.slug}`,
    image: cat.image,
    desc: cat.intro,
  }));
  const homeCategories = cmsHomeCategories.length ? cmsHomeCategories : HOME_CATEGORIES;
  const signature = SIGNATURE_SLUGS.map((s) => ALL_SERVICES.find((x) => x.slug === s)).filter(Boolean);
  const homeTestimonials = testimonials?.length ? testimonials.map((t) => ({
    name: t.name,
    area: t.area || "Artham Guest",
    rating: t.rating || 5,
    quote: t.quote || t.review,
  })) : [
    { name: "Ananya S.", area: "Noida", rating: 5, quote: "The first clinic I've visited where nobody tried to upsell me. I got exactly the two treatments I actually needed — and my skin has never behaved better." },
    { name: "Rhea K.", area: "Delhi", rating: 5, quote: "Six months out from my wedding, I walked in nervous. I walked out with a plan I understood — and skin I actually recognise on my wedding photos." },
    { name: "Kabir M.", area: "Gurgaon", rating: 5, quote: "The beard-line laser at Artham is the cleanest, quietest treatment I've had. Private, precise, done in 25 minutes. Booked back." },
  ];

  const [statsRef1, n1] = useCountUp(10);
  const [statsRef2, n2] = useCountUp(37);
  const [statsRef3, n3] = useCountUp(5000);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalClinic",
    name: "Artham Aesthetique",
    image: SITE.logoUrl,
    telephone: SITE.phone,
    priceRange: "$$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: `${SITE.address.line1}, ${SITE.address.line2}`,
      addressLocality: "Noida",
      addressRegion: "Uttar Pradesh",
      postalCode: "201304",
      addressCountry: "IN",
    },
    openingHours: "Mo-Sa 10:00-20:00",
    medicalSpecialty: "Dermatology",
  };

  return (
    <>
      <Seo title="Where Science meets Soulful Care" description="Dr-led skin, hair and body wellness in Noida. Editorial care by Dr. Omaima Jawed at Artham Aesthetique." jsonLd={jsonLd} />

      {/* 1. HERO — clinic video with dark gradient overlay */}
      <section
        className="relative w-full overflow-hidden bg-[#3D2F23]"
        data-testid="hero"
        style={{ minHeight: "min(92vh, 900px)" }}
      >
        <video
          data-testid="hero-video"
          autoPlay muted loop playsInline
          poster={SITE.clinicPhotoUrl}
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
          <p className="text-[13px] font-semibold text-[#F5D89C] mb-5 animate-fade-up" style={{ fontFamily: "'Raleway', sans-serif", letterSpacing: 0 }}>Artham Aesthetique · Noida</p>
          <h1 className="font-display text-[#FFF7EC] leading-[1.15] max-w-3xl animate-fade-up" style={{ animationDelay: "120ms", fontSize: "clamp(2rem, 5.5vw, 3.5rem)", fontWeight: 600 }}>
            Where Science meets<br /><em className="italic font-light">Soulful Care.</em>
          </h1>
          <p className="text-[17px] md:text-[18px] leading-[1.6] text-[#FFF7EC] max-w-xl mt-6 animate-fade-up" style={{ animationDelay: "220ms", fontFamily: "'Poppins', sans-serif" }}>
            Dr-led skin, hair and body wellness — practised with restraint, considered like a ritual.
          </p>
          <div className="flex flex-wrap gap-4 mt-8 animate-fade-up" style={{ animationDelay: "320ms" }}>
            <button data-testid="hero-book-btn" onClick={onOpenBooking} className="btn-primary">Book Appointment</button>
            <Link to="/category/skin" data-testid="hero-explore-btn" className="btn-outline-light">Explore Treatments</Link>
          </div>
        </div>
      </section>

      {/* 2. TRUST BAR */}
      <section className="bg-[#3D2F23] py-6" data-testid="trust-bar">
        <div className="container-editorial flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[13px] md:text-[14px] text-[#FFF7EC]" style={{ fontFamily: "'Poppins', sans-serif" }}>
          <div className="flex items-center gap-2"><BadgeCheck size={16} className="text-[#F5D89C]" /> Dr-led</div>
          <div className="hidden md:block h-4 w-px bg-[#FFF7EC]/25" />
          <div className="flex items-center gap-2"><ShieldCheck size={16} className="text-[#F5D89C]" /> FDA-approved technology</div>
          <div className="hidden md:block h-4 w-px bg-[#FFF7EC]/25" />
          <div className="flex items-center gap-2"><Award size={16} className="text-[#F5D89C]" /> 10+ years experience</div>
          <div className="hidden md:block h-4 w-px bg-[#FFF7EC]/25" />
          <div className="flex items-center gap-2"><Star size={16} className="text-[#F5D89C] fill-[#F5D89C]" /> 4.9 Google rating</div>
          <div className="hidden md:block h-4 w-px bg-[#FFF7EC]/25" />
          <div className="flex items-center gap-2"><Users size={16} className="text-[#F5D89C]" /> 5,000+ happy clients</div>
        </div>
      </section>

      {/* 3. TREATMENT CATEGORIES */}
      <section className="bg-[#efdfc8] py-20 lg:py-28" data-testid="categories-section">
        <div className="container-editorial">
          <div className="max-w-2xl mb-14 reveal">
            <p className="overline mb-3">Explore Our Treatments</p>
            <h2 className="text-[36px] md:text-[44px] leading-[1.1] mb-4">Four worlds of care, one editorial approach.</h2>
            <p className="text-body-lg text-[#5C4A38]">From the softest facials to advanced regenerative protocols — designed and supervised by Dr. Omaima Jawed.</p>
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
      </section>

      {/* 4. SIGNATURE TREATMENTS */}
      <section className="bg-[#f5e6d0] py-20 lg:py-28" data-testid="signature-treatments">
        <div className="container-editorial">
          <div className="flex items-end justify-between mb-12 gap-8 flex-wrap reveal">
            <div className="max-w-xl">
              <p className="overline mb-3">Signature Treatments</p>
              <h2 className="text-[36px] md:text-[44px] leading-[1.1]">The protocols we're loved for.</h2>
            </div>
            <Link to="/category/skin" className="link-gold text-[15px] font-semibold">View all treatments →</Link>
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
      </section>

      {/* 5. MEET THE DOCTOR */}
      <section className="bg-[#efdfc8] py-20 lg:py-28" data-testid="meet-doctor">
        <div className="container-editorial grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative order-2 lg:order-1 reveal">
            <div className="bg-[#f5e6d0] rounded-lg overflow-hidden aspect-[4/5] flex items-end justify-center">
              <img
                src={SITE.doctorPortraitUrl}
                alt="Dr. Omaima Jawed, Dermatologist and Founder of Artham Aesthetique"
                className="w-full h-full object-contain object-bottom"
                loading="lazy"
              />
            </div>
            <div className="absolute -top-5 -right-5 bg-white px-5 py-3 rounded-lg border border-[#b8894a]/40 shadow-md hidden md:block">
              <p className="overline text-[10px] mb-1">Founder</p>
              <p className="font-display text-[#3D2F23] text-lg">Dr. Omaima Jawed</p>
            </div>
          </div>
          <div className="order-1 lg:order-2 reveal" style={{ transitionDelay: "120ms" }}>
            <p className="overline mb-3">Meet Your Doctor</p>
            <h2 className="text-[36px] md:text-[44px] leading-[1.1] mb-4">Dr. Omaima Jawed</h2>
            <p className="text-[15px] font-semibold text-[#7A5A2E] mb-6">MBBS · MD Dermatology · Cosmetic Dermatology Fellowship</p>
            <p className="font-display text-xl text-[#5C4A38] italic mb-6 leading-snug">"Care that enhances what is already yours — never replaces it."</p>
            <div className="text-body space-y-4">
              <p>Founder and lead dermatologist at Artham Aesthetique, Dr. Omaima leads every consult personally. Her practice sits at the intersection of medical dermatology (acne, pigmentation, hair loss) and considered aesthetics (injectables, lasers, regenerative protocols).</p>
              <p>Member — Indian Association of Dermatologists · Cosmetic Dermatology Society of India.</p>
            </div>
            <div className="flex flex-wrap gap-2 mt-6">
              {["Acne", "Pigmentation", "Anti-ageing", "Lasers", "Hair restoration"].map((chip) => (
                <span key={chip} className="text-[13px] px-3 py-1.5 border border-[#b8894a]/50 text-[#3D2F23] rounded-full">{chip}</span>
              ))}
            </div>
            <div className="flex flex-wrap gap-3 mt-8">
              <Link to="/doctors/dr-omaima-jawed" data-testid="home-doctor-link" className="btn-secondary">About Dr. Omaima →</Link>
              <button data-testid="home-doctor-book" onClick={onOpenBooking} className="btn-primary">Book with Dr. Omaima</button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. TESTIMONIALS */}
      <section className="bg-[#f5e6d0] py-20 lg:py-28" data-testid="testimonials">
        <div className="container-editorial">
          <div className="max-w-2xl mb-12 reveal">
            <p className="overline mb-3">In Our Guests' Words</p>
            <h2 className="text-[36px] md:text-[44px] leading-[1.1]">Considered stories, not scripted reviews.</h2>
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
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#7A5A2E]">Google Review</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* 7. WHY ARTHAM */}
      <section className="bg-[#efdfc8] py-20 lg:py-28" data-testid="why-us">
        <div className="container-editorial">
          <div className="max-w-2xl mb-14 reveal">
            <p className="overline mb-3">Why Artham</p>
            <h2 className="text-[36px] md:text-[44px] leading-[1.1]">Four quiet reasons patients stay.</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: HeartHandshake, title: "Personalised protocols", body: "Never a shelf package. Every plan is written to your skin, calendar and season." },
              { icon: Sparkles, title: "Medical-grade devices", body: "FDA-approved technology, single-use consumables — physician oversight on every visit." },
              { icon: BadgeCheck, title: "Consultation-first", body: "Your plan is shaped in a complimentary consult — only what your skin actually needs, nothing it doesn't." },
              { icon: ShieldCheck, title: "Follow-up care", body: "You are never handed off. The same doctor sees you at every visit and follow-up." },
            ].map((p, i) => (
              <div key={p.title} className="reveal" style={{ transitionDelay: `${i * 80}ms` }}>
                <div className="w-12 h-12 rounded-full bg-white border border-[#b8894a]/50 flex items-center justify-center mb-4">
                  <p.icon className="text-[#7A3E1D]" size={20} />
                </div>
                <h4 className="font-display text-xl text-[#3D2F23] mb-2 leading-tight">{p.title}</h4>
                <p className="text-[15px] text-[#5C4A38] leading-relaxed">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. JOURNAL TEASER */}
      <section className="bg-white py-20 lg:py-24 border-t border-[#b8894a]/25" data-testid="latest-blog">
        <div className="container-editorial">
          <div className="flex items-end justify-between mb-10 gap-6 flex-wrap reveal">
            <div>
              <p className="overline mb-3">Latest Blogs</p>
              <h2 className="text-[36px] md:text-[44px] leading-[1.1]">Our Latest Blogs.</h2>
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
      <section className="bg-[#7a3f1f] text-[#FFF7EC] py-20 lg:py-24 overflow-hidden" data-testid="cta-band">
        <div className="container-editorial reveal">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.22em] font-semibold text-[#F5D89C] mb-5">
              <span className="w-6 h-px bg-[#F5D89C]" aria-hidden="true" />
              A Slow, Considered Beginning
            </p>
            <h2 className="font-display text-[36px] md:text-[44px] leading-[1.1] mb-4">Ready for your consultation?</h2>
            <p className="text-[17px] leading-[1.65] text-[#FFF7EC]/75 mb-8 max-w-lg">A 15-minute discovery consult with Dr. Omaima Jawed is complimentary — an unhurried conversation about your skin, no obligation.</p>
            <div className="flex flex-wrap gap-3">
              <button data-testid="cta-book-btn" onClick={onOpenBooking} className="btn-on-dark inline-flex items-center gap-2 px-2"><CalendarCheck size={16} /> Book Appointment</button>
              <a data-testid="cta-wa-btn" href={cmsWhatsAppLink(SITE)} target="_blank" rel="noreferrer" className="btn-outline-light inline-flex items-center gap-2"><MessageCircle size={15} /> WhatsApp</a>
              <a data-testid="cta-call-btn" href={`tel:${SITE.phoneDigits}`} className="btn-outline-light inline-flex items-center gap-2"><Phone size={15} /> {SITE.phone}</a>
            </div>
            <div className="flex flex-wrap gap-x-7 gap-y-2 mt-8 text-[13px] text-[#F5D89C]">
              {["Complimentary 15-min consult", "MD-led dermatology", "No obligation"].map((m) => (
                <span key={m} className="inline-flex items-center gap-2"><Check size={15} className="text-[#b8894a]" /> {m}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* STATS strip (small, moved after main content per revised order) */}
      <section className="bg-[#7a3f1f] py-12" data-testid="stats-strip">
        <div className="container-editorial grid grid-cols-3 gap-6 text-center">
          <div ref={statsRef1}>
            <div className="font-display text-3xl md:text-4xl text-[#FFF7EC]">{n1}+</div>
            <div className="text-[11px] uppercase tracking-[0.14em] font-semibold text-[#F5D89C] mt-2">Years of Care</div>
          </div>
          <div ref={statsRef2}>
            <div className="font-display text-3xl md:text-4xl text-[#FFF7EC]">{n2}+</div>
            <div className="text-[11px] uppercase tracking-[0.14em] font-semibold text-[#F5D89C] mt-2">Signature Treatments</div>
          </div>
          <div ref={statsRef3}>
            <div className="font-display text-3xl md:text-4xl text-[#FFF7EC]">{n3.toLocaleString("en-IN")}+</div>
            <div className="text-[11px] uppercase tracking-[0.14em] font-semibold text-[#F5D89C] mt-2">Happy Clients</div>
          </div>
        </div>
      </section>
    </>
  );
}
