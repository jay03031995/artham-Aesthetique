import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Seo from "../lib/seo";

const GENERAL_FAQS = [
  { q: "How do I book my first appointment?", a: "Tap Book Appointment (top right on desktop, sticky bar on mobile) and follow the 3-step flow. Or WhatsApp us on +91 98119 97993." },
  { q: "Do I need a referral?", a: "No — you can book directly. If you have prior reports or prescriptions, please bring them along." },
  { q: "Is the first consult chargeable?", a: "A 15-minute discovery consult with Dr. Omaima Jawed is complimentary. Detailed treatment consults are billed separately." },
  { q: "Do you have female-only staff?", a: "Yes — for hair removal and body treatments, all technicians are female. The clinic is quiet and private." },
  { q: "What is your cancellation policy?", a: "We ask for 24 hours' notice for cancellation. See /policies/cancellation for details." },
  { q: "Do you offer packages?", a: "We do not sell 'shelf packages'. Every plan is designed after consultation and shared in writing." },
  { q: "Do you accept credit cards / UPI?", a: "Yes — all major cards, UPI, and net banking. GST invoice is available on request." },
  { q: "Can I combine treatments?", a: "Often, yes. What can and cannot be combined is decided at your consult, based on your skin's readiness that day." },
];

export default function FaqPage() {
  const [open, setOpen] = useState(0);
  return (
    <>
      <Seo title="Frequently Asked Questions" description="Answers to the questions we hear most often." />
      <section className="bg-summer-peach pt-40 pb-16 lg:pt-48 lg:pb-24">
        <div className="container-editorial max-w-3xl">
          <p className="overline text-coronation-gold mb-4">FAQs</p>
          <h1 className="font-display text-5xl md:text-6xl text-armadillo leading-[1.05]">Frequently asked, calmly answered.</h1>
        </div>
      </section>

      <section className="bg-arabian-white py-24">
        <div className="container-editorial max-w-3xl">
          <div className="divide-y divide-coronation-gold/30 border-y border-coronation-gold/30">
            {GENERAL_FAQS.map((f, i) => {
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
