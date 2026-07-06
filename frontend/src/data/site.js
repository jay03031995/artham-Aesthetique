export const SITE = {
  name: "Artham Aesthetique",
  wordmarkDeva: "अर्थम्",
  tagline: "Where Science meets Soulful Care",
  phone: "+91 98119 97993",
  phoneDigits: "919811997993",
  hours: "Mon–Sat · 10:00 – 20:00",
  address: {
    line1: "Lotus Plaza, near Mithaas Sweets",
    line2: "Hazipur, Sector 104, Noida",
    line3: "Uttar Pradesh 201304, India",
  },
  // Self-hosted in frontend/public/media so they load same-origin on Vercel
  // (the previous Emergent preview-CDN URLs were unreliable in production).
  logoUrl: "/media/logo.png",
  footerLogoUrl: "/media/footer-logo.png",
  doctorPortraitUrl: "/media/doctor.png",
  heroImageUrl: "/media/hero.png",
  clinicPhotoUrl: "/media/hero-poster.jpg",
  heroVideoUrl: "/media/hero.mp4",
  parentBrandUrl: "https://artham-intro.preview.emergentagent.com/",
  social: {
    instagram: "https://instagram.com/artham.aesthetique",
    facebook: "https://facebook.com/artham.aesthetique",
    x: "https://x.com/arthamaesthetique",
    linkedin: "https://linkedin.com/company/artham-aesthetique",
    youtube: "https://youtube.com/@arthamaesthetique",
    whatsapp: "https://wa.me/919811997993",
  },
};

export const whatsAppLink = (msg = "Hello Artham Aesthetique, I would like to book a consultation.") =>
  `https://wa.me/${SITE.phoneDigits}?text=${encodeURIComponent(msg)}`;

export const telLink = () => `tel:${SITE.phone.replace(/\s|\+/g, "")}`;
