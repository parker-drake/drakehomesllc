/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // App directory is now stable, no need for experimental flag
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
}

module.exports = nextConfig 