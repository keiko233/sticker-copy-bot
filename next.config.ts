import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
import type { NextConfig } from "next";

initOpenNextCloudflareForDev();

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    typedRoutes: true,
  },
  serverExternalPackages: ["grammy"],
};

export default nextConfig;
