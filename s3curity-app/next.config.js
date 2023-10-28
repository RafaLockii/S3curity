/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  distDir: 'build',
  pageExtensions: ['page.tsx', 'page.ts, api.tsx', 'api.ts'],
}

module.exports = nextConfig
