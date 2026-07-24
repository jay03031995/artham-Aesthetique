import { Link } from "react-router-dom";
import { useCmsContent } from "../lib/cmsContent";
import Seo from "../lib/seo";
import useReveal from "../hooks/useReveal";

const hasText = (value) => typeof value === "string" && value.trim().length > 0;

const videoEmbedUrl = (url) => {
  if (!url) return "";
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtube.com")) {
      const id = parsed.searchParams.get("v");
      return id ? `https://www.youtube.com/embed/${id}` : url;
    }
    if (parsed.hostname.includes("youtu.be")) {
      const id = parsed.pathname.replace("/", "");
      return id ? `https://www.youtube.com/embed/${id}` : url;
    }
    if (parsed.hostname.includes("vimeo.com")) {
      const id = parsed.pathname.split("/").filter(Boolean)[0];
      return id ? `https://player.vimeo.com/video/${id}` : url;
    }
    return url;
  } catch (_) {
    return url;
  }
};

const CtaButton = ({ about, onOpenBooking }) => {
  if (!about.ctaLabel) return null;
  if (about.ctaLink) {
    return about.ctaLink.startsWith("/") ? (
      <Link data-testid="about-cta" to={about.ctaLink} className="btn-primary btn-on-dark">
        {about.ctaLabel}
      </Link>
    ) : (
      <a data-testid="about-cta" href={about.ctaLink} target="_blank" rel="noreferrer" className="btn-primary btn-on-dark">
        {about.ctaLabel}
      </a>
    );
  }
  return (
    <button data-testid="about-cta" onClick={onOpenBooking} className="btn-primary btn-on-dark">
      {about.ctaLabel}
    </button>
  );
};

