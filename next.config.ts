import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  devIndicators: false,

  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  images: {
    remotePatterns: [
      { hostname: 'lh3.googleusercontent.com' },
      { hostname: 'platform-lookaside.fbsbx.com' },
      { hostname: 'avatars.githubusercontent.com' },
      { hostname: 'cdn.discordapp.com' },
    ],
  },
}

export default nextConfig
