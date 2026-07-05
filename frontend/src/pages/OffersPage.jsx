import { Link } from "react-router-dom";
import Seo from "../lib/seo";

export default function OffersPage({ onOpenBooking }) {
  const offers = [
    { title: "First Consult", body: "A 15-minute discovery consult with Dr. Omaima Jawed — complimentary.", cta: "Book" },
    { title: "Bridal Runway", body: "6-month bridal programme (skin, hair, body) — with a personalised schedule.", cta: "Enquire" },
    { title: "HydraFacial Series", body: "Book 3, we quietly add the fourth — no small print.", cta: "Book" },
  ];
  return (
    <>
      <Seo title="Offers" description="Considered offers at Artham Aesthetique." />
      <section className="bg-summer-peach pt-40 pb-16 lg:pt-48 lg:pb-24">
        <div className="container-editorial max-w-3xl">
          <p className="overline text-coronation-gold mb-4">Offers</p>
          <h1 className="font-display text-5xl md:text-6xl text-armadillo leading-[1.05]">A few quiet offers, curated.</h1>
        </div>
      </section>
      <section className="bg-arabian-white py-24">
        <div className="container-editorial grid md:grid-cols-3 gap-6">
          {offers.map((o, i) => (
            <div key={i} className="bg-summer-peach border border-coronation-gold/25 p-8">
              <p className="overline text-coronation-gold mb-3">Offer</p>
              <h3 className="font-display text-2xl text-armadillo mb-3">{o.title}</h3>
              <p className="fine text-armadillo/75 leading-relaxed mb-6">{o.body}</p>
              <button data-testid={`offer-cta-${i}`} onClick={onOpenBooking} className="btn-secondary">{o.cta}</button>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
