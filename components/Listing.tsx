import { Entry, EntrySkeletonType, ChainModifiers } from 'contentful'
import { BlogPost, Instructor, Testimonial } from './types'
import Card from './Card'
import { useState, useEffect } from 'react'
import { createClient } from 'contentful'

interface ListingProps {
  contentType: string;
  title?: string;
  subTitle?: string;
  columns?: string;
  pagination?: {
    enabled: boolean;
    itemsPerPage?: number;
  };
}

// Map the contentType from the listings component to the actual Contentful content type IDs
const contentTypeMap: Record<string, string> = {
  'Instructors': 'instructor',
  'Blog': 'blogPost',
  'Articles': 'pageBlogPost',
  'Testimonials': 'testimonial'
};

export default function Listing({ 
  contentType, 
  title, 
  subTitle, 
  columns = '3', 
  pagination = { enabled: false } 
}: ListingProps) {
  const [items, setItems] = useState<Entry<EntrySkeletonType, ChainModifiers>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const client = createClient({
          space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID || '',
          accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN || '',
        });

        // Get the mapped content type ID
        const mappedContentType = contentTypeMap[contentType];
        if (!mappedContentType) {
          throw new Error(`Unknown content type: ${contentType}`);
        }

        console.log('Fetching items for content type:', mappedContentType);
        
        // Set up query parameters
        const query: any = {
          content_type: mappedContentType,
          limit: 1000, // Adjust based on your needs
          include: 3 // Include linked entries up to 3 levels deep
        };

        // Add ordering for instructors
        if (contentType === 'Instructors') {
          query.order = 'fields.order';
        }

        const response = await client.getEntries(query);

        console.log('Fetched items:', JSON.stringify(response.items, null, 2));
        setItems(response.items);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching items:', err);
        setError('Failed to load content');
        setLoading(false);
      }
    };

    fetchItems();
  }, [contentType]);

  const itemsPerPage = pagination?.itemsPerPage || 6;
  const totalPages = Math.ceil((items?.length || 0) / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = items?.slice(startIndex, endIndex) || [];

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  if (!items || items.length === 0) {
    console.warn('No items found for content type:', contentType);
    return null;
  }

  const getColumnClass = () => {
    const numColumns = parseInt(columns, 10) || 3;
    switch (numColumns) {
      case 1:
        return 'col-12'
      case 2:
        return 'col-12 col-md-6'
      case 3:
        return 'col-12 col-md-6 col-lg-4'
      case 4:
        return 'col-12 col-md-6 col-lg-3'
      default:
        return 'col-12 col-md-6 col-lg-4'
    }
  }

  return (
    <section className="py-5">
      <div className="container">
        {title && (
          <h2 className="text-center mb-4">
            {title}
          </h2>
        )}
        {subTitle && (
          <p className="text-center mb-4">
            {subTitle}
          </p>
        )}
        <div className="row g-4">
          {currentItems.map((item, index) => (
            <div key={item.sys.id} className={getColumnClass()}>
              <div className="card h-100">
                <Card item={item} contentType={contentType.toLowerCase()} columns={columns} />
              </div>
            </div>
          ))}
        </div>
        {pagination?.enabled && totalPages > 1 && (
          <div className="d-flex justify-content-center mt-4">
            <nav aria-label="Page navigation">
              <ul className="pagination">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                </li>
                <li className="page-item">
                  <span className="page-link">
                    Page {currentPage} of {totalPages}
                  </span>
                </li>
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </div>
    </section>
  )
} 