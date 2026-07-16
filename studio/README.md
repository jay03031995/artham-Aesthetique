# Artham Aesthetique — Sanity Studio (CMS)

Headless CMS for the whole site: **Site Settings & Menu, Categories, Treatments,
Before/After Results, Doctors, Journal (Wikipedia-style articles), Offers,
Testimonials, FAQs**, and an **Appointments dashboard**.

- **Project ID:** `3goot0bo`
- **Dataset:** `production`
- **Studio config:** `sanity.config.js` (custom desk structure with grouped sections + an Appointments board)
- **Schemas:** `schemas/index.js`

## Prerequisites
Node 18+. The Studio needs a real install (~400–600 MB). **Free disk space first**
if the machine is low (see repo notes) — the install will fail otherwise.

## Run the Studio locally
```bash
cd studio
npm install
npm run dev            # http://localhost:3333
```
First run: `npx sanity login` (browser auth) if prompted.

## Deploy the hosted Studio
```bash
npm run deploy         # pick a subdomain → <name>.sanity.studio
```

## Environment
`studio/.env` (gitignored) holds:
```
SANITY_STUDIO_PROJECT_ID=3goot0bo
SANITY_STUDIO_DATASET=production
SANITY_TOKEN=<read+write token>     # used by seed scripts and backend form sync
```
⚠️ The token currently in `.env` was pasted in chat — **roll it** in
Sanity → Manage → API → Tokens and replace it here.

## Seed / re-seed content
Imports the static data (`frontend/src/data/{treatments,blog,site}.js`) into Sanity.
No dependencies — pure Node `fetch` + the Sanity HTTP API.
```bash
# copies the data files so Node can import them as ESM, then seeds
mkdir -p scripts/_data
cp ../frontend/src/data/treatments.js scripts/_data/treatments.mjs
cp ../frontend/src/data/blog.js       scripts/_data/blog.mjs
cp ../frontend/src/data/site.js       scripts/_data/site.mjs
SANITY_TOKEN=xxxx node scripts/seed.mjs
```
`createOrReplace` with deterministic IDs (`treatment-<slug>`, `post-<slug>`,
`category-<slug>`, `siteSettings`) → safe to re-run; it updates in place.

Seeded so far: 6 categories · 37 treatments · 6 journal articles · 1 doctor · site settings.
Images are stored as source **URLs** (`image.url`); replace with uploaded assets
(`image.asset`) in the Studio when real clinic photos are ready.

## Appointments dashboard
The FastAPI backend (`backend/server.py`) mirrors booking modal submissions and
contact callback requests into Sanity `appointment` documents. Staff manage them
in **Studio → 📅 Appointments** (New / Confirmed / Completed / Cancelled).

Backend needs `SANITY_TOKEN` in `backend/.env`; use `backend/.env.example` as the
template. Check `/api/sanity/status` after restarting the backend — it should show
`token_configured: true` and project id `3goot0bo`.

## Next: point the website at Sanity (Phase 2 — TODO)
The React frontend still reads from `frontend/src/data/*.js`. To make Sanity the
live source, add `@sanity/client` + `@sanity/image-url` to the frontend, create a
client + GROQ queries, and convert the pages (HomePage, CategoryPage, ServicePage,
BlogIndex/BlogPost, Doctors, About/Contact, a new Results page) to fetch from
Sanity. Schema field names mirror the current data shape to keep this a close 1:1 map.
