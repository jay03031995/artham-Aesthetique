import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown, ArrowRight } from "lucide-react";
import { useCmsContent } from "../../lib/cmsContent";
import { ALL_SERVICES } from "../../data/treatments";

// Group services into Dermapuritys-style mega menu columns.
// (Internal category URLs stay /category/{slug}.)
const bySlugs = (slugs) => slugs.map((s) => ALL_SERVICES.find((x) => x.slug === s)).filter(Boolean);

const MEGA = [
  {
    heading: "Skin",
    catLink: "/category/skin",
    items: bySlugs([
      "hydrafacial-treatment",
      "derma-genesis-facial",
      "chemical-peel",
      "micro-needling",
      "vampire-facial-prp",
      "acne-treatment",
      "hello-bright-zo-obagi",
    ]),
  },
  {
    heading: "Hair",
    catLink: "/category/hair",
    items: bySlugs([
      "advanced-hair-transplant",
      "hair-loss-treatment",
      "hair-patch-treatment",
    ]),
  },
  {
    heading: "Body & Bridal",
    catLink: "/category/body",
    items: bySlugs([
      "coolsculpting",
      "med-contour",
      "body-shaping-figure-correction",
      "face-lifting",
      "jawline-definition",
      "wedding-package",
      "weight-loss-treatment",
    ]),
  },
  {
    heading: "Laser & Advanced",
    catLink: "/category/anti-ageing",
    items: bySlugs([
      "laser-hair-removal",
      "laser-hair-removal-women",
      "laser-hair-removal-men",
      "4d-clearlift",
      "hifu",
      "dermal-fillers",
      "mesobotox",
      "morpheus",
      "opus-plasma",
    ]),
  },
];

const CONCERN_LINKS = [
  { label: "Acne & Scars", href: "/services/acne-treatment" },
  { label: "Pigmentation", href: "/services/hello-bright-zo-obagi" },
  { label: "Hair Loss", href: "/services/hair-loss-treatment" },
  { label: "Anti-Ageing", href: "/services/dermal-fillers" },
  { label: "Bridal Runway", href: "/services/wedding-package" },
  { label: "Body Contour", href: "/services/coolsculpting" },
  { label: "Dullness & Glow", href: "/services/hydrafacial-treatment" },
];

const ABOUT_LINKS = [
  { label: "About Clinic", href: "/about#about-clinic" },
  { label: "Dr. Omaima Jawed", href: "/doctors/dr-omaima-jawed" },
  { label: "Who We Are", href: "/about#who-we-are" },
  { label: "Our Technology", href: "/about#technology" },
  { label: "Clinic Gallery", href: "/about#gallery" },
];

const NAV_ITEMS = [
  { label: "About", href: "/about", dropdown: "about" },
  { label: "Treatments", href: "#treatments", dropdown: "treatments" },
  { label: "Team", href: "/doctors" },
  { label: "Result", href: "/results" },
  { label: "Blog", href: "/blog" },
  { label: "Contact us", href: "/contact" },
];

