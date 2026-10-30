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
      // NOTE (blog-preview branch only): the /blog -> / redirects are removed
      // here so the restored blog can be read locally. They must go back
      // before this is merged, or stay removed if the blog is relaunched.

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
