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

// Function to log available content types
async function logContentTypes() {
  try {
    const contentTypes = await client.getContentTypes();
    console.log('Available content types:', contentTypes.items.map(ct => ({
      id: ct.sys.id,
      name: ct.name,
      displayField: ct.displayField
    })));
  } catch (error) {
    console.error('Error fetching content types:', error);
  }
}

export async function getPageContent(slug: string | string[]): Promise<PageContent> {
  // If slug is an array, join it into a string
  const fullPath = Array.isArray(slug) ? slug.join('/') : slug;
  console.log('Fetching page content for slug:', fullPath);

  try {
    // Log available content types
    const contentTypes = await client.getContentTypes();
    console.log('Available content types:', contentTypes.items.map(type => ({
      id: type.sys.id,
      name: type.name
    })));

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
        console.error('Error fetching homepage:', error);
        notFound();
      }
    }

    // Get all page entries
    const allEntries = await client.getEntries<PageEntry>({
      include: 3,
      content_type: 'pageLanding'
    });

    console.log('Total entries found:', allEntries.items.length);
    console.log('First entry sample:', {
      id: allEntries.items[0]?.sys?.id,
      contentType: allEntries.items[0]?.sys?.contentType?.sys?.id,
      fields: allEntries.items[0]?.fields
    });

    // Log all entries with their relationships
    const entriesWithRelationships = allEntries.items.map(entry => ({
      id: entry.sys.id,
      slug: entry.fields?.slug,
      parentSlug: entry.fields?.pageParent?.fields?.slug,
      fullPath: entry.fields?.pageParent?.fields?.slug ? 
        `${entry.fields.pageParent.fields.slug}/${entry.fields.slug}` : 
        entry.fields?.slug
    }));
    console.log('All entries with relationships:', entriesWithRelationships);

    // Try to get the entry directly by ID if we know it
    if (fullPath === 'driving-lessons-york/what-you-need') {
      try {
        const entry = await client.getEntry<PageEntry>('5KWjMlZQHcfo3cWu2Wo8W9', {
          include: 3,
        });
        console.log('Found entry by ID:', {
          id: entry.sys.id,
          slug: entry.fields.slug,
          parentSlug: entry.fields?.pageParent?.fields?.slug,
          fullPath: entry.fields?.pageParent?.fields?.slug ? 
            `${entry.fields.pageParent.fields.slug}/${entry.fields.slug}` : 
            entry.fields.slug
        });
        return {
          title: entry.fields.title,
          slug: entry.fields.slug,
          content: Array.isArray(entry.fields.content) ? entry.fields.content : [],
          parentSlug: entry.fields?.pageParent?.fields?.slug
        };
      } catch (error) {
        console.error('Error fetching entry by ID:', error);
      }
    }

    // First try to find a direct match
    const directMatch = allEntries.items.find(entry => entry.fields?.slug === fullPath);
    if (directMatch) {
      console.log('Found direct match:', {
        id: directMatch.sys.id,
        slug: directMatch.fields.slug
      });
      return {
        title: directMatch.fields.title,
        slug: directMatch.fields.slug,
        content: Array.isArray(directMatch.fields.content) ? directMatch.fields.content : [],
        parentSlug: directMatch.fields?.pageParent?.fields?.slug
      };
    }

    // If no direct match, look for a child page
    const childMatch = allEntries.items.find(entry => {
      const entrySlug = entry.fields?.slug;
      const entryParentSlug = entry.fields?.pageParent?.fields?.slug;
      
      if (!entryParentSlug) return false;

      const entryFullPath = `${entryParentSlug}/${entrySlug}`;
      console.log('Checking child page:', {
        entryFullPath,
        requestedPath: fullPath,
        matches: entryFullPath === fullPath
      });
      return entryFullPath === fullPath;
    });

    if (childMatch) {
      console.log('Found child page match:', {
        id: childMatch.sys.id,
        slug: childMatch.fields.slug,
        parentSlug: childMatch.fields?.pageParent?.fields?.slug,
        fullPath: `${childMatch.fields?.pageParent?.fields?.slug}/${childMatch.fields.slug}`
      });
      return {
        title: childMatch.fields.title,
        slug: childMatch.fields.slug,
        content: Array.isArray(childMatch.fields.content) ? childMatch.fields.content : [],
        parentSlug: childMatch.fields?.pageParent?.fields?.slug
      };
    }

    console.error(`Page not found for slug: ${fullPath}`);
    console.error('Available paths:', entriesWithRelationships);
    notFound();
  } catch (error) {
    console.error('Error fetching page:', error);
    notFound();
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const fullPath = params.slug;
  const page = await getPageContent(fullPath);
  
  return {
    title: page.title,
  };
}

async function getPageData(slug: string) {
  console.log('getPageData - slug:', slug);
  return await getPageContent(slug);
}

// Add dynamic configuration
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Page({ params }: { params: { slug: string } }) {
  const fullPath = params.slug;
  console.log('Page component - fullPath:', fullPath);
  const page = await getPageData(fullPath);

  console.log('Page content:', {
    title: page.title,
    slug: page.slug,
    parentSlug: page.parentSlug,
    contentLength: page.content?.length || 0,
    contentTypes: page.content?.map(section => section.sys.contentType.sys.id) || []
  });

  return (
    <main>
      <h1 className="sr-only">{page.title}</h1>
      {page.content?.map((section, index) => (
        <ContentSection key={index} section={section} />
      ))}
    </main>
  );
} 