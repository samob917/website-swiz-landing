import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSiteConfig } from "@/lib/engine/resolve-site";
import {
  getAllUsesSlugs,
  getUsesData,
  getAllUsesData,
} from "@/lib/engine/resolve-uses";
import { UsesPageContent } from "@/components/uses-page-content";
import { SectionContainer } from "@/components/section-container";
import { PageHeader } from "@/components/page-header";
import { buildWebPageJsonLd } from "@/lib/json-ld";

export const dynamicParams = false;

export async function generateStaticParams() {
  const slugs = await getAllUsesSlugs();
  return [{ slug: undefined }, ...slugs.map((s) => ({ slug: [s] }))];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const site = await getSiteConfig();

  if (!slug) {
    const indexSeo = site.usesIndex?.seo;
    if (!indexSeo) return {};
    return {
      title: indexSeo.title,
      description: indexSeo.description,
      openGraph: {
        title: indexSeo.title,
        description: indexSeo.description,
        images: [site.globalSeo.ogImage],
      },
    };
  }

  const page = await getUsesData(slug[0]);
  if (!page) return {};

  return {
    title: page.seoMetadata.metaTitle,
    description: page.seoMetadata.metaDescription,
    openGraph: {
      title: page.seoMetadata.metaTitle,
      description: page.seoMetadata.metaDescription,
      images: [site.globalSeo.ogImage],
    },
  };
}

export default async function UsesPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await params;
  const site = await getSiteConfig();

  // Index: /uses
  if (!slug) {
    const allUses = await getAllUsesData();
    const usesIndex = site.usesIndex;
    if (!usesIndex) notFound();

    const categoryLabels = usesIndex.categoryLabels;

    const grouped = new Map<string, typeof allUses>();
    for (const use of allUses) {
      if (!grouped.has(use.category)) grouped.set(use.category, []);
      grouped.get(use.category)!.push(use);
    }

    const orderedCategories = [
      ...Object.keys(categoryLabels).filter((k) => grouped.has(k)),
      ...[...grouped.keys()].filter((k) => !(k in categoryLabels)),
    ];

    const indexJsonLd = await buildWebPageJsonLd({
      name: usesIndex.seo.title,
      description: usesIndex.seo.description,
      path: "/uses",
    });

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(indexJsonLd) }}
        />
        <PageHeader
          eyebrow="Use Cases"
          title={usesIndex.heading}
          description={usesIndex.description}
        />
        <SectionContainer>
            {allUses.length === 0 && (
              <p className="text-gray-500 text-base">
                Use cases coming soon.
              </p>
            )}

            {orderedCategories.map((cat) => (
              <section key={cat} className="mb-14">
                <h2 className="mb-6 text-2xl font-semibold tracking-tight text-gray-900">
                  {categoryLabels[cat] ?? cat}
                </h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {grouped.get(cat)!.map((use) => (
                    <Link
                      key={use.slug}
                      href={`/uses/${use.slug}`}
                      className="group rounded-2xl border border-gray-200 bg-white p-6 transition-all hover:border-yellow-400 hover:shadow-md"
                    >
                      <h3 className="mb-2 text-base font-semibold tracking-tight text-gray-900 group-hover:text-yellow-600 transition-colors">
                        {use.anchor ?? use.data.hero.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-gray-600 line-clamp-4">
                        {use.paragraph ?? use.data.hero.description}
                      </p>
                    </Link>
                  ))}
                </div>
              </section>
            ))}
        </SectionContainer>
      </>
    );
  }

  // Detail: /uses/[slug]
  const page = await getUsesData(slug[0]);
  if (!page) notFound();

  const webPageJsonLd = await buildWebPageJsonLd({
    name: page.seoMetadata.metaTitle,
    description: page.seoMetadata.metaDescription,
    path: `/uses/${slug[0]}`,
  });

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.data.faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <UsesPageContent
        data={page.data}
        featureImageMap={site.featureImageMap}
      />
    </>
  );
}
