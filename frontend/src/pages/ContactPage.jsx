import { useState } from "react";
import { Phone, MapPin, Clock, Mail, MessageCircle, Navigation } from "lucide-react";
import { useCmsContent, cmsWhatsAppLink } from "../lib/cmsContent";
import { api } from "../lib/api";
import { toast } from "sonner";
import Seo from "../lib/seo";

export default function ContactPage() {
  const { site: SITE, contact } = useCmsContent();
  const [form, setForm] = useState({ name: "", phone: "", concern: "" });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = contact?.nameError || "";
    if (!form.phone.trim()) e.phone = contact?.phoneError || "";
    else if (!/^[0-9+\-\s()]{8,}$/.test(form.phone)) e.phone = contact?.phoneInvalidError || "";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setBusy(true);
    try {
      await api.post("/callbacks", form);
      toast.success(contact?.successMessage || "");
      setForm({ name: "", phone: "", concern: "" });
      setErrors({});
    } catch (e) {
      toast.error(contact?.errorMessage || "");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Seo title={contact?.seo?.title || contact?.seoTitle || contact?.heroTitle} description={contact?.seo?.description || contact?.metaDescription || contact?.heroDescription} ogImage={contact?.heroImageUrl} />

      <section className="bg-[#f5e6d0] pt-16 pb-14 lg:pt-24 lg:pb-20">
        <div className="container-editorial max-w-4xl">
          <p className="overline mb-3">{contact?.eyebrow || "Contact"}</p>
          <h1 className="font-display leading-[1.05] text-[#3D2F23]" style={{ fontSize: "clamp(2.5rem, 5vw, 3.75rem)" }}>{contact?.heroTitle || "Come, sit with us."}</h1>
          <p className="text-body-lg text-[#5C4A38] max-w-xl mt-4">{contact?.heroDescription || "The easiest way is a call or a WhatsApp — we usually reply within a few minutes."}</p>
        </div>
      </section>

      <section className="bg-[#efdfc8] py-16 lg:py-20">
        <div className="container-editorial grid lg:grid-cols-2 gap-12">
          <div>
            {contact?.clinicSectionTitle && <p className="overline mb-5">{contact.clinicSectionTitle}</p>}
            <div className="space-y-5 mb-8">
              <div className="flex gap-4">
                <MapPin className="text-[#7A3E1D] shrink-0 mt-1" size={20} />
                <address className="not-italic text-body">
                  {SITE.address.line1}<br />
                  {SITE.address.line2}<br />
                  {SITE.address.line3}
                </address>
              </div>
              <div className="flex gap-4">
                <Phone className="text-[#7A3E1D] shrink-0 mt-1" size={20} />
                <a data-testid="contact-phone" href={`tel:${SITE.phoneDigits}`} className="text-body link-gold">{SITE.phone}</a>
              </div>
              <div className="flex gap-4">
                <MessageCircle className="text-[#7A3E1D] shrink-0 mt-1" size={20} />
                <a data-testid="contact-wa" href={cmsWhatsAppLink(SITE)} target="_blank" rel="noreferrer" className="text-body link-gold">{contact?.whatsappLabel}</a>
              </div>
              <div className="flex gap-4">
                <Clock className="text-[#7A3E1D] shrink-0 mt-1" size={20} />
                <span className="text-body">{SITE.hours}</span>
              </div>
              <div className="flex gap-4">
                <Mail className="text-[#7A3E1D] shrink-0 mt-1" size={20} />
                <a href={`mailto:${contact?.email || SITE.emails?.[0] || ""}`} className="text-body link-gold">{contact?.email || SITE.emails?.[0]}</a>
              </div>
            </div>

            <a
              data-testid="contact-directions"
              href={contact?.mapsUrl || SITE.googleMaps || "#"}
              target="_blank" rel="noreferrer"
              className="btn-secondary inline-flex items-center gap-2"
            >
              <Navigation size={15} /> {contact?.directionsLabel}
            </a>

            <div className="mt-8 aspect-[16/10] w-full overflow-hidden rounded-lg border border-[#b8894a]/30">
              <iframe
                title={contact?.mapTitle || ""}
                src={contact?.mapEmbed}
                className="w-full h-full"
                loading="lazy"
              />
            </div>
          </div>

          <div>
            {contact?.formEyebrow && <p className="overline mb-5">{contact.formEyebrow}</p>}
            {contact?.formIntro && <p className="text-body text-[#5C4A38] mb-6">{contact.formIntro}</p>}
            <form onSubmit={submit} noValidate className="space-y-5 bg-white p-6 lg:p-8 rounded-lg border border-[#b8894a]/25">
              <div>
                <label htmlFor="c-name" className="form-label">{contact?.nameLabel}</label>
                <input
                  id="c-name"
                  data-testid="contact-name"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="input-box"
                  placeholder={contact?.namePlaceholder || ""}
                />
                {errors.name && <p className="text-[13px] text-[#B12A0F] mt-1">{errors.name}</p>}
              </div>
              <div>
                <label htmlFor="c-phone" className="form-label">{contact?.phoneLabel}</label>
                <input
                  id="c-phone"
                  data-testid="contact-phone-input"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  className="input-box"
                  placeholder={contact?.phonePlaceholder || ""}
                />
                {errors.phone && <p className="text-[13px] text-[#B12A0F] mt-1">{errors.phone}</p>}
              </div>
              <div>
                <label htmlFor="c-concern" className="form-label">{contact?.concernLabel}</label>
                <textarea
                  id="c-concern"
                  data-testid="contact-concern"
                  rows={4}
                  value={form.concern}
                  onChange={(e) => setForm((f) => ({ ...f, concern: e.target.value }))}
                  className="textarea-box"
                  placeholder={contact?.concernPlaceholder || ""}
                />
              </div>
              <button data-testid="contact-submit" type="submit" disabled={busy} className="btn-primary w-full sm:w-auto disabled:opacity-60">
                {busy ? "..." : contact?.submitLabel}
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
