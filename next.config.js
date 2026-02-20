/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Production optimizations
  compress: true,
  poweredByHeader: false,
  
  // Environment variables
  env: {
    GROQ_API_KEY: process.env.GROQ_API_KEY,
  },
  
  // Image optimization (if needed in future)
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  
  // TypeScript and ESLint
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
};

module.exports = nextConfig;
