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
  'blogs': 'pageBlogPost',
  'Blog': 'pageBlogPost',
  'Blogs': 'pageBlogPost',
  'article': 'pageBlogPost',
  'articles': 'pageBlogPost',
  'Article': 'pageBlogPost',
  'Articles': 'pageBlogPost',
  'testimonial': 'testimonial',
  'testimonials': 'testimonial',
  'Testimonial': 'testimonial',
  'Testimonials': 'testimonial'
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
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

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

  // Get all unique tags from instructors with counts
  const allTags = useMemo(() => {
    if (normalizedContentType !== 'instructor' && normalizedContentType !== 'instructors') return [];
    
    const tagCounts = items.reduce((acc, item) => {
      const tags = (item.fields as Instructor['fields']).tags || [];
      tags.forEach(tag => {
        acc[tag] = (acc[tag] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(tagCounts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => a.tag.localeCompare(b.tag));
  }, [items, normalizedContentType]);

  // Get all unique categories from articles with counts
  const allCategories = useMemo(() => {
    if (normalizedContentType !== 'blog' && normalizedContentType !== 'blogs' && 
        normalizedContentType !== 'article' && normalizedContentType !== 'articles') return [];
    
    const categoryCounts = items.reduce((acc, item) => {
      const category = (item.fields as BlogPost['fields']).category;
      if (category) {
        acc[category] = (acc[category] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(categoryCounts)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => a.category.localeCompare(b.category));
  }, [items, normalizedContentType]);

  // Filter items based on selected tags or categories
  const filteredItems = useMemo(() => {
    if (!filter) return items;

    if ((normalizedContentType === 'instructor' || normalizedContentType === 'instructors') && selectedTags.length > 0) {
      return items.filter(item => {
        const instructorTags = (item.fields as Instructor['fields']).tags || [];
        return selectedTags.some(tag => instructorTags.includes(tag));
      });
    }

    if ((normalizedContentType === 'blog' || normalizedContentType === 'blogs' || 
         normalizedContentType === 'article' || normalizedContentType === 'articles') && 
        selectedCategories.length > 0) {
      console.log('Filtering articles by categories:', {
        selectedCategories,
        totalItems: items.length
      });
      
      const filtered = items.filter(item => {
        const fields = item.fields as BlogPost['fields'];
        console.log('Checking article:', {
          id: item.sys.id,
          category: fields.category,
          matches: selectedCategories.includes(fields.category)
        });
        return selectedCategories.includes(fields.category);
      });
      
      console.log('Filtered articles:', filtered.length);
      return filtered;
    }

    return items;
  }, [items, normalizedContentType, filter, selectedTags, selectedCategories]);

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

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
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
          {filter && (
            <div className="col-12 col-md-3 mb-4 mb-md-0">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Filter by</h5>
                  <div className="d-flex flex-column gap-3">
                    {/* Instructor Tags Filter */}
                    {(normalizedContentType === 'instructor' || normalizedContentType === 'instructors') && 
                     allTags.length > 0 && allTags.map(({ tag, count }) => (
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
                          {tag} <span className="text-muted">({count})</span>
                        </label>
                      </div>
                    ))}
                    
                    {/* Article Categories Filter */}
                    {(normalizedContentType === 'blog' || normalizedContentType === 'blogs' || 
                      normalizedContentType === 'article' || normalizedContentType === 'articles') && 
                     allCategories.length > 0 && allCategories.map(({ category, count }) => (
                      <div key={category} className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          role="switch"
                          id={`filter-${category}`}
                          checked={selectedCategories.includes(category)}
                          onChange={() => handleCategoryToggle(category)}
                        />
                        <label className="form-check-label" htmlFor={`filter-${category}`}>
                          {category} <span className="text-muted">({count})</span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className={`${filter && (allTags.length > 0 || allCategories.length > 0) ? 'col-12 col-md-9' : 'col-12'}`}>
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