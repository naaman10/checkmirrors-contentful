import { createClient, Entry, EntrySkeletonType } from 'contentful';
import { notFound } from 'next/navigation';
import ContentSection from '@/components/ContentSection';

interface PageFields {
  title: string;
  slug?: string;
  content: any[];
}

interface PageEntry extends EntrySkeletonType {
  fields: PageFields;
}

interface PageContent {
  title: string;
  slug?: string;
  content: any[];
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

async function getPageContent(slug: string): Promise<PageContent> {
  console.log('Fetching page content for slug:', slug);

  if (slug === 'home') {
    try {
      const homepage = await client.getEntry<PageEntry>('3vrx9Ezv34q2B8pY0kjP25', {
        include: 3,
      });
      return {
        title: homepage.fields.title,
        slug: 'home',
        content: homepage.fields.content,
      };
    } catch (error) {
      console.error('Error fetching homepage:', error);
      notFound();
    }
  }

  try {
    // First, get all content types to see what's available
    const contentTypes = await client.getContentTypes();
    const availableTypes = contentTypes.items.map(ct => ({
      id: ct.sys.id,
      name: ct.name,
      displayField: ct.displayField
    }));
    console.log('Available content types:', JSON.stringify(availableTypes, null, 2));

    // Get all entries across all content types
    const allEntries = await client.getEntries<PageEntry>({
      include: 3,
    });

    console.log('Total entries found:', allEntries.items.length);
    console.log('Entry content types:', allEntries.items.map(entry => ({
      id: entry.sys.id,
      contentType: entry.sys.contentType.sys.id,
      slug: entry.fields.slug
    })));

    // Find the entry with matching slug
    const matchingEntry = allEntries.items.find(entry => 
      entry.fields.slug === slug
    );

    if (matchingEntry) {
      console.log('Found matching entry:', {
        id: matchingEntry.sys.id,
        contentType: matchingEntry.sys.contentType.sys.id,
        fields: matchingEntry.fields
      });
      return {
        title: matchingEntry.fields.title,
        slug: matchingEntry.fields.slug,
        content: matchingEntry.fields.content,
      };
    }

    console.error(`Page not found for slug: ${slug}`);
    notFound();
  } catch (error) {
    console.error('Error fetching page:', error);
    notFound();
  }
}

export async function generateStaticParams() {
  try {
    // Get all entries to find slugs
    const entries = await client.getEntries<PageEntry>({
      include: 3,
      select: ['fields']
    });

    console.log('Entries for static params:', entries.items.map(entry => ({
      id: entry.sys.id,
      contentType: entry.sys.contentType.sys.id,
      slug: entry.fields.slug
    })));

    const slugs = entries.items
      .filter(item => item.fields.slug)
      .map(item => ({
        slug: item.fields.slug!
      }));

    // Add homepage to static params
    return [...slugs, { slug: 'home' }];
  } catch (error) {
    console.error('Error generating static params:', error);
    return [{ slug: 'home' }];
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const page = await getPageContent(params.slug);
  
  return {
    title: page.title,
  };
}

async function getPageData(slug: string) {
  return await getPageContent(slug);
}

export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const page = await getPageData(slug);

  console.log('Page content:', {
    title: page.title,
    slug: page.slug,
    contentLength: page.content.length,
    contentTypes: page.content.map(section => section.sys.contentType.sys.id)
  });

  return (
    <main>
      <h1 className="sr-only">{page.title}</h1>
      {page.content.map((section, index) => (
        <ContentSection key={index} section={section} />
      ))}
    </main>
  );
} 