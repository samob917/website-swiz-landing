import { getAllPosts } from "@/lib/blog/resolve-blog";
import { getSiteConfig } from "@/lib/engine/resolve-site";

// RSS for the blog, so readers and aggregators can follow new posts.
// getAllPosts is empty while the blog is switched off, and the /blog/*
// redirect sends this URL home in that state anyway.
export const revalidate = 3600;

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export async function GET() {
  const site = await getSiteConfig();
  const base = site.domain.replace(/\/$/, "");
  const posts = getAllPosts();
  const items = posts
    .map((p) => {
      const url = `${base}/blog/${p.slug}`;
      const date = new Date(p.publishedAt ?? Date.now()).toUTCString();
      return `<item><title>${esc(p.title)}</title><link>${url}</link><guid isPermaLink="true">${url}</guid><pubDate>${date}</pubDate><description>${esc(p.description ?? "")}</description></item>`;
    })
    .join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>Scheduling Wizard Blog</title><link>${base}/blog</link><description>Guides on ACGME duty hour requirements, residency and fellowship scheduling, and how programs get schedules built.</description><language>en-us</language><atom:link href="${base}/blog/rss.xml" rel="self" type="application/rss+xml"/>${items}</channel></rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
