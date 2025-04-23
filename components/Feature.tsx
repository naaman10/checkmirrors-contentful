'use client';

import React from 'react';
import Image from 'next/image';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS, INLINES } from '@contentful/rich-text-types';
import CTA from './CTA';
import { getCloudinaryUrl, getImageDimensions } from '@/utils/cloudinary';

interface FeatureProps {
  section: {
    fields: {
      title: any; // Rich text field
      bodyText: any; // Rich text field
      media?: {
        fields?: {
          altText?: string;
          image?: Array<{
            url?: string;
            secure_url?: string;
          }>;
        };
      };
      alignment?: 'Left' | 'Right';
      background?: 'Light' | 'Dark';
      cta?: any; // CTA field
    };
  };
  isEmbedded?: boolean;
}

const options = {
  renderNode: {
    [BLOCKS.PARAGRAPH]: (node: any, children: any) => {
      // Check if any of the children are block elements (like divs)
      const hasBlockElements = React.Children.toArray(children).some(
        child => React.isValidElement(child) && 
        (child.type === 'div' || child.type === 'p' || child.type === 'h1' || child.type === 'h2' || child.type === 'h3' || child.type === 'ul' || child.type === 'ol')
      );

      // If there are block elements, render without a paragraph wrapper
      if (hasBlockElements) {
        return <>{children}</>;
      }

      // Otherwise, render as a normal paragraph
      return <p className="mb-4">{children}</p>;
    },
    [BLOCKS.HEADING_1]: (node: any, children: any) => (
      <h1 className="mb-4">{children}</h1>
    ),
    [BLOCKS.HEADING_2]: (node: any, children: any) => (
      <h2 className="mb-4">{children}</h2>
    ),
    [BLOCKS.HEADING_3]: (node: any, children: any) => (
      <h3 className="mb-4">{children}</h3>
    ),
    [BLOCKS.UL_LIST]: (node: any, children: any) => (
      <ul className="list-unstyled mb-4">{children}</ul>
    ),
    [BLOCKS.OL_LIST]: (node: any, children: any) => (
      <ol className="list-unstyled mb-4">{children}</ol>
    ),
    [BLOCKS.LIST_ITEM]: (node: any, children: any) => {
      // Process children to remove mb-4 from any paragraphs
      const processedChildren = React.Children.map(children, (child) => {
        if (React.isValidElement<{ className?: string }>(child) && child.type === 'p') {
          return React.cloneElement(child, { className: '' });
        }
        return child;
      });
      return <li className="">{processedChildren}</li>;
    },
    [INLINES.HYPERLINK]: (node: any, children: any) => (
      <a href={node.data.uri} className="text-primary" target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    ),
    [INLINES.EMBEDDED_ENTRY]: (node: any) => {
      const entry = node.data.target;
      const contentType = entry.sys.contentType.sys.id;

      if (contentType === 'image') {
        const imageUrl = entry.fields.image?.[0]?.secure_url || entry.fields.image?.[0]?.url;
        const altText = entry.fields.altText || '';
        
        if (!imageUrl) {
          console.warn('No image URL found in embedded entry');
          return null;
        }

        const transformedUrl = getCloudinaryUrl(imageUrl, 200, 0, 'featured');

        if (!transformedUrl) {
          console.warn('Failed to transform image URL');
          return null;
        }

        return (
          <div className="d-inline-block">
            <img
              src={transformedUrl}
              alt={altText}
              className="rounded-3"
              style={{ maxWidth: '200px', height: 'auto' }}
            />
          </div>
        );
      }

      console.warn(`Unsupported inline embedded content type: ${contentType}`);
      return null;
    },
  },
  renderText: (text: string) => {
    // Replace HTML entities with their actual characters
    const decodedText = text
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&amp;/g, '&');

    // If the text contains HTML, render it directly
    if (decodedText.includes('<') && decodedText.includes('>')) {
      return <span dangerouslySetInnerHTML={{ __html: decodedText }} />;
    }
    
    // Otherwise return the text as is
    return text;
  },
};

export default function Feature({ section, isEmbedded = false }: FeatureProps) {
  const imageUrl = section.fields.media?.fields?.image?.[0]?.secure_url || 
                  section.fields.media?.fields?.image?.[0]?.url;
  const imagePosition = section.fields.alignment?.toLowerCase() === 'right' ? 'right' : 'left';
  const backgroundColor = isEmbedded ? 'transparent' : (section.fields.background?.toLowerCase() === 'dark' ? 'bg-dark' : 'bg-light');
  const textColor = isEmbedded ? 'text-dark' : (section.fields.background?.toLowerCase() === 'dark' ? 'text-white' : 'text-dark');
  const isDarkBackground = !isEmbedded && section.fields.background?.toLowerCase() === 'dark';

  const dimensions = getImageDimensions('featured');
  const transformedImageUrl = imageUrl ? getCloudinaryUrl(imageUrl, dimensions.width, 0, 'featured') : null;

  const renderContent = () => (
    <>
      <div className="mb-4">
        {section.fields.title && documentToReactComponents(section.fields.title, options)}
      </div>
      {section.fields.bodyText && documentToReactComponents(section.fields.bodyText, options)}
      {section.fields.cta && <CTA cta={section.fields.cta} />}
    </>
  );

  return (
    <section className={`${backgroundColor} py-5`}>
      <div className="container">
        <div className={`row align-items-center ${imagePosition === 'right' ? 'flex-row-reverse' : ''}`}>
          {transformedImageUrl && (
            <div className="col-md-6 mb-4 mb-md-0">
              <img
              src={transformedImageUrl}
              alt={section.fields.media?.fields?.altText || section.fields.title}
              className="img-fluid"
              style={{ width: 'auto', height: 'auto' }}
              />  
            </div>
          )}
          <div className={`col-md-6 ${textColor}`}>
            {isDarkBackground ? (
              renderContent()
            ) : (
              <div className='card'>
                <div className='card-body'>
                  {renderContent()}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
} 