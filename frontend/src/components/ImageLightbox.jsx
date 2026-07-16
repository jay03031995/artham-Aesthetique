import { useEffect, useRef, useState } from "react";

export default function ImageLightbox({ images = [], currentIndex = 0, open, onClose, onNavigate }) {
  const [visible, setVisible] = useState(false);
  const closeButtonRef = useRef(null);
  const safeImages = images.filter((image) => image?.src);
  const current = safeImages[currentIndex] || safeImages[0];
  const displayImages = current?.images?.length ? current.images.filter((image) => image?.src) : current ? [current] : [];
  const hasMultiple = safeImages.length > 1;

  useEffect(() => {
    if (!open) {
      setVisible(false);
      return undefined;
    }

    const timer = window.setTimeout(() => setVisible(true), 10);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    return () => {
      window.clearTimeout(timer);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft" && hasMultiple) onNavigate((currentIndex - 1 + safeImages.length) % safeImages.length);
      if (event.key === "ArrowRight" && hasMultiple) onNavigate((currentIndex + 1) % safeImages.length);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, hasMultiple, onClose, onNavigate, open, safeImages.length]);

  if (!open || !current) return null;

  const navigate = (nextIndex) => {
    onNavigate((nextIndex + safeImages.length) % safeImages.length);
  };

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-black/90 px-4 py-6 transition-opacity duration-300 ${visible ? "opacity-100" : "opacity-0"}`}
      role="dialog"
      aria-modal="true"
      aria-label={current.alt || current.caption || "Image preview"}
      onClick={onClose}
    >
      <button
        ref={closeButtonRef}
        type="button"
        aria-label="Close image preview"
        onClick={onClose}
        className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-black/40 text-3xl leading-none text-white transition-colors hover:bg-white hover:text-black focus:outline-none focus:ring-2 focus:ring-white"
      >
        ×
      </button>

      {hasMultiple && (
        <button
          type="button"
          aria-label="Previous image"
          onClick={(event) => {
            event.stopPropagation();
            navigate(currentIndex - 1);
          }}
          className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/40 text-3xl text-white transition-colors hover:bg-white hover:text-black focus:outline-none focus:ring-2 focus:ring-white md:left-6"
        >
          ‹
        </button>
      )}

      <figure
        className={`max-h-full w-full max-w-6xl transform transition-transform duration-300 ${visible ? "scale-100" : "scale-95"}`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className={`grid gap-3 ${displayImages.length > 1 ? "md:grid-cols-2" : "grid-cols-1"}`}>
          {displayImages.map((image, index) => (
            <div key={`${image.src}-${index}`} className="min-w-0">
              {image.label && <p className="mb-2 text-center text-xs font-semibold uppercase tracking-[0.16em] text-white/70">{image.label}</p>}
              <img
                src={image.src}
                alt={image.alt || ""}
                className="mx-auto max-h-[78vh] w-auto max-w-full rounded-lg object-contain shadow-2xl"
              />
            </div>
          ))}
        </div>
        {(current.caption || hasMultiple) && (
          <figcaption className="mt-4 text-center text-sm text-white/80">
            {current.caption || `${currentIndex + 1} / ${safeImages.length}`}
          </figcaption>
        )}
      </figure>

      {hasMultiple && (
        <button
          type="button"
          aria-label="Next image"
          onClick={(event) => {
            event.stopPropagation();
            navigate(currentIndex + 1);
          }}
          className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/40 text-3xl text-white transition-colors hover:bg-white hover:text-black focus:outline-none focus:ring-2 focus:ring-white md:right-6"
        >
          ›
        </button>
      )}
    </div>
  );
}
