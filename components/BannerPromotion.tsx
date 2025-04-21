import React from 'react';
import { BannerPromotion, CTA, ComponentCtaAction, ComponentCtaLink } from './types';
import CTAAction from './CTAAction';
import CTALink from './CTALink';

interface BannerPromotionProps {
  internalName: string;
  title: string;
  ctAs?: CTA[];
  background: string;
}

export default function BannerPromotionComponent({ 
  internalName, 
  title, 
  ctAs, 
  background 
}: BannerPromotionProps) {
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

  const renderCTA = (cta: CTA) => {
    if (!cta) return null;
    
    if (cta.sys.contentType.sys.id === 'componentCtaAction') {
      return <CTAAction cta={cta as ComponentCtaAction} />;
    } else if (cta.sys.contentType.sys.id === 'componentCtaLink') {
      return <CTALink cta={cta as ComponentCtaLink} />;
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