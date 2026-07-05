import { useEffect, useMemo, useState } from "react";
import { X, Search, ChevronLeft, Check } from "lucide-react";
import { CATEGORIES, ALL_SERVICES, findService } from "../../data/treatments";
import { api } from "../../lib/api";
import { SITE, whatsAppLink } from "../../data/site";
import { toast } from "sonner";

const timeSlots = [
  "10:00", "10:45", "11:30", "12:15",
  "14:00", "14:45", "15:30", "16:15",
  "17:00", "17:45", "18:30", "19:15",
];

const nextDates = () => {
  const arr = [];
  const today = new Date();
  let d = new Date(today);
  d.setDate(d.getDate() + 1);
  while (arr.length < 14) {
    if (d.getDay() !== 0) {
      arr.push(new Date(d));
    }
    d.setDate(d.getDate() + 1);
  }
  return arr;
};

const fmtDate = (d) => d.toISOString().slice(0, 10);
const displayDate = (d) => d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });

export default function BookingFlow({ open, onClose, initialSlug }) {
  const [step, setStep] = useState(1);
  const [query, setQuery] = useState("");
  const [treatmentSlug, setTreatmentSlug] = useState(initialSlug || "");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [form, setForm] = useState({ name: "", phone: "", email: "", note: "" });
  const [submitting, setSubmitting] = useState(false);
  const [confirmedId, setConfirmedId] = useState(null);
  const dates = useMemo(nextDates, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      if (initialSlug) {
        setTreatmentSlug(initialSlug);
        setStep(2);
      }
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open, initialSlug]);

  const treatment = findService(treatmentSlug);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;
    return ALL_SERVICES.filter((s) => s.name.toLowerCase().includes(q));
  }, [query]);

  const goNext = () => setStep((s) => Math.min(3, s + 1));
  const goBack = () => setStep((s) => Math.max(1, s - 1));

  const submit = async () => {
    if (!treatment || !date || !time || !form.name || !form.phone) {
      toast.error("Please fill in your name, phone, date and time.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await api.post("/bookings", {
        treatment_slug: treatment.slug,
        treatment_name: treatment.name,
        category: treatment.category,
        date, time_slot: time,
        name: form.name, phone: form.phone,
        email: form.email || null, note: form.note || null,
      });
      setConfirmedId(res.data.id);
      toast.success("Booking received. We'll confirm on WhatsApp shortly.");
    } catch (e) {
      toast.error("Could not save booking. Please WhatsApp us.");
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setStep(1); setTreatmentSlug(""); setDate(""); setTime("");
    setForm({ name: "", phone: "", email: "", note: "" });
    setConfirmedId(null); setQuery("");
  };

  const close = () => { onClose(); setTimeout(reset, 400); };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-armadillo/60 backdrop-blur-sm flex items-end lg:items-center justify-center" data-testid="booking-modal">
      <div className="w-full max-w-3xl bg-arabian-white max-h-[92vh] overflow-y-auto animate-fade-up">
        {/* header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-coronation-gold/30">
          <div className="flex items-center gap-4">
            {step > 1 && !confirmedId && (
              <button data-testid="booking-back" onClick={goBack} className="text-armadillo hover:text-burma-teak transition-colors" aria-label="Back">
                <ChevronLeft size={18} />
              </button>
            )}
            <div>
              <p className="overline text-coronation-gold text-[10px]">Book Appointment</p>
              <h3 className="font-display text-xl text-armadillo leading-tight">
                {confirmedId ? "You're booked" : step === 1 ? "Choose your treatment" : step === 2 ? "Pick a date & time" : "Your details"}
              </h3>
            </div>
          </div>
          <button data-testid="booking-close" onClick={close} className="text-armadillo hover:text-burma-teak transition-colors" aria-label="Close">
            <X size={22} />
          </button>
        </div>

        {/* progress */}
        {!confirmedId && (
          <div className="flex items-center gap-2 px-6 py-4 border-b border-coronation-gold/20">
            {[1, 2, 3].map((n) => (
              <div key={n} className="flex-1 flex items-center gap-2">
                <span className={`overline text-[10px] ${step >= n ? "text-coronation-gold" : "text-armadillo/40"}`}>Step {n}</span>
                <div className={`flex-1 h-px ${step > n ? "bg-coronation-gold" : "bg-coronation-gold/25"}`} />
              </div>
            ))}
          </div>
        )}

        {/* content */}
        <div className="p-6 lg:p-8">
          {confirmedId ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-coronation-gold/20 flex items-center justify-center mx-auto mb-6">
                <Check className="text-coronation-gold" size={28} />
              </div>
              <h4 className="font-display text-3xl text-armadillo mb-3">Thank you, {form.name.split(" ")[0]}.</h4>
              <p className="fine text-armadillo/75 max-w-lg mx-auto mb-2">
                We've received your request for <strong>{treatment.name}</strong> with Dr. Omaima Jawed on <strong>{displayDate(new Date(date))}</strong> at <strong>{time}</strong>.
              </p>
              <p className="fine text-armadillo/75 max-w-lg mx-auto mb-8">
                Our team will confirm the slot on WhatsApp within 30 minutes.
              </p>
              <p className="overline text-[10px] text-armadillo/50 mb-6">Reference · {confirmedId.slice(0, 8).toUpperCase()}</p>
              <div className="flex flex-wrap gap-3 justify-center">
                <a
                  data-testid="booking-wa-confirm"
                  href={whatsAppLink(`Hello Artham! I just booked ${treatment.name} for ${displayDate(new Date(date))} at ${time}. Reference: ${confirmedId.slice(0,8).toUpperCase()}`)}
                  target="_blank" rel="noreferrer"
                  className="btn-primary"
                >WhatsApp us</a>
                <button data-testid="booking-close-confirm" onClick={close} className="btn-secondary">Close</button>
              </div>
            </div>
          ) : step === 1 ? (
            <>
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-armadillo/40" size={16} />
                <input
                  data-testid="booking-search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search treatments — e.g. HydraFacial, PRP, laser…"
                  className="w-full pl-10 pr-4 py-3 bg-summer-peach border border-coronation-gold/30 focus:border-burma-teak fine text-sm text-armadillo placeholder:text-armadillo/40 outline-none transition-all duration-500"
                />
              </div>

              {filtered ? (
                <div className="space-y-2 max-h-[45vh] overflow-y-auto">
                  {filtered.map((s) => (
                    <button
                      key={s.slug}
                      data-testid={`booking-svc-${s.slug}`}
                      onClick={() => { setTreatmentSlug(s.slug); goNext(); }}
                      className={`w-full text-left px-4 py-3 border transition-all duration-500 ${treatmentSlug === s.slug ? "border-burma-teak bg-summer-peach" : "border-coronation-gold/25 hover:border-burma-teak"}`}
                    >
                      <p className="font-display text-lg text-armadillo">{s.name}</p>
                      <p className="fine text-xs text-armadillo/60">{s.category} · {s.short}</p>
                    </button>
                  ))}
                  {filtered.length === 0 && <p className="fine text-sm text-armadillo/60 text-center py-6">Nothing matched. Try a different word.</p>}
                </div>
              ) : (
                <div className="space-y-6 max-h-[45vh] overflow-y-auto">
                  {CATEGORIES.map((cat) => (
                    <div key={cat.slug}>
                      <p className="overline text-coronation-gold mb-3">{cat.name}</p>
                      <div className="grid grid-cols-2 gap-2">
                        {cat.services.map((s) => (
                          <button
                            key={s.slug}
                            data-testid={`booking-svc-${s.slug}`}
                            onClick={() => { setTreatmentSlug(s.slug); goNext(); }}
                            className={`px-3 py-2.5 text-left border transition-all duration-500 fine text-sm ${treatmentSlug === s.slug ? "border-burma-teak bg-summer-peach text-armadillo" : "border-coronation-gold/25 text-armadillo/80 hover:border-burma-teak hover:text-armadillo"}`}
                          >
                            {s.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : step === 2 ? (
            <>
              <div className="bg-summer-peach border border-coronation-gold/25 px-4 py-3 mb-6">
                <p className="overline text-[10px] text-coronation-gold">Treatment</p>
                <p className="font-display text-armadillo text-lg">{treatment?.name}</p>
                <p className="fine text-xs text-armadillo/60">With Dr. Omaima Jawed</p>
              </div>

              <p className="overline text-coronation-gold mb-3">Choose a date</p>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 mb-6">
                {dates.map((d) => {
                  const ds = fmtDate(d);
                  const active = date === ds;
                  return (
                    <button
                      key={ds}
                      data-testid={`booking-date-${ds}`}
                      onClick={() => setDate(ds)}
                      className={`p-3 text-center border transition-all duration-500 ${active ? "border-burma-teak bg-burma-teak text-arabian-white" : "border-coronation-gold/30 text-armadillo hover:border-burma-teak"}`}
                    >
                      <p className="overline text-[9px]">{d.toLocaleDateString("en-IN", { weekday: "short" })}</p>
                      <p className="font-display text-lg leading-tight">{d.getDate()}</p>
                      <p className="fine text-[10px]">{d.toLocaleDateString("en-IN", { month: "short" })}</p>
                    </button>
                  );
                })}
              </div>

              <p className="overline text-coronation-gold mb-3">Choose a time</p>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-8">
                {timeSlots.map((t) => (
                  <button
                    key={t}
                    data-testid={`booking-time-${t}`}
                    onClick={() => setTime(t)}
                    className={`py-2.5 fine text-sm border transition-all duration-500 ${time === t ? "border-burma-teak bg-burma-teak text-arabian-white" : "border-coronation-gold/30 text-armadillo hover:border-burma-teak"}`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <div className="flex justify-end">
                <button
                  data-testid="booking-next-2"
                  disabled={!date || !time}
                  onClick={goNext}
                  className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
                >Continue</button>
              </div>
            </>
          ) : (
            <>
              <div className="bg-summer-peach border border-coronation-gold/25 px-4 py-3 mb-6">
                <p className="overline text-[10px] text-coronation-gold">Summary</p>
                <p className="font-display text-armadillo text-lg">{treatment?.name}</p>
                <p className="fine text-xs text-armadillo/70">{displayDate(new Date(date))} · {time} · Dr. Omaima Jawed</p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="overline text-[10px] text-armadillo/70 mb-1 block">Full name</label>
                  <input data-testid="booking-name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="w-full bg-transparent border-b border-armadillo/30 py-2 fine text-armadillo focus:outline-none focus:border-burma-teak" />
                </div>
                <div>
                  <label className="overline text-[10px] text-armadillo/70 mb-1 block">Phone (WhatsApp)</label>
                  <input data-testid="booking-phone" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} className="w-full bg-transparent border-b border-armadillo/30 py-2 fine text-armadillo focus:outline-none focus:border-burma-teak" />
                </div>
                <div>
                  <label className="overline text-[10px] text-armadillo/70 mb-1 block">Email (optional)</label>
                  <input data-testid="booking-email" type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className="w-full bg-transparent border-b border-armadillo/30 py-2 fine text-armadillo focus:outline-none focus:border-burma-teak" />
                </div>
                <div className="sm:col-span-2">
                  <label className="overline text-[10px] text-armadillo/70 mb-1 block">Note (optional)</label>
                  <textarea data-testid="booking-note" rows={2} value={form.note} onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))} className="w-full bg-transparent border-b border-armadillo/30 py-2 fine text-armadillo focus:outline-none focus:border-burma-teak resize-none" />
                </div>
              </div>

              <p className="fine text-xs text-armadillo/60 mb-6">By booking, you agree to our cancellation policy. We'll confirm on WhatsApp within 30 minutes.</p>

              <div className="flex justify-end">
                <button data-testid="booking-submit" onClick={submit} disabled={submitting} className="btn-primary disabled:opacity-50">
                  {submitting ? "Sending…" : "Confirm Booking"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
