import type { MetadataRoute } from 'next';

const siteUrl = 'https://https://eurocomfort.vercel.app/';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const languages = {
    uk: `${siteUrl}/`,
    ru: `${siteUrl}/ru`,
    'x-default': `${siteUrl}/`,
  };

  return [
    {
      url: `${siteUrl}/`,
      lastModified: now,
      alternates: { languages },
    },
    {
      url: `${siteUrl}/ru`,
      lastModified: now,
      alternates: { languages },
    },
  ];
}
