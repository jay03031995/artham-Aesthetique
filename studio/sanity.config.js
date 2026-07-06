import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemas/index.js";

const PROJECT_ID = "3goot0bo";
const DATASET = "production";

// Custom desk: a real "Appointment Dashboard" grouped by status, a Site Settings
// singleton, and grouped content sections.
const structure = (S) =>
  S.list()
    .title("Artham Aesthetique")
    .items([
      S.listItem()
        .title("⚙️  Site Settings & Menu")
        .child(S.document().schemaType("siteSettings").documentId("siteSettings")),
      S.divider(),

      S.listItem()
        .title("📅  Appointments")
        .child(
          S.list()
            .title("Appointments")
            .items([
              S.listItem()
                .title("🆕  New")
                .child(S.documentList().title("New").filter('_type == "appointment" && status == "new"').defaultOrdering([{ field: "createdAt", direction: "desc" }])),
              S.listItem()
                .title("✅  Confirmed")
                .child(S.documentList().title("Confirmed").filter('_type == "appointment" && status == "confirmed"').defaultOrdering([{ field: "preferredDate", direction: "asc" }])),
              S.listItem()
                .title("🎉  Completed")
                .child(S.documentList().title("Completed").filter('_type == "appointment" && status == "completed"')),
              S.listItem()
                .title("🚫  Cancelled")
                .child(S.documentList().title("Cancelled").filter('_type == "appointment" && status == "cancelled"')),
              S.divider(),
              S.listItem()
                .title("All appointments")
                .child(S.documentList().title("All appointments").filter('_type == "appointment"').defaultOrdering([{ field: "createdAt", direction: "desc" }])),
            ])
        ),
      S.divider(),

      S.listItem().title("💠  Treatments").child(S.documentTypeList("treatment").title("Treatments")),
      S.listItem().title("🗂️  Categories").child(S.documentTypeList("category").title("Categories")),
      S.listItem().title("✨  Before / After Results").child(S.documentTypeList("beforeAfter").title("Before / After Results")),
      S.listItem().title("👩‍⚕️  Doctors").child(S.documentTypeList("doctor").title("Doctors")),
      S.listItem().title("📰  Journal").child(S.documentTypeList("post").title("Journal Articles")),
      S.listItem().title("🎁  Offers").child(S.documentTypeList("offer").title("Offers")),
      S.listItem().title("💬  Testimonials").child(S.documentTypeList("testimonial").title("Testimonials")),
      S.listItem().title("❓  FAQs").child(S.documentTypeList("faq").title("FAQs")),
    ]);

export default defineConfig({
  name: "artham",
  title: "Artham Aesthetique",
  projectId: PROJECT_ID,
  dataset: DATASET,
  plugins: [structureTool({ structure }), visionTool()],
  schema: {
    types: schemaTypes,
    // Hide the singleton from the global "create new" menu
    templates: (templates) => templates.filter((t) => t.schemaType !== "siteSettings"),
  },
  document: {
    // Prevent duplicate/delete of the singleton
    actions: (input, context) =>
      context.schemaType === "siteSettings"
        ? input.filter(({ action }) => !["unpublish", "delete", "duplicate"].includes(action))
        : input,
  },
});
