// Artham Aesthetique — Sanity schema set
// Covers every section of the site: site settings + menu, categories, treatments,
// doctors, before/after results, journal (Wikipedia-style), offers, testimonials,
// FAQs, and appointments (the booking dashboard).

/* ---------- reusable objects ---------- */

const imageWithUrl = (name = "image", title = "Image") => ({
  name,
  title,
  type: "object",
  options: { collapsed: false },
  fields: [
    { name: "asset", title: "Uploaded image", type: "image", options: { hotspot: true } },
    { name: "url", title: "…or paste an image URL", type: "url" },
    { name: "alt", title: "Alt text", type: "string" },
  ],
  preview: {
    select: { media: "asset", title: "alt", subtitle: "url" },
  },
});

const qa = {
  name: "qa",
  title: "Q&A",
  type: "object",
  fields: [
    { name: "q", title: "Question", type: "string" },
    { name: "a", title: "Answer", type: "text", rows: 3 },
  ],
  preview: { select: { title: "q" } },
};

const step = {
  name: "step",
  title: "Step",
  type: "object",
  fields: [
    { name: "title", title: "Title", type: "string" },
    { name: "body", title: "Body", type: "text", rows: 2 },
  ],
  preview: { select: { title: "title", subtitle: "body" } },
};

const labelValue = (name, title) => ({
  name,
  title,
  type: "object",
  fields: [
    { name: "label", title: "Label", type: "string" },
    { name: "value", title: "Value", type: "string" },
  ],
  preview: { select: { title: "label", subtitle: "value" } },
});

const link = {
  name: "link",
  title: "Link",
  type: "object",
  fields: [
    { name: "label", title: "Label", type: "string" },
    { name: "url", title: "URL", type: "url" },
  ],
  preview: { select: { title: "label", subtitle: "url" } },
};

/* ---------- journal (Wikipedia-style) block model ---------- */

const journalBlock = {
  name: "journalBlock",
  title: "Block",
  type: "object",
  fields: [
    {
      name: "type",
      title: "Type",
      type: "string",
      options: {
        list: [
          { title: "Paragraph", value: "p" },
          { title: "Bullet list", value: "ul" },
          { title: "Numbered list", value: "ol" },
          { title: "Table", value: "table" },
          { title: "Quote", value: "quote" },
        ],
        layout: "radio",
      },
      initialValue: "p",
    },
    { name: "text", title: "Text (paragraph / quote)", type: "text", rows: 3, hidden: ({ parent }) => !["p", "quote"].includes(parent?.type) },
    { name: "items", title: "List items", type: "array", of: [{ type: "string" }], hidden: ({ parent }) => !["ul", "ol"].includes(parent?.type) },
    { name: "head", title: "Table header cells", type: "array", of: [{ type: "string" }], hidden: ({ parent }) => parent?.type !== "table" },
    {
      name: "rows",
      title: "Table rows",
      type: "array",
      hidden: ({ parent }) => parent?.type !== "table",
      of: [
        {
          type: "object",
          name: "row",
          fields: [{ name: "cells", title: "Cells", type: "array", of: [{ type: "string" }] }],
          preview: { select: { cells: "cells" }, prepare: ({ cells }) => ({ title: (cells || []).join(" · ") }) },
        },
      ],
    },
  ],
  preview: {
    select: { type: "type", text: "text" },
    prepare: ({ type, text }) => ({ title: `[${type}] ${text || ""}`.slice(0, 60) }),
  },
};

const journalSection = {
  name: "journalSection",
  title: "Section",
  type: "object",
  fields: [
    { name: "heading", title: "Heading", type: "string" },
    { name: "level", title: "Level (2 = H2, 3 = H3)", type: "number", initialValue: 2 },
    { name: "id", title: "Anchor id (auto if blank)", type: "string" },
    { name: "blocks", title: "Blocks", type: "array", of: [journalBlock] },
  ],
  preview: { select: { title: "heading", subtitle: "level" }, prepare: ({ title, subtitle }) => ({ title, subtitle: `H${subtitle || 2}` }) },
};

/* ---------- documents ---------- */

