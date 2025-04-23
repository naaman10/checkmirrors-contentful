'use client';

import React from 'react';
import Image from 'next/image';
import CTA from './CTA';
import { getCloudinaryUrl, getImageDimensions } from '@/utils/cloudinary';

interface FeatureProps {
  section: any;
}

export default function Feature({ section }: FeatureProps) {
  if (!section?.fields) {
    console.warn('Invalid section data in Feature component');
    return null;
  }

  const { title, bodyText, media, alignment, background, cta } = section.fields as {
    title: string;
    bodyText: string;
    media: {
      fields: {
        altText: string;
        image: Array<{
          url: string;
          secure_url: string;
        }>;
      };
    };
    alignment: 'Left' | 'Right';
    background: 'Light' | 'Dark';
    cta?: any;
  };

  if (!media?.fields?.image?.[0]) {
    console.warn('Invalid media data in Feature component');
    return null;
  }

  const imageUrl = media.fields.image[0].secure_url || media.fields.image[0].url;
  const altText = media.fields.altText;
  const isRightAligned = alignment.toLowerCase() === 'right';

  const dimensions = getImageDimensions('featured');
  const transformedUrl = getCloudinaryUrl(imageUrl, dimensions.width, dimensions.height, 'featured');

  const getBackgroundClass = (background: string) => {
    switch (background) {
      case 'Dark':
        return 'bg-dark';
      case 'Light':
        return 'bg-light';
      default:
        return 'bg-dark';
    }
  };

  return (
    <section className={`${getBackgroundClass(background)} text-white py-12 px-4`}>
      <div className="container-fluid py-5">
        <div className={`row justify-content-center mt-3 ${isRightAligned ? 'flex-row-reverse' : ''}`}>
          <div className="col-12 col-sm-12 col-md-4 d-flex align-items-center">
            <div className="mb-3">
              <div className="mb-3" dangerouslySetInnerHTML={{ 
                __html: title.replace(/\n/g, '<br />') 
              }} />
              <p>{bodyText}</p>
              {cta && (
                <div className="mt-4">
                  <CTA cta={cta} />
                </div>
              )}
            </div>
          </div>
          <div className="col-12 col-sm-12 col-md-4">
            {transformedUrl && (
              <Image 
                src={transformedUrl}
                alt={altText}
                width={dimensions.width}
                height={dimensions.height}
                className="rounded-3 img-fluid"
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
} 