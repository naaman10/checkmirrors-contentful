import { createClient, Entry, EntrySkeletonType } from 'contentful';
import { notFound } from 'next/navigation';
import ContentSection from '@/components/ContentSection';

interface PageFields {
  title: string;
  slug: string;
  content: any[];
  pageParent?: {
    sys: {
      type: string;
      linkType: string;
      id: string;
    };
    fields: {
      slug: string;
    };
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
          parentSlug: entry.fields?.pageParent?.fields?.slug
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
        parentSlug: directMatch.fields?.pageParent?.fields?.slug
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
        parentSlug: childMatch.fields?.pageParent?.fields?.slug
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
    
    return {
      title: page.title,
    };
  } catch (error) {
    return {
      title: 'Page Not Found'
    };
  }
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Page({ params }: { params: { slug: string[] } }) {
  try {
    const fullPath = params.slug.join('/');
    const page = await getPageContent(fullPath);

    return (
      <main>
        <h1 className="sr-only">{page.title}</h1>
        {page.content?.map((section, index) => (
          <ContentSection key={index} section={section} />
        ))}
      </main>
    );
  } catch (error) {
    notFound();
  }
} 