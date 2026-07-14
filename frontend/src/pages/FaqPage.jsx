import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Seo from "../lib/seo";
import { useCmsContent } from "../lib/cmsContent";

export default function FaqPage() {
  const [open, setOpen] = useState(0);
  const { seo, faqs } = useCmsContent();
  return (
    <>
      <Seo title={seo?.faqTitle} description={seo?.faqDescription} />
      <section className="bg-summer-peach pt-40 pb-16 lg:pt-48 lg:pb-24">
        <div className="container-editorial max-w-3xl">
          {seo?.faqEyebrow && <p className="overline text-coronation-gold mb-4">{seo.faqEyebrow}</p>}
          {seo?.faqTitle && <h1 className="font-display text-5xl md:text-6xl text-armadillo leading-[1.05]">{seo.faqTitle}</h1>}
        </div>
      </section>

      <section className="bg-arabian-white py-24">
        <div className="container-editorial max-w-3xl">
          <div className="divide-y divide-coronation-gold/30 border-y border-coronation-gold/30">
            {faqs.map((f, i) => {
              const isOpen = open === i;
              return (
                <div key={i}>
                  <button
                    data-testid={`faq-q-${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="w-full flex items-center justify-between py-6 text-left"
                  >
                    <span className="font-display text-lg text-armadillo pr-6">{f.q}</span>
                    <ChevronDown size={18} className={`text-burma-teak transition-transform duration-500 ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                  <div className={`grid transition-all duration-500 ${isOpen ? "grid-rows-[1fr] pb-6" : "grid-rows-[0fr]"}`}>
                    <div className="overflow-hidden">
                      <p className="fine text-armadillo/75 leading-relaxed">{f.a}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
