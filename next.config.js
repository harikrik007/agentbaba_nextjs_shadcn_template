/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    // DISABLE optimization in development to save CPU
    unoptimized: process.env.NODE_ENV === 'development',
  },
}

module.exports = nextConfig