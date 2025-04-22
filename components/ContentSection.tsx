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
import { Listings } from './types';

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
    case 'componentListings': {
      const listings = section as unknown as Listings;
      console.log('Listings data:', JSON.stringify(listings, null, 2));
      console.log('Listings fields:', JSON.stringify(listings.fields, null, 2));
      console.log('Listings items type:', typeof listings.fields.items);
      console.log('Listings items is array:', Array.isArray(listings.fields.items));
      
      // Ensure items is an array and not undefined
      const items = Array.isArray(listings.fields.items) ? listings.fields.items : [];
      console.log('Processed items:', items);
      
      // Ensure pagination has the correct structure
      const pagination = typeof listings.fields.pagination === 'boolean' 
        ? { enabled: listings.fields.pagination }
        : listings.fields.pagination;
      
      return <Listing 
        items={items}
        contentType={listings.fields.contentType}
        title={listings.fields.title}
        subTitle={listings.fields.subTitle}
        columns={listings.fields.columns}
        pagination={pagination}
      />;
    }
    default:
      console.warn(`Unknown content type: ${section.sys.contentType.sys.id}`);
      return null;
  }
} 