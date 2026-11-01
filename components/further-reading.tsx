import Link from "next/link"

export type Reading = { slug: string; title: string }

/**
 * Posts worth reading next, at the foot of each /uses/[slug] page.
 *
 * Mirrors RelatedUses. The posts link into these pages from their "Where we
 * fit" copy; this is the way back, so a reader who arrived by search can get
 * to the deeper material without the navigation, and the pages that bring the
 * traffic pick up links from the pages that convert it.
 */
export function FurtherReading({ items }: { items: Reading[] }) {
  if (items.length === 0) return null

  return (
    <section className="bg-white pt-12 pb-16 sm:pt-16 sm:pb-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-6 text-2xl font-semibold tracking-tight text-gray-900">
          Further reading
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {items.map((item) => (
            <Link
              key={item.slug}
              href={`/blog/${item.slug}`}
              className="group rounded-2xl border border-gray-200 bg-white p-5 transition-all hover:border-yellow-400 hover:shadow-md"
            >
              <span className="text-sm font-semibold tracking-tight text-gray-900 transition-colors group-hover:text-yellow-600">
                {item.title}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
