'use client';

import React from 'react';
import { Entry, EntrySkeletonType } from 'contentful';
import HeroBanner from './HeroBanner';
import TextSection from './TextSection';
import Feature from './Feature';
import { HeroBannerSection, TextSection as TextSectionType, FeatureSection, CardGroup, BannerPromotion } from './types';
import CardGroupComponent from './CardGroup';
import BannerPromotionComponent from './BannerPromotion';

type ContentfulEntry<T> = Entry<EntrySkeletonType> & {
  fields: T;
};

export default function ContentSection({ section }: { section: Entry<EntrySkeletonType> }) {
  if (!section?.sys?.contentType?.sys?.id) {
    console.warn('Invalid section data:', section);
    return null;
  }

  const contentType = section.sys.contentType.sys.id;
  
  // Ensure we have the fields before trying to render
  if (!section.fields) {
    console.warn(`Missing fields for content type: ${contentType}`);
    return null;
  }

  try {
    switch (contentType) {
      case 'componentHeroBanner':
        return <HeroBanner {...(section as ContentfulEntry<HeroBannerSection['fields']>).fields} />;
      case 'text':
        return <TextSection {...(section as ContentfulEntry<TextSectionType['fields']>).fields} />;
      case 'componentFeature':
        return <Feature {...(section as ContentfulEntry<FeatureSection['fields']>).fields} />;
      case 'componentCardCardGroup':
        const cardGroupFields = (section as ContentfulEntry<CardGroup['fields']>).fields;
        if (!cardGroupFields.cards) {
          console.warn('CardGroup missing cards array');
          return null;
        }
        return <CardGroupComponent {...cardGroupFields} />;
      case 'componentBannerPromotion':
        return <BannerPromotionComponent {...(section as ContentfulEntry<BannerPromotion['fields']>).fields} />;
      default:
        console.warn(`Unknown content type: ${contentType}`);
        return null;
    }
  } catch (error) {
    console.error(`Error rendering ${contentType}:`, error);
    return null;
  }
} 