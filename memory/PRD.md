# Artham Aesthetique — PRD

## Original Problem Statement
Build the complete Artham Aesthetique website — the dermatology & aesthetics vertical of the Artham parent healthcare brand. Structure like Dermapuritys.com (booking-first), soul like Artham. Luxury editorial (Aesop × Aman Resorts), calm motion, generous whitespace. Full site in one pass — all pages, all service pages, booking flow, chatbot, blog.

## User Choices
- LLM for chatbot: Claude Sonnet 4.5 via Emergent LLM key
- Booking confirmation: DB save + on-screen + WhatsApp deep-link (Twilio/SendGrid deferred until keys provided)
- Tech stack: React CRA + FastAPI + MongoDB (Next.js/Sanity NOT used, user confirmed "recommended")
- Contact: Lotus Plaza, near Mithaas Sweets, Hazipur, Sector 104, Noida — UP 201304 · +91 98119 97993 · Mon-Sat 10am–8pm

## Brand System (locked)
- Colors: burma-teak #844d28, arabian-white #efdfc8, armadillo #483f37, coronation-gold #b8894a, summer-peach #f5e6d0
- Fonts: Playfair Display (H), Poppins (body), Montserrat 11px 0.3em (UI), Raleway (fine), Tiro Devanagari Hindi (wordmark)
- Motion: opacity + translate + blur only, 700–1200ms; no bounce/neon/particles/WebGL

## Architecture
- Backend: FastAPI (`/app/backend/server.py`) — bookings, newsletter, callbacks, chatbot (Claude Sonnet 4.5 streaming)
- Frontend: React CRA + React Router, Tailwind with brand tokens, sonner toasts
- Data: 6 categories, ~37 treatments, 6 blog posts baked into `/app/frontend/src/data/*.js`

## Implemented (Feb 2026)
- **Header** — utility strip + glassmorphism scroll nav + 7-column mega menu (6 cat + featured HydraFacial card) + mobile drawer with accordion
- **Hero** — full-bleed muted looping video (user-provided asset), armadillo gradient overlay, editorial H1
- **Homepage** — hero → stats strip (animated counters) → 6 category grid → about intro → 3 quick-link tiles → why-us pillars → The Artham Way (Consult → Customise → Care) → Meet Dr. Omaima → testimonials carousel → CTA band → featured-in marquee → latest 3 blog posts → footer
- **6 Category pages** (Skin, Anti-Ageing, Laser, Hair, Body, Bridal) with hero + service grid
- **~37 Service pages** — hero + what-is + who-for chips + how-it-works timeline + benefits + downtime table + doctor's note + FAQ accordion + related carousel + sticky mobile CTA + MedicalProcedure + FAQPage schema
- **Dr. Omaima Jawed profile** — editorial hero + credentials + memberships + expertise chips + philosophy quote + 6 signature treatments + Physician schema. `/doctors` index extensible.
- **3-step booking modal** — searchable treatment (Step 1) → date/time (Step 2) → details (Step 3) → confirmation with WhatsApp deep-link. Saves to MongoDB.
- **Chatbot Aara** — floating lotus launcher, Claude Sonnet 4.5 streaming via SSE, guided intents (book, treatments, WhatsApp handoff), persistent history in MongoDB.
- **Blog** — /blog index with category filters + featured post + 6 seeded posts (one per category, 800+ words each) + BlogPosting schema.
- **About, Contact (with map + callback form), FAQ, Careers, Offers, 4 Policy pages**
- **Footer** — armadillo bg, 4-column, real social SVGs (IG/FB/X/LI/YT/WA), newsletter, "Part of Artham family" parent link
- **Sticky mobile bar** (Home / Menu / Book / Call / Chat) + WhatsApp FAB (desktop)
- **PWA** — manifest.json, favicon, install-ready
- **SEO/GEO** — per-page Seo helper (title, description, canonical, OG, JSON-LD MedicalClinic/Physician/MedicalProcedure/FAQPage/BlogPosting/BreadcrumbList), robots.txt, llms.txt
- **API endpoints (all /api-prefixed)**: `POST /bookings`, `GET /bookings`, `POST /newsletter`, `POST /callbacks`, `POST /chat` (SSE stream)

## Deferred / P1 backlog
- Real Dr. Omaima portrait photo (currently editorial placeholder)
- Real treatment photography (currently curated Unsplash in-palette stand-ins)
- Automated WhatsApp/Email confirmations (needs Twilio/SendGrid keys)
- Doctor timeline scheduling with real availability
- Multi-doctor team growth
- GA/GTM/Meta Pixel wiring
- Service worker for offline shell (manifest exists; SW not yet registered)
- XML sitemap auto-generation from routes
- Sanity CMS (user opted for React+FastAPI recommended path)
