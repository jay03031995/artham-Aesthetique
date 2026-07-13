import { Link } from "react-router-dom";
import { Phone, MessageCircle, Home, LayoutGrid, CalendarCheck } from "lucide-react";
import { useCmsContent, cmsWhatsAppLink } from "../../lib/cmsContent";

export default function StickyMobileBar({ onOpenBooking }) {
  const { site: SITE } = useCmsContent();
  return (
    <div
      data-testid="sticky-mobile-bar"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-arabian-white/95 backdrop-blur-xl border-t border-coronation-gold/30"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="grid grid-cols-5 h-16">
        <Link to="/" data-testid="smb-home" className="flex flex-col items-center justify-center gap-1 text-armadillo">
          <Home size={16} />
          <span className="overline text-[9px]">Home</span>
        </Link>
        <Link to="/category/skin" data-testid="smb-treatments" className="flex flex-col items-center justify-center gap-1 text-armadillo">
          <LayoutGrid size={16} />
          <span className="overline text-[9px]">Menu</span>
        </Link>
        <button
          data-testid="smb-book"
          onClick={onOpenBooking}
          className="flex flex-col items-center justify-center gap-1 bg-burma-teak text-arabian-white -mt-4 mx-1 rounded-full shadow-lg"
          aria-label="Book Appointment"
        >
          <CalendarCheck size={18} />
          <span className="overline text-[9px]">Book</span>
        </button>
        <a data-testid="smb-call" href={`tel:${SITE.phoneDigits}`} className="flex flex-col items-center justify-center gap-1 text-armadillo">
          <Phone size={16} />
          <span className="overline text-[9px]">Call</span>
        </a>
        <a data-testid="smb-wa" href={cmsWhatsAppLink(SITE)} target="_blank" rel="noreferrer" className="flex flex-col items-center justify-center gap-1 text-armadillo">
          <MessageCircle size={16} />
          <span className="overline text-[9px]">Chat</span>
        </a>
      </div>
    </div>
  );
}
