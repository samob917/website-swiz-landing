import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { PostContent } from "@/components/blog/post-content";
import { Badge } from "@/components/ui/badge";
import { getSiteConfig } from "@/lib/engine/resolve-site";
import { isHiddenPost } from "@/lib/blog/hidden-posts";
import { getAllSlugs, getPost } from "@/lib/blog/resolve-blog";

// Content is in the repo now, so these are built statically.
export const dynamicParams = false;

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

interface Params {
  slug: string;
}

type Props = {
  params: Promise<Params>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Post Not Found" };

  const { title, description, image } = post;
  return {
    title,
    description: description ?? "",
    openGraph: {
      title,
      description: description ?? "",
      images: image ? [image] : [],
    },
  };
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params;
  if (isHiddenPost(slug)) return notFound();

  const [post, site] = await Promise.all([
    Promise.resolve(getPost(slug)),
    getSiteConfig(),
  ]);

  if (!post) return notFound();

  const { title, publishedAt, content, tags, image, updatedAt } = post;

  const publishDate = publishedAt ?? updatedAt ?? new Date().toISOString();
  const formattedDate = format(new Date(publishDate), "MMMM dd, yyyy");
  // Same formula as the featured images, so the index card and the page agree.
  const words = content.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
  const minsRead = Math.max(3, Math.round(words / 200));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    image: image ?? undefined,
    datePublished: publishedAt
      ? new Date(publishedAt).toISOString()
      : undefined,
    dateModified: updatedAt ? new Date(updatedAt).toISOString() : undefined,
    author: { "@type": "Organization", name: site.name },
    publisher: {
      "@type": "Organization",
      name: site.name,
      url: site.domain,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="hero-background medical-pattern relative overflow-hidden pt-32 pb-16 sm:pt-40 sm:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <nav className="mb-6 text-sm text-white/60">
            <Link href="/blog" className="hover:text-white transition-colors">
              Blog
            </Link>
            <span className="mx-2">/</span>
            <span className="text-white/90">{title}</span>
          </nav>
          <h1 className="hero-text hero-text-bold text-white max-w-6xl text-3xl sm:text-5xl lg:text-[3.4rem] lg:leading-[1.1] text-balance">
            {title}
          </h1>
          <p className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm font-medium uppercase tracking-widest text-white/60">
            <span>{minsRead} min read</span>
            <span aria-hidden="true" className="text-white/30">·</span>
            <span>{formattedDate}</span>
          </p>
        </div>
      </section>

      <article className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 bg-white">
        <div className="relative gap-14">
          <div>
            {/* The featured image repeats the title, so it stays on the index cards and in link
                previews and does not open the article a second time here. */}
            <PostContent content={content} title={title} />

            {tags && tags.length > 0 && (
              <div className="mt-10 flex items-center gap-3">
                <span className="text-sm text-gray-500">Tags:</span>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Link key={tag} href={`/blog?tag=${encodeURIComponent(tag)}`}>
                      <Badge
                        variant="secondary"
                        className="cursor-pointer hover:bg-secondary/80"
                      >
                        {tag}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </article>
    </>
  );
}
