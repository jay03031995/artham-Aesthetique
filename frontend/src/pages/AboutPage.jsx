import { Link } from "react-router-dom";
import { useCmsContent } from "../lib/cmsContent";
import Seo from "../lib/seo";
import useReveal from "../hooks/useReveal";

export default function AboutPage({ onOpenBooking }) {
  useReveal();
  const { site: SITE, about } = useCmsContent();
  return (
    <>
      <Seo title={about?.seo?.title || about?.seoTitle || about?.heroTitle} description={about?.seo?.description || about?.metaDescription || about?.heroDescription} ogImage={about?.heroImageUrl} />
      <section className="bg-summer-peach pt-40 pb-16 lg:pt-48 lg:pb-24">
        <div className="container-editorial max-w-4xl">
          {about?.eyebrow && <p className="overline text-coronation-gold mb-4">{about.eyebrow}</p>}
          {about?.heroTitle && <h1 className="font-display text-5xl md:text-6xl text-armadillo leading-[1.05] mb-8">{about.heroTitle}</h1>}
          {about?.heroDescription && <p className="fine text-lg text-armadillo/80 leading-relaxed">{about.heroDescription}</p>}
        </div>
      </section>

      <section className="bg-arabian-white py-24 lg:py-28">
        <div className="container-editorial grid lg:grid-cols-2 gap-14 items-center">
          <div className="reveal">
            {about?.storyEyebrow && <p className="overline text-coronation-gold mb-4">{about.storyEyebrow}</p>}
            {about?.storyTitle && <h2 className="font-display text-3xl md:text-4xl text-armadillo mb-6">{about.storyTitle}</h2>}
            <div className="fine text-armadillo/80 leading-[1.9] space-y-4">
              {(about?.storyBody || []).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
          </div>
          <div className="reveal" style={{ transitionDelay: "150ms" }}>
            {(about?.heroImageUrl || SITE.clinicPhotoUrl) && <img src={about?.heroImageUrl || SITE.clinicPhotoUrl} alt={about?.heroTitle || ""} loading="lazy" className="w-full aspect-[4/5] object-cover rounded-lg" />}
          </div>
        </div>
      </section>

      {about?.clinicHighlights?.length > 0 && <section id="certifications" className="bg-summer-peach py-24 lg:py-28">
        <div className="container-editorial">
          <div className="max-w-2xl mb-14 reveal">
            {about?.mission && <p className="overline text-coronation-gold mb-4">{about.mission}</p>}
            {about?.vision && <h2 className="font-display text-4xl text-armadillo">{about.vision}</h2>}
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {about.clinicHighlights.map((c) => (
              <div key={c.title} className="bg-arabian-white border border-coronation-gold/25 p-8 text-center">
                {c.description && <p className="overline text-coronation-gold text-[10px] mb-4">{c.description}</p>}
                <p className="font-display text-lg text-armadillo">{c.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>}

      {about?.galleryUrls?.length > 0 && <section className="bg-arabian-white py-24">
        <div className="container-editorial">
          <div className="flex items-end justify-between mb-10 gap-4 flex-wrap">
            <div>
              {about?.galleryEyebrow && <p className="overline text-coronation-gold mb-3">{about.galleryEyebrow}</p>}
              {about?.galleryTitle && <h2 className="font-display text-3xl md:text-4xl text-armadillo">{about.galleryTitle}</h2>}
            </div>
            {SITE.social.instagram && about?.galleryLinkText && <a data-testid="about-ig-link" href={SITE.social.instagram} target="_blank" rel="noreferrer" className="link-gold overline">{about.galleryLinkText}</a>}
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
            {about.galleryUrls.map((image, i)=>(
              <img key={image.url || i} src={image.url} alt={image.alt || ""} className="aspect-square object-cover" loading="lazy" />
            ))}
          </div>
        </div>
      </section>}

      {(about?.ctaTitle || about?.ctaText) && <section className="bg-burma-teak text-arabian-white py-20 text-center">
        <div className="container-editorial max-w-2xl mx-auto">
          {about?.ctaTitle && <h2 className="font-display text-4xl mb-6">{about.ctaTitle}</h2>}
          {about?.ctaText && <p className="fine text-arabian-white/85 mb-8">{about.ctaText}</p>}
          {about?.ctaButtonText && <button data-testid="about-cta" onClick={onOpenBooking} className="btn-primary btn-on-dark">{about.ctaButtonText}</button>}
        </div>
      </section>}
    </>
  );
}
