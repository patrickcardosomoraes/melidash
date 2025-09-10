import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['@prisma/client'],
  images: {
    domains: [
      'http2.mlstatic.com',
      'mla-s1-p.mlstatic.com',
      'mla-s2-p.mlstatic.com',
      'mlb-s1-p.mlstatic.com',
      'mlb-s2-p.mlstatic.com',
    ],
  },
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    VERCEL_URL: process.env.VERCEL_URL,
  },
};

export default nextConfig;
