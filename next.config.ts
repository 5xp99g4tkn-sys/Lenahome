import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  serverExternalPackages: [],
  experimental: {
    optimizePackageImports: ["@react-three/drei"],
  },
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
