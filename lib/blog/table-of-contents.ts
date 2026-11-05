// Builds a table of contents from the post HTML, and gives each heading an id
// so the contents can link to it.
//
// Replaces @wisp-cms/table-of-content, which came with the CMS the posts used
// to live in. Same shape, no dependency.

export interface TableOfContentsItem {
  id: string
  title: string
  level: number
  children?: TableOfContentsItem[]
}

const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/<[^>]+>/g, "")
    .replace(/&[a-z]+;/g, " ")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 80)

export function generateTableOfContents(html: string): {
  modifiedHtml: string
  tableOfContents: TableOfContentsItem[]
} {
  const flat: TableOfContentsItem[] = []
  const used = new Map<string, number>()

  const modifiedHtml = html.replace(
    /<h([23])([^>]*)>([\s\S]*?)<\/h\1>/gi,
    (_m, levelStr: string, attrs: string, inner: string) => {
      const level = Number(levelStr)
      const title = inner
        .replace(/<[^>]+>/g, "")
        .replace(/&amp;|&#x26;/g, "&")
        .replace(/&#x27;|&#39;|&rsquo;/g, "'")
        .replace(/&quot;/g, '"')
        .replace(/&nbsp;/g, " ")
        .replace(/\s+/g, " ")
        .trim()
      if (!title) return _m

      let id = slugify(title) || `section-${flat.length + 1}`
      const seen = used.get(id)
      if (seen !== undefined) {
        used.set(id, seen + 1)
        id = `${id}-${seen + 1}`
      } else {
        used.set(id, 0)
      }

      flat.push({ id, title, level })
      const cleaned = attrs.replace(/\sid="[^"]*"/i, "")
      return `<h${level}${cleaned} id="${id}">${inner}</h${level}>`
    }
  )

  // Nest h3s under the preceding h2.
  const tableOfContents: TableOfContentsItem[] = []
  for (const item of flat) {
    if (item.level === 2) {
      tableOfContents.push({ ...item, children: [] })
    } else if (tableOfContents.length > 0) {
      tableOfContents[tableOfContents.length - 1].children!.push(item)
    } else {
      tableOfContents.push({ ...item, children: [] })
    }
  }

  return { modifiedHtml, tableOfContents }
}
