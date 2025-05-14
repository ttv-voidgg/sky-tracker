/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['api.aviationstack.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.aviationstack.com',
        port: '',
        pathname: '/**',
      },
    ],
    unoptimized: true,
  },
  // Ensure environment variables are properly handled
  env: {
    AVIATIONSTACK_API_KEY: process.env.AVIATIONSTACK_API_KEY,
  },
  // Optimize for production
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

export default nextConfig
