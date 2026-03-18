import type { MetadataRoute } from 'next';
import { getSiteBaseUrl } from '@/utils/seo';

export default function robots(): MetadataRoute.Robots {
  const base = getSiteBaseUrl();
  const baseUrl = base?.toString() ?? 'https://www.checkmirrors.co.uk';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