const siteSettings = {
  name: "siteSettings",
  title: "Site Settings & Menu",
  type: "document",
  groups: [
    { name: "brand", title: "Brand" },
    { name: "contact", title: "Contact" },
    { name: "media", title: "Media" },
    { name: "menu", title: "Navigation Menu" },
    { name: "social", title: "Social" },
  ],
  fields: [
    { name: "title", title: "Clinic name", type: "string", group: "brand" },
    { name: "tagline", title: "Tagline", type: "string", group: "brand" },
    { name: "wordmarkDeva", title: "Devanagari wordmark", type: "string", group: "brand" },
    { name: "phone", title: "Phone (display)", type: "string", group: "contact" },
    { name: "phoneDigits", title: "Phone (digits only)", type: "string", group: "contact" },
    { name: "hours", title: "Hours", type: "string", group: "contact" },
    {
      name: "address",
      title: "Address",
      type: "object",
      group: "contact",
      fields: [
        { name: "line1", type: "string", title: "Line 1" },
        { name: "line2", type: "string", title: "Line 2" },
        { name: "line3", type: "string", title: "Line 3" },
      ],
    },
    { ...imageWithUrl("logo", "Logo"), group: "media" },
    { ...imageWithUrl("footerLogo", "Footer logo"), group: "media" },
    { ...imageWithUrl("doctorPortrait", "Doctor portrait"), group: "media" },
    { ...imageWithUrl("heroImage", "Hero image"), group: "media" },
    { name: "heroVideoUrl", title: "Hero video URL", type: "string", group: "media" },
    {
      name: "nav",
      title: "Primary nav items",
      type: "array",
      group: "menu",
      of: [
        {
          type: "object",
          name: "navItem",
          fields: [
            { name: "label", title: "Label", type: "string" },
            { name: "href", title: "Link (path)", type: "string" },
          ],
          preview: { select: { title: "label", subtitle: "href" } },
        },
      ],
    },
    {
      name: "megaGroups",
      title: "Treatments mega-menu groups",
      type: "array",
      group: "menu",
      of: [
        {
          type: "object",
          name: "megaGroup",
          fields: [
            { name: "heading", title: "Heading", type: "string" },
            { name: "category", title: "Category link", type: "reference", to: [{ type: "category" }] },
            { name: "treatments", title: "Treatments shown", type: "array", of: [{ type: "reference", to: [{ type: "treatment" }] }] },
          ],
          preview: { select: { title: "heading" } },
        },
      ],
    },
    {
      name: "social",
      title: "Social links",
      type: "object",
      group: "social",
      fields: ["instagram", "facebook", "x", "linkedin", "youtube", "whatsapp"].map((s) => ({ name: s, title: s[0].toUpperCase() + s.slice(1), type: "url" })),
    },
  ],
  preview: { prepare: () => ({ title: "Site Settings & Menu" }) },
};

const category = {
  name: "category",
  title: "Category",
  type: "document",
  fields: [
    { name: "title", title: "Name", type: "string", validation: (R) => R.required() },
    { name: "slug", title: "Slug", type: "slug", options: { source: "title" }, validation: (R) => R.required() },
    { name: "intro", title: "Intro", type: "text", rows: 2 },
    imageWithUrl("image", "Image"),
    { name: "order", title: "Order", type: "number", initialValue: 0 },
  ],
  orderings: [{ title: "Manual order", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "title", subtitle: "intro", media: "image.asset" } },
};

