import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: '/admin' }],
    host: 'https://eurocomfort.kiev.ua',
    sitemap: 'https://eurocomfort.kiev.ua/sitemap.xml',
  };
}
