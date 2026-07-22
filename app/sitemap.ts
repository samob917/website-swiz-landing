import type { MetadataRoute } from "next";
import { getSiteConfig } from "@/lib/engine/resolve-site";
import { getAllUsesData } from "@/lib/engine/resolve-uses";

// Revalidate hourly so newly added pages appear without a redeploy.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = await getSiteConfig();
  const base = site.domain.replace(/\/$/, "");
  const now = new Date();

  // Static, hand-maintained routes (one entry per app/<route>/page.tsx).
  const staticEntries: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/uses`, lastModified: now, changeFrequency: site.usesIndex?.sitemap?.changeFrequency ?? "weekly", priority: site.usesIndex?.sitemap?.priority ?? 0.9 },
    { url: `${base}/demo`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/customers`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/team`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/get-a-quote`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
  ];

  // /uses/[slug] detail pages, sourced from content/uses/*.json.
  const usesPages = await getAllUsesData();
  const usesEntries: MetadataRoute.Sitemap = usesPages.map((page) => ({
    url: `${base}/uses/${page.slug}`,
    lastModified: now,
    changeFrequency: site.usesIndex?.sitemap?.changeFrequency ?? "monthly",
    priority: 0.7,
  }));

  return [...staticEntries, ...usesEntries];
}