const treatment = {
  name: "treatment",
  title: "Treatment",
  type: "document",
  groups: [
    { name: "main", title: "Main", default: true },
    { name: "content", title: "Content" },
    { name: "process", title: "Process & FAQ" },
  ],
  fields: [
    { name: "title", title: "Name", type: "string", group: "main", validation: (R) => R.required() },
    { name: "slug", title: "Slug", type: "slug", options: { source: "title" }, group: "main", validation: (R) => R.required() },
    { name: "category", title: "Category", type: "reference", to: [{ type: "category" }], group: "main" },
    { name: "short", title: "Short description", type: "text", rows: 2, group: "main" },
    { name: "hero", title: "Hero line", type: "text", rows: 2, group: "main" },
    { ...imageWithUrl("image", "Image"), group: "main" },
    { name: "featured", title: "Featured (signature)", type: "boolean", initialValue: false, group: "main" },
    { name: "order", title: "Order", type: "number", initialValue: 0, group: "main" },
    { name: "what", title: "What is it", type: "text", rows: 4, group: "content" },
    { name: "whoFor", title: "Who it's for", type: "array", of: [{ type: "string" }], group: "content" },
    { name: "benefits", title: "Benefits", type: "array", of: [{ type: "string" }], group: "content" },
    { name: "duration", title: "Duration", type: "string", group: "content" },
    { name: "sessions", title: "Sessions", type: "string", group: "content" },
    { name: "downtime", title: "Downtime notes", type: "array", of: [{ type: "string" }], group: "content" },
    { name: "howItWorks", title: "How it works (steps)", type: "array", of: [step], group: "process" },
    { name: "doctorNote", title: "Doctor's note", type: "text", rows: 3, group: "process" },
    { name: "faqs", title: "FAQs", type: "array", of: [qa], group: "process" },
  ],
  orderings: [{ title: "Manual order", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "title", subtitle: "short", media: "image.asset" } },
};

const doctor = {
  name: "doctor",
  title: "Doctor",
  type: "document",
  fields: [
    { name: "name", title: "Name", type: "string", validation: (R) => R.required() },
    { name: "slug", title: "Slug", type: "slug", options: { source: "name" }, validation: (R) => R.required() },
    { name: "title", title: "Title / credentials", type: "string" },
    imageWithUrl("portrait", "Portrait"),
    { name: "bio", title: "Bio", type: "array", of: [{ type: "text", rows: 3 }] },
    { name: "education", title: "Education", type: "array", of: [{ type: "string" }] },
    { name: "memberships", title: "Memberships", type: "array", of: [{ type: "string" }] },
    { name: "expertise", title: "Expertise", type: "array", of: [{ type: "string" }] },
    { name: "philosophy", title: "Philosophy", type: "text", rows: 4 },
  ],
  preview: { select: { title: "name", subtitle: "title", media: "portrait.asset" } },
};

const beforeAfter = {
  name: "beforeAfter",
  title: "Before / After Result",
  type: "document",
  fields: [
    { name: "title", title: "Title", type: "string", validation: (R) => R.required() },
    { name: "treatment", title: "Treatment", type: "reference", to: [{ type: "treatment" }] },
    { name: "category", title: "Category", type: "reference", to: [{ type: "category" }] },
    imageWithUrl("beforeImage", "Before image"),
    imageWithUrl("afterImage", "After image"),
    { name: "sessionsInfo", title: "Sessions / timeline", type: "string" },
    { name: "note", title: "Note", type: "text", rows: 3 },
    { name: "consent", title: "Patient consent on file", type: "boolean", initialValue: false, validation: (R) => R.required() },
    { name: "publishedAt", title: "Published at", type: "datetime" },
    { name: "order", title: "Order", type: "number", initialValue: 0 },
  ],
  preview: { select: { title: "title", subtitle: "sessionsInfo", media: "afterImage.asset" } },
};

const post = {
  name: "post",
  title: "Journal Article",
  type: "document",
  groups: [
    { name: "main", title: "Main", default: true },
    { name: "body", title: "Body" },
    { name: "meta", title: "Links & Refs" },
  ],
  fields: [
    { name: "title", title: "Title", type: "string", group: "main", validation: (R) => R.required() },
    { name: "slug", title: "Slug", type: "slug", options: { source: "title" }, group: "main", validation: (R) => R.required() },
    { name: "category", title: "Category", type: "string", group: "main" },
    { name: "excerpt", title: "Excerpt / description", type: "text", rows: 2, group: "main" },
    { ...imageWithUrl("cover", "Cover image"), group: "main" },
    { name: "date", title: "Published date", type: "date", group: "main" },
    { name: "updated", title: "Updated date", type: "date", group: "main" },
    { name: "keywords", title: "Keywords (drive auto-backlinks)", type: "array", of: [{ type: "string" }], options: { layout: "tags" }, group: "main" },
    { name: "aliases", title: "Aliases", type: "array", of: [{ type: "string" }], options: { layout: "tags" }, group: "main" },
    { name: "lead", title: "Lead paragraphs", type: "array", of: [{ type: "text", rows: 3 }], group: "body" },
    { name: "sections", title: "Sections", type: "array", of: [journalSection], group: "body" },
    { name: "keyFacts", title: "Infobox key facts", type: "array", of: [labelValue("keyFact", "Key fact")], group: "meta" },
    { name: "references", title: "References", type: "array", of: [link], group: "meta" },
    { name: "faq", title: "FAQ", type: "array", of: [qa], group: "meta" },
    { name: "furtherReading", title: "Further reading", type: "array", of: [link], group: "meta" },
  ],
  preview: { select: { title: "title", subtitle: "category", media: "cover.asset" } },
};

