import Link from "next/link"

export type RelatedUse = {
  slug: string
  anchor?: string
  heroTitle: string
}

/**
 * Sibling use-case links at the foot of each /uses/[slug] page.
 *
 * Before this, every detail page had exactly one inbound internal link, from
 * the /uses index, so link equity reached them single file and none of them
 * passed any onward. Cross-linking within a category spreads it and gives a
 * reader on, say, a call-scheduling page somewhere relevant to go next.
 */
export function RelatedUses({ items }: { items: RelatedUse[] }) {
  if (items.length === 0) return null

  return (
    <section className="bg-white pb-16 sm:pb-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-6 text-2xl font-semibold tracking-tight text-gray-900">
          Related
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <Link
              key={item.slug}
              href={`/uses/${item.slug}`}
              className="group rounded-2xl border border-gray-200 bg-white p-5 transition-all hover:border-yellow-400 hover:shadow-md"
            >
              <span className="text-sm font-semibold tracking-tight text-gray-900 transition-colors group-hover:text-yellow-600">
                {item.anchor ?? item.heroTitle}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
