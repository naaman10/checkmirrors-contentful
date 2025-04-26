import { createClient } from 'contentful';
import Image from 'next/image';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS, INLINES } from '@contentful/rich-text-types';
import { getCloudinaryUrl, getImageDimensions } from '@/utils/cloudinary';
import HeroBanner from '@/components/HeroBanner';
import Feature from '@/components/Feature';

interface BlogPost {
  sys: {
    id: string;
  };
  fields: {
    title: string;
    slug: string;
    publishedDate: string;
    author: {
      fields: {
        name: string;
        profileImage?: {
          fields?: {
            file?: {
              url?: string;
            };
            image?: Array<{
              url?: string;
              secure_url?: string;
            }>;
          };
        };
      };
    };
    featureImage?: {
      fields?: {
        altText?: string;
        image?: Array<{
          url?: string;
          secure_url?: string;
        }>;
        file?: {
          url?: string;
        };
        title?: string;
      };
    };
    content: any;
  };
}

async function getBlogPost(slug: string) {
  const spaceId = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID;
  const accessToken = process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN;
  
  if (!spaceId || !accessToken) {
    throw new Error('Contentful credentials are missing');
  }

  const client = createClient({
    space: spaceId,
    accessToken: accessToken,
  });

  const response = await client.getEntries({
    content_type: 'pageBlogPost',
    'fields.slug': slug,
    limit: 1,
    include: 3, // Include linked entries up to 3 levels deep
    select: [
      'sys.id',
      'fields.title',
      'fields.slug',
      'fields.publishedDate',
      'fields.author',
      'fields.featureImage',
      'fields.content'
    ]
  });

  if (!response.items.length) {
    throw new Error('Blog post not found');
  }


  return response.items[0] as unknown as BlogPost;
}

const options = {
  renderNode: {
    [BLOCKS.PARAGRAPH]: (node: any, children: any) => (
      <p className="mb-4">{children}</p>
    ),
    [BLOCKS.HEADING_1]: (node: any, children: any) => (
      <h1 className="display-4 mb-4">{children}</h1>
    ),
    [BLOCKS.HEADING_2]: (node: any, children: any) => (
      <h2 className="display-5 mb-4">{children}</h2>
    ),
    [BLOCKS.HEADING_3]: (node: any, children: any) => (
      <h3 className="display-6 mb-4">{children}</h3>
    ),
    [BLOCKS.UL_LIST]: (node: any, children: any) => (
      <ul className="list-unstyled mb-4">{children}</ul>
    ),
    [BLOCKS.OL_LIST]: (node: any, children: any) => (
      <ol className="list-unstyled mb-4">{children}</ol>
    ),
    [BLOCKS.LIST_ITEM]: (node: any, children: any) => (
      <li className="mb-2">{children}</li>
    ),
    [INLINES.HYPERLINK]: (node: any, children: any) => (
      <a href={node.data.uri} className="text-primary" target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    ),
    [BLOCKS.EMBEDDED_ENTRY]: (node: any) => {
      
      if (!node.data.target) {
        console.warn('No target found in embedded entry');
        return null;
      }

      const contentType = node.data.target.sys.contentType.sys.id;
      
      switch (contentType) {
        case 'image':
        case 'componentImage': {
          const image = node.data.target;
          console.log('Image component data:', JSON.stringify(image, null, 2));
          
          const imageUrl = image.fields.image?.[0]?.secure_url || image.fields.image?.[0]?.url;
          const altText = image.fields.altText || '';
          
          if (!imageUrl) {
            console.warn('No image URL found in image component');
            return null;
          }
          
          const dimensions = getImageDimensions('featured');
          const transformedUrl = getCloudinaryUrl(imageUrl, dimensions.width, dimensions.height, 'featured');
          
          if (!transformedUrl) {
            console.warn('Failed to transform image URL');
            return null;
          }
          
          return (
            <div className="my-4">
              <Image
                src={transformedUrl}
                alt={altText}
                width={dimensions.width}
                height={dimensions.height}
                className="rounded-3 img-fluid"
              />
            </div>
          );
        }
        case 'componentFeature': {
          const feature = node.data.target;
          console.log('Feature component data:', JSON.stringify(feature, null, 2));
          return <Feature section={feature} isEmbedded={true} />;
        }
        default:
          console.warn(`Unsupported embedded content type: ${contentType}`);
          return null;
      }
    },
  },
};

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  try {
    const post = await getBlogPost(params.slug);
    console.log('Blog post data:', JSON.stringify(post, null, 2));
    console.log('Blog post content:', JSON.stringify(post.fields.content, null, 2));
    console.log('Author data:', JSON.stringify(post.fields.author, null, 2));
    
    // Try different possible paths to the author profile image
    const authorProfileImage = 
      post.fields.author?.fields?.profileImage?.fields?.file?.url || 
      post.fields.author?.fields?.profileImage?.fields?.image?.[0]?.secure_url || 
      post.fields.author?.fields?.profileImage?.fields?.image?.[0]?.url;
    console.log('Author profile image URL:', authorProfileImage);
    
    const featuredImageUrl = post.fields.featureImage?.fields?.image?.[0]?.secure_url || 
                           post.fields.featureImage?.fields?.image?.[0]?.url;
    console.log('Featured image URL:', featuredImageUrl);
    
    const featuredImageAlt = post.fields.featureImage?.fields?.altText || post.fields.title;
    const avatarDimensions = getImageDimensions('avatar');
    const featuredDimensions = getImageDimensions('featured');
    
    const transformedProfileImageUrl = authorProfileImage ? getCloudinaryUrl(authorProfileImage, avatarDimensions.width, avatarDimensions.height, 'avatar') : null;
    const transformedFeaturedUrl = featuredImageUrl ? getCloudinaryUrl(featuredImageUrl, featuredDimensions.width, featuredDimensions.height, 'featured') : null;

    // Create a hero banner section with the blog's title and featured image
    const heroBannerSection = {
      fields: {
        heading: post.fields.title,
        backgroundImage: [{
          url: featuredImageUrl,
          secure_url: featuredImageUrl
        }],
        size: '50'
      }
    };

    return (
      <>
        <HeroBanner section={heroBannerSection} />
        <main className="container py-5">
          <article className="bg-white rounded shadow-sm p-4">
            <div className="d-flex align-items-center mb-3">
              {transformedProfileImageUrl && (
                <div className="me-3">
                  <Image
                    src={transformedProfileImageUrl}
                    alt={`${post.fields.author.fields.name}'s profile`}
                    width={avatarDimensions.width}
                    height={avatarDimensions.height}
                    className="rounded-circle"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              )}
              <div>
                <span className="text-muted">By {post.fields.author?.fields?.name || 'Unknown Author'}</span>
                <br />
                <time className="text-muted" dateTime={post.fields.publishedDate}>
                  {new Date(post.fields.publishedDate).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </time>
              </div>
            </div>

            <div className="content">
              {documentToReactComponents(post.fields.content, options)}
            </div>
          </article>
        </main>
      </>
    );
  } catch (error) {
    return (
      <main className="container py-5">
        <div className="alert alert-danger">
          {error instanceof Error ? error.message : 'An error occurred while loading the blog post'}
        </div>
      </main>
    );
  }
} 