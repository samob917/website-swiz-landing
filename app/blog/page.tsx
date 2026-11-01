import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"

import { PageHeader } from "@/components/page-header"
import { SectionContainer } from "@/components/section-container"
import { getSiteConfig } from "@/lib/engine/resolve-site"
import { buildWebPageJsonLd } from "@/lib/json-ld"
import { getAllPosts } from "@/lib/blog/resolve-blog"

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteConfig()
  return {
    title: site.blog?.seo.title ?? "Blog",
    description: site.blog?.seo.description,
    alternates: { canonical: "/blog" },
  }
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string }>
}) {
  const site = await getSiteConfig()
  const { tag } = await searchParams

  // Posts come from content/blog/*.json rather than a CMS, so the index is
  // rendered on the server with no client-side fetch.
  const all = getAllPosts()
  const posts = tag ? all.filter((p) => (p.tags ?? []).includes(tag)) : all

  const webPageJsonLd = await buildWebPageJsonLd({
    name: site.blog?.seo.title ?? "Blog",
    description:
      site.blog?.seo.description ??
      "Scheduling, ACGME compliance and program operations for GME teams.",
    path: "/blog",
  })

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }}
      />
      <PageHeader
        eyebrow="Blog"
        title={site.blog?.heading ?? "Blog"}
        description={site.blog?.subtitle}
      />
      <SectionContainer>
        {tag && (
          <p className="mb-8 text-sm text-gray-500">
            Showing posts tagged <span className="font-medium text-gray-900">{tag}</span>.{" "}
            <Link href="/blog" className="underline underline-offset-2 hover:text-gray-700">
              Show all
            </Link>
          </p>
        )}

        {posts.length === 0 ? (
          <p className="text-base text-gray-500">No posts yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all hover:border-yellow-400 hover:shadow-md"
              >
                {post.image && (
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-gray-100">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex flex-1 flex-col p-6">
                  <h2 className="mb-2 text-base font-semibold leading-snug tracking-tight text-gray-900 transition-colors group-hover:text-yellow-600">
                    {post.title}
                  </h2>
                  <p className="line-clamp-4 text-sm leading-relaxed text-gray-600">
                    {post.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </SectionContainer>
    </>
  )
}
