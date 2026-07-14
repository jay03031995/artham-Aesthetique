import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown, Instagram, Youtube, Facebook, ArrowRight } from "lucide-react";
import { useCmsContent } from "../../lib/cmsContent";

export default function Header({ onOpenBooking }) {
  const { site: SITE, categories, megaGroups, nav } = useCmsContent();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [openMobileCat, setOpenMobileCat] = useState(null);
  const megaTimeout = useRef(null);
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
  }, [location.pathname]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") { setMegaOpen(false); setMobileOpen(false); } };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const openMega = () => { clearTimeout(megaTimeout.current); setMegaOpen(true); };
  const closeMega = () => { megaTimeout.current = setTimeout(() => setMegaOpen(false), 120); };

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + "/");
  const cmsMega = megaGroups?.filter((group) => group.heading && group.items?.length);
  const categoryMega = categories?.length
    ? categories.map((cat) => ({
        heading: cat.name,
        catLink: `/category/${cat.slug}`,
        items: (cat.services || []).slice(0, 9),
      }))
    : [];
  const menuGroups = cmsMega?.length ? cmsMega : categoryMega;
  const featuredService = menuGroups.flatMap((group) => group.items || []).find((item) => item.featured) || menuGroups[0]?.items?.[0];
  const navItems = nav || [];
  const headerCta = SITE.headerCta?.label || "";

  return (
    <header className="fixed top-0 left-0 right-0 z-40" data-testid="site-header">
      {/* Announcement bar — dermaheal style */}
      <div className="bg-[#3D2F23] text-[#F5D89C] text-center" data-testid="announce-bar">
        <div className="container-editorial flex items-center justify-center gap-3 sm:gap-6 h-[34px] text-[10px] sm:text-[11px] tracking-[0.12em] uppercase">
          <span className="truncate">{SITE.tagline}</span>
          <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-[#F5D89C]/50 shrink-0" aria-hidden="true" />
          <button
            data-testid="announce-cta"
            onClick={onOpenBooking}
            className="hidden sm:inline-flex items-center gap-1.5 border-b border-[#F5D89C]/40 pb-px hover:text-[#FFF7EC] hover:border-[#FFF7EC] transition-colors shrink-0"
          >
            {headerCta} <ArrowRight size={11} />
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
          <Link to="/" data-testid="header-logo" aria-label={SITE.title || ""} className="flex items-center gap-3 group shrink-0">
            <img
              src={SITE.logoUrl}
              alt={SITE.title || ""}
              className="h-12 w-12 lg:h-14 lg:w-14 object-contain transition-transform duration-500 group-hover:scale-105"
            />
            {SITE.title && <div className="leading-tight hidden sm:block">
              <div className="font-display text-xl lg:text-2xl text-[#3D2F23]" style={{ letterSpacing: "0" }}>{SITE.title}</div>
              {SITE.tagline && <div className="text-[11px] text-[#8A6D3B] font-semibold" style={{ fontFamily: "'Raleway', sans-serif" }}>{SITE.tagline}</div>}
            </div>}
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => {
              const isTreatments = item.label?.toLowerCase().includes("treatment") || item.href === "#treatments";
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
            <div className="hidden xl:flex items-center gap-2" data-testid="header-socials">
              {[
                { href: SITE.social.instagram, label: "Instagram", Icon: Instagram },
                { href: SITE.social.youtube, label: "YouTube", Icon: Youtube },
                { href: SITE.social.facebook, label: "Facebook", Icon: Facebook },
              ].map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-8 h-8 grid place-items-center rounded-full border border-[#b8894a]/40 text-[#7A5A2E] hover:bg-[#3D2F23] hover:border-[#3D2F23] hover:text-[#F5D89C] transition-colors"
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
            <a
              href={`tel:${SITE.phoneDigits}`}
              className="hidden md:block text-sm font-semibold text-[#3D2F23] hover:text-[#7A3E1D] transition-colors"
              data-testid="header-phone"
            >
              {SITE.phone}
            </a>
            {headerCta && <button
              data-testid="header-book-btn"
              onClick={onOpenBooking}
              className="btn-primary hidden md:inline-flex"
              style={{ padding: "10px 22px", minHeight: "44px" }}
            >
              {headerCta}
            </button>}
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
              {featuredService && <div className="col-span-5 pt-6 mt-4 border-t border-[#b8894a]/30">
                <Link
                  to={`/services/${featuredService.slug}`}
                  data-testid={`mega-featured-${featuredService.slug}`}
                  className="flex items-center gap-6 group"
                >
                  <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0">
                    {featuredService.image && <img src={featuredService.image} alt={featuredService.name || ""} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />}
                  </div>
                  <div className="flex-1">
                    {SITE.footerCta?.label && <p className="text-[12px] font-semibold text-[#8A6D3B] mb-1" style={{ fontFamily: "'Raleway', sans-serif" }}>{SITE.footerCta.label}</p>}
                    <h4 className="font-display text-xl text-[#3D2F23] mb-1" style={{ fontWeight: 600 }}>{featuredService.name}</h4>
                    {featuredService.short && <p className="text-sm text-[#5C4A38]">{featuredService.short}</p>}
                  </div>
                  {headerCta && <span className="text-sm font-semibold text-[#7A3E1D] group-hover:underline">{headerCta} →</span>}
                </Link>
              </div>}
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
            <img src={SITE.logoUrl} alt="" className="h-11 w-11 object-contain" />
            <span className="font-display text-lg text-[#3D2F23]">{SITE.title}</span>
          </Link>
          <button data-testid="mobile-drawer-close" onClick={() => setMobileOpen(false)} className="text-[#3D2F23] p-2" aria-label="Close menu"><X size={24} /></button>
        </div>
        <div className="container-editorial py-6 overflow-y-auto h-[calc(100vh-70px)] pb-32">
          <nav className="space-y-1">
            {navItems.filter((item) => !(item.label?.toLowerCase().includes("treatment") || item.href === "#treatments")).map((item) => (
              <Link key={item.label} data-testid={`mnav-${item.label.toLowerCase().replace(/\s+/g, "-")}`} to={item.href || "#"} className="block py-3 text-[15px] font-medium text-[#3D2F23] border-b border-[#b8894a]/25">{item.label}</Link>
            ))}
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
                </div>
              )}
            </div>
          </nav>
          {headerCta && <button data-testid="mnav-book" onClick={() => { setMobileOpen(false); onOpenBooking(); }} className="btn-primary w-full mt-6">{headerCta}</button>}
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
