import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://drakehomesllc.com'
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/about',
          '/contact',
          '/available-homes',
          '/available-homes/*',
          '/lots',
          '/lots/*',
          '/plans',
          '/plans/*',
          '/gallery',
          '/gallery/*',
          '/_next/static/',
          '/*.css$',
          '/*.js$',
          '/*.webp$',
          '/*.jpg$',
          '/*.jpeg$',
          '/*.png$',
          '/*.svg$',
        ],
        disallow: [
          '/admin',
          '/admin/*',
          '/api/*',
          '/_next/image*',
          '/test-image',
          '/debug-image',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        crawlDelay: 0,
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        crawlDelay: 1,
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
