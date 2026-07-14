import { useParams, Navigate, Link } from "react-router-dom";
import Seo from "../lib/seo";
import { useCmsContent } from "../lib/cmsContent";

export default function PolicyPage() {
  const { slug } = useParams();
  const { policies } = useCmsContent();
  const doc = policies.find((policy) => policy.slug === slug);
  if (!doc) return <Navigate to="/" replace />;

  return (
    <>
      <Seo title={doc.seo?.title || doc.title} description={doc.seo?.description || doc.intro} />
      <section className="bg-summer-peach pt-40 pb-16 lg:pt-48 lg:pb-24">
        <div className="container-editorial max-w-3xl">
          {doc.eyebrow && <p className="overline text-coronation-gold mb-4">{doc.eyebrow}</p>}
          <h1 className="font-display text-5xl md:text-6xl text-armadillo leading-[1.05] mb-6">{doc.title}</h1>
          <p className="fine text-lg text-armadillo/80">{doc.intro}</p>
        </div>
      </section>

      <section className="bg-arabian-white py-24">
        <div className="container-editorial max-w-3xl">
          {doc.sections.map((s, i) => (
            <div key={i} className="mb-10">
              <h2 className="font-display text-2xl text-armadillo mb-3">{s.heading}</h2>
              <p className="fine text-armadillo/80 leading-[1.9]">{s.body}</p>
            </div>
          ))}
          {(doc.updatedText || doc.contactLink?.label) && <p className="fine text-armadillo/60 text-sm mt-10">
            {doc.updatedText}
            {doc.contactLink?.label && <Link className="link-gold ml-1" to={doc.contactLink.url || "/contact"}>{doc.contactLink.label}</Link>}
          </p>}
        </div>
      </section>
    </>
  );
}
