import { Link } from "react-router-dom";
import { useCmsContent } from "../lib/cmsContent";
import Seo from "../lib/seo";
import useReveal from "../hooks/useReveal";

export default function ResultsPage() {
  useReveal();
  const { results } = useCmsContent();

  return (
    <>
      <Seo title="Results" description="Before and after results from Artham Aesthetique." />

      <section className="bg-summer-peach pt-40 pb-16 lg:pt-48 lg:pb-24" data-testid="results-hero">
        <div className="container-editorial">
          <p className="overline text-coronation-gold mb-4">Results</p>
          <h1 className="font-display text-5xl md:text-6xl text-armadillo leading-[1.05] mb-6">Before and after treatments.</h1>
          <p className="fine text-lg text-armadillo/80 max-w-2xl">Browse medicine-led transformations and treatment outcomes from Artham's trusted clinic.</p>
        </div>
      </section>

      <section className="bg-arabian-white py-24">
        <div className="container-editorial grid gap-10 lg:grid-cols-2">
          {(results || []).map((item, index) => (
            <article key={item._id || index} className="group overflow-hidden rounded-3xl border border-[#b8894a]/20 bg-[#FFF8EE] shadow-sm transition-transform duration-300 hover:-translate-y-1">
              <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] p-6 items-start">
                <div className="space-y-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-coronation-gold" style={{ fontFamily: "'Raleway', sans-serif" }}>
                    {item.category || item.treatmentName || "Result"}
                  </p>
                  <h2 className="font-display text-2xl text-armadillo leading-tight">{item.title || item.treatmentName || "Treatment result"}</h2>
                  <dl className="grid gap-2 text-sm text-armadillo/75">
                    {item.treatmentName && (
                      <div className="flex justify-between gap-4">
                        <dt className="font-semibold">Treatment</dt>
                        <dd>{item.treatmentName}</dd>
                      </div>
                    )}
                    {item.patientAge && (
                      <div className="flex justify-between gap-4">
                        <dt className="font-semibold">Age</dt>
                        <dd>{item.patientAge}</dd>
                      </div>
                    )}
                    {item.gender && (
                      <div className="flex justify-between gap-4">
                        <dt className="font-semibold">Gender</dt>
                        <dd>{item.gender}</dd>
                      </div>
                    )}
                    {item.sessionsInfo && (
                      <div className="flex justify-between gap-4">
                        <dt className="font-semibold">Sessions</dt>
                        <dd>{item.sessionsInfo}</dd>
                      </div>
                    )}
                  </dl>
                  {item.note && <p className="fine text-armadillo/80 leading-relaxed">{item.note}</p>}
                  {item.treatmentSlug && (
                    <Link to={`/services/${item.treatmentSlug}`} className="inline-flex items-center gap-2 text-sm font-semibold text-[#7A3E1D] hover:text-[#5C2E15] transition-colors">
                      View treatment
                    </Link>
                  )}
                </div>
               <div className="grid grid-cols-2 gap-3">
  {item.beforeImage && (
    <div className="overflow-hidden rounded-2xl bg-white aspect-[4/5]">
      <img
        src={item.beforeImage}
        alt={`${item.title || "Result"} before`}
        loading="lazy"
        className="w-full h-full object-cover"
      />
    </div>
  )}

  {item.afterImage && (
    <div className="overflow-hidden rounded-2xl bg-white aspect-[4/5]">
      <img
        src={item.afterImage}
        alt={`${item.title || "Result"} after`}
        loading="lazy"
        className="w-full h-full object-cover"
      />
    </div>
  )}
</div>
              </div>
            </article>
          ))}
          {(!results || !results.length) && <p className="fine text-armadillo/60">No results are available right now.</p>}
        </div>
      </section>
    </>
  );
}
