import { MessageCircle } from "lucide-react";
import { whatsAppLink } from "../../data/site";

export default function WhatsAppFab() {
  return (
    <a
      data-testid="wa-fab"
      href={whatsAppLink()}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className="hidden lg:flex fixed bottom-6 right-24 z-30 w-12 h-12 rounded-full bg-coronation-gold text-armadillo items-center justify-center shadow-lg hover:scale-110 transition-transform duration-500"
    >
      <MessageCircle size={20} />
    </a>
  );
}
