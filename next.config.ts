import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,

  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  images: {
    minimumCacheTTL: 60,
    remotePatterns: [
      // Allow images for profile avatars
      { hostname: "lh3.googleusercontent.com" }, // Google
      { hostname: "platform-lookaside.fbsbx.com" }, // Facebook
      { hostname: "avatars.githubusercontent.com" }, // Github
      { hostname: "cdn.discordapp.com" }, // Discord
    ],
  },
};

export default nextConfig;
