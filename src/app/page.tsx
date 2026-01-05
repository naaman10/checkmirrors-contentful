import { getEntries } from '@/lib/contentful';
import ContentSection from '@/components/ContentSection';

interface LandingPage {
  sys: {
    id: string;
  };
  fields: {
    title: string;
    content: Array<{
      sys: {
        id: string;
      };
      fields: {
        contentType: string;
        // Other fields will be handled by ContentSection component
      };
    }>;
  };
}

export default async function HomePage() {
  try {
    const landingPages = await getEntries('pageLanding');
    
    if (!landingPages || landingPages.length === 0) {
      console.error('No landing pages found');
      return <div>No landing page found</div>;
    }

    const landingPage = landingPages[0] as unknown as LandingPage;
    
    // Debug the landing page structure
    console.log('Landing Page Structure:', {
      fields: Object.keys(landingPage.fields),
      content: landingPage.fields.content,
      contentType: typeof landingPage.fields.content,
      isArray: Array.isArray(landingPage.fields.content)
    });
    
    if (!landingPage.fields?.content) {
      console.error('Landing page has no content field. Available fields:', Object.keys(landingPage.fields));
      return <div>Landing page content is missing</div>;
    }

    // Ensure content is an array
    const contentArray = Array.isArray(landingPage.fields.content) 
      ? landingPage.fields.content 
      : [landingPage.fields.content];

    return (
      <main>
        <h1 className="text-center py-4">{landingPage.fields.title}</h1>
        {contentArray.map((section) => (
          <ContentSection key={section.sys.id} section={section as any} />
        ))}
      </main>
    );
  } catch (error) {
    console.error('Error loading landing page:', error);
    return <div>Error loading page content</div>;
  }
} 