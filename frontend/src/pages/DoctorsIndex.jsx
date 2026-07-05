import { Link } from "react-router-dom";
import Seo from "../lib/seo";

export default function DoctorsIndex() {
  return (
    <>
      <Seo title="Our Doctors" description="Meet the doctors at Artham Aesthetique." />
      <section className="bg-summer-peach pt-40 pb-16 lg:pt-48 lg:pb-24">
        <div className="container-editorial">
          <p className="overline text-coronation-gold mb-4">The Team</p>
          <h1 className="font-display text-5xl md:text-6xl text-armadillo leading-[1.05] mb-6">Our Doctors</h1>
          <p className="fine text-lg text-armadillo/80 max-w-lg">Every consult at Artham is doctor-led. Meet the people who lead the practice.</p>
        </div>
      </section>
      <section className="bg-arabian-white py-24 lg:py-28">
        <div className="container-editorial grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Link data-testid="doctors-omaima" to="/doctors/dr-omaima-jawed" className="group block">
            <div className="aspect-[4/5] overflow-hidden mb-5">
              <img src="https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=1000&q=80" alt="Dr. Omaima Jawed" loading="lazy" className="w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-105" />
            </div>
            <p className="overline text-coronation-gold mb-2">Founder · Dermatologist</p>
            <h3 className="font-display text-2xl text-armadillo group-hover:text-burma-teak transition-colors duration-500">Dr. Omaima Jawed</h3>
            <p className="fine text-sm text-armadillo/70 mt-2">Acne, pigmentation, anti-ageing injectables, lasers and hair restoration.</p>
          </Link>
        </div>
      </section>
    </>
  );
}
