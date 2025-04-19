import React from 'react';
import Image from 'next/image';
import CTA from './CTA';
import { BlogPost, FeatureSection, CTA as CTAType } from './types';

interface CardProps {
  content: BlogPost | FeatureSection;
  variant?: 'default' | 'feature' | 'blog';
  className?: string;
}

export default function Card({ content, variant = 'default', className = '' }: CardProps) {
  // Common card styles
  const baseClasses = 'card h-100 shadow-sm';
  const variantClasses = {
    default: '',
    feature: 'feature-card',
    blog: 'blog-card'
  };

  // Helper function to get image URL
  const getImageUrl = (imageArray: Array<{ url: string; secure_url: string }> | undefined) => {
    const url = imageArray?.[0]?.secure_url || imageArray?.[0]?.url;
    return url || '/placeholder.jpg'; // Fallback image
  };

  // Helper function to get image alt text
  const getImageAlt = (altText: string | undefined, fallback: string) => {
    return altText || fallback;
  };

  // Render different card types based on content type
  if ('fields' in content) {
    const fields = content.fields;

    // Blog Post Card
    if ('slug' in fields) {
      const blogFields = fields as BlogPost['fields'];
      const authorAvatar = blogFields.author?.fields?.avatar?.fields?.image;
      const featuredImage = blogFields.featuredImage?.fields?.image;
      const authorName = blogFields.author?.fields?.name || 'Unknown Author';

      return (
        <div className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
          {featuredImage && (
            <div className="card-img-top">
              <Image
                src={getImageUrl(featuredImage)}
                alt={getImageAlt(blogFields.featuredImage?.fields?.altText, blogFields.title)}
                width={400}
                height={250}
                className="img-fluid"
                style={{ objectFit: 'cover' }}
              />
            </div>
          )}
          <div className="card-body">
            <h5 className="card-title">{blogFields.title}</h5>
            <div className="d-flex align-items-center mb-3">
              {authorAvatar && (
                <div className="me-2">
                  <Image
                    src={getImageUrl(authorAvatar)}
                    alt={`${authorName}'s avatar`}
                    width={32}
                    height={32}
                    className="rounded-circle"
                  />
                </div>
              )}
              <div>
                <small className="text-muted">By {authorName}</small>
                <br />
                <small className="text-muted">
                  {new Date(blogFields.publishDate).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </small>
              </div>
            </div>
            {blogFields.excerpt && (
              <p className="card-text">{blogFields.excerpt}</p>
            )}
            {blogFields.tags && blogFields.tags.length > 0 && (
              <div className="mt-3">
                {blogFields.tags.map((tag) => (
                  <span key={tag} className="badge bg-secondary me-1">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="card-footer bg-transparent border-top-0">
            <a href={`/blog/${blogFields.slug}`} className="btn btn-primary">
              Read More
            </a>
          </div>
        </div>
      );
    }

    // Feature Card
    if ('title' in fields && 'bodyText' in fields) {
      const featureFields = fields as FeatureSection['fields'];
      const mediaImage = featureFields.media?.fields?.image;

      return (
        <div className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
          {mediaImage && (
            <div className="card-img-top">
              <Image
                src={getImageUrl(mediaImage)}
                alt={getImageAlt(featureFields.media?.fields?.altText, featureFields.title)}
                width={400}
                height={250}
                className="img-fluid"
                style={{ objectFit: 'cover' }}
              />
            </div>
          )}
          <div className="card-body">
            <h5 className="card-title">{featureFields.title}</h5>
            <p className="card-text">{featureFields.bodyText}</p>
            {featureFields.cta && (
              <div className="mt-3">
                <CTA cta={featureFields.cta} />
              </div>
            )}
          </div>
        </div>
      );
    }
  }

  // Fallback for unknown content types
  return (
    <div className={`${baseClasses} ${className}`}>
      <div className="card-body">
        <p className="card-text">Unsupported content type</p>
      </div>
    </div>
  );
} 