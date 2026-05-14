import { getSiteConfig } from "@/lib/engine/resolve-site";

export async function buildWebPageJsonLd({
  name,
  description,
  path,
}: {
  name: string;
  description: string;
  path: string;
}) {
  const site = await getSiteConfig();
  const url = `${site.domain}${path}`;

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name,
    description,
    url,
  };
}
