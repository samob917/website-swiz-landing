import type { MetadataRoute } from "next";
import { getSiteConfig } from "@/lib/engine/resolve-site";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const site = await getSiteConfig();
  const base = site.domain.replace(/\/$/, "");

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
