import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@repo/shared"],
  experimental: {
    typedRoutes: true,
  },
  async rewrites() {
    return [
      {
        source: "/api/trpc/:path*",
        destination: "http://localhost:8080/trpc/:path*",
      },
    ];
  },
};

export default nextConfig;
