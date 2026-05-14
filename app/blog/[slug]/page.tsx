import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { PostContent } from "@/components/blog/post-content";
import { Badge } from "@/components/ui/badge";
import { getSiteConfig } from "@/lib/engine/resolve-site";
import { wisp } from "@/lib/wisp";

export const revalidate = 3600;

interface Params {
  slug: string;
}

type Props = {
  params: Promise<Params>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const result = await wisp.getPost(slug);
  if (!result.post) return { title: "Post Not Found" };

  const { title, description, image } = result.post;
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
  const [result, site] = await Promise.all([
    wisp.getPost(slug),
    getSiteConfig(),
  ]);

  if (!result.post) return notFound();

  const {
    title,
    publishedAt,
    createdAt,
    content,
    tags,
    image,
    updatedAt,
    author,
  } = result.post;

  const publishDate = publishedAt || createdAt;
  const formattedDate = format(new Date(publishDate), "MMMM dd, yyyy");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    image: image ?? undefined,
    datePublished: publishedAt
      ? new Date(publishedAt).toISOString()
      : undefined,
    dateModified: new Date(updatedAt).toISOString(),
    author: {
      "@type": "Person",
      name: author?.name ?? undefined,
      image: author?.image ?? undefined,
    },
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
          <h1 className="hero-text hero-text-bold text-white max-w-4xl text-4xl sm:text-5xl lg:text-6xl">
            {title}
          </h1>
        </div>
      </section>

      <article className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 bg-white">
        <div className="relative gap-14">
          <div>
            <PostContent content={content} title={title} />

            {tags.length > 0 && (
              <div className="mt-10 flex items-center gap-3">
                <span className="text-sm text-gray-500">Tags:</span>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Link key={tag.id} href={`/blog?tag=${tag.name}`}>
                      <Badge
                        variant="secondary"
                        className="cursor-pointer hover:bg-secondary/80"
                      >
                        {tag.name}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="my-8 text-sm text-gray-500">
              Published on {formattedDate}
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
