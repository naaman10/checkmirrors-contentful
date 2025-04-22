'use client';

import React from 'react';
import { Entry, EntrySkeletonType, ChainModifiers } from 'contentful';
import HeroBanner from './HeroBanner';
import TextSection from './TextSection';
import Feature from './Feature';
import { HeroBannerSection, TextSection as TextSectionType, FeatureSection, CardGroup, BannerPromotion, ComponentCtaLink } from './types';
import BannerPromotionComponent from './BannerPromotion';
import CardGroupComponent from './CardGroup';

interface CardGroupFields {
  title: string;
  subTitle?: string;
  cards: Array<{
    sys: {
      id: string;
      contentType: {
        sys: {
          id: string;
        };
      };
    };
    fields: {
      title: string;
      text: string;
      cardImage?: {
        fields?: {
          altText?: string;
          image?: Array<{
            url?: string;
            secure_url?: string;
          }>;
        };
      };
      cta?: ComponentCtaLink;
    };
  }>;
  columns?: string;
  background?: string;
}

interface ContentSectionProps {
  section: Entry<EntrySkeletonType, ChainModifiers>;
}

export default function ContentSection({ section }: ContentSectionProps) {
  if (!section || !section.sys || !section.fields) {
    console.warn('Invalid section data:', section);
    return null;
  }

  const contentType = section.sys.contentType?.sys?.id;
  console.log('Rendering content type:', contentType);
  console.log('Section data:', JSON.stringify(section, null, 2));

  switch (contentType) {
    case 'componentHeroBanner':
      return <HeroBanner {...(section.fields as unknown as HeroBannerSection['fields'])} />;
    case 'componentTextSection':
      return <TextSection {...(section.fields as unknown as TextSectionType['fields'])} />;
    case 'componentFeature':
      return <Feature {...(section.fields as unknown as FeatureSection['fields'])} />;
    case 'componentBannerPromotion':
      return <BannerPromotionComponent {...(section.fields as unknown as BannerPromotion['fields'])} />;
    case 'componentCardCardGroup':
      const { title, subTitle, cards, columns, background } = section.fields as unknown as CardGroupFields;
      if (!Array.isArray(cards)) {
        console.warn('Cards is not an array:', cards);
        return null;
      }
      return (
        <CardGroupComponent
          title={title}
          subTitle={subTitle}
          cards={cards}
          columns={columns}
          background={background}
        />
      );
    default:
      console.warn('Unknown content type:', contentType);
      return null;
  }
} 