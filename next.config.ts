import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        // Railway-hosted Payload media (direct uploads)
        protocol: 'https',
        hostname: '**.railway.app',
      },
      {
        // Cloudflare R2 bucket (if/when media is moved to R2)
        protocol: 'https',
        hostname: '**.r2.dev',
      },
    ],
  },
};

export default nextConfig;
