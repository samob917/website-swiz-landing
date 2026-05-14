import type { Metadata } from "next";
import { BlogIndexPage } from "@/components/blog/blog-index-page";
import { PageHeader } from "@/components/page-header";
import { getSiteConfig } from "@/lib/engine/resolve-site";
import { buildWebPageJsonLd } from "@/lib/json-ld";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteConfig();
  const blog = site.blog;

  return {
    title: blog?.seo.title ?? "Blog",
    description: blog?.seo.description,
  };
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string; page?: string }>;
}) {
  const site = await getSiteConfig();
  const blog = site.blog;

  const webPageJsonLd = await buildWebPageJsonLd({
    name: blog?.seo.title ?? "Blog",
    description:
      blog?.seo.description ??
      "Insights on medical scheduling, residency operations, and program management.",
    path: "/blog",
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }}
      />
      <PageHeader
        eyebrow="Blog"
        title={blog?.heading ?? "Blog"}
        description={blog?.subtitle}
      />
      <BlogIndexPage
        searchParams={searchParams}
        blogConfig={blog}
        hideHeading
      />
    </>
  );
}
