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
  logoUrl:
    "https://customer-assets.emergentagent.com/job_skin-soul-clinic/artifacts/gng6ao8r_Artham%20Aesthetique%20.png",
  doctorPortraitUrl:
    "https://customer-assets.emergentagent.com/job_skin-soul-clinic/artifacts/oebd0rmo_omaima.png",
  heroImageUrl:
    "https://customer-assets.emergentagent.com/job_skin-soul-clinic/artifacts/3q9xhx4u_image.png",
  clinicPhotoUrl:
    "https://customer-assets.emergentagent.com/job_skin-soul-clinic/artifacts/4crgdbma_PHOTO-2026-07-02-19-15-10.jpg",
  heroVideoUrl:
    "https://customer-assets.emergentagent.com/job_abefdb02-6575-4919-95fe-d04bd8e6b148/artifacts/3ulgovjn_arhum%20%285%29.mp4",
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
