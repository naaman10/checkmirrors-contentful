'use client';

import CTA from './CTA';
import type { CTA as CTAType } from './types';

interface HeroBannerProps {
  heading: string;
  subHeading: string;
  backgroundImage: Array<{
    url: string;
    secure_url: string;
  }>;
  size: string;
  buttons: CTAType[];
}

export default function HeroBanner({ heading, subHeading, backgroundImage, size, buttons }: HeroBannerProps) {
  const image = backgroundImage[0];
  
  return (
    <section 
      className="hero-banner d-flex align-items-center justify-content-center position-relative"
      style={{
        backgroundImage: `url(${image.secure_url})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: `${size}vh`,
        position: 'relative',
        color: 'white',
        textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
      }}
    >
      <div 
        className="position-absolute w-100 h-100"
        style={{
          left: 0,
          bottom: 0,
          right: 0,
          top: 0,
          background: 'rgba(0, 0, 0, 0.4)',
          zIndex: 1
        }}
      />
      <div className="container position-relative" style={{ zIndex: 2 }}>
        <div className="row justify-content-center">
          <div className="col-md-8 text-center">
            <h1 className="mb-3">{heading}</h1>
            <p className="lead mb-4">{subHeading}</p>
            <div className="cta-container d-flex justify-content-center gap-2">
              {buttons.map((button, index) => (
                <CTA
                  key={index}
                  cta={button}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 