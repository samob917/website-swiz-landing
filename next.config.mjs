/** @type {import('next').NextConfig} */
const nextConfig = {
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
      // The blog was removed; old posts still rank in Google. 301 them
      // to the homepage so clicks land somewhere useful and Google
      // drops the old URLs.
      { source: "/blog", destination: "/", permanent: true },
      { source: "/blog/:slug*", destination: "/", permanent: true },
    ]
  },
}

export default nextConfig
