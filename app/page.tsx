import { createClient, Entry, EntrySkeletonType } from 'contentful';
import ContentSection from '../components/ContentSection';
import { buildMetadataFromContentfulSeo } from '@/utils/seo';
import { getWebSiteJsonLd } from '@/utils/structuredData';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface PageContent {
  sys: {
    id: string;
    contentType: {
      sys: {
        id: string;
      };
    };
  };
  fields: {
    internalName: string;
    seoFields?: any;
    featuredBlogPost?: any;
    content: Entry<EntrySkeletonType> | Entry<EntrySkeletonType>[];
  };
}

async function getHomepageContent(): Promise<PageContent | null> {
  const spaceId = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID;
  const accessToken = process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN;

  if (!spaceId || !accessToken) {
    console.error('Contentful env missing');
    return null;
  }

  try {
    const client = createClient({
      space: spaceId,
      accessToken: accessToken,
    });

    const entry = await client.getEntry('3vrx9Ezv34q2B8pY0kjP25', {
      include: 3,
    });

    return entry as unknown as PageContent;
  } catch (error) {
    console.error('Error in getHomepageContent:', error);
    return null;
  }
}

export async function generateMetadata() {
  const pageContent = await getHomepageContent();

  // If Contentful is unavailable, fall back to static metadata (never 500).
  if (!pageContent) {
    return {
      title: 'Check Mirrors - School of Motoring',
      description: 'Check Mirrors - Professional Driving School',
      openGraph: {
        title: 'Check Mirrors - School of Motoring',
        description: 'Check Mirrors - Professional Driving School',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image' as const,
        title: 'Check Mirrors - School of Motoring',
        description: 'Check Mirrors - Professional Driving School',
      },
    };
  }

  const title = typeof pageContent.fields?.internalName === 'string'
    ? pageContent.fields.internalName
    : 'Home';

  return buildMetadataFromContentfulSeo({
    seoFields: pageContent.fields?.seoFields,
    fallback: {
      title,
      path: '/',
      type: 'website',
    },
  });
}

export default async function Home() {
  const pageContent = await getHomepageContent();

  if (!pageContent) {
    return (
      <main className="container py-5">
        <div className="alert alert-info">
          Content is temporarily unavailable. Please try again later.
        </div>
      </main>
    );
  }

  const content = pageContent.fields?.content;
  if (!content) {
    return <main>No content found</main>;
  }

  const contentArray = Array.isArray(content) ? content : [content];
  if (contentArray.length === 0) {
    return <main>No content sections found</main>;
  }

  const webSiteLd = getWebSiteJsonLd();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteLd) }}
      />
      <main>
        {contentArray.map((section, index) => (
          <div key={section?.sys?.id ?? index}>
            <ContentSection section={section} />
          </div>
        ))}
      </main>
    </>
  );
} 