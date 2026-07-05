import { useParams, Navigate, Link } from "react-router-dom";
import Seo from "../lib/seo";

const CONTENT = {
  terms: {
    title: "Terms of Service",
    intro: "By using the Artham Aesthetique website and services, you agree to the following terms.",
    sections: [
      { h: "Use of Site", p: "All content on this website is for general information. It is not a substitute for professional medical advice, diagnosis or treatment. Always consult a qualified physician." },
      { h: "Bookings", p: "Bookings made through the website are provisional and confirmed only after our team responds via WhatsApp or phone." },
      { h: "Intellectual Property", p: "All logos, text, imagery and design elements are the property of Artham Aesthetique unless otherwise stated." },
      { h: "Contact", p: "For queries, write to hello@arthamaesthetique.com or WhatsApp +91 98119 97993." },
    ],
  },
  privacy: {
    title: "Privacy Policy",
    intro: "We take your privacy seriously. This is a plain-language summary of what we collect and why.",
    sections: [
      { h: "What we collect", p: "Name, phone, email and (optionally) notes when you book or subscribe. When you use the chatbot, we store the conversation to improve service quality." },
      { h: "How we use it", p: "Only to respond to your enquiry, confirm bookings, and — with your consent — share occasional newsletter notes." },
      { h: "Sharing", p: "We never sell your data. We share only with clinic staff involved in your care." },
      { h: "Your rights", p: "You can request access, correction or deletion of your data by writing to hello@arthamaesthetique.com." },
    ],
  },
  refund: {
    title: "Refund Policy",
    intro: "We aim to be fair with refunds while respecting the medical nature of our services.",
    sections: [
      { h: "Deposits", p: "Deposits paid to hold specialty slots are refundable up to 48 hours before the appointment." },
      { h: "Completed procedures", p: "Fees for completed procedures are non-refundable, as they cover the physician's time and consumables used." },
      { h: "Pre-paid plans", p: "Unused sessions from pre-paid plans can be refunded pro-rata, minus a small administrative fee." },
    ],
  },
  cancellation: {
    title: "Cancellation Policy",
    intro: "We ask for 24 hours' notice to cancel or reschedule, so we can offer the slot to another patient.",
    sections: [
      { h: "24 hours or more", p: "Free cancellation and reschedule. Deposit fully refunded." },
      { h: "Less than 24 hours", p: "A small fee equal to 25% of the deposit is charged. Rescheduling is free." },
      { h: "No-show", p: "The deposit is retained. We understand emergencies happen — call us and we will use our discretion." },
    ],
  },
};

export default function PolicyPage() {
  const { slug } = useParams();
  const doc = CONTENT[slug];
  if (!doc) return <Navigate to="/" replace />;

  return (
    <>
      <Seo title={doc.title} description={doc.intro} />
      <section className="bg-summer-peach pt-40 pb-16 lg:pt-48 lg:pb-24">
        <div className="container-editorial max-w-3xl">
          <p className="overline text-coronation-gold mb-4">Policies</p>
          <h1 className="font-display text-5xl md:text-6xl text-armadillo leading-[1.05] mb-6">{doc.title}</h1>
          <p className="fine text-lg text-armadillo/80">{doc.intro}</p>
        </div>
      </section>

      <section className="bg-arabian-white py-24">
        <div className="container-editorial max-w-3xl">
          {doc.sections.map((s, i) => (
            <div key={i} className="mb-10">
              <h2 className="font-display text-2xl text-armadillo mb-3">{s.h}</h2>
              <p className="fine text-armadillo/80 leading-[1.9]">{s.p}</p>
            </div>
          ))}
          <p className="fine text-armadillo/60 text-sm mt-10">Last updated: February 2026 · <Link className="link-gold" to="/contact">Contact us</Link> with questions.</p>
        </div>
      </section>
    </>
  );
}
