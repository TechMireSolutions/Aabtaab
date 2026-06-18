/**
 * One-time Sanity dataset migration for renamed CMS fields.
 *
 * Usage (from project root, with .env.local or exported vars):
 *   NEXT_PUBLIC_SANITY_PROJECT_ID=xxx \
 *   NEXT_PUBLIC_SANITY_DATASET=production \
 *   SANITY_API_TOKEN=xxx \
 *   node scripts/migrate-sanity-fields.mjs
 *
 * Dry run (no writes):
 *   DRY_RUN=1 node scripts/migrate-sanity-fields.mjs
 */

import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_TOKEN;
const dryRun = process.env.DRY_RUN === "1";

if (!projectId || !token) {
  console.error(
    "Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_TOKEN environment variables.",
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2025-06-18",
  useCdn: false,
});

function mapDescToDescription(items) {
  if (!Array.isArray(items)) return items;
  return items.map((item) => {
    if (!item || typeof item !== "object") return item;
    if (item.desc === undefined) return item;
    const { desc, ...rest } = item;
    return { ...rest, description: desc };
  });
}

function buildSeoObject(doc) {
  const seo = { ...(doc.seo || {}) };
  if (doc.seoTitle) seo.metaTitle = doc.seoTitle;
  if (doc.seoDescription) seo.metaDescription = doc.seoDescription;
  return Object.keys(seo).length > 0 ? seo : undefined;
}

function migrateCourseOrService(doc) {
  const set = {};
  const unset = [];

  if (Array.isArray(doc.faq) && doc.faq.length > 0) {
    set.faqItems = doc.faq;
    unset.push("faq");
  }

  const seo = buildSeoObject(doc);
  if (seo) set.seo = seo;
  if (doc.seoTitle) unset.push("seoTitle");
  if (doc.seoDescription) unset.push("seoDescription");

  if (doc.ctaBtn1Label) {
    set.ctaPrimaryLabel = doc.ctaBtn1Label;
    unset.push("ctaBtn1Label");
  }
  if (doc.ctaBtn2Label) {
    set.ctaSecondaryLabel = doc.ctaBtn2Label;
    unset.push("ctaBtn2Label");
  }
  if (doc.faqSectionHeading) {
    set.faqHeading = doc.faqSectionHeading;
    unset.push("faqSectionHeading");
  }

  for (const field of [
    "outcomes",
    "whyUs",
    "howItWorks",
    "commitment",
  ]) {
    if (Array.isArray(doc[field])) {
      set[field] = mapDescToDescription(doc[field]);
    }
  }

  return { set, unset };
}

function migratePage(doc) {
  const set = {};
  const unset = [];

  const seo = buildSeoObject(doc);
  if (seo) set.seo = seo;
  if (doc.seoTitle) unset.push("seoTitle");
  if (doc.seoDescription) unset.push("seoDescription");

  if (doc.slug?.current === "articles") {
    set.slug = { ...doc.slug, current: "posts" };
  }

  return { set, unset };
}

function migrateSiteSettings(doc) {
  const set = {};
  if (Array.isArray(doc.donateCauses)) {
    set.donateCauses = mapDescToDescription(doc.donateCauses);
  }
  return { set, unset: [] };
}

function hasChanges({ set, unset }) {
  return Object.keys(set).length > 0 || unset.length > 0;
}

async function applyPatch(id, { set, unset }) {
  if (!hasChanges({ set, unset })) return false;

  if (dryRun) {
    console.log(`[dry-run] would patch ${id}`, { set, unset });
    return true;
  }

  let patch = client.patch(id);
  if (Object.keys(set).length > 0) patch = patch.set(set);
  if (unset.length > 0) patch = patch.unset(unset);
  await patch.commit();
  return true;
}

async function run() {
  console.log(
    `Migrating dataset "${dataset}"${dryRun ? " (DRY RUN)" : ""}...`,
  );

  const [courses, services, pages, siteSettingsList] = await Promise.all([
    client.fetch(`*[_type == "course"]`),
    client.fetch(`*[_type == "service"]`),
    client.fetch(`*[_type == "page"]`),
    client.fetch(`*[_type == "siteSettings"]`),
  ]);

  let patched = 0;

  for (const doc of courses) {
    if (await applyPatch(doc._id, migrateCourseOrService(doc))) patched++;
  }
  for (const doc of services) {
    if (await applyPatch(doc._id, migrateCourseOrService(doc))) patched++;
  }
  for (const doc of pages) {
    if (await applyPatch(doc._id, migratePage(doc))) patched++;
  }
  for (const doc of siteSettingsList) {
    if (await applyPatch(doc._id, migrateSiteSettings(doc))) patched++;
  }

  console.log(`Done. ${patched} document(s) ${dryRun ? "would be " : ""}updated.`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
