import { Entry, EntrySkeletonType, ChainModifiers } from 'contentful'
import { BlogPost, Instructor, Testimonial } from './types'
import Card from './Card'
import { useState, useEffect, useMemo } from 'react'
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
  filter?: boolean;
  items?: Entry<EntrySkeletonType, ChainModifiers>[];
}

// Map the contentType from the listings component to the actual Contentful content type IDs
const contentTypeMap: Record<string, string> = {
  'instructor': 'instructor',
  'instructors': 'instructor',
  'Instructor': 'instructor',
  'Instructors': 'instructor',
  'blog': 'pageBlogPost',
  'testimonial': 'testimonial'
};

export default function Listing({ 
  contentType, 
  title, 
  subTitle, 
  columns = '3', 
  pagination = { enabled: false },
  filter = false,
  items: initialItems
}: ListingProps) {
  // Normalize the content type to lowercase for consistent comparison
  const normalizedContentType = contentType?.toLowerCase();
  
  console.log('Listing component initialized with:', {
    contentType,
    normalizedContentType,
    initialItems: initialItems?.length || 0,
    hasInitialItems: !!initialItems,
    initialItemsType: typeof initialItems,
    spaceId: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID?.slice(0, 5) + '...',
    hasAccessToken: !!process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN,
    mappedContentType: contentTypeMap[contentType] || contentTypeMap[normalizedContentType]
  });

  const [items, setItems] = useState<Entry<EntrySkeletonType, ChainModifiers>[]>(() => {
    // Only initialize with initialItems if it's a valid array
    if (Array.isArray(initialItems) && initialItems.length > 0) {
      console.log('Initializing items with initialItems:', initialItems.length);
      return initialItems;
    }
    console.log('Initializing items with empty array');
    return [];
  });
  const [loading, setLoading] = useState(() => !Array.isArray(initialItems) || initialItems.length === 0);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    const fetchItems = async () => {
      // Only skip fetch if we have valid initialItems
      if (Array.isArray(initialItems) && initialItems.length > 0) {
        console.log('Using initial items, skipping fetch:', initialItems.length);
        return;
      }

      try {
        if (!process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID || !process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN) {
          throw new Error('Missing Contentful credentials');
        }

        const client = createClient({
          space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID,
          accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN,
        });

        // Get the mapped content type ID
        const mappedContentType = contentTypeMap[contentType] || contentTypeMap[normalizedContentType];
        console.log('Content type mapping:', {
          input: contentType,
          normalizedInput: normalizedContentType,
          mapped: mappedContentType,
          availableMappings: Object.keys(contentTypeMap)
        });

        if (!mappedContentType) {
          throw new Error(`Unknown content type: ${contentType}`);
        }

        // Set up query parameters
        const query: any = {
          content_type: mappedContentType,
          limit: 1000,
          include: 3
        };

        // Add ordering for instructors
        if (normalizedContentType === 'instructor' || normalizedContentType === 'instructors') {
          query.order = 'fields.order';
        }

        console.log('Fetching with query:', query);
        const response = await client.getEntries(query);
        console.log('Contentful response:', {
          total: response.total,
          items: response.items.map(item => ({
            id: item.sys.id,
            contentType: item.sys.contentType.sys.id,
            fields: Object.keys(item.fields)
          }))
        });

        setItems(response.items);
        setLoading(false);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load content';
        console.error('Error fetching items:', err);
        setError(errorMessage);
        setLoading(false);
      }
    };

    fetchItems();
  }, [contentType, initialItems]);

  // Get all unique tags from instructors
  const allTags = useMemo(() => {
    if (normalizedContentType !== 'instructor' && normalizedContentType !== 'instructors') return [];
    return Array.from(new Set(
      items.flatMap(item => (item.fields as Instructor['fields']).tags || [])
    )).sort();
  }, [items, normalizedContentType]);

  // Filter items based on selected tags
  const filteredItems = useMemo(() => {
    if (normalizedContentType !== 'instructor' && normalizedContentType !== 'instructors' || !filter || selectedTags.length === 0) {
      return items;
    }
    return items.filter(item => {
      const instructorTags = (item.fields as Instructor['fields']).tags || [];
      return selectedTags.some(tag => instructorTags.includes(tag));
    });
  }, [items, normalizedContentType, filter, selectedTags]);

  const itemsPerPage = pagination?.itemsPerPage || 6;
  const totalPages = Math.ceil((filteredItems?.length || 0) / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredItems?.slice(startIndex, endIndex) || [];

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
    setCurrentPage(1); // Reset to first page when filters change
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  if (!items || items.length === 0) {
    console.warn('No items found for content type:', contentType, {
      itemsLength: items?.length,
      isLoading: loading,
      hasError: !!error
    });
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
        <div className="row">
          {filter && (normalizedContentType === 'instructor' || normalizedContentType === 'instructors') && allTags.length > 0 && (
            <div className="col-12 col-md-3 mb-4 mb-md-0">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Filter by</h5>
                  <div className="d-flex flex-column gap-3">
                    {allTags.map(tag => (
                      <div key={tag} className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          role="switch"
                          id={`filter-${tag}`}
                          checked={selectedTags.includes(tag)}
                          onChange={() => handleTagToggle(tag)}
                        />
                        <label className="form-check-label" htmlFor={`filter-${tag}`}>
                          {tag}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className={`${filter && (normalizedContentType === 'instructor' || normalizedContentType === 'instructors') && allTags.length > 0 ? 'col-12 col-md-9' : 'col-12'}`}>
            <div className="row g-4">
              {currentItems.map((item, index) => (
                <div key={item.sys.id} className={getColumnClass()}>
                  <div className="card h-100">
                    <Card item={item} contentType={normalizedContentType} columns={columns} />
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
        </div>
      </div>
    </section>
  )
} 