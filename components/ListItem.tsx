'use client';

import React from 'react';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS, INLINES } from '@contentful/rich-text-types';
import { Entry, EntrySkeletonType, ChainModifiers } from 'contentful';
import { getCloudinaryUrl, getImageDimensions } from '@/utils/cloudinary';

interface ListItemProps {
  section: Entry<EntrySkeletonType, ChainModifiers>;
  isInline?: boolean;
}

const getRichTextOptions = (isInline: boolean) => ({
  renderNode: {
    [BLOCKS.PARAGRAPH]: (node: any, children: any) => {
      // When inline, use span or div instead of p to avoid nesting issues
      if (isInline) {
        return <span className="d-block mb-2">{children}</span>;
      }
      return <p className="mb-2">{children}</p>;
    },
    [BLOCKS.HEADING_4]: (node: any, children: any) => {
      if (isInline) {
        return <span className="h5 mb-2 d-block fw-bold" style={{ fontSize: '1.25rem' }}>{children}</span>;
      }
      return <h4 className="h5 mb-2">{children}</h4>;
    },
    [BLOCKS.HEADING_5]: (node: any, children: any) => {
      if (isInline) {
        return <span className="h6 mb-2 d-block fw-bold" style={{ fontSize: '1rem' }}>{children}</span>;
      }
      return <h5 className="h6 mb-2">{children}</h5>;
    },
    [BLOCKS.HEADING_6]: (node: any, children: any) => {
      if (isInline) {
        return <span className="mb-2 d-block fw-bold" style={{ fontSize: '0.875rem' }}>{children}</span>;
      }
      return <h6 className="mb-2">{children}</h6>;
    },
    [BLOCKS.UL_LIST]: (node: any, children: any) => {
      if (isInline) {
        return <span className="d-block mb-2"><ul className="mb-2">{children}</ul></span>;
      }
      return <ul className="mb-2">{children}</ul>;
    },
    [BLOCKS.OL_LIST]: (node: any, children: any) => {
      if (isInline) {
        return <span className="d-block mb-2"><ol className="mb-2">{children}</ol></span>;
      }
      return <ol className="mb-2">{children}</ol>;
    },
    [BLOCKS.LIST_ITEM]: (node: any, children: any) => (
      <li className="mb-1">{children}</li>
    ),
    [INLINES.HYPERLINK]: (node: any, children: any) => (
      <a href={node.data.uri} className="text-primary" target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    ),
  },
  renderMark: {
    BOLD: (text: any) => <strong>{text}</strong>,
    ITALIC: (text: any) => <em>{text}</em>,
    UNDERLINE: (text: any) => <u>{text}</u>,
    SUPERSCRIPT: (text: any) => <sup>{text}</sup>,
    SUBSCRIPT: (text: any) => <sub>{text}</sub>,
  },
});

