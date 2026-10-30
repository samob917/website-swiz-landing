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

      // /compliance-checker was a real page with a navbar link until it was
      // removed. Anything still linking to it should land on the use-case
      // page that replaced it rather than a 404.
      {
        source: "/compliance-checker",
        destination: "/uses/acgme-compliance-checker",
        permanent: true,
      },

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
