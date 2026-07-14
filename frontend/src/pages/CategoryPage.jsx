import { Link, useParams, Navigate } from "react-router-dom";
import { ArrowRight, ChevronRight } from "lucide-react";
import { useCmsContent } from "../lib/cmsContent";
import Seo from "../lib/seo";
import useReveal from "../hooks/useReveal";

export default function CategoryPage({ onOpenBooking }) {
  useReveal();
  const { slug } = useParams();
  const { findCategory } = useCmsContent();
  const cat = findCategory(slug);
  if (!cat) return <Navigate to="/" replace />;

  return (
    <>
      <Seo
        title={`${cat.name} Treatments in Noida`}
        description={cat.intro}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "/" },
            { "@type": "ListItem", position: 2, name: "Treatments", item: "/category/" + cat.slug },
            { "@type": "ListItem", position: 3, name: cat.name, item: "/category/" + cat.slug },
          ],
        }}
      />

      {/* HERO */}
      <section className="relative bg-summer-peach pt-40 pb-20 lg:pt-48 lg:pb-28" data-testid="category-hero">
        <div className="container-editorial">
          <nav className="fine text-xs text-armadillo/60 flex items-center gap-2 mb-8" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-burma-teak">Home</Link>
            <ChevronRight size={12} />
            <span>Treatments</span>
            <ChevronRight size={12} />
            <span className="text-armadillo">{cat.name}</span>
          </nav>
          <div className="grid lg:grid-cols-2 gap-12 items-end">
            <div>
              <p className="overline text-coronation-gold mb-4">{cat.services.length} Treatments</p>
              <h1 className="font-display text-5xl md:text-6xl text-armadillo leading-[1.05] mb-6">{cat.name}</h1>
              <p className="fine text-lg text-armadillo/80 max-w-lg leading-relaxed">{cat.intro}</p>
            </div>
            <div className="aspect-[16/10] overflow-hidden">
              <img src={cat.image} alt={cat.name} loading="lazy" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES GRID */}
      <section className="bg-arabian-white py-24 lg:py-28" data-testid="category-grid">
        <div className="container-editorial">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {cat.services.map((s, i) => (
              <Link
                key={s.slug}
                data-testid={`cat-svc-${s.slug}`}
                to={`/services/${s.slug}`}
                className="group block reveal card-3d rounded-lg overflow-hidden"
                style={{ transitionDelay: `${(i % 6) * 80}ms` }}
              >
                <div className="aspect-[5/4] overflow-hidden">
                  <img src={s.image} alt={s.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-105" />
                </div>
                <div className="p-6">
                  <h3 className="font-display text-xl text-armadillo group-hover:text-burma-teak transition-colors duration-500 mb-2 leading-tight">{s.name}</h3>
                  <p className="fine text-sm text-armadillo/70 leading-relaxed mb-4">{s.short}</p>
                  <span className="text-burma-teak font-semibold text-[13px] flex items-center gap-2">
                    Explore <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform duration-500" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-armadillo text-arabian-white py-20 text-center">
        <div className="container-editorial max-w-2xl mx-auto">
          <p className="overline text-coronation-gold mb-4">Not sure where to begin?</p>
          <h2 className="font-display text-4xl mb-6">Book a 15-minute consult.</h2>
          <p className="fine text-arabian-white/80 mb-8">Dr. Omaima will help you pick the right first step — complimentary, no pressure.</p>
          <button data-testid="category-cta-book" onClick={onOpenBooking} className="btn-primary btn-on-dark">Book Appointment</button>
        </div>
      </section>
    </>
  );
}
