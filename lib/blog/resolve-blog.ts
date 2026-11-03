// Blog content, read from content/blog/*.json.
//
// The posts used to be fetched from Wisp CMS at request time. They were
// migrated into the repo because Wisp's API is read-only: there was no way to
// correct the factual errors in the content while it lived there. Keeping it
// here also means the posts are version-controlled and reviewable in a diff,
// and the site no longer depends on a CMS account set up by a contractor.
//
// Same shape as lib/engine/resolve-uses.ts, which does this for /uses.

import fs from "node:fs"
import path from "node:path"
import site from "@/content/site.json"

export interface BlogPost {
  slug: string
  title: string
  description: string
  image: string
  publishedAt: string | null
  updatedAt: string | null
  tags: string[]
  content: string
  /** false holds a post back from the index and returns 404 for its page. */
  publish?: boolean
  excludedReason?: string
}

const DIR = path.join(process.cwd(), "content", "blog")

function readAll(): BlogPost[] {
  // content/site.json "blogLive" is the one switch for the blog. Off, no
  // post exists anywhere on the site: not on /blog (which redirects home in
  // next.config.mjs), not in the sitemap, not in a use page's further reading.
  if (site.blogLive !== true && process.env.BLOG_LIVE !== "true") return []
  let files: string[] = []
  try {
    files = fs.readdirSync(DIR).filter((f) => f.endsWith(".json"))
  } catch {
    return []
  }
  return files
    .map((f) => JSON.parse(fs.readFileSync(path.join(DIR, f), "utf8")) as BlogPost)
    .filter((p) => p.publish !== false)
    .sort((a, b) => {
      const at = a.publishedAt ? Date.parse(a.publishedAt) : 0
      const bt = b.publishedAt ? Date.parse(b.publishedAt) : 0
      return bt - at
    })
}

let cache: BlogPost[] | null = null
const all = () => (cache ??= readAll())

export function getAllPosts(): BlogPost[] {
  return all()
}

export function getAllSlugs(): string[] {
  return all().map((p) => p.slug)
}

export function getPost(slug: string): BlogPost | null {
  return all().find((p) => p.slug === slug) ?? null
}

/**
 * Other posts to link to from the foot of a post. Shares tags where it can,
 * and falls back to the most recent, so every post links onward rather than
 * dead-ending.
 */
export function getRelatedPosts(slug: string, limit = 3): BlogPost[] {
  const posts = all()
  const current = posts.find((p) => p.slug === slug)
  if (!current) return posts.slice(0, limit)
  const tags = new Set(current.tags ?? [])
  const scored = posts
    .filter((p) => p.slug !== slug)
    .map((p) => ({ p, shared: (p.tags ?? []).filter((t) => tags.has(t)).length }))
    .sort((a, b) => b.shared - a.shared)
  return scored.slice(0, limit).map((s) => s.p)
}
