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
    "/sitemap.xml": ["./content/uses/**/*"],
  },
  async redirects() {
    return [
      // The /blog -> / redirects are gone: the blog is live again on its
      // original slugs, so those URLs resolve to the posts Google already
      // indexed rather than being funnelled to the homepage.

      // best-physician-scheduling-tools-2026 was a near-identical copy of
      // best-physician-scheduling-tools: same title, same description, 98% the
      // same body. Two URLs were competing for one query, so the copy is held
      // back and its traffic goes to the one we kept.
      {
        source: "/blog/best-physician-scheduling-tools-2026",
        destination: "/blog/best-physician-scheduling-tools",
        permanent: true,
      },

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
      { source: "/blog/acgme-compliance-tools", destination: "/blog/acgme-duty-hour-compliance", permanent: true },

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
