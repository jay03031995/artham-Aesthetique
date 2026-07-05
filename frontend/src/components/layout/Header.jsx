import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone, MapPin, ChevronDown } from "lucide-react";
import { SITE, whatsAppLink } from "../../data/site";
import { CATEGORIES } from "../../data/treatments";

const MegaFeaturedCard = () => (
  <Link
    to="/services/hydrafacial-treatment"
    data-testid="mega-featured-hydrafacial"
    className="block bg-summer-peach p-6 border border-coronation-gold/30 hover:border-coronation-gold transition-all duration-500 group"
  >
    <p className="overline text-coronation-gold mb-3">Most Loved</p>
    <h4 className="font-display text-2xl text-armadillo leading-tight mb-2">HydraFacial</h4>
    <p className="fine text-armadillo/70 text-sm mb-4">Cleanse, extract, hydrate — in one calm hour.</p>
    <span className="overline text-burma-teak link-gold">Book now</span>
  </Link>
);

export default function Header({ onOpenBooking }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [openMobileCat, setOpenMobileCat] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setMegaOpen(false);
  }, [location.pathname]);

  return (
    <header className="fixed top-0 left-0 right-0 z-40" data-testid="site-header">
      {/* Utility strip */}
      <div className="hidden md:block bg-armadillo text-arabian-white/85 text-[11px]">
        <div className="container-editorial flex items-center justify-between h-9">
          <div className="flex items-center gap-6 fine">
            <a href={`tel:${SITE.phoneDigits}`} data-testid="utility-phone" className="flex items-center gap-2 hover:text-coronation-gold transition-colors duration-500">
              <Phone size={12} /> {SITE.phone}
            </a>
            <span className="flex items-center gap-2"><MapPin size={12} /> {SITE.hours}</span>
          </div>
          <div className="flex items-center gap-6 overline">
            <span className="text-arabian-white/60">Noida · Sector 104</span>
            <button data-testid="utility-book-btn" onClick={onOpenBooking} className="text-coronation-gold hover:text-arabian-white transition-colors duration-500">Book Appointment</button>
          </div>
        </div>
      </div>

      {/* Main bar */}
      <div
        className={`transition-all duration-500 ${
          scrolled ? "bg-arabian-white/85 backdrop-blur-xl border-b border-coronation-gold/40" : "bg-arabian-white"
        }`}
      >
        <div className="container-editorial flex items-center justify-between h-20 lg:h-24">
          <Link to="/" data-testid="header-logo" className="flex items-center gap-3 group">
            <div className="w-11 h-11 lg:w-12 lg:h-12 rounded-full bg-armadillo flex items-center justify-center overflow-hidden transition-transform duration-700 group-hover:scale-105">
              <img src={SITE.logoUrl} alt="Artham Aesthetique lotus" className="w-full h-full object-contain" />
            </div>
            <div className="leading-tight">
              <div className="font-display text-lg lg:text-xl text-armadillo tracking-wide">Artham</div>
              <div className="overline text-coronation-gold text-[9px] lg:text-[10px]">Aesthetique</div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-10 overline text-armadillo">
            <Link data-testid="nav-home" to="/" className="nav-link">Home</Link>

            <div
              className="relative"
              onMouseEnter={() => setMegaOpen(true)}
              onMouseLeave={() => setMegaOpen(false)}
            >
              <button data-testid="nav-treatments" className="nav-link flex items-center gap-1.5">
                Treatments <ChevronDown size={12} className={`transition-transform duration-500 ${megaOpen ? "rotate-180" : ""}`} />
              </button>
              {/* Mega menu */}
              <div
                className={`fixed left-0 right-0 top-[calc(3.75rem+5rem)] lg:top-[calc(2.25rem+6rem)] transition-all duration-500 ${
                  megaOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"
                }`}
              >
                <div className="bg-arabian-white/95 backdrop-blur-xl border-y border-coronation-gold/30 shadow-[0_20px_40px_-20px_rgba(72,63,55,0.25)]">
                  <div className="container-editorial py-12">
                    <div className="grid grid-cols-7 gap-8">
                      {CATEGORIES.map((cat) => (
                        <div key={cat.slug} className="col-span-1">
                          <Link
                            data-testid={`mega-cat-${cat.slug}`}
                            to={`/category/${cat.slug}`}
                            className="block group"
                          >
                            <div className="h-px w-8 bg-coronation-gold mb-3 group-hover:w-16 transition-all duration-500" />
                            <h4 className="font-display text-lg text-armadillo mb-2 leading-tight">{cat.name}</h4>
                            <p className="fine text-armadillo/60 text-[11px] mb-4 leading-relaxed normal-case tracking-normal">{cat.intro}</p>
                          </Link>
                          <ul className="space-y-2 normal-case tracking-normal fine text-[13px]">
                            {cat.services.slice(0, 5).map((s) => (
                              <li key={s.slug}>
                                <Link
                                  data-testid={`mega-svc-${s.slug}`}
                                  to={`/services/${s.slug}`}
                                  className="text-armadillo/80 hover:text-burma-teak transition-colors duration-500"
                                >
                                  {s.name}
                                </Link>
                              </li>
                            ))}
                            {cat.services.length > 5 && (
                              <li>
                                <Link
                                  data-testid={`mega-cat-more-${cat.slug}`}
                                  to={`/category/${cat.slug}`}
                                  className="text-burma-teak hover:text-armadillo transition-colors duration-500 overline text-[10px]"
                                >
                                  View all →
                                </Link>
                              </li>
                            )}
                          </ul>
                        </div>
                      ))}
                      <div className="col-span-1">
                        <MegaFeaturedCard />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Link data-testid="nav-doctors" to="/doctors/dr-omaima-jawed" className="nav-link">Doctor</Link>
            <Link data-testid="nav-blog" to="/blog" className="nav-link">Journal</Link>
            <Link data-testid="nav-about" to="/about" className="nav-link">About</Link>
            <Link data-testid="nav-contact" to="/contact" className="nav-link">Contact</Link>
          </nav>

          <div className="flex items-center gap-3">
            <button
              data-testid="header-book-btn"
              onClick={onOpenBooking}
              className="btn-primary hidden md:inline-flex"
              style={{ padding: "12px 22px" }}
            >
              Book Appointment
            </button>
            <button
              data-testid="mobile-menu-toggle"
              className="lg:hidden text-armadillo p-2"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        className={`lg:hidden fixed inset-0 top-0 z-50 bg-arabian-white transition-all duration-500 ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
        data-testid="mobile-drawer"
      >
        <div className="flex items-center justify-between h-20 container-editorial border-b border-coronation-gold/30">
          <Link to="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-armadillo flex items-center justify-center overflow-hidden">
              <img src={SITE.logoUrl} alt="" className="w-full h-full object-contain" />
            </div>
            <span className="font-display text-lg text-armadillo">Artham</span>
          </Link>
          <button data-testid="mobile-drawer-close" onClick={() => setMobileOpen(false)} className="text-armadillo p-2"><X size={22} /></button>
        </div>
        <div className="container-editorial py-8 overflow-y-auto h-[calc(100vh-80px)] pb-32">
          <nav className="space-y-1">
            <Link data-testid="mnav-home" to="/" className="block py-3 overline text-armadillo border-b border-coronation-gold/20">Home</Link>
            <div className="border-b border-coronation-gold/20">
              <button
                data-testid="mnav-treatments"
                onClick={() => setOpenMobileCat(openMobileCat === "root" ? null : "root")}
                className="w-full flex items-center justify-between py-3 overline text-armadillo"
              >
                Treatments <ChevronDown size={14} className={`transition-transform ${openMobileCat === "root" ? "rotate-180" : ""}`} />
              </button>
              {openMobileCat === "root" && (
                <div className="pl-4 pb-3 space-y-2">
                  {CATEGORIES.map((cat) => (
                    <details key={cat.slug} className="group">
                      <summary className="fine normal-case list-none py-2 flex items-center justify-between cursor-pointer text-armadillo/80">
                        <span>{cat.name}</span>
                        <ChevronDown size={14} className="group-open:rotate-180 transition-transform" />
                      </summary>
                      <ul className="pl-2 pb-3 space-y-2 fine text-sm">
                        <li>
                          <Link data-testid={`mnav-cat-${cat.slug}`} to={`/category/${cat.slug}`} className="text-burma-teak">All {cat.name} →</Link>
                        </li>
                        {cat.services.map((s) => (
                          <li key={s.slug}>
                            <Link data-testid={`mnav-svc-${s.slug}`} to={`/services/${s.slug}`} className="text-armadillo/70">{s.name}</Link>
                          </li>
                        ))}
                      </ul>
                    </details>
                  ))}
                </div>
              )}
            </div>
            <Link data-testid="mnav-doctor" to="/doctors/dr-omaima-jawed" className="block py-3 overline text-armadillo border-b border-coronation-gold/20">Doctor</Link>
            <Link data-testid="mnav-blog" to="/blog" className="block py-3 overline text-armadillo border-b border-coronation-gold/20">Journal</Link>
            <Link data-testid="mnav-about" to="/about" className="block py-3 overline text-armadillo border-b border-coronation-gold/20">About</Link>
            <Link data-testid="mnav-contact" to="/contact" className="block py-3 overline text-armadillo border-b border-coronation-gold/20">Contact</Link>
          </nav>
          <button data-testid="mnav-book" onClick={() => { setMobileOpen(false); onOpenBooking(); }} className="btn-primary w-full mt-6">Book Appointment</button>
          <div className="mt-8 fine text-sm text-armadillo/70 leading-relaxed">
            <p>{SITE.address.line1}</p>
            <p>{SITE.address.line2}</p>
            <p>{SITE.address.line3}</p>
            <p className="mt-3">{SITE.phone} · {SITE.hours}</p>
          </div>
        </div>
        <div className="fixed bottom-0 left-0 right-0 grid grid-cols-3 border-t border-coronation-gold/30 bg-arabian-white">
          <a data-testid="mnav-call" href={`tel:${SITE.phoneDigits}`} className="py-4 text-center overline text-armadillo">Call</a>
          <a data-testid="mnav-wa" href={whatsAppLink()} target="_blank" rel="noreferrer" className="py-4 text-center overline text-armadillo border-x border-coronation-gold/30">WhatsApp</a>
          <button data-testid="mnav-book-bottom" onClick={() => { setMobileOpen(false); onOpenBooking(); }} className="py-4 text-center overline text-arabian-white bg-burma-teak">Book</button>
        </div>
      </div>
    </header>
  );
}
