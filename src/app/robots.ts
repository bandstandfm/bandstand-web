import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Block API surface even though it's mostly proxy routes — keeps
        // crawlers from wasting budget on JSON endpoints.
        disallow: ['/api/'],
      },
    ],
    sitemap: 'https://bandstand.fm/sitemap.xml',
    host: 'https://bandstand.fm',
  };
}
