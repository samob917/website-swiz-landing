import type { MetadataRoute } from "next";
import { getSiteConfig } from "@/lib/engine/resolve-site";
import { getAllUsesData } from "@/lib/engine/resolve-uses";

// Revalidate hourly so newly added pages appear without a redeploy.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = await getSiteConfig();
  const base = site.domain.replace(/\/$/, "");
  // Every URL previously reported lastmod as "now", regenerated hourly, which
  // claims the whole site changes every hour. It does not, and Google responds
  // to that by ignoring lastmod altogether. Real dates instead: content files
  // carry updatedAt, and hand-maintained routes get a date that only moves
  // when someone edits them.
  const STATIC_ROUTES_UPDATED = new Date("2026-10-30T00:00:00.000Z");

  // Static, hand-maintained routes (one entry per app/<route>/page.tsx).
  const staticEntries: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: STATIC_ROUTES_UPDATED, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/uses`, lastModified: STATIC_ROUTES_UPDATED, changeFrequency: site.usesIndex?.sitemap?.changeFrequency ?? "weekly", priority: site.usesIndex?.sitemap?.priority ?? 0.9 },
    { url: `${base}/demo`, lastModified: STATIC_ROUTES_UPDATED, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/customers`, lastModified: STATIC_ROUTES_UPDATED, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/team`, lastModified: STATIC_ROUTES_UPDATED, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/contact`, lastModified: STATIC_ROUTES_UPDATED, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/privacy`, lastModified: STATIC_ROUTES_UPDATED, changeFrequency: "yearly", priority: 0.3 },
  ];

  // /uses/[slug] detail pages, sourced from content/uses/*.json.
  const usesPages = await getAllUsesData();
  const usesEntries: MetadataRoute.Sitemap = usesPages.map((page) => ({
    url: `${base}/uses/${page.slug}`,
    lastModified: page.updatedAt ? new Date(page.updatedAt) : STATIC_ROUTES_UPDATED,
    changeFrequency: site.usesIndex?.sitemap?.changeFrequency ?? "monthly",
    priority: 0.7,
  }));

  return [...staticEntries, ...usesEntries];
}
