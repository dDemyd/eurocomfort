import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://eurocomfort.kiev.ua/', lastModified: new Date() },
    { url: 'https://eurocomfort.kiev.ua/ru', lastModified: new Date() },
  ];
}
