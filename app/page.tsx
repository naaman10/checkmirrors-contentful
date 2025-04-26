import { createClient, Entry, EntrySkeletonType } from 'contentful';
import ContentSection from '../components/ContentSection';

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

async function getHomepageContent() {
  // Log environment variables for debugging
  const spaceId = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID;
  const accessToken = process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN;

  // Validate environment variables
  if (!spaceId) {
    throw new Error('NEXT_PUBLIC_CONTENTFUL_SPACE_ID is missing');
  }
  if (!accessToken) {
    throw new Error('NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN is missing');
  }

  try {
    // Create Contentful client
    const client = createClient({
      space: spaceId,
      accessToken: accessToken,
    });

    // Fetch the entry
    const entry = await client.getEntry('3vrx9Ezv34q2B8pY0kjP25', { 
      include: 3
    });

    return entry as unknown as PageContent;
  } catch (error) {
    console.error('Error in getHomepageContent:', error);
    throw error;
  }
}

export default async function Home() {
  try {
    const pageContent = await getHomepageContent();

    if (!pageContent) {
      return <main>No content available</main>;
    }

    const content = pageContent.fields.content;
    if (!content) {
      return <main>No content found</main>;
    }

    // Convert single content item to array if needed
    const contentArray = Array.isArray(content) ? content : [content];
    
    if (contentArray.length === 0) {
      return <main>No content sections found</main>;
    }
    
    return (
      <main>
        {contentArray.map((section, index) => (
          <div key={section.sys.id || index} >
            <ContentSection section={section} />
          </div>
        ))}
      </main>
    );
  } catch (error) {
    return <main>Error loading content: {error instanceof Error ? error.message : 'Unknown error'}</main>;
  }
} 