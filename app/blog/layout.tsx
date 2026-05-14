import type { Metadata } from "next";
import { getSiteConfig } from "@/lib/engine/resolve-site";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteConfig();
  const titleTemplate = site.blog?.seo.titleTemplate;

  return {
    ...(titleTemplate && {
      title: {
        template: titleTemplate,
        default: site.blog?.seo.title ?? "Blog",
      },
    }),
  };
}

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
