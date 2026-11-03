import site from "./content/site.json" with { type: "json" };

// One switch for the whole blog. While it is off the site deploys without
// the blog: /blog and every post redirect to the homepage, the sitemap lists
// no posts, and the use-case pages show no "Further reading". Flip
// "blogLive" in content/site.json to true once the posts have been read.
// BLOG_LIVE=true in a Vercel environment overrides the JSON, so a preview
// deployment can show the blog while production keeps it hidden.
const BLOG_LIVE = site.blogLive === true || process.env.BLOG_LIVE === "true";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // The blog pulls featured images from Cloudflare Images. This was
  // "unoptimized: true" before the blog was removed, which is what let
  // remote images render without a domain allowlist.
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Ship the use-case JSON files with the serverless function that
  // regenerates sitemap.xml hourly — without this, the runtime rebuild
  // can't see content/uses and silently drops all /uses URLs.
  outputFileTracingIncludes: {
    "/sitemap.xml": ["./content/uses/**/*", "./content/blog/**/*"],
  },
  async redirects() {
    return [
      ...(BLOG_LIVE
        ? [
            // best-physician-scheduling-tools-2026 was a near-identical copy of
            // best-physician-scheduling-tools: same title, same description, 98%
            // the same body. Two URLs were competing for one query, so the copy
            // is held back and its traffic goes to the one we kept.
            { source: "/blog/best-physician-scheduling-tools-2026", destination: "/blog/best-physician-scheduling-tools", permanent: true },
            // The post that listed "checker tools" is gone; see below.
            { source: "/blog/acgme-compliance-tools", destination: "/blog/acgme-duty-hour-compliance", permanent: true },
          ]
        : [
            // Blog hidden: every blog URL lands on the homepage, as before.
            { source: "/blog", destination: "/", permanent: false },
            { source: "/blog/:slug*", destination: "/", permanent: false },
          ]),

      // Three use-case pages were close variants of another and were folded
      // in. Each old URL carries its reader to the page that absorbed it.
      { source: "/uses/call-schedule-software", destination: "/uses/on-call-scheduling-software", permanent: true },
      { source: "/uses/resident-call-schedule-automation", destination: "/uses/on-call-scheduling-software", permanent: true },
      { source: "/uses/general-surgery-residency-scheduling", destination: "/uses/surgery-residency-scheduling", permanent: true },

      // There is no such product category as an "ACGME compliance checker";
      // the old tool page, the use-case page that replaced it and the post
      // that listed "checker tools" are all gone. Their readers wanted the
      // duty hour rules, so that is where they land.
      { source: "/compliance-checker", destination: "/uses/acgme-duty-hour-rules", permanent: true },
      { source: "/uses/acgme-compliance-checker", destination: "/uses/acgme-duty-hour-rules", permanent: true },

      // www and the apex both served the whole site at 200, so every page
      // existed at two URLs. The canonical tags already pointed at the apex,
      // but a 301 is what actually consolidates them.
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.schedulingwiz.com" }],
        destination: "https://schedulingwiz.com/:path*",
        permanent: true,
      },
    ]
  },
}

export default nextConfig
