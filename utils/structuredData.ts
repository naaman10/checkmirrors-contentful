import { getSiteBaseUrl } from './seo';

/**
 * Site-wide Organization and LocalBusiness JSON-LD for Check Mirrors.
 * Single source for brand name, URL, logo, phone, and social sameAs.
 */
export function getOrganizationLocalBusinessJsonLd(): object[] {
  const base = getSiteBaseUrl();
  const siteUrl = base?.toString() ?? 'https://www.checkmirrors.co.uk';
  const logoUrl = base ? new URL('/favicon/android-chrome-192x192.png', base).toString() : `${siteUrl}/favicon/android-chrome-192x192.png`;

  const organization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Check Mirrors',
    url: siteUrl,
    logo: logoUrl,
    description: 'Check Mirrors - Professional Driving School',
    sameAs: ['https://www.facebook.com/pg/checkmirrors'],
  };

  const localBusiness = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${siteUrl}/#organization`,
    name: 'Check Mirrors',
    image: logoUrl,
    url: siteUrl,
    description: 'Check Mirrors - Professional Driving School',
    telephone: '+447821291783',
    sameAs: ['https://www.facebook.com/pg/checkmirrors'],
    parentOrganization: {
      '@type': 'Organization',
      name: 'Checkmirrors Ltd',
    },
  };

  return [organization, localBusiness];
}

const defaultBaseUrl = 'https://www.checkmirrors.co.uk';

function getBaseAndLogo() {
  const base = getSiteBaseUrl();
  const siteUrl = base?.toString() ?? defaultBaseUrl;
  const logoUrl = base ? new URL('/favicon/android-chrome-192x192.png', base).toString() : `${defaultBaseUrl}/favicon/android-chrome-192x192.png`;
  return { siteUrl, logoUrl };
}

export type BreadcrumbItem = { name: string; path: string };

export function getBreadcrumbListJsonLd(items: BreadcrumbItem[]): object {
  const { siteUrl } = getBaseAndLogo();
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.path.startsWith('http') ? item.path : `${siteUrl}${item.path.startsWith('/') ? '' : '/'}${item.path}`,
    })),
  };
}

export interface BlogPostForStructuredData {
  fields: {
    title: string;
    slug: string;
    publishedDate: string;
    author?: { fields?: { name?: string } };
    featureImage?: {
      fields?: {
        image?: Array<{ url?: string; secure_url?: string }>;
        file?: { url?: string };
      };
    };
  };
  sys?: { updatedAt?: string };
}

export interface WebPageStructuredDataInput {
  name: string;
  description?: string;
  path: string;
  breadcrumbLd: object;
}

export function getWebSiteJsonLd(): object {
  const { siteUrl, logoUrl } = getBaseAndLogo();
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Check Mirrors',
    url: siteUrl,
    description: 'Check Mirrors - Professional Driving School',
    publisher: {
      '@type': 'Organization',
      name: 'Check Mirrors',
      logo: {
        '@type': 'ImageObject',
        url: logoUrl,
      },
    },
  };
}

export function getWebPageJsonLd(input: WebPageStructuredDataInput): object {
  const { siteUrl } = getBaseAndLogo();
  const url = input.path.startsWith('http') ? input.path : `${siteUrl}${input.path.startsWith('/') ? '' : '/'}${input.path}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: input.name,
    url,
    ...(input.description ? { description: input.description } : {}),
    breadcrumb: input.breadcrumbLd,
  };
}

export function getBlogPostingJsonLd(post: BlogPostForStructuredData): object {
  const { siteUrl, logoUrl } = getBaseAndLogo();
  const postUrl = `${siteUrl}/blog/${post.fields.slug}`;
  const imageUrl =
    post.fields.featureImage?.fields?.image?.[0]?.secure_url ||
    post.fields.featureImage?.fields?.image?.[0]?.url ||
    post.fields.featureImage?.fields?.file?.url;
  const datePublished = post.fields.publishedDate;
  const dateModified = (post.sys as { updatedAt?: string } | undefined)?.updatedAt ?? datePublished;
  const authorName = post.fields.author?.fields?.name ?? 'Check Mirrors';

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.fields.title,
    url: postUrl,
    ...(imageUrl ? { image: imageUrl.startsWith('http') ? imageUrl : new URL(imageUrl, siteUrl).toString() } : {}),
    datePublished,
    dateModified,
    author: {
      '@type': 'Person',
      name: authorName,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Check Mirrors',
      logo: {
        '@type': 'ImageObject',
        url: logoUrl,
      },
    },
  };
}
