import { createClient } from 'contentful';
import Image from 'next/image';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS, INLINES } from '@contentful/rich-text-types';

interface BlogPost {
  sys: {
    id: string;
  };
  fields: {
    title: string;
    slug: string;
    publishDate: string;
    author: {
      fields: {
        name: string;
        avatar?: {
          fields?: {
            image?: Array<{
              url?: string;
              secure_url?: string;
            }>;
          };
        };
      };
    };
    featuredImage?: {
      fields?: {
        altText?: string;
        image?: Array<{
          url?: string;
          secure_url?: string;
        }>;
      };
    };
    content: any;
    tags?: string[];
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
    limit: 1
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
  },
};

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  try {
    const post = await getBlogPost(params.slug);
    const authorAvatar = post.fields.author?.fields?.avatar?.fields?.image?.[0]?.secure_url || 
                        post.fields.author?.fields?.avatar?.fields?.image?.[0]?.url;
    const featuredImageUrl = post.fields.featuredImage?.fields?.image?.[0]?.secure_url || 
                            post.fields.featuredImage?.fields?.image?.[0]?.url;
    const featuredImageAlt = post.fields.featuredImage?.fields?.altText || post.fields.title;

    return (
      <main className="container py-5">
        <article className="bg-white rounded shadow-sm p-4">
          <header className="mb-4">
            <h1 className="display-4 mb-3">{post.fields.title}</h1>
            <div className="d-flex align-items-center mb-3">
              {authorAvatar && (
                <div className="me-3">
                  <Image
                    src={authorAvatar}
                    alt={`${post.fields.author.fields.name}'s avatar`}
                    width={40}
                    height={40}
                    className="rounded-circle"
                  />
                </div>
              )}
              <div>
                <span className="text-muted">By {post.fields.author?.fields?.name || 'Unknown Author'}</span>
                <br />
                <time className="text-muted" dateTime={post.fields.publishDate}>
                  {new Date(post.fields.publishDate).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </time>
              </div>
            </div>
          </header>

          {featuredImageUrl && (
            <div className="mb-4">
              <Image
                src={featuredImageUrl}
                alt={featuredImageAlt}
                width={1200}
                height={600}
                className="img-fluid rounded"
                priority
              />
            </div>
          )}

          <div className="content">
            {documentToReactComponents(post.fields.content, options)}
          </div>

          {post.fields.tags && post.fields.tags.length > 0 && (
            <footer className="mt-4">
              <div className="d-flex flex-wrap gap-2">
                {post.fields.tags.map((tag) => (
                  <span key={tag} className="badge bg-secondary">
                    {tag}
                  </span>
                ))}
              </div>
            </footer>
          )}
        </article>
      </main>
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