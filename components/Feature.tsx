import React from 'react';
import CTA from './CTA';
import styles from '../styles/Feature.module.css';

interface FeatureProps {
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
}

export default function Feature({ title, bodyText, media, alignment, background, cta }: FeatureProps) {
  const imageUrl = media.fields.image[0]?.secure_url || media.fields.image[0]?.url;
  const altText = media.fields.altText;
  const isRightAligned = alignment.toLowerCase() === 'right';

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
            {imageUrl && (
              <img 
                className="img-fluid" 
                src={imageUrl} 
                alt={altText}
                loading="lazy"
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
} 