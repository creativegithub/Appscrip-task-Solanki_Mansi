import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "fakestoreapi.com",
        pathname: "/**",
      },
    ],
    unoptimized: true,
    minimumCacheTTL: 60,
  },
  output: "export",
  trailingSlash: true,
  distDir: "out",
};

export default nextConfig;
