'use client';

import React from 'react';
import Image from 'next/image';
import { getCloudinaryUrl, getImageDimensions } from '@/utils/cloudinary';
import CTA from './CTA';

interface HeroBannerProps {
  section: any;
}

export default function HeroBanner({ section }: HeroBannerProps) {
  if (!section?.fields) {
    console.warn('Invalid section data in HeroBanner component');
    return null;
  }

  const { heading, subHeading, backgroundImage, size, buttons = [] } = section.fields as {
    heading: string;
    subHeading?: string;
    backgroundImage: Array<{
      url: string;
      secure_url: string;
    }>;
    size: string;
    buttons?: any[];
  };

  if (!backgroundImage?.[0]) {
    console.warn('No background image found in HeroBanner component');
    return null;
  }

  const image = backgroundImage[0];
  const dimensions = getImageDimensions('featured');
  const transformedUrl = getCloudinaryUrl(image.secure_url || image.url, dimensions.width, dimensions.height, 'featured');
  
  return (
    <section 
      className="hero-banner d-flex align-items-center justify-content-center position-relative"
      style={{
        backgroundImage: transformedUrl ? `url(${transformedUrl})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: `${size}vh`,
        position: 'relative',
        color: 'white',
      }}
    >
      <div 
        className="position-absolute w-100 h-100"
        style={{
          left: 0,
          bottom: 0,
          right: 0,
          top: 0,
          background: 'rgba(0,35,71,0.6)',
          zIndex: 1
        }}
      />
      <div className="container position-relative z-2 text-center">
        <h1 className="mb-3">{heading}</h1>
        {subHeading && <p className="lead mb-4">{subHeading}</p>}
        {buttons && buttons.length > 0 && (
          <div className="d-flex justify-content-center gap-3">
            {buttons.map((button, index) => (
              <a
                key={index}
                href={button.fields.url}
                className={`btn ${button.fields.style === 'Primary' ? 'btn-primary' : 'btn-outline-light'}`}
              >
                {button.fields.text}
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
} 