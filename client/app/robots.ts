// app/robots.ts
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/', '/admin-login', '/cart'],
    },
    sitemap: 'https://clothing-shop-livid.vercel.app/sitemap.xml',
  };
}
