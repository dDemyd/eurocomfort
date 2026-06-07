import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: '/admin' }],
    host: 'https://https://eurocomfort.vercel.app/',
    sitemap: 'https://https://eurocomfort.vercel.app//sitemap.xml',
  };
}
