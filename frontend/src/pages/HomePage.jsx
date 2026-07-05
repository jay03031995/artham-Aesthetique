import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Award, Users, Sparkles, Calendar, Quote, Leaf, ShieldCheck, HeartHandshake } from "lucide-react";
import { SITE } from "../data/site";
import { CATEGORIES } from "../data/treatments";
import { POSTS } from "../data/blog";
import Seo from "../lib/seo";
import useReveal from "../hooks/useReveal";

const useCountUp = (target, duration = 1600) => {
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

const StatItem = ({ value, label, suffix = "+" }) => {
  const [ref, n] = useCountUp(value);
  return (
    <div ref={ref} className="text-center">
      <div className="font-display text-4xl md:text-5xl text-arabian-white leading-none">
        {n.toLocaleString("en-IN")}{suffix}
      </div>
      <div className="overline text-coronation-gold mt-3">{label}</div>
    </div>
  );
};

export default function HomePage({ onOpenBooking }) {
  useReveal();

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
    url: typeof window !== "undefined" ? window.location.origin : "",
    medicalSpecialty: "Dermatology",
  };

  return (
    <>
      <Seo title="Where Science meets Soulful Care" description="Dermatologist-led skin, hair and body wellness in Noida. Editorial care by Dr. Omaima Jawed at Artham Aesthetique." jsonLd={jsonLd} />

      {/* HERO */}
      <section className="relative h-[100svh] min-h-[640px] w-full overflow-hidden" data-testid="hero">
        <video
          data-testid="hero-video"
          autoPlay muted loop playsInline
          poster="https://images.unsplash.com/photo-1676302144341-10563603f99a?auto=format&fit=crop&w=1920&q=80"
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={SITE.heroVideoUrl} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-armadillo/50 via-armadillo/25 to-armadillo/70" />
        <div className="relative z-10 h-full container-editorial flex flex-col justify-end pb-24 lg:pb-32">
          <p className="overline text-coronation-gold mb-6 animate-fade-up">Artham Aesthetique · Noida</p>
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl text-arabian-white leading-[1.02] max-w-4xl animate-fade-up" style={{ animationDelay: "150ms" }}>
            Where Science meets<br /><em className="italic font-light">Soulful Care.</em>
          </h1>
          <p className="fine text-arabian-white/85 text-base md:text-lg max-w-xl mt-8 animate-fade-up" style={{ animationDelay: "300ms" }}>
            Dermatologist-led skin, hair and body wellness — practised with restraint, considered like a ritual.
          </p>
          <div className="flex flex-wrap gap-4 mt-10 animate-fade-up" style={{ animationDelay: "450ms" }}>
            <button data-testid="hero-book-btn" onClick={onOpenBooking} className="btn-primary btn-on-dark">Book Appointment</button>
            <Link to="/category/skin" data-testid="hero-explore-btn" className="btn-secondary text-arabian-white border-arabian-white/60 hover:bg-arabian-white hover:text-armadillo">Explore Treatments</Link>
          </div>
          <div className="flex items-center gap-3 mt-10 fine text-sm text-arabian-white/70 animate-fade-up" style={{ animationDelay: "600ms" }}>
            <div className="h-px w-8 bg-coronation-gold" />
            <span>Dermatologist-led · FDA-approved technology</span>
          </div>
        </div>
      </section>

      {/* STATS STRIP */}
      <section className="bg-armadillo py-16" data-testid="stats-strip">
        <div className="container-editorial grid grid-cols-2 md:grid-cols-4 gap-10">
          <StatItem value={12000} label="Happy Clients" />
          <StatItem value={37} label="Signature Services" />
          <StatItem value={8} label="Expert Team" />
          <StatItem value={9} label="Years of Care" />
        </div>
      </section>

      {/* CATEGORIES GRID */}
      <section className="bg-arabian-white py-24 lg:py-32" data-testid="categories-section">
        <div className="container-editorial">
          <div className="max-w-2xl mb-16 reveal">
            <p className="overline text-coronation-gold mb-4">Explore Our Treatments</p>
            <h2 className="font-display text-4xl md:text-5xl text-armadillo leading-tight">Six worlds of care, one editorial approach.</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {CATEGORIES.map((cat, i) => (
              <Link
                key={cat.slug}
                data-testid={`home-cat-${cat.slug}`}
                to={`/category/${cat.slug}`}
                className="group block reveal"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="relative aspect-[4/5] overflow-hidden mb-5">
                  <img src={cat.image} alt={cat.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-105" />
                  <div className="absolute inset-0 bg-armadillo/10 group-hover:bg-armadillo/20 transition-colors duration-700" />
                  <div className="absolute top-6 left-6 overline text-arabian-white/90 backdrop-blur-sm bg-armadillo/40 px-3 py-1">{cat.services.length} treatments</div>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <h3 className="font-display text-2xl text-armadillo group-hover:text-burma-teak transition-colors duration-500">{cat.name}</h3>
                    <p className="fine text-sm text-armadillo/60 mt-1 max-w-xs">{cat.intro}</p>
                  </div>
                  <ArrowRight size={18} className="text-burma-teak group-hover:translate-x-1 transition-transform duration-500 shrink-0 ml-3" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT INTRO */}
      <section className="bg-summer-peach py-24 lg:py-32" data-testid="home-about">
        <div className="container-editorial grid lg:grid-cols-2 gap-16 items-center">
          <div className="reveal">
            <p className="overline text-coronation-gold mb-4">About Artham Aesthetique</p>
            <h2 className="font-display text-4xl md:text-5xl text-armadillo mb-8 leading-tight">Advanced solutions for skin, hair &amp; body — <em className="italic font-light">without the theatre.</em></h2>
            <div className="fine text-armadillo/85 leading-[1.9] space-y-5">
              <p>We began Artham Aesthetique with one quiet conviction: the best clinics do less, but do it beautifully. Every treatment here begins with a real consult — a conversation about your history, your goals and your calendar — before any device is switched on.</p>
              <p>You will find FDA-approved technology, single-use consumables and physician oversight on every protocol. You will also find warm light, generous chairs, hushed music and time — because good skin decisions are rarely made in a hurry.</p>
            </div>
            <Link to="/about" data-testid="home-about-link" className="link-gold overline mt-8 inline-block">Read our story</Link>
          </div>
          <div className="relative reveal" style={{ transitionDelay: "150ms" }}>
            <img src="https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=1400&q=80" alt="Warm, editorial clinic ambience" loading="lazy" className="w-full aspect-[4/5] object-cover" />
            <div className="absolute -bottom-6 -left-6 bg-arabian-white px-6 py-4 border border-coronation-gold/30 shadow-lg max-w-xs">
              <p className="overline text-coronation-gold text-[10px] mb-1">Est. 2017</p>
              <p className="font-display text-armadillo">A quieter dermatology.</p>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK-LINK TILES */}
      <section className="bg-arabian-white py-24 lg:py-32" data-testid="quicklinks">
        <div className="container-editorial grid md:grid-cols-3 gap-6 md:gap-8">
          {[
            { title: "Golden Tips & Journal", link: "/blog", cta: "Read the journal", img: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=1200&q=80", key: "blog" },
            { title: "Certifications & Awards", link: "/about#certifications", cta: "View recognitions", img: "https://images.unsplash.com/photo-1585951237318-9ea5e175b891?auto=format&fit=crop&w=1200&q=80", key: "certs" },
            { title: "Services & Packages", link: "/category/skin", cta: "See what we offer", img: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1200&q=80", key: "services" },
          ].map((tile, i) => (
            <Link
              key={tile.key}
              data-testid={`home-tile-${tile.key}`}
              to={tile.link}
              className="group relative aspect-[3/4] overflow-hidden reveal"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <img src={tile.img} alt={tile.title} loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-armadillo/85 via-armadillo/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <h3 className="font-display text-2xl text-arabian-white mb-3">{tile.title}</h3>
                <span className="overline text-coronation-gold link-gold">{tile.cta} →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* WHY US */}
      <section className="bg-summer-peach py-24 lg:py-32" data-testid="why-us">
        <div className="container-editorial">
          <div className="max-w-2xl mb-16 reveal">
            <p className="overline text-coronation-gold mb-4">Why Artham Aesthetique</p>
            <h2 className="font-display text-4xl md:text-5xl text-armadillo">Four quiet reasons patients stay.</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: ShieldCheck, title: "Dermatologist-led", body: "Every protocol is designed and supervised by Dr. Omaima Jawed." },
              { icon: Sparkles, title: "FDA-approved tech", body: "Devices we trust, consumables that are single-use, always." },
              { icon: Leaf, title: "Restraint over excess", body: "We do less, on purpose. Faces should age beautifully, not obviously." },
              { icon: HeartHandshake, title: "Honest pricing", body: "Personalised plans — never sold as fixed 'packages'." },
            ].map((p, i) => (
              <div key={p.title} className="reveal" style={{ transitionDelay: `${i * 80}ms` }}>
                <div className="w-12 h-12 rounded-full bg-arabian-white border border-coronation-gold/40 flex items-center justify-center mb-5">
                  <p.icon className="text-burma-teak" size={20} />
                </div>
                <h4 className="font-display text-xl text-armadillo mb-3 leading-tight">{p.title}</h4>
                <p className="fine text-sm text-armadillo/75 leading-relaxed">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* THE ARTHAM WAY */}
      <section className="bg-armadillo text-arabian-white py-24 lg:py-32" data-testid="artham-way">
        <div className="container-editorial">
          <div className="max-w-2xl mb-16 reveal">
            <p className="overline text-coronation-gold mb-4">Our Philosophy</p>
            <h2 className="font-display text-4xl md:text-5xl">The Artham Way — <em className="italic font-light">a slow, three-step process.</em></h2>
          </div>
          <div className="grid md:grid-cols-3 gap-10 lg:gap-14">
            {[
              { n: "01", title: "Consult", body: "A real conversation — history, goals, honest expectations. Sometimes 30 minutes is all it takes to change everything." },
              { n: "02", title: "Customise", body: "A plan designed around your skin, calendar and season — never a shelf package. Written down, always." },
              { n: "03", title: "Care", body: "Devices, hands and follow-through — with the same physician on every visit. You are never handed off." },
            ].map((s, i) => (
              <div key={s.n} className="reveal" style={{ transitionDelay: `${i * 100}ms` }}>
                <p className="font-display text-6xl text-coronation-gold mb-6">{s.n}</p>
                <h3 className="font-display text-3xl text-arabian-white mb-4">{s.title}</h3>
                <p className="fine text-arabian-white/75 leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MEET DR OMAIMA */}
      <section className="bg-arabian-white py-24 lg:py-32" data-testid="meet-doctor">
        <div className="container-editorial grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative order-2 lg:order-1 reveal">
            <img
              src="https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=1200&q=80"
              alt="Dr. Omaima Jawed portrait — placeholder"
              className="w-full aspect-[4/5] object-cover"
              loading="lazy"
            />
            <div className="absolute -top-6 -right-6 bg-summer-peach px-6 py-4 border border-coronation-gold/30 hidden md:block">
              <p className="overline text-coronation-gold text-[10px] mb-1">Founder & Dermatologist</p>
              <p className="font-display text-armadillo text-lg">Dr. Omaima Jawed</p>
            </div>
          </div>
          <div className="order-1 lg:order-2 reveal" style={{ transitionDelay: "150ms" }}>
            <p className="overline text-coronation-gold mb-4">Meet Your Doctor</p>
            <h2 className="font-display text-4xl md:text-5xl text-armadillo mb-6 leading-tight">Dr. Omaima Jawed</h2>
            <p className="font-display text-xl text-armadillo/70 italic mb-8 leading-snug">"Care that enhances what is already yours — never replaces it."</p>
            <div className="fine text-armadillo/80 space-y-4 leading-[1.9]">
              <p>Trained in dermatology and cosmetology, Dr. Omaima leads every consult at Artham Aesthetique. Her practice sits at the intersection of medical dermatology (acne, pigmentation, hair loss) and considered aesthetics (injectables, lasers, regenerative protocols).</p>
              <p>Her rule is simple: if a treatment cannot be defended clinically, we do not offer it. If it can, we do it beautifully.</p>
            </div>
            <div className="flex flex-wrap gap-2 mt-8">
              {["Acne", "Pigmentation", "Anti-ageing injectables", "Lasers", "Hair restoration"].map((chip) => (
                <span key={chip} className="fine text-xs px-3 py-1 border border-coronation-gold/40 text-armadillo/80">{chip}</span>
              ))}
            </div>
            <div className="flex flex-wrap gap-3 mt-10">
              <Link to="/doctors/dr-omaima-jawed" data-testid="home-doctor-link" className="btn-secondary">Read Full Profile</Link>
              <button data-testid="home-doctor-book" onClick={onOpenBooking} className="btn-primary">Book with Dr. Omaima</button>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-summer-peach py-24 lg:py-32" data-testid="testimonials">
        <div className="container-editorial">
          <div className="max-w-2xl mb-16 reveal">
            <p className="overline text-coronation-gold mb-4">In Our Guests' Words</p>
            <h2 className="font-display text-4xl md:text-5xl text-armadillo">Considered stories, not scripted reviews.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {[
              { name: "Ananya S.", area: "Noida", quote: "The first clinic I have visited where nobody tried to upsell me. I got exactly the two treatments I actually needed — and my skin has never behaved better.", img: "https://images.unsplash.com/photo-1552693673-1bf958298935?auto=format&fit=crop&w=400&q=80" },
              { name: "Rhea K.", area: "Delhi", quote: "Six months out from my wedding, I walked in nervous. I walked out with a plan I understood — and skin I actually recognise on my wedding photos.", img: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=400&q=80" },
              { name: "Kabir M.", area: "Gurgaon", quote: "The beard-line laser at Artham is the cleanest, quietest treatment I have had. Private, precise, done in 25 minutes. Booked back.", img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80" },
            ].map((t, i) => (
              <figure key={t.name} className="bg-arabian-white p-8 lg:p-10 reveal" style={{ transitionDelay: `${i * 100}ms` }}>
                <Quote className="text-coronation-gold mb-6" size={28} />
                <blockquote className="fine text-armadillo/85 italic leading-relaxed mb-8">"{t.quote}"</blockquote>
                <figcaption className="flex items-center gap-4">
                  <img src={t.img} alt="" className="w-11 h-11 rounded-full object-cover" loading="lazy" />
                  <div>
                    <div className="font-display text-armadillo">{t.name}</div>
                    <div className="overline text-coronation-gold text-[10px]">{t.area}</div>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* OFFER CTA BAND */}
      <section className="bg-burma-teak text-arabian-white py-20 lg:py-28" data-testid="cta-band">
        <div className="container-editorial text-center max-w-3xl mx-auto reveal">
          <p className="overline text-coronation-gold mb-5">A Slow, Considered Beginning</p>
          <h2 className="font-display text-4xl md:text-5xl mb-6 leading-tight">Begin your journey today.</h2>
          <p className="fine text-arabian-white/85 mb-10">A 15-minute consult with Dr. Omaima is complimentary. Bring your questions.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button data-testid="cta-book-btn" onClick={onOpenBooking} className="btn-primary btn-on-dark">Book Appointment</button>
            <Link to="/contact" data-testid="cta-talk-btn" className="btn-secondary text-arabian-white border-arabian-white/60 hover:bg-arabian-white hover:text-burma-teak">Talk to an Expert</Link>
          </div>
        </div>
      </section>

      {/* FEATURED IN */}
      <section className="bg-arabian-white py-16 border-t border-coronation-gold/25" data-testid="featured-in">
        <p className="overline text-armadillo/60 text-center mb-8">As seen in</p>
        <div className="overflow-hidden">
          <div className="marquee-track animate-marquee">
            {[...Array(2)].flatMap((_, r) => ["VOGUE INDIA", "ELLE", "HARPER'S BAZAAR", "COSMOPOLITAN", "GRAZIA", "FEMINA", "HELLO! INDIA", "MID-DAY"].map((brand, i) => (
              <div key={`${r}-${i}`} className="font-display italic text-2xl md:text-3xl text-armadillo/40 whitespace-nowrap px-12">{brand}</div>
            )))}
          </div>
        </div>
      </section>

      {/* LATEST BLOG */}
      <section className="bg-arabian-white py-24 lg:py-32" data-testid="latest-blog">
        <div className="container-editorial">
          <div className="flex items-end justify-between mb-14 gap-8 flex-wrap reveal">
            <div>
              <p className="overline text-coronation-gold mb-4">Latest from the Journal</p>
              <h2 className="font-display text-4xl md:text-5xl text-armadillo max-w-xl">Considered notes, from the clinic.</h2>
            </div>
            <Link to="/blog" data-testid="home-blog-all" className="link-gold overline">Read all →</Link>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {POSTS.slice(0, 3).map((p, i) => (
              <Link
                key={p.slug}
                data-testid={`home-post-${p.slug}`}
                to={`/blog/${p.slug}`}
                className="group block reveal"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="aspect-[4/3] overflow-hidden mb-5">
                  <img src={p.coverImage} alt={p.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-105" />
                </div>
                <p className="overline text-coronation-gold mb-2">{p.category} · {p.readingTimeMin} min</p>
                <h3 className="font-display text-2xl text-armadillo group-hover:text-burma-teak transition-colors duration-500 leading-tight mb-2">{p.title}</h3>
                <p className="fine text-sm text-armadillo/70 leading-relaxed">{p.excerpt}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
