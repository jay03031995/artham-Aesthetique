import { useState } from "react";
import { Phone, MapPin, Clock, Mail, MessageCircle } from "lucide-react";
import { SITE, whatsAppLink } from "../data/site";
import { api } from "../lib/api";
import { toast } from "sonner";
import Seo from "../lib/seo";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", phone: "", concern: "" });
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone) return toast.error("Please share your name and phone.");
    setBusy(true);
    try {
      await api.post("/callbacks", form);
      toast.success("We'll call you back within business hours.");
      setForm({ name: "", phone: "", concern: "" });
    } catch (e) {
      toast.error("Could not send. Please try WhatsApp.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Seo title="Contact & Visit" description="Visit Artham Aesthetique at Lotus Plaza, Sector 104, Noida. Call +91 98119 97993 or WhatsApp us." />
      <section className="bg-summer-peach pt-40 pb-16 lg:pt-48 lg:pb-24">
        <div className="container-editorial max-w-4xl">
          <p className="overline text-coronation-gold mb-4">Contact</p>
          <h1 className="font-display text-5xl md:text-6xl text-armadillo leading-[1.05] mb-6">Come, sit with us.</h1>
          <p className="fine text-lg text-armadillo/80 max-w-lg">The easiest way is a call or a WhatsApp — we usually reply within a few minutes.</p>
        </div>
      </section>

      <section className="bg-arabian-white py-24">
        <div className="container-editorial grid lg:grid-cols-2 gap-14">
          <div>
            <p className="overline text-coronation-gold mb-6">The Clinic</p>
            <div className="space-y-6">
              <div className="flex gap-4">
                <MapPin className="text-burma-teak shrink-0 mt-1" size={18} />
                <address className="not-italic fine text-armadillo/85 leading-relaxed">
                  {SITE.address.line1}<br />
                  {SITE.address.line2}<br />
                  {SITE.address.line3}
                </address>
              </div>
              <div className="flex gap-4">
                <Phone className="text-burma-teak shrink-0 mt-1" size={18} />
                <a data-testid="contact-phone" href={`tel:${SITE.phoneDigits}`} className="fine text-armadillo/85 link-gold">{SITE.phone}</a>
              </div>
              <div className="flex gap-4">
                <MessageCircle className="text-burma-teak shrink-0 mt-1" size={18} />
                <a data-testid="contact-wa" href={whatsAppLink()} target="_blank" rel="noreferrer" className="fine text-armadillo/85 link-gold">WhatsApp us</a>
              </div>
              <div className="flex gap-4">
                <Clock className="text-burma-teak shrink-0 mt-1" size={18} />
                <span className="fine text-armadillo/85">{SITE.hours}</span>
              </div>
              <div className="flex gap-4">
                <Mail className="text-burma-teak shrink-0 mt-1" size={18} />
                <a href="mailto:hello@arthamaesthetique.com" className="fine text-armadillo/85 link-gold">hello@arthamaesthetique.com</a>
              </div>
            </div>
            <div className="mt-10 aspect-[16/9] w-full overflow-hidden border border-coronation-gold/30">
              <iframe
                title="Map"
                src="https://maps.google.com/maps?q=Sector%20104%20Noida&t=&z=14&ie=UTF8&iwloc=&output=embed"
                className="w-full h-full grayscale-[20%]"
                loading="lazy"
              />
            </div>
          </div>

          <div>
            <p className="overline text-coronation-gold mb-6">Talk to an Expert</p>
            <p className="fine text-armadillo/75 mb-8">Prefer we call you? Share your name and number — we'll reach you within business hours.</p>
            <form onSubmit={submit} className="space-y-6">
              <div>
                <label className="overline text-[10px] text-armadillo/70 mb-1 block">Your name</label>
                <input data-testid="contact-name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="w-full bg-transparent border-b border-armadillo/30 py-2 fine text-armadillo focus:outline-none focus:border-burma-teak" />
              </div>
              <div>
                <label className="overline text-[10px] text-armadillo/70 mb-1 block">Phone (WhatsApp)</label>
                <input data-testid="contact-phone-input" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} className="w-full bg-transparent border-b border-armadillo/30 py-2 fine text-armadillo focus:outline-none focus:border-burma-teak" />
              </div>
              <div>
                <label className="overline text-[10px] text-armadillo/70 mb-1 block">Concern (optional)</label>
                <textarea data-testid="contact-concern" rows={3} value={form.concern} onChange={(e) => setForm((f) => ({ ...f, concern: e.target.value }))} className="w-full bg-transparent border-b border-armadillo/30 py-2 fine text-armadillo focus:outline-none focus:border-burma-teak resize-none" />
              </div>
              <button data-testid="contact-submit" type="submit" disabled={busy} className="btn-primary disabled:opacity-50">
                {busy ? "Sending…" : "Request a Callback"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
