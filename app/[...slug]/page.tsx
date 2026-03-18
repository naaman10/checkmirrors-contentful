import { createClient, Entry, EntrySkeletonType } from 'contentful';
import { notFound } from 'next/navigation';
import ContentSection from '@/components/ContentSection';
import { buildMetadataFromContentfulSeo } from '@/utils/seo';
import { getBreadcrumbListJsonLd, getWebPageJsonLd } from '@/utils/structuredData';

interface PageFields {
  title: string;
  slug: string;
  content: any[];
  seoFields?: any;
  pageParent?: {
    sys: { type: string; linkType: string; id: string };
    fields: { slug: string; title?: string };
  };
}

interface PageEntry extends EntrySkeletonType {
  fields: PageFields;
}

interface PageContent {
  title: string;
  slug: string;
  content: any[];
  parentSlug?: string;
  parentTitle?: string;
  seoFields?: any;
}

const client = createClient({
  space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID!,
  accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN!,
});

export async function getPageContent(slug: string | string[]): Promise<PageContent> {
  const fullPath = Array.isArray(slug) ? slug.join('/') : slug;

  try {
    if (fullPath === 'home') {
      try {
        const homepage = await client.getEntry<PageEntry>('3vrx9Ezv34q2B8pY0kjP25', {
          include: 3,
        });
        return {
          title: homepage.fields.title,
          slug: 'home',
          content: Array.isArray(homepage.fields.content) ? homepage.fields.content : [],
          seoFields: (homepage.fields as any).seoFields,
        };
      } catch (error) {
        notFound();
      }
    }

    const allEntries = await client.getEntries<PageEntry>({
      include: 3,
      content_type: 'pageLanding'
    });

    if (fullPath === 'driving-lessons-york/what-you-need') {
      try {
        const entry = await client.getEntry<PageEntry>('5KWjMlZQHcfo3cWu2Wo8W9', {
          include: 3,
        });
        return {
          title: entry.fields.title,
          slug: entry.fields.slug,
          content: Array.isArray(entry.fields.content) ? entry.fields.content : [],
          parentSlug: entry.fields?.pageParent?.fields?.slug,
          parentTitle: entry.fields?.pageParent?.fields?.title,
          seoFields: (entry.fields as any).seoFields,
        };
      } catch (error) {
        // Continue to next search method
      }
    }

    const directMatch = allEntries.items.find(entry => entry.fields?.slug === fullPath);
    if (directMatch) {
      return {
        title: directMatch.fields.title,
        slug: directMatch.fields.slug,
        content: Array.isArray(directMatch.fields.content) ? directMatch.fields.content : [],
        parentSlug: directMatch.fields?.pageParent?.fields?.slug,
        parentTitle: directMatch.fields?.pageParent?.fields?.title,
        seoFields: (directMatch.fields as any).seoFields,
      };
    }

    const childMatch = allEntries.items.find(entry => {
      const entrySlug = entry.fields?.slug;
      const entryParentSlug = entry.fields?.pageParent?.fields?.slug;
      
      if (!entryParentSlug) return false;
      return `${entryParentSlug}/${entrySlug}` === fullPath;
    });

    if (childMatch) {
      return {
        title: childMatch.fields.title,
        slug: childMatch.fields.slug,
        content: Array.isArray(childMatch.fields.content) ? childMatch.fields.content : [],
        parentSlug: childMatch.fields?.pageParent?.fields?.slug,
        parentTitle: childMatch.fields?.pageParent?.fields?.title,
        seoFields: (childMatch.fields as any).seoFields,
      };
    }

    notFound();
  } catch (error) {
    notFound();
  }
}

export async function generateStaticParams() {
  try {
    const entries = await client.getEntries<PageEntry>({
      include: 3,
      content_type: 'pageLanding'
    });

    const paths = entries.items
      .filter(entry => !!entry?.fields?.slug)
      .map(entry => {
        const entrySlug = entry.fields.slug;
        const parentSlug = entry.fields?.pageParent?.fields?.slug;

        if (parentSlug) {
          return {
            slug: `${parentSlug}/${entrySlug}`.split('/')
          };
        }

        return {
          slug: [entrySlug]
        };
      })
      .filter(Boolean);

    return [...paths, { slug: ['home'] }];
  } catch (error) {
    return [{ slug: ['home'] }];
  }
}

export async function generateMetadata({ params }: { params: { slug: string[] } }) {
  try {
    const fullPath = params.slug.join('/');
    const page = await getPageContent(fullPath);

    const path = fullPath === 'home' ? '/' : `/${fullPath}`;
    return buildMetadataFromContentfulSeo({
      seoFields: page.seoFields,
      fallback: {
        title: page.title,
        path,
        type: 'website',
      },
    });
  } catch (error) {
    return {
      title: 'Page Not Found'
    };
  }
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function buildBreadcrumbItems(
  fullPath: string,
  pageTitle: string,
  parentSlug?: string,
  parentTitle?: string
): { name: string; path: string }[] {
  const items: { name: string; path: string }[] = [{ name: 'Home', path: '/' }];
  if (fullPath === 'home') return items;
  if (parentSlug) {
    items.push({ name: parentTitle ?? parentSlug, path: `/${parentSlug}` });
  }
  items.push({ name: pageTitle, path: `/${fullPath}` });
  return items;
}

export default async function Page({ params }: { params: { slug: string[] } }) {
  try {
    const fullPath = params.slug.join('/');
    const page = await getPageContent(fullPath);

    const breadcrumbItems = buildBreadcrumbItems(
      fullPath,
      page.title,
      page.parentSlug,
      page.parentTitle
    );
    const breadcrumbLd = getBreadcrumbListJsonLd(breadcrumbItems);
    const pagePath = fullPath === 'home' ? '/' : `/${fullPath}`;
    const webPageLd = getWebPageJsonLd({
      name: page.title,
      path: pagePath,
      breadcrumbLd,
    });

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageLd) }}
        />
        <main>
          <h1 className="sr-only">{page.title}</h1>
          {page.content?.map((section, index) => (
            <ContentSection key={index} section={section} />
          ))}
        </main>
      </>
    );
  } catch (error) {
    notFound();
  }
} 