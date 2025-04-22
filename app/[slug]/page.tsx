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
    console.log('Available content types:', contentTypes.items.map(ct => ct.sys.id));

    // Try to find the page using a more flexible query
    const entries = await client.getEntries<PageEntry>({
      include: 3,
      select: ['fields', 'sys.id', 'sys.type', 'sys.contentType'],
      query: slug
    });

    console.log('Found entries:', entries.items.length);
    if (entries.items.length > 0) {
      console.log('Entry details:', JSON.stringify(entries.items[0], null, 2));
    }

    const page = entries.items[0];
    
    if (!page) {
      console.error(`Page not found for slug: ${slug}`);
      notFound();
    }

    return {
      title: page.fields.title,
      slug: page.fields.slug,
      content: page.fields.content,
    };
  } catch (error) {
    console.error('Error fetching page:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    notFound();
  }
}

export async function generateStaticParams() {
  try {
    // Log available content types
    await logContentTypes();

    // Get pages from both content types
    const [pageEntries, pageLandingEntries] = await Promise.all([
      client.getEntries<PageEntry>({
        content_type: 'page',
        include: 3,
        select: ['fields', 'sys.id', 'sys.type', 'sys.contentType']
      }),
      client.getEntries<PageEntry>({
        content_type: 'pageLanding',
        include: 3,
        select: ['fields', 'sys.id', 'sys.type', 'sys.contentType']
      })
    ]);

    const slugs = [
      ...pageEntries.items,
      ...pageLandingEntries.items
    ]
      .filter(item => item.fields.slug)
      .map(item => ({
        slug: item.fields.slug!
      }));

    // Add homepage to static params
    return [...slugs, { slug: 'home' }];
  } catch (error) {
    console.error('Error generating static params:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    return [{ slug: 'home' }];
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  return {
    title: params.slug === 'home' ? 'Home' : params.slug,
  };
}

export default async function Page({ params }: { params: { slug: string } }) {
  const slug = params.slug;
  const page = await getPageContent(slug);

  return (
    <main>
      <h1 className="sr-only">{page.title}</h1>
      {page.content.map((section, index) => (
        <ContentSection key={index} section={section} />
      ))}
    </main>
  );
} 