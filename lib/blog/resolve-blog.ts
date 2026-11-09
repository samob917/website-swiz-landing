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
  /**
   * Weekly release: the post goes live this many weeks after
   * site.json "blogLaunchDate". Until then it does not exist anywhere on the
   * site, and links to it from other posts are unwrapped to plain text.
   */
  releaseWeek?: number
}

// Release time of day for weekly posts: 14:00 UTC, morning in the US.
const RELEASE_HOUR_UTC = 14

/** When a held post goes live, or null if it is not held. */
function releaseDate(p: BlogPost): Date | null {
  if (!p.releaseWeek) return null
  const launch = (site as { blogLaunchDate?: string | null }).blogLaunchDate
  if (!launch) {
    // No launch date yet. On production (blogLive true) keep held posts
    // hidden; on a preview (BLOG_LIVE env only) show them so they can be read.
    return site.blogLive === true ? new Date(8640000000000000) : new Date(0)
  }
  const d = new Date(launch)
  d.setUTCDate(d.getUTCDate() + 7 * p.releaseWeek)
  d.setUTCHours(RELEASE_HOUR_UTC, 0, 0, 0)
  return d
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

// The files are read once; which of them are released is decided on every
// call, so a held post appears on its release date without a redeploy (the
// blog pages, sitemap and feed revalidate hourly).
let cache: BlogPost[] | null = null
const loaded = () => (cache ??= readAll())

function released(now = new Date()): BlogPost[] {
  const posts = loaded().filter((p) => {
    const r = releaseDate(p)
    return !r || r.getTime() <= now.getTime()
  })
  const hidden = new Set(loaded().filter((p) => !posts.includes(p)).map((p) => p.slug))
  return posts
    .map((p) => {
      const r = releaseDate(p)
      // A released weekly post is dated the day it went out.
      const dated = r && r.getTime() > 0 ? { ...p, publishedAt: r.toISOString(), updatedAt: r.toISOString() } : p
      return hidden.size ? { ...dated, content: unlinkHidden(dated.content, hidden) } : dated
    })
    .sort((a, b) => {
      const at = a.publishedAt ? Date.parse(a.publishedAt) : 0
      const bt = b.publishedAt ? Date.parse(b.publishedAt) : 0
      return bt - at
    })
}

/**
 * Links to posts that are not out yet: a "Related reading" list item that
 * exists only for that link is dropped; anywhere else the link becomes plain
 * text, so no page points at a URL that does not exist yet.
 */
function unlinkHidden(html: string, hidden: Set<string>): string {
  const href = (slug: string) => `href="(?:https://schedulingwiz\\.com)?/blog/${slug}"`
  let out = html
  for (const slug of hidden) {
    out = out.replace(new RegExp(`<li><a ${href(slug)}[^>]*>[\\s\\S]*?</a>[^<]*</li>`, "g"), "")
    out = out.replace(new RegExp(`<a ${href(slug)}[^>]*>([\\s\\S]*?)</a>`, "g"), "$1")
  }
  // A reading list whose every item was held drops out with its heading.
  out = out.replace(/<h2[^>]*>[^<]*<\/h2>\s*(?:<p>[^<]*<\/p>\s*)?<ul>\s*<\/ul>/g, "")
  return out
}

const all = () => released()

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