const offer = {
  name: "offer",
  title: "Offer",
  type: "document",
  fields: [
    { name: "title", title: "Title", type: "string", validation: (R) => R.required() },
    { name: "slug", title: "Slug", type: "slug", options: { source: "title" } },
    { name: "blurb", title: "Blurb", type: "text", rows: 3 },
    { name: "terms", title: "Terms", type: "text", rows: 2 },
    { name: "validTill", title: "Valid till", type: "date" },
    { name: "active", title: "Active", type: "boolean", initialValue: true },
    imageWithUrl("image", "Image"),
  ],
  preview: { select: { title: "title", subtitle: "blurb" } },
};

const testimonial = {
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  fields: [
    { name: "name", title: "Guest name", type: "string" },
    { name: "quote", title: "Quote", type: "text", rows: 3 },
    { name: "treatment", title: "Treatment", type: "reference", to: [{ type: "treatment" }] },
    { name: "rating", title: "Rating (1–5)", type: "number", initialValue: 5 },
    { name: "order", title: "Order", type: "number", initialValue: 0 },
  ],
  preview: { select: { title: "name", subtitle: "quote" } },
};

const faq = {
  name: "faq",
  title: "FAQ (global)",
  type: "document",
  fields: [
    { name: "q", title: "Question", type: "string", validation: (R) => R.required() },
    { name: "a", title: "Answer", type: "text", rows: 3 },
    { name: "order", title: "Order", type: "number", initialValue: 0 },
  ],
  preview: { select: { title: "q" } },
};

const appointment = {
  name: "appointment",
  title: "Appointment",
  type: "document",
  fields: [
    { name: "name", title: "Name", type: "string" },
    { name: "phone", title: "Phone", type: "string" },
    { name: "email", title: "Email", type: "string" },
    { name: "treatmentName", title: "Treatment", type: "string" },
    { name: "category", title: "Category", type: "string" },
    { name: "preferredDate", title: "Preferred date", type: "date" },
    { name: "preferredTime", title: "Preferred time", type: "string" },
    { name: "note", title: "Note", type: "text", rows: 2 },
    {
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "New", value: "new" },
          { title: "Confirmed", value: "confirmed" },
          { title: "Completed", value: "completed" },
          { title: "Cancelled", value: "cancelled" },
        ],
        layout: "radio",
      },
      initialValue: "new",
    },
    { name: "source", title: "Source", type: "string", initialValue: "website" },
    { name: "createdAt", title: "Created at", type: "datetime" },
  ],
  orderings: [{ title: "Newest", name: "createdAtDesc", by: [{ field: "createdAt", direction: "desc" }] }],
  preview: {
    select: { title: "name", phone: "phone", treatment: "treatmentName", status: "status", date: "preferredDate" },
    prepare: ({ title, phone, treatment, status, date }) => ({
      title: `${title || "—"} · ${phone || ""}`,
      subtitle: `${(status || "new").toUpperCase()} · ${treatment || "consult"} · ${date || ""}`,
    }),
  },
};

export const schemaTypes = [
  // documents
  siteSettings,
  category,
  treatment,
  doctor,
  beforeAfter,
  post,
  offer,
  testimonial,
  faq,
  appointment,
];
