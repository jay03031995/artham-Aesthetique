import Seo from "../lib/seo";
import { useCmsContent } from "../lib/cmsContent";

export default function CareersPage() {
  const { careers } = useCmsContent();
  return (
    <>
      <Seo title={careers?.seo?.title || careers?.heroTitle} description={careers?.seo?.description || careers?.heroDescription} />
      <section className="bg-summer-peach pt-40 pb-16 lg:pt-48 lg:pb-24">
        <div className="container-editorial max-w-3xl">
          {careers?.eyebrow && <p className="overline text-coronation-gold mb-4">{careers.eyebrow}</p>}
          {careers?.heroTitle && <h1 className="font-display text-5xl md:text-6xl text-armadillo leading-[1.05] mb-6">{careers.heroTitle}</h1>}
          {careers?.heroDescription && <p className="fine text-lg text-armadillo/80">{careers.heroDescription}</p>}
        </div>
      </section>
      <section className="bg-arabian-white py-24">
        <div className="container-editorial max-w-3xl">
          <div className="space-y-6 fine text-armadillo/85 leading-[1.9]">
            {(careers?.sections || []).map((section) => (
              <section key={section.heading || section.body}>
                {section.heading && <h2 className="font-display text-2xl text-armadillo mb-3">{section.heading}</h2>}
                {section.body && <p>{section.body}</p>}
              </section>
            ))}
            {careers?.cta?.label && <a href={careers.cta.url || "#"} className="link-gold">{careers.cta.label}</a>}
          </div>
        </div>
      </section>
    </>
  );
}
