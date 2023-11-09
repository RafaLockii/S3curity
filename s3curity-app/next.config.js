/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  distDir: 'build',
  pageExtensions: ['page.tsx', 'page.ts, api.tsx', 'api.ts'],
  //APENAS PARA DESENVOLVIMENTO
  images: {
    domains: ['img.freepik.com'], // Allow images from any domain (not recommended for production)
  },
  server: {
    useFileSystemPublicRoutes: false,
  },
}

module.exports = nextConfig
