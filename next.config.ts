import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [{ source: "/", destination: "/de", permanent: false }];
  },
  async headers() {
    return [
      {
        // Public pages: tell crawlers the canonical index/follow intent via HTTP header too
        source: "/(de|en)(.*)",
        headers: [{ key: "X-Robots-Tag", value: "index, follow" }],
      },
      {
        // Admin and API routes: no indexing
        source: "/(admin|api)(.*)",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
};

export default nextConfig;
