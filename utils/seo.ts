import type { Metadata } from 'next';

type UnknownRecord = Record<string, any>;

export function getSiteBaseUrl(): URL | null {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    // Netlify provides URL in build/runtime for the primary deploy URL
    process.env.URL ||
    process.env.DEPLOY_PRIME_URL ||
    process.env.NETLIFY_URL;

  if (!raw) return null;

  try {
    return new URL(raw);
  } catch {
    try {
      return new URL(`https://${raw.replace(/^https?:\/\//, '')}`);
    } catch {
      return null;
    }
  }
}

function asAbsoluteUrl(maybeUrl: string | undefined | null, base: URL | null): string | undefined {
  if (!maybeUrl) return undefined;
  if (maybeUrl.startsWith('http://') || maybeUrl.startsWith('https://')) return maybeUrl;
  if (maybeUrl.startsWith('//')) return `https:${maybeUrl}`;
  if (!base) return maybeUrl;
  try {
    return new URL(maybeUrl, base).toString();
  } catch {
    return maybeUrl;
  }
}

function pickFirstString(obj: UnknownRecord, keys: string[]): string | undefined {
  for (const key of keys) {
    const val = obj?.[key];
    if (typeof val === 'string' && val.trim()) return val.trim();
  }
  return undefined;
}

function pickBoolean(obj: UnknownRecord, keys: string[]): boolean | undefined {
  for (const key of keys) {
    const val = obj?.[key];
    if (typeof val === 'boolean') return val;
  }
  return undefined;
}

function pickImageUrl(seo: UnknownRecord, base: URL | null): string | undefined {
  const unwrap = (val: any): any[] => {
    if (val == null) return [];
    if (Array.isArray(val)) return val;
    if (typeof val === 'string') return [val];
    if (typeof val === 'object') return [val];
    return [];
  };

  const safeGet = (obj: UnknownRecord, keys: string[]): any[] => {
    for (const key of keys) {
      try {
        const val = obj?.[key];
        if (val != null) return unwrap(val);
      } catch {
        // skip
      }
    }
    return [];
  };

  const candidates = safeGet(seo, [
    'openGraphImage',
    'openGraphImages',
    'ogImage',
    'ogImages',
    'socialImage',
    'socialImages',
    'shareImage',
    'shareImages',
    'metaImage',
    'metaImageUrl',
    'openGraphImageUrl',
    'twitterImage',
    'twitterImageUrl',
    'image',
    'featuredImage',
  ]);

  for (const c of candidates) {
    try {
      const assetUrl =
        // plain string URL
        (typeof c === 'string' ? c : undefined) ||
        // Contentful Asset shape or "image component" shape or direct Cloudinary object
        c?.fields?.file?.url ||
        c?.fields?.image?.[0]?.secure_url ||
        c?.fields?.image?.[0]?.url ||
        c?.file?.url ||
        c?.secure_url ||
        c?.url ||
        c?.image?.[0]?.secure_url ||
        c?.image?.[0]?.url;

      if (typeof assetUrl === 'string' && assetUrl.trim()) {
        return asAbsoluteUrl(assetUrl.trim(), base);
      }
    } catch {
      continue;
    }
  }

  return undefined;
}

export function buildMetadataFromContentfulSeo(input: {
  seoFields?: any;
  fallback: {
    title: string;
    description?: string;
    path?: string; // e.g. "/blog/my-post"
    imageUrl?: string;
    type?: 'website' | 'article';
  };
}): Metadata {
  const fallbackTitle = input?.fallback?.title ?? 'Page';
  const fallbackDesc = input?.fallback?.description;
  const fallbackPath = input?.fallback?.path;
  const fallbackImage = input?.fallback?.imageUrl;
  const fallbackType = input?.fallback?.type ?? 'website';

  try {
    const base = getSiteBaseUrl();
    let seo: UnknownRecord = {};
    try {
      const raw = input.seoFields;
      if (raw && typeof raw === 'object') {
        if (Array.isArray(raw) && raw.length > 0 && raw[0]?.fields) {
          seo = (raw[0].fields ?? {}) as UnknownRecord;
        } else if (raw.fields && typeof raw.fields === 'object') {
          seo = raw.fields as UnknownRecord;
        } else if (!raw.sys) {
          seo = raw as UnknownRecord;
        }
      }
    } catch {
      // leave seo as {}
    }

    const title =
      pickFirstString(seo, ['metaTitle', 'title', 'pageTitle', 'name']) || fallbackTitle;

    const description =
      pickFirstString(seo, ['metaDescription', 'description', 'summary']) || fallbackDesc;

    const canonicalPath =
      pickFirstString(seo, ['canonicalUrl', 'canonical']) ||
      (fallbackPath ? asAbsoluteUrl(fallbackPath, base) : undefined);

    const noIndex = pickBoolean(seo, ['noIndex', 'noindex']);
    const noFollow = pickBoolean(seo, ['noFollow', 'nofollow']);

    const ogTitle =
      pickFirstString(seo, ['openGraphTitle', 'ogTitle', 'socialTitle']) || title;
    const ogDescription =
      pickFirstString(seo, ['openGraphDescription', 'ogDescription', 'socialDescription']) || description;

    const imageUrl =
      pickImageUrl(seo, base) ||
      asAbsoluteUrl(fallbackImage, base);

    const type =
      (pickFirstString(seo, ['openGraphType', 'ogType']) as 'website' | 'article' | undefined) ||
      fallbackType;

    const twitterCard =
      pickFirstString(seo, ['twitterCard', 'twitter_card']) || (imageUrl ? 'summary_large_image' : 'summary');

    const metadata: Metadata = {
      title,
      ...(description ? { description } : {}),
      ...(canonicalPath ? { alternates: { canonical: canonicalPath } } : {}),
      ...(typeof noIndex === 'boolean' || typeof noFollow === 'boolean'
        ? {
            robots: {
              index: typeof noIndex === 'boolean' ? !noIndex : undefined,
              follow: typeof noFollow === 'boolean' ? !noFollow : undefined,
            },
          }
        : {}),
      openGraph: {
        title: ogTitle,
        ...(ogDescription ? { description: ogDescription } : {}),
        ...(canonicalPath ? { url: canonicalPath } : {}),
        type,
        ...(imageUrl ? { images: [{ url: imageUrl }] } : {}),
      },
      twitter: {
        card: twitterCard as any,
        title: ogTitle,
        ...(ogDescription ? { description: ogDescription } : {}),
        ...(imageUrl ? { images: [imageUrl] } : {}),
      },
    };

    if (base) {
      metadata.metadataBase = base;
    }

    return metadata;
  } catch {
    return {
      title: fallbackTitle,
      ...(fallbackDesc ? { description: fallbackDesc } : {}),
      openGraph: { title: fallbackTitle, type: fallbackType },
      twitter: { title: fallbackTitle },
    };
  }
}

