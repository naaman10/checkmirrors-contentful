'use client';

import React from 'react';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS, INLINES } from '@contentful/rich-text-types';
import { Entry, EntrySkeletonType, ChainModifiers } from 'contentful';
import Video from './Video';
import Image from 'next/image';

interface RichTextProps {
  section: Entry<EntrySkeletonType, ChainModifiers>;
}

export default function RichText({ section }: RichTextProps) {
  console.log('RichText section:', section); // Debug log

  if (!section?.fields) {
    console.warn('No fields provided for RichText component');
    return null;
  }

  // Check for different possible field names
  const content = section.fields.content || section.fields.richText || section.fields.body;
  
  if (!content) {
    console.warn('No content found in RichText component fields:', section.fields);
    return null;
  }

  // Get text alignment class
  const getTextAlignmentClass = (alignText: string | undefined) => {
    switch (alignText) {
      case 'Left':
        return 'text-start';
      case 'Center':
        return 'text-center';
      case 'Right':
        return 'text-end';
      default:
        return 'text-start'; // Default to left alignment
    }
  };

  const textAlignmentClass = getTextAlignmentClass(section.fields.alignText as string | undefined);

  const options = {
    renderNode: {
      [BLOCKS.EMBEDDED_ENTRY]: (node: any) => {
        const contentType = node.data.target.sys.contentType.sys.id;
        console.log('Embedded entry type:', contentType); // Debug log
        
        switch (contentType) {
          case 'video':
          case 'componentVideo':
            return <Video section={node.data.target} />;
          case 'image':
          case 'componentImage':
            const image = node.data.target.fields.image[0];
            return (
              <div className="rich-text-image">
                <Image
                  src={image.secure_url || image.url}
                  alt={node.data.target.fields.altText || ''}
                  width={800}
                  height={600}
                  style={{ width: '100%', height: 'auto' }}
                />
              </div>
            );
          default:
            console.warn(`Unsupported embedded content type: ${contentType}`);
            return null;
        }
      },
      [INLINES.EMBEDDED_ENTRY]: (node: any) => {
        const contentType = node.data.target.sys.contentType.sys.id;
        
        switch (contentType) {
          case 'video':
          case 'componentVideo':
            return <Video section={node.data.target} />;
          case 'image':
          case 'componentImage':
            const image = node.data.target.fields.image[0];
            return (
              <Image
                src={image.secure_url || image.url}
                alt={node.data.target.fields.altText || ''}
                width={200}
                height={150}
                style={{ display: 'inline-block' }}
              />
            );
          default:
            console.warn(`Unsupported embedded content type: ${contentType}`);
            return null;
        }
      },
    },
  };

  return (
    <div className="container my-4">
      <div className="row justify-content-center mt-5">
        <div className="col-8">
          <div className={`rich-text-content ${textAlignmentClass}`}>
            {documentToReactComponents(content as any, options)}
          </div>
        </div>
      </div>
    </div>
  );
} 