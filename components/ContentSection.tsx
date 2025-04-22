'use client';

import React from 'react';
import { Entry, EntrySkeletonType, ChainModifiers } from 'contentful';
import HeroBanner from './HeroBanner';
import TextSection from './TextSection';
import Feature from './Feature';
import BannerPromotionComponent from './BannerPromotion';
import CardGroupComponent from './CardGroup';
import Embed from './Embed';

interface ContentSectionProps {
  section: Entry<EntrySkeletonType, ChainModifiers>;
}

export default function ContentSection({ section }: ContentSectionProps) {
  if (!section?.sys?.contentType?.sys?.id) {
    console.warn('Invalid section data in ContentSection component');
    return null;
  }

  console.log('Rendering content type:', section.sys.contentType.sys.id);
  console.log('Section data:', JSON.stringify(section, null, 2));

  switch (section.sys.contentType.sys.id) {
    case 'componentHeroBanner':
      return <HeroBanner section={section} />;
    case 'componentTextSection':
      return <TextSection section={section} />;
    case 'componentFeature':
      return <Feature section={section} />;
    case 'componentBannerPromotion':
      return <BannerPromotionComponent section={section} />;
    case 'componentCardCardGroup':
      return <CardGroupComponent section={section} />;
    case 'componentEmbed':
      return <Embed section={section} />;
    default:
      console.warn(`Unknown content type: ${section.sys.contentType.sys.id}`);
      return null;
  }
} 