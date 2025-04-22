import React from 'react';
import { Entry, EntrySkeletonType, ChainModifiers } from 'contentful';
import CTAAction from './CTAAction';
import CTALink from './CTALink';

interface BannerPromotionProps {
  section: Entry<EntrySkeletonType, ChainModifiers>;
}

export default function BannerPromotionComponent({ section }: BannerPromotionProps) {
  if (!section?.fields) {
    console.warn('Invalid section data in BannerPromotion component');
    return null;
  }

  const { internalName, title, ctAs, background } = section.fields as {
    internalName: string;
    title: string;
    ctAs?: Array<{
      sys: {
        contentType: {
          sys: {
            id: string;
          };
        };
      };
      fields: any;
    }>;
    background: string;
  };

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

  const renderCTA = (cta: any) => {
    if (!cta) return null;
    
    if (cta.sys.contentType.sys.id === 'componentCtaAction') {
      return <CTAAction cta={cta} />;
    } else if (cta.sys.contentType.sys.id === 'componentCtaLink') {
      return <CTALink cta={cta} />;
    }
    return null;
  };

  return (
    <div className={`${getBackgroundClass(background)} text-white py-12 p-5 text-center`}>
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-4 md:mb-0">
            <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
          </div>
          {ctAs && ctAs.length > 0 && (
            <div className="flex gap-2">
              {ctAs.map((cta, index) => (
                <div key={index}>
                  {renderCTA(cta)}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 