export default function AboutPage({ onOpenBooking }) {
  useReveal();
  const { site: SITE, about: cmsAbout } = useCmsContent();
  const fallbackAbout = {
    title: "Artham Aesthetique",
    eyebrow: "About Clinic",
    heroTitle: "A quieter dermatology clinic in Noida.",
    heroDescription: "Artham Aesthetique is a doctor-led skin, hair and body wellness clinic built around careful consultation, FDA-approved technology and considered treatment plans.",
    heroImage: SITE.clinicPhotoUrl,
    heroImageAlt: "Artham Aesthetique clinic",
    storyEyebrow: "Who We Are",
    storyTitle: "Medical care with restraint, warmth and clarity.",
    storyBody: [
      "Led by Dr. Omaima Jawed, Artham Aesthetique brings medical dermatology and thoughtful aesthetics together under one calm clinical experience.",
      "Every treatment begins with diagnosis and planning. We focus on what your skin, hair and body actually need, then build protocols that are realistic, safe and easy to follow.",
    ],
    mission: "To offer evidence-led dermatology and aesthetics with honest advice, safe technology and care that feels personal from first consult to follow-up.",
    vision: "To become Noida's most trusted destination for refined skin, hair and body wellness, known for clinical rigour and a slower, more human approach.",
    statistics: [
      { value: "10+", label: "Years of Care" },
      { value: "37+", label: "Signature Treatments" },
      { value: "5,000+", label: "Happy Clients" },
      { value: "MD", label: "Dermatologist-led" },
    ],
    clinicHighlights: [
      { title: "FDA-approved Technology", description: "Laser, injectable and regenerative protocols chosen for safety and suitability." },
      { title: "Consultation-first Care", description: "No rushed packages. Treatment plans begin with skin history, diagnosis and goals." },
      { title: "Doctor-led Protocols", description: "Clinical decisions are supervised by Dr. Omaima Jawed and the medical team." },
      { title: "Measured Results", description: "The aim is healthier, calmer skin and natural-looking aesthetic outcomes." },
    ],
    gallery: [
      { url: SITE.clinicPhotoUrl, alt: "Artham Aesthetique clinic interior" },
      { url: SITE.heroImageUrl, alt: "Artham Aesthetique treatment space" },
      { url: SITE.doctorPortraitUrl, alt: "Dr. Omaima Jawed" },
    ],
    ctaTitle: "Come visit us in Noida.",
    ctaText: "A 15-minute discovery consult is complimentary.",
    ctaLabel: "Book Appointment",
  };
  const about = {
    ...fallbackAbout,
    ...(cmsAbout || {}),
    storyBody: cmsAbout?.storyBody?.length ? cmsAbout.storyBody : fallbackAbout.storyBody,
    statistics: cmsAbout?.statistics?.length ? cmsAbout.statistics : fallbackAbout.statistics,
    clinicHighlights: cmsAbout?.clinicHighlights?.length ? cmsAbout.clinicHighlights : fallbackAbout.clinicHighlights,
    gallery: cmsAbout?.gallery?.length ? cmsAbout.gallery : fallbackAbout.gallery,
  };
  const seo = about?.seo || {};
  const hasHeroCopy = hasText(about?.eyebrow) || hasText(about?.heroTitle) || hasText(about?.title) || hasText(about?.heroDescription);
  const hasStory = hasText(about?.storyEyebrow) || hasText(about?.storyTitle) || about?.storyBody?.length || about?.heroImage;
  const hasMissionVision = hasText(about?.mission) || hasText(about?.vision);
  const hasTimeline = about?.timeline?.length > 0;
  const hasHighlights = about?.clinicHighlights?.length > 0;
  const hasStats = about?.statistics?.length > 0;
  const hasGallery = about?.gallery?.length > 0;
  const hasVideo = hasText(about?.videoUrl);
  const embedUrl = videoEmbedUrl(about?.videoUrl);
  const hasCta = hasText(about?.ctaTitle) || hasText(about?.ctaText) || hasText(about?.ctaLabel);

  return (
    <>
      <Seo
        title={seo.title || about?.title}
        description={seo.description}
        canonical={seo.canonicalUrl}
        ogImage={seo.openGraphImage || about?.heroImage}
        keywords={seo.keywords}
        noIndex={seo.noIndex}
        jsonLd={seo.schema}
      />

      {hasHeroCopy && (
        <section id="about-clinic" className="bg-summer-peach pt-40 pb-16 lg:pt-48 lg:pb-24">
          <div className="container-editorial max-w-4xl">
            {about.eyebrow && <p className="overline text-coronation-gold mb-4">{about.eyebrow}</p>}
            {(about.heroTitle || about.title) && (
              <h1 className="font-display text-5xl md:text-6xl text-armadillo leading-[1.05] mb-8">{about.heroTitle || about.title}</h1>
            )}
            {about.heroDescription && <p className="fine text-lg text-armadillo/80 leading-relaxed">{about.heroDescription}</p>}
          </div>
        </section>
      )}

      {hasStory && (
        <section id="who-we-are" className="bg-arabian-white py-24 lg:py-28">
          <div className="container-editorial grid lg:grid-cols-2 gap-14 items-center">
            <div className="reveal">
              {about.storyEyebrow && <p className="overline text-coronation-gold mb-4">{about.storyEyebrow}</p>}
              {about.storyTitle && <h2 className="font-display text-3xl md:text-4xl text-armadillo mb-6">{about.storyTitle}</h2>}
              {about.storyBody?.length > 0 && (
                <div className="fine text-armadillo/80 leading-[1.9] space-y-4">
                  {about.storyBody.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                </div>
              )}
            </div>
            {about.heroImage && (
              <div className="reveal" style={{ transitionDelay: "150ms" }}>
                <img src={about.heroImage} alt={about.heroImageAlt || about.heroTitle || about.title || ""} loading="lazy" className="w-full aspect-[4/5] object-cover rounded-lg" />
              </div>
            )}
          </div>
        </section>
      )}

      {hasMissionVision && (
        <section className="bg-summer-peach py-20 lg:py-24">
          <div className="container-editorial">
            <div className="max-w-2xl mb-10 reveal">
              <p className="overline text-coronation-gold mb-4">Purpose</p>
              <h2 className="font-display text-3xl md:text-4xl text-armadillo">Mission &amp; Vision</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {about.mission && (
                <div className="bg-arabian-white border border-coronation-gold/25 p-8 reveal">
                  <h3 className="font-display text-2xl text-armadillo mb-4">Mission</h3>
                  <p className="fine text-armadillo/80 leading-relaxed">{about.mission}</p>
                </div>
              )}
              {about.vision && (
                <div className="bg-arabian-white border border-coronation-gold/25 p-8 reveal" style={{ transitionDelay: "120ms" }}>
                  <h3 className="font-display text-2xl text-armadillo mb-4">Vision</h3>
                  <p className="fine text-armadillo/80 leading-relaxed">{about.vision}</p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {(hasTimeline || hasHighlights || hasStats) && (
        <section id="technology" className="bg-arabian-white py-24 lg:py-28">
          <div className="container-editorial space-y-16">
            {hasStats && (
              <div className="grid md:grid-cols-4 gap-6">
                {about.statistics.map((item) => (
                  <div key={`${item.label}-${item.value}`} className="border border-coronation-gold/25 p-8 text-center reveal">
                    {item.value && <p className="font-display text-2xl md:text-3xl text-armadillo mb-3">{item.value}</p>}
                    {item.label && <p className="fine text-sm font-medium text-armadillo/75 leading-relaxed">{item.label}</p>}
                  </div>
                ))}
              </div>
            )}

            {hasHighlights && (
              <div>
                <div className="max-w-2xl mb-10 reveal">
                  <p className="overline text-coronation-gold mb-4">Clinic Highlights</p>
                  <h2 className="font-display text-4xl text-armadillo">Our Technology</h2>
                </div>
                <div className="grid md:grid-cols-4 gap-6">
                  {about.clinicHighlights.map((item, index) => (
                    <div key={`${item.title}-${index}`} className="bg-summer-peach border border-coronation-gold/25 p-8 text-center reveal">
                      {item.image && <img src={item.image} alt={item.imageAlt || item.title || ""} loading="lazy" className="h-10 w-10 object-contain mx-auto mb-5" />}
                      {item.title && <p className="font-display text-lg text-armadillo mb-3">{item.title}</p>}
                      {item.description && <p className="fine text-sm text-armadillo/70 leading-relaxed">{item.description}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {hasTimeline && (
              <div>
                <div className="max-w-2xl mb-10 reveal">
                  <p className="overline text-coronation-gold mb-4">Timeline</p>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                  {about.timeline.map((item) => (
                    <div key={`${item.label}-${item.value}`} className="border-l border-coronation-gold/50 pl-6 reveal">
                      {item.label && <p className="fine text-sm font-medium text-coronation-gold mb-2">{item.label}</p>}
                      {item.value && <p className="font-display text-lg md:text-xl text-armadillo leading-snug">{item.value}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {(hasGallery || hasVideo) && (
        <section id="gallery" className="bg-summer-peach py-24">
          <div className="container-editorial">
            {hasVideo && (
              <div className="mb-12 reveal">
                <div className="aspect-video overflow-hidden bg-armadillo/10">
                  <iframe
                    src={embedUrl}
                    title={about.title || "About video"}
                    className="h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              </div>
            )}
            {hasGallery && (
              <div className="max-w-2xl mb-10 reveal">
                <p className="overline text-coronation-gold mb-4">Clinic Gallery</p>
                <h2 className="font-display text-4xl text-armadillo">A calm clinical space for considered care.</h2>
              </div>
            )}
            {hasGallery && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {about.gallery.map((image, index) => (
                  <div key={`${image.url}-${index}`} className="overflow-hidden rounded-lg bg-arabian-white border border-coronation-gold/25">
                    <img src={image.url} alt={image.alt || ""} className="aspect-[4/3] w-full object-cover" loading="lazy" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {hasCta && (
        <section className="bg-burma-teak text-arabian-white py-20 text-center">
          <div className="container-editorial max-w-2xl mx-auto">
            {about.ctaTitle && <h2 className="font-display text-4xl mb-6">{about.ctaTitle}</h2>}
            {about.ctaText && <p className="fine text-arabian-white/85 mb-8">{about.ctaText}</p>}
            <CtaButton about={about} onOpenBooking={onOpenBooking} />
          </div>
        </section>
      )}
    </>
  );
}
