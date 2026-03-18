import type { MetadataRoute } from 'next';
import { createClient } from 'contentful';
import { getSiteBaseUrl } from '@/utils/seo';

const contentful = createClient({
  space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID!,
  accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN!,
});

export const revalidate = 3600; // revalidate sitemap every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteBaseUrl();
  const baseUrl = base?.toString() ?? 'https://www.checkmirrors.co.uk';

  const entries: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
  ];

  try {
    const [landingRes, blogRes] = await Promise.all([
      contentful.getEntries({
        content_type: 'pageLanding',
        select: 'fields.slug,fields.pageParent,sys.updatedAt',
        include: 1,
        limit: 500,
      }),
      contentful.getEntries({
        content_type: 'pageBlogPost',
        select: 'fields.slug,sys.updatedAt',
        limit: 500,
      }),
    ]);

    for (const item of landingRes.items) {
      const slug = (item.fields as { slug?: string }).slug;
      if (!slug) continue;
      const parent = (item.fields as { pageParent?: { fields?: { slug?: string } } }).pageParent;
      const parentSlug = parent?.fields?.slug;
      const path = parentSlug ? `${parentSlug}/${slug}` : slug;
      if (path === 'home') continue; // already added as baseUrl
      entries.push({
        url: `${baseUrl}/${path}`,
        lastModified: (item.sys as { updatedAt?: string }).updatedAt
          ? new Date((item.sys as { updatedAt: string }).updatedAt)
          : new Date(),
        changeFrequency: 'monthly',
        priority: 0.8,
      });
    }

    for (const item of blogRes.items) {
      const slug = (item.fields as { slug?: string }).slug;
      if (!slug) continue;
      entries.push({
        url: `${baseUrl}/blog/${slug}`,
        lastModified: (item.sys as { updatedAt?: string }).updatedAt
          ? new Date((item.sys as { updatedAt: string }).updatedAt)
          : new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      });
    }
  } catch {
    // Return at least homepage if Contentful fails
  }

  return entries;
}
