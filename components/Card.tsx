import React from 'react';
import Image from 'next/image';
import CTA from './CTA';
import { BlogPost, FeatureSection, CTA as CTAType, ContentType, Instructor, Testimonial } from './types';
import { Entry, EntrySkeletonType, ChainModifiers } from 'contentful';
import Link from 'next/link';
import { getCloudinaryUrl, getImageDimensions } from '../utils/cloudinary';

interface CardProps {
  item: Entry<EntrySkeletonType, ChainModifiers>;
  contentType: string;
  columns?: string;
}

interface ContentfulImage {
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
}

export default function Card({ item, contentType, columns = '3' }: CardProps) {
  if (!item.fields) return null;

  const getImageUrl = (imageData: ContentfulImage | null | undefined) => {
    if (!imageData?.fields) return null;

    // Handle the new structure (file.url)
    if (imageData.fields.file?.url) {
      return imageData.fields.file.url;
    }

    // Handle the old structure (image array with url/secure_url)
    if (imageData.fields.image?.[0]) {
      return imageData.fields.image[0].secure_url || imageData.fields.image[0].url;
    }

    return null;
  };

  const getImageAlt = (imageData: ContentfulImage | null | undefined) => {
    if (!imageData?.fields) return '';
    return imageData.fields.altText || imageData.fields.title || '';
  };

  const isSingleColumn = parseInt(columns, 10) === 1;

  const renderImage = (imageUrl: string | null | undefined, alt: string, contentType: string, hasPadding: boolean = false) => {
    if (!imageUrl) return null;
    
    const dimensions = getImageDimensions(contentType);
    const transformedUrl = getCloudinaryUrl(imageUrl, dimensions.width, dimensions.height, contentType);
    if (!transformedUrl) return null;
    
    if (isSingleColumn) {
      return (
        <div className="col-4">
          <div className="card-img-top">
            <Image
              src={transformedUrl}
              alt={alt}
              width={dimensions.width}
              height={dimensions.height}
              className="rounded-3 img-fluid"
              priority
            />
          </div>
        </div>
      );
    }

    return (
      <div className="card-img-top">
        <Image
          src={transformedUrl}
          alt={alt}
          width={dimensions.width}
          height={dimensions.height}
          className="rounded-3 img-fluid"
          priority
        />
      </div>
    );
  };

  const renderCardBody = (content: React.ReactNode) => {
    if (isSingleColumn) {
      return <div className="col-8">{content}</div>;
    }
    return content;
  };

  switch (contentType.toLowerCase()) {
    case 'blog':
    case 'pageblogpost':
    case 'articles': {
      const blogFields = item.fields as BlogPost['fields'];
      const imageData = blogFields.featureImage || blogFields.featuredImage;
      const imageUrl = getImageUrl(imageData as ContentfulImage);
      const imageAlt = getImageAlt(imageData as ContentfulImage) || 'Featured image';
      
      const cardContent = (
        <div className="card-body">
          <h5 className="card-title">{blogFields.title}</h5>
          {blogFields.publishDate && (
            <p className="card-text">
              <small className="text-muted">
                {new Date(blogFields.publishDate).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </small>
            </p>
          )}
          <Link href={`/blog/${blogFields.slug}`} className="btn btn-primary">
            Read More
          </Link>
        </div>
      );

      return (
        <div className="card h-100">
          {isSingleColumn ? (
            <div className="row g-0 h-100">
              {renderImage(imageUrl, imageAlt, contentType, true)}
              {renderCardBody(cardContent)}
            </div>
          ) : (
            <>
              {renderImage(imageUrl, imageAlt, contentType, true)}
              {cardContent}
            </>
          )}
        </div>
      );
    }

    case 'instructor':
    case 'instructors': {
      const instructorFields = item.fields as Instructor['fields'];
      const imageUrl = getImageUrl(instructorFields.image as ContentfulImage);
      const imageAlt = getImageAlt(instructorFields.image as ContentfulImage) || 'Profile image';
      
      const cardContent = (
        <div className="card-body text-center">
          <h5 className="card-title">{instructorFields.name}</h5>
          {instructorFields.qualifications && instructorFields.qualifications.length > 0 && (
            <p className="card-text">
              {instructorFields.qualifications.join(', ')}
            </p>
          )}
          {instructorFields.bio && (
            <p className="card-text">{instructorFields.bio}</p>
          )}
        </div>
      );

      return (
        <div className="card h-100">
          {isSingleColumn ? (
            <div className="row g-0 h-100">
              {renderImage(imageUrl, imageAlt, contentType, true)}
              {renderCardBody(cardContent)}
            </div>
          ) : (
            <>
              {renderImage(imageUrl, imageAlt, contentType, true)}
              {cardContent}
            </>
          )}
        </div>
      );
    }

    case 'testimonials': {
      const testimonialFields = item.fields as {
        internalName: string;
        title: string;
        text: string;
        passDate: string;
        pupilImage: Array<{
          url: string;
          secure_url: string;
        }>;
      };
      
      const imageUrl = testimonialFields.pupilImage?.[0]?.secure_url || testimonialFields.pupilImage?.[0]?.url;
      const imageAlt = testimonialFields.title;
      
      const cardContent = (
        <div className="card-body text-center">
          <h5 className="card-title">{testimonialFields.title}</h5>
          {testimonialFields.passDate && (
            <p className="text-muted mb-3">
              Passed: {new Date(testimonialFields.passDate).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </p>
          )}
          <blockquote className="blockquote mb-0">
            <p className="card-text">{testimonialFields.text}</p>
          </blockquote>
        </div>
      );

      return (
        <div className="card h-100">
          {isSingleColumn ? (
            <div className="row g-0 h-100">
              {renderImage(imageUrl, imageAlt, contentType)}
              {renderCardBody(cardContent)}
            </div>
          ) : (
            <>
              {renderImage(imageUrl, imageAlt, contentType)}
              {cardContent}
            </>
          )}
        </div>
      );
    }

    default:
      return null;
  }
} 