import { MessageCircle } from "lucide-react";
import { useCmsContent, cmsWhatsAppLink } from "../../lib/cmsContent";

export default function WhatsAppFab() {
  const { site } = useCmsContent();
  return (
    <a
      data-testid="wa-fab"
      href={cmsWhatsAppLink(site)}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className="hidden lg:flex fixed bottom-6 right-24 z-30 w-12 h-12 rounded-full bg-coronation-gold text-armadillo items-center justify-center shadow-lg hover:scale-110 transition-transform duration-500"
    >
      <MessageCircle size={20} />
    </a>
  );
}
