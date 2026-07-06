import { useEffect, useState } from "react";
import { Twitter, Facebook, Linkedin, MessageCircle, Send, Mail, Link2, Check, Share2 } from "lucide-react";

export default function JournalShare({ url, title }) {
  const [copied, setCopied] = useState(false);
  const [canShare, setCanShare] = useState(false);

  useEffect(() => {
    setCanShare(typeof navigator !== "undefined" && !!navigator.share);
  }, []);

  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);
  const links = [
    { label: "Share on X", href: `https://twitter.com/intent/tweet?text=${t}&url=${u}`, Icon: Twitter },
    { label: "Share on Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${u}`, Icon: Facebook },
    { label: "Share on LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`, Icon: Linkedin },
    { label: "Share on WhatsApp", href: `https://api.whatsapp.com/send?text=${t}%20${u}`, Icon: MessageCircle },
    { label: "Share on Telegram", href: `https://t.me/share/url?url=${u}&text=${t}`, Icon: Send },
    { label: "Share by email", href: `mailto:?subject=${t}&body=${t}%0A%0A${u}`, Icon: Mail },
  ];

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (_) { /* ignore */ }
  };

  const nativeShare = async () => {
    try { await navigator.share({ title, url }); } catch (_) { /* cancelled */ }
  };

  const btn = "inline-flex h-9 w-9 items-center justify-center border border-coronation-gold/40 text-armadillo hover:text-burma-teak hover:border-burma-teak transition-colors";

  return (
    <div className="flex flex-wrap items-center gap-2 lg:flex-col lg:items-start" role="group" aria-label="Share this article">
      <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-coronation-gold lg:mb-1" style={{ fontFamily: "'Raleway', sans-serif" }}>
        Share
      </span>
      <div className="flex flex-wrap items-center gap-2">
        {links.map(({ label, href, Icon }) => (
          <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} title={label} className={btn}>
            <Icon size={16} />
          </a>
        ))}
        <button type="button" onClick={copy} aria-label="Copy link" title="Copy link" className={btn}>
          {copied ? <Check size={16} className="text-burma-teak" /> : <Link2 size={16} />}
        </button>
        {canShare && (
          <button type="button" onClick={nativeShare} aria-label="Share" title="Share" className={`${btn} lg:hidden`}>
            <Share2 size={16} />
          </button>
        )}
      </div>
      <span role="status" aria-live="polite" className={`text-xs text-burma-teak transition-opacity ${copied ? "opacity-100" : "opacity-0"}`}>
        Link copied
      </span>
    </div>
  );
}
