import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/student/*',
          '/dashboard/*',
          '/api/*',
          '/*.json',
          '/*?*',  // Query parameters
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/student/*',
          '/dashboard/*',
          '/api/*',
        ],
      },
    ],
    sitemap: 'https://playfitclasses.com/sitemap.xml',
  }
}
