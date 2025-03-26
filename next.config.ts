import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
import type { NextConfig } from "next";

initOpenNextCloudflareForDev();

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    typedRoutes: true,
  },
  serverExternalPackages: ["grammy"],
  allowedDevOrigins: ["jmcmomic-serverless-bot.majokeiko.com"],
};

export default nextConfig;
