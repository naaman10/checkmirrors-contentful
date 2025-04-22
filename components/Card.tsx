import React from 'react';
import Image from 'next/image';
import CTA from './CTA';
import { BlogPost, FeatureSection, CTA as CTAType, ContentType, Instructor, Testimonial } from './types';
import { Entry, EntrySkeletonType, ChainModifiers } from 'contentful';
import Link from 'next/link';

interface CardProps {
  item: Entry<EntrySkeletonType, ChainModifiers>;
  contentType: string;
}

export default function Card({ item, contentType }: CardProps) {
  if (!item.fields) return null;

  switch (contentType) {
    case 'blog': {
      const blogFields = item.fields as BlogPost['fields'];
      return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {blogFields.featuredImage?.fields?.file?.url && (
            <div className="relative h-48">
              <Image
                src={`https:${blogFields.featuredImage.fields.file.url}`}
                alt={blogFields.featuredImage.fields.title || 'Featured image'}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-2">{blogFields.title}</h3>
            {blogFields.excerpt && (
              <p className="text-gray-600 mb-4">{blogFields.excerpt}</p>
            )}
            <p className="text-sm text-gray-500">
              {new Date(blogFields.publishDate).toLocaleDateString()}
            </p>
          </div>
        </div>
      );
    }

    case 'instructors': {
      const instructorFields = item.fields as Instructor['fields'];
      return (
        <div className="bg-white rounded-lg shadow-md p-6">
          {instructorFields.profileImage?.fields?.file?.url && (
            <div className="relative w-32 h-32 mx-auto mb-4">
              <Image
                src={`https:${instructorFields.profileImage.fields.file.url}`}
                alt={instructorFields.profileImage.fields.title || 'Profile image'}
                fill
                className="rounded-full object-cover"
              />
            </div>
          )}
          <h3 className="text-xl font-semibold text-center mb-2">
            {instructorFields.name}
          </h3>
          <p className="text-gray-600 mb-4">{instructorFields.bio}</p>
          {instructorFields.qualifications && (
            <ul className="text-sm text-gray-500">
              {instructorFields.qualifications.map((qual, index) => (
                <li key={index}>{qual}</li>
              ))}
            </ul>
          )}
        </div>
      );
    }

    case 'testimonials': {
      const testimonialFields = item.fields as Testimonial['fields'];
      return (
        <div className="bg-white rounded-lg shadow-md p-6">
          {testimonialFields.authorImage?.fields?.file?.url && (
            <div className="relative w-20 h-20 mx-auto mb-4">
              <Image
                src={`https:${testimonialFields.authorImage.fields.file.url}`}
                alt={testimonialFields.authorImage.fields.title || 'Author image'}
                fill
                className="rounded-full object-cover"
              />
            </div>
          )}
          <h3 className="text-xl font-semibold text-center mb-2">
            {testimonialFields.authorName}
          </h3>
          {testimonialFields.authorTitle && (
            <p className="text-gray-500 text-center mb-4">
              {testimonialFields.authorTitle}
            </p>
          )}
          <p className="text-gray-600 italic">"{testimonialFields.testimonial}"</p>
        </div>
      );
    }

    default:
      console.warn(`Unknown content type: ${contentType}`);
      return null;
  }
} 