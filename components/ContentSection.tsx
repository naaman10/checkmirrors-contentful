'use client';

import React from 'react';
import { Entry, EntrySkeletonType } from 'contentful';
import HeroBanner from './HeroBanner';
import TextSection from './TextSection';
import Feature from './Feature';
import { HeroBannerSection, TextSection as TextSectionType, FeatureSection, CardGroup } from './types';
import CardGroupComponent from './CardGroup';

type ContentfulEntry<T> = Entry<EntrySkeletonType> & {
  fields: T;
};

export default function ContentSection({ section }: { section: Entry<EntrySkeletonType> }) {
  const contentType = section.sys.contentType.sys.id;
  console.log('Content type:', contentType); // Debug log
  console.log('Section fields:', section.fields); // Debug log
  
  switch (contentType) {
    case 'componentHeroBanner':
      return <HeroBanner {...(section as ContentfulEntry<HeroBannerSection['fields']>).fields} />;
    case 'text':
      return <TextSection {...(section as ContentfulEntry<TextSectionType['fields']>).fields} />;
    case 'componentFeature':
      return <Feature {...(section as ContentfulEntry<FeatureSection['fields']>).fields} />;
    case 'componentCardCardGroup':
      return <CardGroupComponent {...(section as ContentfulEntry<CardGroup['fields']>).fields} />;
    default:
      console.warn(`No component found for content type: ${contentType}`);
      return null;
  }
} 