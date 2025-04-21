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
  if (slug === 'home') {
    try {
      const homepage = await client.getEntry<PageEntry>('3vrx9Ezv34q2B8pY0kjP25');
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
    const entries = await client.getEntries<PageEntry>({
      content_type: 'pageLanding',
      include: 3,
    });

    const page = entries.items.find(item => item.fields.slug === slug);
    
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
    const entries = await client.getEntries<PageEntry>({
      content_type: 'pageLanding',
    });

    const slugs = entries.items
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

export default async function Page({ params }: { params: { slug: string } }) {
  const page = await getPageContent(params.slug);

  return (
    <main>
      <h1 className="sr-only">{page.title}</h1>
      {page.content.map((section, index) => (
        <ContentSection key={index} section={section} />
      ))}
    </main>
  );
} 