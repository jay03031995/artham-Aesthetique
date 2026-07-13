import { useState } from "react";
import { Link } from "react-router-dom";
import { Instagram, Facebook, Linkedin, Youtube, MessageCircle } from "lucide-react";
import { useCmsContent } from "../../lib/cmsContent";
import { api } from "../../lib/api";
import { toast } from "sonner";

const XIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export default function Footer() {
  const { site: SITE, categories: CATEGORIES, footer } = useCmsContent();
  const [email, setEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);

  const subscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribing(true);
    try {
      await api.post("/newsletter", { email });
      toast.success("You're on the list. Small, considered notes only.");
      setEmail("");
    } catch (err) {
      toast.error("Could not subscribe. Please try again.");
    } finally {
      setSubscribing(false);
    }
  };

  const socialIcons = [
    { key: "instagram", href: SITE.social.instagram, Icon: Instagram },
    { key: "facebook", href: SITE.social.facebook, Icon: Facebook },
    { key: "x", href: SITE.social.x, Icon: XIcon },
    { key: "linkedin", href: SITE.social.linkedin, Icon: Linkedin },
    { key: "youtube", href: SITE.social.youtube, Icon: Youtube },
    { key: "whatsapp", href: SITE.social.whatsapp, Icon: MessageCircle },
  ];

  return (
    <footer className="bg-armadillo text-arabian-white" data-testid="site-footer">
      <div className="container-editorial py-20 lg:py-28">
        <div className="grid grid-cols-2 md:grid-cols-6 lg:grid-cols-12 gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-6 lg:col-span-4">
            <div className="flex items-center gap-3 mb-6">
              <img src={SITE.footerLogoUrl} alt="Artham Aesthetique lotus" className="h-14 w-14 object-contain rounded-md" />
              <div>
                <div className="font-display text-xl text-[#FFF7EC]">Artham</div>
                <div className="text-[10px] uppercase tracking-[0.18em] font-semibold text-[#b8894a]">Aesthetique</div>
              </div>
            </div>
            <p className="fine text-arabian-white/70 text-sm max-w-sm leading-relaxed">
              {footer?.brandText || "A dr-led clinic in Noida — where medical rigour meets a slower, editorial approach to skin, hair and body."}
            </p>
            <div className="flex items-center gap-4 mt-8">
              {socialIcons.map(({ key, href, Icon }) => (
                <a
                  key={key}
                  data-testid={`footer-social-${key}`}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-full border border-arabian-white/25 flex items-center justify-center hover:bg-coronation-gold hover:border-coronation-gold hover:text-armadillo transition-all duration-500"
                  aria-label={key}
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Treatments */}
          <div className="col-span-1 md:col-span-3 lg:col-span-2">
            <h5 className="text-[13px] font-semibold text-[#FFF7EC] mb-5" style={{ fontFamily: "'Raleway', sans-serif", letterSpacing: 0 }}>Treatments</h5>
            <ul className="space-y-3 fine text-sm text-arabian-white/75">
              {CATEGORIES.map((c) => (
                <li key={c.slug}>
                  <Link data-testid={`footer-cat-${c.slug}`} to={`/category/${c.slug}`} className="hover:text-coronation-gold transition-colors duration-500">{c.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="col-span-1 md:col-span-3 lg:col-span-2">
            <h5 className="text-[13px] font-semibold text-[#FFF7EC] mb-5" style={{ fontFamily: "'Raleway', sans-serif", letterSpacing: 0 }}>Company</h5>
            <ul className="space-y-3 fine text-sm text-arabian-white/75">
              {(footer?.quickLinks || [
                { label: "About", href: "/about" },
                { label: "Dr. Omaima Jawed", href: "/doctors/dr-omaima-jawed" },
                { label: "Journal", href: "/blog" },
                { label: "Careers", href: "/careers" },
                { label: "Contact", href: "/contact" },
              ]).map((link) => (
                <li key={link.label}>
                  <Link data-testid={`footer-${link.label.toLowerCase().replace(/\s+/g, "-")}`} to={link.href || link.url || "#"} className="hover:text-coronation-gold transition-colors duration-500">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support / Policies */}
          <div className="col-span-1 md:col-span-3 lg:col-span-2">
            <h5 className="text-[13px] font-semibold text-[#FFF7EC] mb-5" style={{ fontFamily: "'Raleway', sans-serif", letterSpacing: 0 }}>Support</h5>
            <ul className="space-y-3 fine text-sm text-arabian-white/75">
              {(footer?.legalLinks || [
                { label: "FAQs", href: "/faq" },
                { label: "Book Appointment", href: "/book" },
                { label: "Offers", href: "/offers" },
                { label: "Terms", href: "/policies/terms" },
                { label: "Privacy", href: "/policies/privacy" },
                { label: "Refund", href: "/policies/refund" },
                { label: "Cancellation", href: "/policies/cancellation" },
              ]).map((link, index) => (
                <li key={link.label} className={index === 3 ? "pt-4" : ""}>
                  <Link to={link.href || link.url || "#"} className="hover:text-coronation-gold transition-colors duration-500">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & newsletter */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <h5 className="text-[13px] font-semibold text-[#FFF7EC] mb-5" style={{ fontFamily: "'Raleway', sans-serif", letterSpacing: 0 }}>Visit</h5>
            <address className="not-italic fine text-sm text-arabian-white/75 leading-relaxed mb-5">
              {SITE.address.line1}<br />
              {SITE.address.line2}<br />
              {SITE.address.line3}<br />
              <a href={`tel:${SITE.phoneDigits}`} className="hover:text-coronation-gold">{SITE.phone}</a><br />
              <span className="text-arabian-white/50">{SITE.hours}</span>
            </address>
            <a
              data-testid="footer-map"
              href="https://maps.google.com/?q=Lotus+Plaza+Sector+104+Noida"
              target="_blank"
              rel="noreferrer"
              className="text-[13px] font-semibold text-[#F5D89C] hover:text-[#FFF7EC] transition-colors duration-500"
              style={{ fontFamily: "'Raleway', sans-serif", letterSpacing: 0 }}
            >
              Open in Maps →
            </a>

            <form onSubmit={subscribe} className="mt-8 border-t border-arabian-white/15 pt-6">
              <label className="text-[13px] font-semibold text-[#FFF7EC] block mb-3" style={{ fontFamily: "'Raleway', sans-serif", letterSpacing: 0 }}>Newsletter</label>
              <div className="flex">
                <input
                  data-testid="footer-newsletter-input"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  className="flex-1 bg-transparent border-b border-arabian-white/30 py-2 fine text-sm text-arabian-white placeholder:text-arabian-white/40 focus:outline-none focus:border-coronation-gold"
                />
                <button data-testid="footer-newsletter-btn" disabled={subscribing} type="submit" className="overline text-coronation-gold ml-4 hover:text-arabian-white transition-colors duration-500 disabled:opacity-50">
                  {subscribing ? "…" : "Join"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="border-t border-arabian-white/15">
        <div className="container-editorial flex flex-col md:flex-row items-center justify-between py-6 gap-2 fine text-xs text-arabian-white/50">
          <p>{footer?.copyrightText || `© ${new Date().getFullYear()} Artham Aesthetique. All rights reserved.`}</p>
          <p>
            Part of the{" "}
            <a data-testid="footer-parent-link" href={SITE.parentBrandUrl} target="_blank" rel="noreferrer" className="text-coronation-gold hover:text-arabian-white transition-colors duration-500">Artham family</a>.
          </p>
        </div>
      </div>
    </footer>
  );
}
