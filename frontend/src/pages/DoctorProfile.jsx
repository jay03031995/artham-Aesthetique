import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { useCmsContent } from "../lib/cmsContent";
import Seo from "../lib/seo";
import useReveal from "../hooks/useReveal";

export default function DoctorProfile({ onOpenBooking }) {
  useReveal();
  const { site: SITE, doctors } = useCmsContent();
  const doctor = doctors?.[0] || {};

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Physician",
    name: doctor.name,
    medicalSpecialty: doctor.designation,
    worksFor: { "@type": "MedicalClinic", name: SITE.title },
    telephone: SITE.phone,
    image: doctor.portrait,
  };

  const signatureServices = doctor.signatureServices || [];

  return (
    <>
      <Seo title={doctor.name} description={doctor.bio?.[0]} jsonLd={jsonLd} ogImage={doctor.portrait} />

      {/* HERO */}
      <section className="bg-summer-peach pt-40 pb-16 lg:pt-48 lg:pb-24" data-testid="doctor-hero">
        <div className="container-editorial">
          <nav className="fine text-xs text-armadillo/60 flex items-center gap-2 mb-8" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-burma-teak">{SITE.title}</Link>
            <ChevronRight size={12} />
            <Link to="/doctors" className="hover:text-burma-teak">{doctor.designation}</Link>
            <ChevronRight size={12} />
            <span className="text-armadillo">{doctor.name}</span>
          </nav>
          <div className="grid lg:grid-cols-2 gap-14 items-end">
            <div className="reveal">
              {doctor.designation && <p className="overline text-coronation-gold mb-4">{doctor.designation}</p>}
              <h1 className="font-display text-5xl md:text-6xl text-armadillo leading-[1.02] mb-6">{doctor.name}</h1>
              {doctor.philosophy && <p className="font-display text-xl text-armadillo/70 italic leading-snug mb-8">"{doctor.philosophy}"</p>}
              <div className="flex flex-wrap gap-3">
                {doctor.consultationCta?.label && <button data-testid="dr-book-btn" onClick={onOpenBooking} className="btn-primary">{doctor.consultationCta.label}</button>}
                {SITE.footerCta?.label && <a data-testid="dr-contact-btn" href={SITE.footerCta.url || "/contact"} className="btn-secondary">{SITE.footerCta.label}</a>}
              </div>
            </div>
            <div className="reveal" style={{ transitionDelay: "150ms" }}>
              <div className="bg-[#f5e6d0] rounded-lg overflow-hidden aspect-[4/5] flex items-end justify-center">
                <img
                  src={doctor.portrait || SITE.doctorPortraitUrl}
                  alt={doctor.name || ""}
                  className="w-full h-full object-contain object-bottom"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CREDENTIALS */}
      <section className="bg-arabian-white py-24 lg:py-28" data-testid="doctor-credentials">
        <div className="container-editorial grid lg:grid-cols-3 gap-14">
          <div className="reveal">
            <p className="overline text-coronation-gold mb-4">Education</p>
            <ul className="space-y-3 fine text-armadillo/80">
              {(doctor.education || doctor.qualifications || []).map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
          <div className="reveal" style={{ transitionDelay: "100ms" }}>
            <p className="overline text-coronation-gold mb-4">Memberships</p>
            <ul className="space-y-3 fine text-armadillo/80">
              {(doctor.memberships || []).map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
          <div className="reveal" style={{ transitionDelay: "200ms" }}>
            <p className="overline text-coronation-gold mb-4">Expertise</p>
            <div className="flex flex-wrap gap-2">
              {(doctor.expertise || []).map((c) => (
                <span key={c} className="fine text-xs px-3 py-1 border border-coronation-gold/50 text-armadillo/80">{c}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PHILOSOPHY QUOTE */}
      {doctor.philosophy && <section className="bg-armadillo text-arabian-white py-24 lg:py-28 text-center">
        <div className="container-editorial max-w-3xl mx-auto reveal">
          {doctor.philosophyLabel && <p className="overline text-coronation-gold mb-6">{doctor.philosophyLabel}</p>}
          <blockquote className="font-display italic text-3xl md:text-4xl leading-snug">"{doctor.philosophy}"</blockquote>
        </div>
      </section>}

      {/* SIGNATURE TREATMENTS */}
      {signatureServices.length > 0 && <section className="bg-arabian-white py-24 lg:py-28" data-testid="doctor-signature">
        <div className="container-editorial">
          <div className="max-w-2xl mb-14 reveal">
            {doctor.signatureEyebrow && <p className="overline text-coronation-gold mb-4">{doctor.signatureEyebrow}</p>}
            {doctor.signatureTitle && <h2 className="font-display text-4xl md:text-5xl text-armadillo">{doctor.signatureTitle}</h2>}
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {signatureServices.map((s, i) => (
              <Link
                key={s.slug}
                data-testid={`dr-sig-${s.slug}`}
                to={`/services/${s.slug}`}
                className="group block reveal"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="aspect-[4/3] overflow-hidden mb-4">
                  <img src={s.image} alt={s.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-105" />
                </div>
                <h3 className="font-display text-xl text-armadillo group-hover:text-burma-teak transition-colors duration-500 mb-1">{s.name}</h3>
                <p className="fine text-xs text-armadillo/60">{s.short}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>}

      {/* CTA */}
      {doctor.consultationCta?.label && <section className="bg-burma-teak text-arabian-white py-20 text-center">
        <div className="container-editorial max-w-2xl mx-auto">
          {doctor.ctaTitle && <h2 className="font-display text-4xl mb-6">{doctor.ctaTitle}</h2>}
          {doctor.ctaText && <p className="fine text-arabian-white/85 mb-8">{doctor.ctaText}</p>}
          <button data-testid="dr-cta-book" onClick={onOpenBooking} className="btn-primary btn-on-dark">{doctor.consultationCta.label}</button>
        </div>
      </section>}
    </>
  );
}
