import { useEffect, useRef, useState } from "react";
import { X, Send } from "lucide-react";
import { streamChat } from "../../lib/api";
import { useCmsContent, cmsWhatsAppLink } from "../../lib/cmsContent";

const uuid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

export default function Chatbot({ onOpenBooking }) {
  const { site: SITE } = useCmsContent();
  const [open, setOpen] = useState(false);
  const [sessionId] = useState(() => uuid());
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello — I'm Aara, your concierge at Artham Aesthetique. I can help you book a consultation, share treatment notes, or connect you with our team on WhatsApp. What would you like to explore?",
    },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, open]);

  const send = async (text) => {
    const q = (text ?? input).trim();
    if (!q || busy) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: q }, { role: "assistant", content: "" }]);
    setBusy(true);
    await streamChat(
      sessionId,
      q,
      (delta) => {
        setMessages((prev) => {
          const next = [...prev];
          const last = next[next.length - 1];
          if (last && last.role === "assistant") last.content += delta;
          return next;
        });
      },
      () => setBusy(false),
      (err) => {
        setMessages((prev) => [
          ...prev.slice(0, -1),
          { role: "assistant", content: `Sorry, I'm unable to respond right now. Please WhatsApp us on ${SITE.phone} — we usually reply within minutes.` },
        ]);
        setBusy(false);
      }
    );
  };

  const quick = [
    { label: "Book a consult", action: () => { setOpen(false); onOpenBooking(); } },
    { label: "About Dr. Omaima", action: () => send("Tell me about Dr. Omaima Jawed and her approach.") },
    { label: "Which facial suits me?", action: () => send("Which facial would you suggest for dull, dehydrated skin?") },
    { label: "WhatsApp us", action: () => window.open(cmsWhatsAppLink(SITE), "_blank") },
  ];

  return (
    <>
      {/* Launcher */}
      <button
        data-testid="chatbot-launcher"
        onClick={() => setOpen(true)}
        aria-label="Open chat"
        className={`fixed z-30 bottom-20 lg:bottom-6 right-6 w-14 h-14 rounded-full bg-[#3D2F23] hover:bg-[#7A3E1D] text-[#FFF7EC] shadow-[0_10px_30px_-10px_rgba(72,63,55,0.6)] flex items-center justify-center transition-all duration-500 ${
          open ? "opacity-0 scale-90 pointer-events-none" : "opacity-100 scale-100"
        }`}
      >
        <img src={SITE.logoUrl} alt="" className="w-9 h-9 object-contain" />
      </button>

      {/* Panel */}
      <div
        data-testid="chatbot-panel"
        className={`fixed z-40 bottom-20 lg:bottom-6 right-6 w-[calc(100vw-3rem)] max-w-sm h-[560px] max-h-[80vh] bg-arabian-white border border-coronation-gold/30 shadow-[0_30px_60px_-20px_rgba(72,63,55,0.4)] flex flex-col transition-all duration-500 origin-bottom-right ${
          open ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-coronation-gold/30 bg-armadillo text-arabian-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-arabian-white/10 flex items-center justify-center overflow-hidden">
              <img src={SITE.logoUrl} alt="" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="font-display text-base leading-tight">Aara · Artham Concierge</div>
              <div className="overline text-coronation-gold text-[9px]">Usually replies instantly</div>
            </div>
          </div>
          <button data-testid="chatbot-close" onClick={() => setOpen(false)} aria-label="Close chat"><X size={18} /></button>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] px-4 py-2.5 fine text-sm leading-relaxed whitespace-pre-wrap ${
                  m.role === "user"
                    ? "bg-burma-teak text-arabian-white"
                    : "bg-summer-peach text-armadillo border border-coronation-gold/20"
                }`}
              >
                {m.content || (m.role === "assistant" && busy && i === messages.length - 1 ? "…" : "")}
              </div>
            </div>
          ))}
        </div>

        <div className="px-4 pt-2 pb-2 flex flex-wrap gap-1.5 border-t border-coronation-gold/20">
          {quick.map((q, i) => (
            <button
              key={i}
              data-testid={`chatbot-quick-${i}`}
              onClick={q.action}
              className="fine text-[11px] px-3 py-1.5 border border-coronation-gold/40 text-armadillo hover:bg-coronation-gold hover:text-armadillo transition-all duration-500"
            >
              {q.label}
            </button>
          ))}
        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); send(); }}
          className="flex items-center gap-2 p-3 border-t border-coronation-gold/30"
        >
          <input
            data-testid="chatbot-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything…"
            className="flex-1 bg-transparent border-b border-armadillo/20 py-2 fine text-sm text-armadillo placeholder:text-armadillo/40 focus:outline-none focus:border-burma-teak"
          />
          <button data-testid="chatbot-send" type="submit" disabled={busy} className="text-burma-teak hover:text-armadillo transition-colors duration-500 disabled:opacity-40">
            <Send size={18} />
          </button>
        </form>
      </div>
    </>
  );
}
