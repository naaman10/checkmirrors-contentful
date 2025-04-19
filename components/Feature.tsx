import React from 'react';
import Image from 'next/image';
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

  return (
    <section className={`${styles.featureSection} ${styles[`${background.toLowerCase()}Bg`]}`}>
      <div className="container">
        <div className={`row align-items-center ${isRightAligned ? 'flex-row-reverse' : ''}`}>
          <div className="col-md-6">
            <div className={styles.featureContent}>
              <div className={styles.title} dangerouslySetInnerHTML={{ __html: title }} />
              <p>{bodyText}</p>
              {cta && (
                <div className={styles.featureCTA}>
                  <CTA cta={cta} />
                </div>
              )}
            </div>
          </div>
          <div className="col-md-6">
            {imageUrl && (
              <div className={styles.featureImage}>
                <Image
                  src={imageUrl}
                  alt={altText}
                  width={600}
                  height={400}
                  className="img-fluid"
                  priority
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
} 