function ListItem({ section, isInline = false }: ListItemProps) {
  if (!section?.fields) {
    console.warn('No fields provided for ListItem component');
    return null;
  }

  const fields = section.fields as {
    entryName?: string;
    itemTitle?: string;
    itemText?: any;
    itemImage?: Entry<EntrySkeletonType, ChainModifiers> | {
      fields?: {
        image?: Array<{
          url?: string;
          secure_url?: string;
        }>;
        file?: {
          url?: string;
        };
        altText?: string;
        title?: string;
      };
    };
    imageAltText?: string;
    itemLink?: string;
    openInNewTab?: boolean;
  };

  // Handle itemImage - it can be:
  // 1. An array of Cloudinary image objects directly (current case)
  // 2. An Entry reference to an Asset or Image component
  // 3. An object with fields
  const itemImage = fields.itemImage;
  
  let imageUrl: string | undefined;
  let imageData: any;
  
  // Check if itemImage is an array (direct Cloudinary images)
  if (Array.isArray(itemImage) && itemImage.length > 0) {
    const firstImage = itemImage[0];
    imageUrl = firstImage?.secure_url || firstImage?.url;
    imageData = firstImage;
  } 
  // Check if itemImage is an Entry with fields
  else if (itemImage && typeof itemImage === 'object' && 'fields' in itemImage) {
    imageData = itemImage.fields;
    imageUrl = 
      imageData?.file?.url ||
      imageData?.image?.[0]?.secure_url || 
      imageData?.image?.[0]?.url;
  }
  // Check if itemImage is a direct object with image/file properties
  else if (itemImage && typeof itemImage === 'object') {
    imageData = itemImage;
    imageUrl = 
      imageData?.file?.url ||
      imageData?.image?.[0]?.secure_url || 
      imageData?.image?.[0]?.url ||
      imageData?.secure_url ||
      imageData?.url;
  }
  
  const altText = fields.imageAltText || imageData?.altText || imageData?.title || fields.itemTitle || '';

  // For ListItem, we want fixed width but full height, so we only transform width
  // Use scale mode instead of fill to avoid cropping
  const getListItemImageUrl = (url: string, width: number) => {
    if (!url) return null;
    if (!url.includes('cloudinary.com')) return url;
    
    const parts = url.split('/upload/');
    if (parts.length !== 2) return url;
    
    // Use scale mode (w_xxx) without height constraint to maintain aspect ratio
    return `${parts[0]}/upload/w_${width}/${parts[1]}`;
  };

  const imageWidth = isInline ? 120 : 200;
  const transformedImageUrl = imageUrl ? getListItemImageUrl(imageUrl, imageWidth) : null;

  const hasLink = fields.itemLink && fields.itemLink.trim() !== '';
  const linkProps = hasLink
    ? {
        href: fields.itemLink,
        target: fields.openInNewTab ? '_blank' : '_self',
        rel: fields.openInNewTab ? 'noopener noreferrer' : undefined,
      }
    : {};

  // For inline rendering, use span elements to avoid nesting block elements in paragraphs
  // For block rendering, use div elements
  const Container = isInline ? 'span' : 'div';
  const ImageContainer = isInline ? 'span' : 'div';
  const TextContainer = isInline ? 'span' : 'div';

  const content = (
    <Container 
      className={isInline ? '' : `d-flex align-items-start gap-3 mb-4`}
      style={isInline ? { 
        display: 'inline-block', 
        width: '100%',
        marginBottom: '1rem',
        verticalAlign: 'top'
      } : {}}
    >
      {transformedImageUrl && (
        <ImageContainer 
          className={isInline ? '' : 'flex-shrink-0'}
          style={isInline ? {
            display: 'inline-block',
            verticalAlign: 'top',
            marginRight: '12px',
            width: isInline ? '120px' : '200px'
          } : { width: isInline ? '120px' : '200px' }}
        >
          <img
            src={transformedImageUrl}
            alt={altText}
            className="rounded"
            style={{ 
              width: isInline ? '120px' : '200px',
              height: 'auto',
              display: 'block',
            }}
          />
        </ImageContainer>
      )}
      <TextContainer 
        className={isInline ? '' : 'flex-grow-1'}
        style={isInline ? {
          display: 'inline-block',
          verticalAlign: 'top',
          width: 'calc(100% - 132px)'
        } : {}}
      >
        {fields.itemTitle && (
          isInline ? (
            <span className="h5 mb-2 d-block fw-bold" style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>
              {fields.itemTitle}
            </span>
          ) : (
            <h3 className="h5 mb-2">{fields.itemTitle}</h3>
          )
        )}
        {fields.itemText && (
          <TextContainer className="text-muted" style={isInline ? { display: 'inline-block' } : {}}>
            {documentToReactComponents(fields.itemText, getRichTextOptions(isInline))}
          </TextContainer>
        )}
      </TextContainer>
    </Container>
  );

  if (hasLink) {
    const LinkWrapper = isInline ? 'span' : 'a';
    return (
      <LinkWrapper
        {...(isInline ? {} : linkProps)}
        className={isInline ? '' : "text-decoration-none text-dark"}
        {...(isInline && hasLink ? {
          onClick: (e: React.MouseEvent) => {
            e.preventDefault();
            if (fields.itemLink) {
              window.open(fields.itemLink, fields.openInNewTab ? '_blank' : '_self');
            }
          }
        } : {})}
        style={isInline && hasLink ? { cursor: 'pointer', display: 'inline-block', width: '100%' } : (isInline ? { display: 'inline-block', width: '100%' } : { display: 'block' })}
      >
        {content}
      </LinkWrapper>
    );
  }

  return content;
}

ListItem.displayName = 'ListItem';

export default ListItem;

