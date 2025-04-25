'use client';

import React from 'react';
import { Entry, EntrySkeletonType, ChainModifiers } from 'contentful';
import HeroBanner from './HeroBanner';
import TextSection from './TextSection';
import Feature from './Feature';
import BannerPromotionComponent from './BannerPromotion';
import CardGroupComponent from './CardGroup';
import Embed from './Embed';
import Listing from './Listing';
import Video from './Video';
import RichText from './RichText';
import { Listings } from './types';

interface FeatureProps {
  fields: {
    title: any;
    bodyText: any;
    media?: Entry<EntrySkeletonType, ChainModifiers>;
    alignment?: 'Left' | 'Right';
    background?: 'Light' | 'Dark';
    cta?: any;
  };
}

interface ContentSectionProps {
  section: Entry<any>;
}

export default function ContentSection({ section }: ContentSectionProps) {
  if (!section?.sys?.contentType?.sys?.id) {
    console.warn('Invalid section data in ContentSection component');
    return null;
  }

  switch (section.sys.contentType.sys.id) {
    case 'componentHeroBanner':
      return <HeroBanner section={section} />;
    case 'componentTextSection':
      return <TextSection section={section} />;
    case 'componentFeature':
      return <Feature section={{ fields: section.fields as FeatureProps['fields'] }} />;
    case 'componentBannerPromotion':
      return <BannerPromotionComponent section={section} />;
    case 'componentCardCardGroup':
      return <CardGroupComponent section={section} />;
    case 'componentEmbed':
      return <Embed section={section} />;
    case 'componentVideo':
      return <Video section={section} />;
    case 'richText':
      return <RichText section={section} />;
    case 'componentListings': {
      const fields = section.fields as Listings['fields'];
      
      console.log('ContentSection - Listings fields:', {
        contentType: fields.contentType,
        itemsLength: fields.items?.length,
        items: fields.items?.map(item => ({
          id: item.sys.id,
          contentType: item.sys.contentType.sys.id
        }))
      });
      
      return <Listing 
        items={Array.isArray(fields.items) ? fields.items : []}
        contentType={fields.contentType || 'blog'}
        title={fields.title || ''}
        subTitle={fields.subTitle}
        columns={typeof fields.columns === 'string' ? fields.columns : undefined}
        pagination={
          typeof fields.pagination === 'boolean' 
            ? { enabled: fields.pagination }
            : fields.pagination
        }
        filter={fields.contentType?.toLowerCase() === 'instructors' || 
                fields.contentType?.toLowerCase() === 'blog' || 
                fields.contentType?.toLowerCase() === 'blogs' || 
                fields.contentType?.toLowerCase() === 'article' || 
                fields.contentType?.toLowerCase() === 'articles'}
      />;
    }
    default:
      console.warn(`Unknown content type: ${section.sys.contentType.sys.id}`);
      return null;
  }
} 