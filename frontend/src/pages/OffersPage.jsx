import { Link } from "react-router-dom";
import Seo from "../lib/seo";
import { useCmsContent } from "../lib/cmsContent";

export default function OffersPage({ onOpenBooking }) {
  const { seo, offers } = useCmsContent();
  return (
    <>
      <Seo title={seo?.offersTitle} description={seo?.offersDescription} />
      <section className="bg-summer-peach pt-40 pb-16 lg:pt-48 lg:pb-24">
        <div className="container-editorial max-w-3xl">
          {seo?.offersEyebrow && <p className="overline text-coronation-gold mb-4">{seo.offersEyebrow}</p>}
          {seo?.offersTitle && <h1 className="font-display text-5xl md:text-6xl text-armadillo leading-[1.05]">{seo.offersTitle}</h1>}
        </div>
      </section>
      <section className="bg-arabian-white py-24">
        <div className="container-editorial grid md:grid-cols-3 gap-6">
          {offers.map((o, i) => (
            <div key={i} className="bg-summer-peach border border-coronation-gold/25 p-8">
              {seo?.offerCardLabel && <p className="overline text-coronation-gold mb-3">{seo.offerCardLabel}</p>}
              <h3 className="font-display text-2xl text-armadillo mb-3">{o.title}</h3>
              <p className="fine text-armadillo/75 leading-relaxed mb-6">{o.blurb}</p>
              {o.terms && <p className="fine text-xs text-armadillo/55 leading-relaxed mb-6">{o.terms}</p>}
              {seo?.offerButtonText && <button data-testid={`offer-cta-${i}`} onClick={onOpenBooking} className="btn-secondary">{seo.offerButtonText}</button>}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
