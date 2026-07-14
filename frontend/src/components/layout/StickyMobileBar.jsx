import { Link } from "react-router-dom";
import { Phone, MessageCircle, Home, LayoutGrid, CalendarCheck } from "lucide-react";
import { useCmsContent, cmsWhatsAppLink } from "../../lib/cmsContent";

export default function StickyMobileBar({ onOpenBooking }) {
  const { site: SITE, mobileBar } = useCmsContent();
  const icons = { home: Home, treatments: LayoutGrid, book: CalendarCheck, call: Phone, chat: MessageCircle };
  const items = mobileBar?.items || [];
  const itemHref = (item) => {
    if (item.action === "call") return `tel:${SITE.phoneDigits}`;
    if (item.action === "whatsapp") return cmsWhatsAppLink(SITE);
    return item.href || "#";
  };
  const renderContent = (item) => {
    const Icon = icons[item.icon] || Home;
    return (
      <>
        <Icon size={item.highlight ? 18 : 16} />
        <span className="overline text-[9px]">{item.label}</span>
      </>
    );
  };
  return (
    <div
      data-testid="sticky-mobile-bar"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-arabian-white/95 backdrop-blur-xl border-t border-coronation-gold/30"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="grid grid-cols-5 h-16">
        {items.map((item, index) => {
          const className = item.highlight
            ? "flex flex-col items-center justify-center gap-1 bg-burma-teak text-arabian-white -mt-4 mx-1 rounded-full shadow-lg"
            : "flex flex-col items-center justify-center gap-1 text-armadillo";
          if (item.action === "booking") {
            return <button key={`${item.label}-${index}`} data-testid={`smb-${item.icon || index}`} onClick={onOpenBooking} className={className} aria-label={item.label}>{renderContent(item)}</button>;
          }
          if (item.action === "link") {
            return <Link key={`${item.label}-${index}`} to={itemHref(item)} data-testid={`smb-${item.icon || index}`} className={className}>{renderContent(item)}</Link>;
          }
          return <a key={`${item.label}-${index}`} data-testid={`smb-${item.icon || index}`} href={itemHref(item)} target={item.action === "whatsapp" ? "_blank" : undefined} rel={item.action === "whatsapp" ? "noreferrer" : undefined} className={className}>{renderContent(item)}</a>;
        })}
      </div>
    </div>
  );
}