export default function Header({ onOpenBooking }) {
  const { site: SITE, categories, megaGroups } = useCmsContent();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [openMobileCat, setOpenMobileCat] = useState(null);
  const megaTimeout = useRef(null);
  const aboutTimeout = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setMegaOpen(false);
    setAboutOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") { setMegaOpen(false); setAboutOpen(false); setMobileOpen(false); } };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const openMega = () => { clearTimeout(megaTimeout.current); setMegaOpen(true); };
  const closeMega = () => { megaTimeout.current = setTimeout(() => setMegaOpen(false), 120); };
  const openAbout = () => { clearTimeout(aboutTimeout.current); setAboutOpen(true); };
  const closeAbout = () => { aboutTimeout.current = setTimeout(() => setAboutOpen(false), 120); };

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + "/");
  const cmsMega = megaGroups?.filter((group) => group.heading && group.items?.length);
  const categoryMega = categories?.length
    ? categories.map((cat) => ({
        heading: cat.name,
        catLink: `/category/${cat.slug}`,
        items: (cat.services || []).slice(0, 9),
      }))
    : [];
  const menuGroups = cmsMega?.length ? cmsMega : (categoryMega.length ? categoryMega : MEGA);
  const featuredService = menuGroups.flatMap((group) => group.items || []).find((item) => item.slug === "hydrafacial-treatment") || menuGroups[0]?.items?.[0];
  const navItems = NAV_ITEMS;

  return (
    <header className="fixed top-0 left-0 right-0 z-40" data-testid="site-header">
      {/* Announcement bar — dermaheal style */}
      <div className="bg-[#3D2F23] text-[#F5D89C] text-center" data-testid="announce-bar">
        <div className="container-editorial flex items-center justify-center gap-3 sm:gap-6 h-[34px] text-[10px] sm:text-[11px] tracking-[0.12em] uppercase">
          <span className="truncate">Book a consultation with an MD Dermatologist</span>
          <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-[#F5D89C]/50 shrink-0" aria-hidden="true" />
          <button
            data-testid="announce-cta"
            onClick={onOpenBooking}
            className="hidden sm:inline-flex items-center gap-1.5 border-b border-[#F5D89C]/40 pb-px hover:text-[#FFF7EC] hover:border-[#FFF7EC] transition-colors shrink-0"
          >
            Book this week <ArrowRight size={11} />
          </button>
        </div>
      </div>
      <div
        className={`transition-all duration-500 ${
          scrolled
            ? "bg-[#FBF3E7]/95 backdrop-blur-xl shadow-[0_1px_0_0_rgba(184,137,74,0.4)]"
            : "bg-[#FBF3E7] border-b border-[#b8894a]/25"
        }`}
      >
        <div className="container-editorial flex items-center justify-between h-[76px] lg:h-[80px]">
          {/* Logo — gold transparent lotus, rendered as-is (no wrapper) */}
          <Link to="/" data-testid="header-logo" aria-label="Artham Aesthetique home" className="flex items-center gap-3 group shrink-0">
            <img
              src={SITE.logoUrl}
              alt="Artham Aesthetique lotus logo"
              className="h-14 w-14 lg:h-16 lg:w-16 object-contain transition-transform duration-500 group-hover:scale-105"
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-8 flex-nowrap overflow-visible">
            {navItems.map((item) => {
              const isTreatments = item.dropdown === "treatments";
              const isAbout = item.dropdown === "about";
              if (isAbout) {
                return (
                  <div key={item.label} className="relative" onMouseEnter={openAbout} onMouseLeave={closeAbout}>
                    <button
                      data-testid="nav-about"
                      onFocus={openAbout}
                      onClick={() => setAboutOpen((v) => !v)}
                      className={`nav-link flex items-center gap-1.5 ${aboutOpen || isActive("/about") ? "active" : ""}`}
                      aria-expanded={aboutOpen}
                      aria-haspopup="true"
                    >
                      {item.label} <ChevronDown size={14} className={`transition-transform duration-300 ${aboutOpen ? "rotate-180" : ""}`} />
                    </button>
	                    <div
	                      className={`absolute left-0 top-full z-50 mt-4 w-64 rounded-lg border border-[#b8894a]/35 bg-[#FBF3E7] p-3 shadow-[0_20px_48px_-24px_rgba(72,63,55,0.55)] transition-all duration-200 ${
                        aboutOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"
                      }`}
                      data-testid="about-menu"
                    >
                      {ABOUT_LINKS.map((link) => (
                        <Link
                          key={link.label}
                          to={link.href}
                          className="block rounded-md px-3 py-2 text-[14px] text-[#3D2F23] hover:bg-[#f5e6d0] hover:text-[#7A3E1D] transition-colors"
                          style={{ fontFamily: "'Poppins', sans-serif" }}
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              }
              if (isTreatments) {
                return (
                  <div key={item.label} className="relative" onMouseEnter={openMega} onMouseLeave={closeMega}>
                    <button
                      data-testid="nav-treatments"
                      onFocus={openMega}
                      onClick={() => setMegaOpen((v) => !v)}
                      className={`nav-link flex items-center gap-1.5 ${megaOpen ? "active" : ""}`}
                      aria-expanded={megaOpen}
                      aria-haspopup="true"
                    >
                      {item.label || "Treatments"} <ChevronDown size={14} className={`transition-transform duration-300 ${megaOpen ? "rotate-180" : ""}`} />
                    </button>
                  </div>
                );
              }
              return (
                <Link key={item.label} data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`} to={item.href || "#"} className={`nav-link ${isActive(item.href || "#") && item.href !== "/" ? "active" : location.pathname === "/" && item.href === "/" ? "active" : ""}`}>{item.label}</Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <button
              data-testid="header-book-btn"
              onClick={() => onOpenBooking?.()}
              className="btn-primary hidden md:inline-flex whitespace-nowrap shrink-0"
              style={{ padding: "10px 22px", minHeight: "44px" }}
            >
              Book Appointment
            </button>
            <button
              data-testid="mobile-menu-toggle"
              className="lg:hidden text-[#3D2F23] p-2"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Menu"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* MEGA MENU — full width panel */}
        <div
          onMouseEnter={openMega}
          onMouseLeave={closeMega}
          className={`hidden lg:block absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[920px] max-w-[calc(100vw-32px)] rounded-xl border border-[#b8894a]/40 bg-[#FBF3E7] shadow-[0_28px_64px_-28px_rgba(72,63,55,0.5)] transition-all duration-200 ${
            megaOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"
          }`}
          data-testid="mega-panel"
        >
          <div className="px-8 py-8">
            <div className="grid grid-cols-5 gap-x-8 gap-y-2">
              {menuGroups.map((col) => (
                <div key={col.heading}>
                  <p className="text-[13px] font-semibold text-[#8A6D3B] mb-4" style={{ fontFamily: "'Raleway', sans-serif", letterSpacing: 0 }}>
                    {col.heading}
                  </p>
                  <ul className="space-y-2.5">
                    {col.items.map((s) => (
                      <li key={s.slug}>
                        <Link
                          data-testid={`mega-svc-${s.slug}`}
                          to={`/services/${s.slug}`}
                          className="text-[15px] text-[#3D2F23] hover:text-[#7A3E1D] hover:underline underline-offset-4 transition-colors"
                          style={{ fontFamily: "'Poppins', sans-serif" }}
                        >
                          {s.name}
                        </Link>
                      </li>
                    ))}
                    <li className="pt-2">
                      <Link
                        data-testid={`mega-cat-${col.heading.replace(/\s|&/g, "").toLowerCase()}`}
                        to={col.catLink}
                        className="text-[13px] font-semibold text-[#7A3E1D] hover:underline underline-offset-4"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                      >
                        View all {col.heading} →
                      </Link>
                    </li>
                  </ul>
                </div>
              ))}
              {/* By Concern */}
              <div>
                <p className="text-[13px] font-semibold text-[#8A6D3B] mb-4" style={{ fontFamily: "'Raleway', sans-serif", letterSpacing: 0 }}>By Concern</p>
                <ul className="space-y-2.5">
                  {CONCERN_LINKS.map((c) => (
                    <li key={c.label}>
                      <Link
                        data-testid={`mega-concern-${c.label.replace(/\s|&/g,"").toLowerCase()}`}
                        to={c.href}
                        className="text-[15px] text-[#3D2F23] hover:text-[#7A3E1D] hover:underline underline-offset-4 transition-colors"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                      >
                        {c.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              {/* Featured card */}
              <div className="col-span-5 pt-6 mt-4 border-t border-[#b8894a]/30">
                <Link
                  to={featuredService ? `/services/${featuredService.slug}` : "/category/skin"}
                  data-testid={featuredService ? `mega-featured-${featuredService.slug}` : "mega-featured"}
                  className="flex items-center gap-6 group"
                >
                  <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0">
                    <img src={featuredService?.image || SITE.clinicPhotoUrl} alt={featuredService?.name || "Featured treatment"} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[12px] font-semibold text-[#8A6D3B] mb-1" style={{ fontFamily: "'Raleway', sans-serif" }}>Most Loved</p>
                    <h4 className="font-display text-xl text-[#3D2F23] mb-1" style={{ fontWeight: 600 }}>{featuredService?.name || "Featured Treatment"}</h4>
                    <p className="text-sm text-[#5C4A38]">{featuredService?.short || "Explore our doctor-led treatment protocols."}</p>
                  </div>
                  <span className="text-sm font-semibold text-[#7A3E1D] group-hover:underline">Book now →</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      <div
        className={`lg:hidden fixed inset-0 top-0 z-50 bg-[#FBF3E7] transition-transform duration-500 ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
        data-testid="mobile-drawer"
      >
        <div className="flex items-center justify-between h-[70px] container-editorial border-b border-[#b8894a]/40">
          <Link to="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-2">
            <img src={SITE.logoUrl} alt="Artham Aesthetique lotus logo" className="h-12 w-12 object-contain" />
          </Link>
          <button data-testid="mobile-drawer-close" onClick={() => setMobileOpen(false)} className="text-[#3D2F23] p-2" aria-label="Close menu"><X size={24} /></button>
        </div>
        <div className="container-editorial py-6 overflow-y-auto h-[calc(100vh-70px)] pb-32">
          <nav className="space-y-1">
            <div className="border-b border-[#b8894a]/25">
              <button
                data-testid="mnav-about"
                onClick={() => setOpenMobileCat(openMobileCat === "about" ? null : "about")}
                className="w-full flex items-center justify-between py-3 text-[15px] font-medium text-[#3D2F23]"
              >
                About <ChevronDown size={16} className={`transition-transform ${openMobileCat === "about" ? "rotate-180" : ""}`} />
              </button>
              {openMobileCat === "about" && (
                <div className="pl-2 pb-3 space-y-1">
                  {ABOUT_LINKS.map((link) => (
                    <Link key={link.label} to={link.href} className="block py-2 text-[14px] text-[#5C4A38]">{link.label}</Link>
                  ))}
                </div>
              )}
            </div>
            <div className="border-b border-[#b8894a]/25">
              <button
                data-testid="mnav-treatments"
                onClick={() => setOpenMobileCat(openMobileCat === "root" ? null : "root")}
                className="w-full flex items-center justify-between py-3 text-[15px] font-medium text-[#3D2F23]"
              >
                Treatments <ChevronDown size={16} className={`transition-transform ${openMobileCat === "root" ? "rotate-180" : ""}`} />
              </button>
              {openMobileCat === "root" && (
                <div className="pl-2 pb-3 space-y-1">
                  {menuGroups.map((col) => (
                    <details key={col.heading} className="group border-b border-[#b8894a]/15 last:border-0">
                      <summary className="list-none py-2 flex items-center justify-between cursor-pointer text-[14px] text-[#3D2F23]">
                        <span>{col.heading}</span>
                        <ChevronDown size={14} className="group-open:rotate-180 transition-transform" />
                      </summary>
                      <ul className="pl-2 pb-2 space-y-2">
                        <li>
                          <Link data-testid={`mnav-cat-${col.heading.replace(/\s|&/g,"").toLowerCase()}`} to={col.catLink} className="text-[13px] font-semibold text-[#7A3E1D]">All {col.heading} →</Link>
                        </li>
                        {col.items.map((s) => (
                          <li key={s.slug}>
                            <Link data-testid={`mnav-svc-${s.slug}`} to={`/services/${s.slug}`} className="text-[14px] text-[#5C4A38]">{s.name}</Link>
                          </li>
                        ))}
                      </ul>
                    </details>
                  ))}
                  <details className="group">
                    <summary className="list-none py-2 flex items-center justify-between cursor-pointer text-[14px] text-[#3D2F23]">
                      <span>By Concern</span>
                      <ChevronDown size={14} className="group-open:rotate-180 transition-transform" />
                    </summary>
                    <ul className="pl-2 pb-2 space-y-2">
                      {CONCERN_LINKS.map((c) => (
                        <li key={c.label}><Link to={c.href} className="text-[14px] text-[#5C4A38]">{c.label}</Link></li>
                      ))}
                    </ul>
                  </details>
                </div>
              )}
            </div>
            {navItems.filter((item) => !item.dropdown).map((item) => (
              <Link key={item.label} data-testid={`mnav-${item.label.toLowerCase().replace(/\s+/g, "-")}`} to={item.href || "#"} className="block py-3 text-[15px] font-medium text-[#3D2F23] border-b border-[#b8894a]/25">{item.label}</Link>
            ))}
          </nav>
          <button data-testid="mnav-book" onClick={() => { setMobileOpen(false); onOpenBooking?.(); }} className="btn-primary w-full mt-6">Book Appointment</button>
          <div className="mt-8 text-[13px] text-[#5C4A38] leading-relaxed">
            <p className="font-semibold text-[#3D2F23]">{SITE.phone}</p>
            <p>{SITE.hours}</p>
            <p className="mt-2">{SITE.address.line1}</p>
            <p>{SITE.address.line2}</p>
            <p>{SITE.address.line3}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
