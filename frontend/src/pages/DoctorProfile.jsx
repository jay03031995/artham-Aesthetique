import { Link, Navigate, useParams } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { useCmsContent } from "../lib/cmsContent";
import Seo from "../lib/seo";
import useReveal from "../hooks/useReveal";

const cleanList = (items) => (Array.isArray(items) ? items : items ? [items] : []).filter(Boolean);
const firstText = (items = []) => cleanList(items)[0] || "";

function TextList({ items }) {
  const list = cleanList(items);
  if (!list.length) return null;
  return (
    <ul className="space-y-3 fine text-armadillo/80 leading-relaxed">
      {list.map((item) => <li key={item}>{item}</li>)}
    </ul>
  );
}

function ChipList({ items }) {
  const list = cleanList(items);
  if (!list.length) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {list.map((item) => (
        <span key={item} className="fine text-xs px-3 py-1 border border-coronation-gold/50 text-armadillo/80">
          {item}
        </span>
      ))}
    </div>
  );
}

function InfoBlock({ eyebrow, title, children, delay = "0ms" }) {
  if (!children) return null;
  return (
    <section className="reveal" style={{ transitionDelay: delay }}>
      <p className="overline text-coronation-gold mb-4">{eyebrow}</p>
      {title && <h2 className="font-display text-3xl md:text-4xl text-armadillo mb-6">{title}</h2>}
      {children}
    </section>
  );
}

