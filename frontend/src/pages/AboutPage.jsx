import { Link } from "react-router-dom";
import { useCmsContent } from "../lib/cmsContent";
import Seo from "../lib/seo";
import useReveal from "../hooks/useReveal";

export default function AboutPage({ onOpenBooking }) {
  useReveal();
  const { site: SITE, about } = useCmsContent();
  return (
    <>
      <Seo title={about?.seoTitle || "About Us"} description={about?.metaDescription || "A dr-led clinic in Noida — where medical rigour meets a slower, editorial approach to skin, hair and body."} />
      <section className="bg-summer-peach pt-40 pb-16 lg:pt-48 lg:pb-24">
        <div className="container-editorial max-w-4xl">
          <p className="overline text-coronation-gold mb-4">{about?.eyebrow || "About Artham Aesthetique"}</p>
          <h1 className="font-display text-5xl md:text-6xl text-armadillo leading-[1.05] mb-8">{about?.heroTitle || "A quieter dermatology."}</h1>
          <p className="fine text-lg text-armadillo/80 leading-relaxed">{about?.heroDescription || "Artham Aesthetique is the dermatology and aesthetics vertical of the Artham family of healthcare brands. We began with a simple conviction — that the best clinics do less, but do it beautifully. Every treatment here begins with a consult, not a device."}</p>
        </div>
      </section>

      <section className="bg-arabian-white py-24 lg:py-28">
        <div className="container-editorial grid lg:grid-cols-2 gap-14 items-center">
          <div className="reveal">
            <p className="overline text-coronation-gold mb-4">{about?.storyEyebrow || "Our story"}</p>
            <h2 className="font-display text-3xl md:text-4xl text-armadillo mb-6">{about?.storyTitle || "Built around one consult at a time."}</h2>
            <div className="fine text-armadillo/80 leading-[1.9] space-y-4">
              {(about?.storyBody || [
                "Founded by Dr. Omaima Jawed in 2017, Artham Aesthetique began as a single, quiet room — offering considered dermatology to a small circle of Noida families. Nearly a decade later, the room is a full clinic, but the ethos is unchanged.",
                "We use only FDA-approved devices, single-use consumables and evidence-based protocols. We refuse to sell 'packages' that do not consider your individual skin. And we take our time.",
              ]).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
          </div>
          <div className="reveal" style={{ transitionDelay: "150ms" }}>
            <img src={SITE.clinicPhotoUrl} alt="Artham Aesthetique treatment suite in Noida — warm, editorial interior" loading="lazy" className="w-full aspect-[4/5] object-cover rounded-lg" />
          </div>
        </div>
      </section>

      <section id="certifications" className="bg-summer-peach py-24 lg:py-28">
        <div className="container-editorial">
          <div className="max-w-2xl mb-14 reveal">
            <p className="overline text-coronation-gold mb-4">Certifications & Recognitions</p>
            <h2 className="font-display text-4xl text-armadillo">Recognised for the quiet work.</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {["FDA-approved technology", "ISO-certified clinic", "IADVL Member", "Cosmetic Dermatology Society"].map((c) => (
              <div key={c} className="bg-arabian-white border border-coronation-gold/25 p-8 text-center">
                <p className="overline text-coronation-gold text-[10px] mb-4">Recognition</p>
                <p className="font-display text-lg text-armadillo">{c}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Instagram stub */}
      <section className="bg-arabian-white py-24">
        <div className="container-editorial">
          <div className="flex items-end justify-between mb-10 gap-4 flex-wrap">
            <div>
              <p className="overline text-coronation-gold mb-3">On Instagram</p>
              <h2 className="font-display text-3xl md:text-4xl text-armadillo">@artham.aesthetique</h2>
            </div>
            <a data-testid="about-ig-link" href={SITE.social.instagram} target="_blank" rel="noreferrer" className="link-gold overline">Follow →</a>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
            {["https://images.unsplash.com/photo-1512290923902-8a9f81dc236c","https://images.unsplash.com/photo-1522337660859-02fbefca4702","https://images.unsplash.com/photo-1570172619644-dfd03ed5d881","https://images.unsplash.com/photo-1585951237318-9ea5e175b891","https://images.unsplash.com/photo-1676302144341-10563603f99a","https://images.unsplash.com/photo-1512290746430-3ea326d9f5c8"].map((u,i)=>(
              <img key={i} src={`${u}?auto=format&fit=crop&w=500&q=70`} alt="" className="aspect-square object-cover" loading="lazy" />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-burma-teak text-arabian-white py-20 text-center">
        <div className="container-editorial max-w-2xl mx-auto">
          <h2 className="font-display text-4xl mb-6">Come visit us in Noida.</h2>
          <p className="fine text-arabian-white/85 mb-8">A 15-minute consult is complimentary.</p>
          <button data-testid="about-cta" onClick={onOpenBooking} className="btn-primary btn-on-dark">Book Appointment</button>
        </div>
      </section>
    </>
  );
}
