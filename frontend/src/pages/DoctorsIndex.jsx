import { Link } from "react-router-dom";
import Seo from "../lib/seo";
import { useCmsContent } from "../lib/cmsContent";

export default function DoctorsIndex() {
  const { doctors, seo } = useCmsContent();
  return (
    <>
      <Seo title={seo?.doctorsTitle} description={seo?.doctorsDescription} />
      <section className="bg-summer-peach pt-40 pb-16 lg:pt-48 lg:pb-24">
        <div className="container-editorial">
          {seo?.doctorsEyebrow && <p className="overline text-coronation-gold mb-4">{seo.doctorsEyebrow}</p>}
          {seo?.doctorsTitle && <h1 className="font-display text-5xl md:text-6xl text-armadillo leading-[1.05] mb-6">{seo.doctorsTitle}</h1>}
          {seo?.doctorsDescription && <p className="fine text-lg text-armadillo/80 max-w-lg">{seo.doctorsDescription}</p>}
        </div>
      </section>
      <section className="bg-arabian-white py-24 lg:py-28">
        <div className="container-editorial grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {doctors.map((doctor) => (
            <Link key={doctor.slug} data-testid={`doctors-${doctor.slug}`} to={`/doctors/${doctor.slug}`} className="group block">
              {doctor.portrait && <div className="aspect-[4/5] overflow-hidden mb-5">
                <img src={doctor.portrait} alt={doctor.name || ""} loading="lazy" className="w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-105" />
              </div>}
              {doctor.designation && <p className="overline text-coronation-gold mb-2">{doctor.designation}</p>}
              <h3 className="font-display text-2xl text-armadillo group-hover:text-burma-teak transition-colors duration-500">{doctor.name}</h3>
              {doctor.bio?.[0] && <p className="fine text-sm text-armadillo/70 mt-2">{doctor.bio[0]}</p>}
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
