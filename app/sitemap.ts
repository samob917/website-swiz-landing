import type { MetadataRoute } from "next";
import { getSiteConfig } from "@/lib/engine/resolve-site";
import { getAllUsesData } from "@/lib/engine/resolve-uses";
import { isHiddenPost } from "@/lib/blog/hidden-posts";
import { wisp } from "@/lib/wisp";

// Revalidate hourly so newly published blog posts appear without a redeploy.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = await getSiteConfig();
  const base = site.domain.replace(/\/$/, "");
  const now = new Date();

  // Static, hand-maintained routes (one entry per app/<route>/page.tsx).
  const staticEntries: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/uses`, lastModified: now, changeFrequency: site.usesIndex?.sitemap?.changeFrequency ?? "weekly", priority: site.usesIndex?.sitemap?.priority ?? 0.9 },
    { url: `${base}/blog`, lastModified: now, changeFrequency: site.blog?.sitemap?.changeFrequency ?? "daily", priority: site.blog?.sitemap?.priority ?? 0.9 },
    { url: `${base}/demo`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/customers`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/team`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/compliance-checker`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
  ];

  // /uses/[slug] detail pages, sourced from content/uses/*.json.
  const usesPages = await getAllUsesData();
  const usesEntries: MetadataRoute.Sitemap = usesPages.map((page) => ({
    url: `${base}/uses/${page.slug}`,
    lastModified: now,
    changeFrequency: site.usesIndex?.sitemap?.changeFrequency ?? "monthly",
    priority: 0.7,
  }));

  // /blog/[slug] posts, paginated out of the Wisp CMS. Fail soft so a CMS
  // outage never breaks the build — the static + uses entries still render.
  const blogEntries: MetadataRoute.Sitemap = [];
  try {
    let page = 1;
    while (true) {
      const result = await wisp.getPosts({ page, limit: 100 });
      for (const post of result.posts) {
        if (isHiddenPost(post.slug)) continue;
        blogEntries.push({
          url: `${base}/blog/${post.slug}`,
          lastModified: post.updatedAt ? new Date(post.updatedAt) : now,
          changeFrequency: site.blog?.sitemap?.changeFrequency ?? "weekly",
          priority: 0.6,
        });
      }
      if (page >= (result.pagination.totalPages ?? 1)) break;
      page++;
    }
  } catch (error) {
    console.error("sitemap: failed to fetch blog posts", error);
  }

  return [...staticEntries, ...usesEntries, ...blogEntries];
}
