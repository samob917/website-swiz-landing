import type { SiteConfig } from "./types";
import siteJson from "@/content/site.json";
import { siteConfigSchema } from "./schemas";

export async function getSiteConfig(): Promise<SiteConfig> {
  return siteConfigSchema.parse(siteJson) as SiteConfig;
}
