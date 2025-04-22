import { Entry, EntrySkeletonType, ChainModifiers } from 'contentful'
import { BlogPost, Instructor, Testimonial } from './types'
import Card from './Card'
import { useState, useEffect } from 'react'
import { createClient } from 'contentful'

interface ListingProps {
  contentType: string;
  title?: string;
  subTitle?: string;
  columns?: number;
  pagination?: {
    enabled: boolean;
    itemsPerPage?: number;
  };
}

// Map the contentType from the listings component to the actual Contentful content type IDs
const contentTypeMap: Record<string, string> = {
  'Instructors': 'instructor',
  'Blog': 'blogPost',
  'Testimonials': 'testimonial'
};

export default function Listing({ 
  contentType, 
  title, 
  subTitle, 
  columns = 3, 
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
        const response = await client.getEntries({
          content_type: mappedContentType,
          limit: 1000, // Adjust based on your needs
        });

        console.log('Fetched items:', response.items);
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
    switch (columns) {
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
      <div className="container">
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${columns} gap-6`}>
          {currentItems.map((item, index) => (
            <Card key={item.sys.id} item={item} contentType={contentType.toLowerCase()} />
          ))}
        </div>
        {pagination?.enabled && totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 mr-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-4 py-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 ml-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </section>
  )
} 