export default function DoctorProfile({ onOpenBooking }) {
  useReveal();
  const { slug } = useParams();
  const { site: SITE, doctors } = useCmsContent();
  const doctor = doctors?.find((item) => item.slug === slug) || doctors?.[0];

  if (!doctor) return <Navigate to="/doctors" replace />;

  const bio = cleanList(doctor.bio);
  const qualifications = cleanList(doctor.qualifications);
  const education = cleanList(doctor.education);
  const memberships = cleanList(doctor.memberships);
  const expertise = cleanList(doctor.expertise);
  const achievements = cleanList(doctor.achievements);
  const languages = cleanList(doctor.languages);
  const signatureServices = cleanList(doctor.signatureServices);
  const primaryTitle = doctor.designation || doctor.title;
  const secondaryTitle = doctor.designation && doctor.title ? doctor.title : "";
  const seoDescription = firstText(bio) || doctor.philosophy || primaryTitle || doctor.name;
  const cta = doctor.consultationCta || {};

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Physician",
    name: doctor.name,
    jobTitle: primaryTitle,
    description: seoDescription,
    image: doctor.portrait,
    telephone: SITE.phone,
    worksFor: { "@type": "MedicalClinic", name: SITE.name || "Artham Aesthetique" },
    knowsLanguage: languages,
    alumniOf: education,
  };

  return (
    <>
      <Seo title={`${doctor.name}${primaryTitle ? ` — ${primaryTitle}` : ""}`} description={seoDescription} jsonLd={jsonLd} />

      <section className="bg-summer-peach pt-40 pb-14 lg:pt-48 lg:pb-24" data-testid="doctor-hero">
        <div className="container-editorial">
          <nav className="fine text-xs text-armadillo/60 flex items-center gap-2 mb-8" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-burma-teak">Home</Link>
            <ChevronRight size={12} />
            <Link to="/doctors" className="hover:text-burma-teak">Doctors</Link>
            <ChevronRight size={12} />
            <span className="text-armadillo">{doctor.name}</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <div className="reveal">
              {primaryTitle && <p className="overline text-coronation-gold mb-4">{primaryTitle}</p>}
              <h1 className="font-display text-5xl md:text-6xl text-armadillo leading-[1.02] mb-5">{doctor.name}</h1>
              {secondaryTitle && <p className="fine text-lg text-armadillo/75 mb-5">{secondaryTitle}</p>}
              {qualifications.length > 0 && (
                <p className="fine text-sm uppercase tracking-[0.12em] text-armadillo/60 mb-6">{qualifications.join(" · ")}</p>
              )}
              {bio.length > 0 && <p className="fine text-lg text-armadillo/80 leading-relaxed mb-8">{bio[0]}</p>}
              <div className="flex flex-wrap gap-3">
                <button data-testid="dr-book-btn" onClick={onOpenBooking} className="btn-primary">
                  {cta.label || "Book Consultation"}
                </button>
                {cta.url && (
                  cta.url.startsWith("/") ? (
                    <Link to={cta.url} className="btn-secondary">Learn More</Link>
                  ) : (
                    <a href={cta.url} target="_blank" rel="noreferrer" className="btn-secondary">Learn More</a>
                  )
                )}
              </div>
            </div>

            {doctor.portrait && (
              <div className="reveal" style={{ transitionDelay: "150ms" }}>
                <div className="bg-[#f5e6d0] rounded-lg overflow-hidden">
                  <img
                    src={doctor.portrait}
                    alt={`${doctor.name} portrait`}
                    className="w-full h-full object-contain object-bottom"
                    loading="lazy"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="bg-arabian-white py-24 lg:py-28" data-testid="doctor-profile-content">
        <div className="container-editorial space-y-20">
          <div className="grid lg:grid-cols-3 gap-12">
            {doctor.experience && (
              <InfoBlock eyebrow="Experience" title={doctor.experience}>
                {languages.length > 0 && (
                  <p className="fine text-armadillo/70 leading-relaxed">Languages: {languages.join(", ")}</p>
                )}
              </InfoBlock>
            )}
            {expertise.length > 0 && (
              <InfoBlock eyebrow="Expertise" title="Clinical Focus" delay="100ms">
                <ChipList items={expertise} />
              </InfoBlock>
            )}
            {achievements.length > 0 && (
              <InfoBlock eyebrow="Achievements" title="Recognition" delay="200ms">
                <TextList items={achievements} />
              </InfoBlock>
            )}
          </div>

          {bio.length > 1 && (
            <InfoBlock eyebrow="Bio" title="Approach and Background">
              <div className="max-w-3xl space-y-5">
                {bio.slice(1).map((paragraph) => (
                  <p key={paragraph} className="fine text-armadillo/80 leading-[1.9]">{paragraph}</p>
                ))}
              </div>
            </InfoBlock>
          )}

          <div className="grid lg:grid-cols-2 gap-14">
            {education.length > 0 && (
              <InfoBlock eyebrow="Education" title="Training">
                <TextList items={education} />
              </InfoBlock>
            )}
            {memberships.length > 0 && (
              <InfoBlock eyebrow="Memberships" title="Associations" delay="100ms">
                <TextList items={memberships} />
              </InfoBlock>
            )}
          </div>
        </div>
      </section>

      {doctor.philosophy && (
        <section className="bg-armadillo text-arabian-white py-24 lg:py-28 text-center">
          <div className="container-editorial max-w-3xl mx-auto reveal">
            <p className="overline text-coronation-gold mb-6">Philosophy</p>
            <blockquote className="font-display italic text-3xl md:text-4xl leading-snug">"{doctor.philosophy}"</blockquote>
          </div>
        </section>
      )}

      {signatureServices.length > 0 && (
        <section className="bg-arabian-white py-24 lg:py-28" data-testid="doctor-signature">
          <div className="container-editorial">
            <div className="max-w-2xl mb-14 reveal">
              <p className="overline text-coronation-gold mb-4">Signature Treatments</p>
              <h2 className="font-display text-4xl md:text-5xl text-armadillo">Recommended treatments with {doctor.name}.</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {signatureServices.map((service, index) => (
                <Link
                  key={service.slug}
                  data-testid={`dr-sig-${service.slug}`}
                  to={`/services/${service.slug}`}
                  className="group block reveal"
                  style={{ transitionDelay: `${index * 80}ms` }}
                >
                  {service.image && (
                    <div className="aspect-[4/3] overflow-hidden mb-4">
                      <img src={service.image} alt={service.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-105" />
                    </div>
                  )}
                  <h3 className="font-display text-xl text-armadillo group-hover:text-burma-teak transition-colors duration-500 mb-1">{service.name}</h3>
                  {service.short && <p className="fine text-xs text-armadillo/60">{service.short}</p>}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-burma-teak text-arabian-white py-20 text-center">
        <div className="container-editorial max-w-2xl mx-auto">
          <h2 className="font-display text-4xl mb-6">{cta.label || "Book Consultation"}</h2>
          {doctor.name && <p className="fine text-arabian-white/85 mb-8">Schedule a consultation with {doctor.name}.</p>}
          <button data-testid="dr-cta-book" onClick={onOpenBooking} className="btn-primary btn-on-dark">
            {cta.label || "Book Consultation"}
          </button>
        </div>
      </section>
    </>
  );
}
