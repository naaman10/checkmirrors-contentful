'use client';

import { Entry, EntrySkeletonType } from 'contentful';
import HeroBanner from './HeroBanner';
import TextSection from './TextSection';
import { HeroBannerSection as HeroBannerSectionType, TextSection as TextSectionType } from './types';

const componentMap = {
  componentHeroBanner: (props: HeroBannerSectionType['fields']) => {
    console.log('HeroBanner props:', props); // Debug log
    return <HeroBanner {...props} />;
  },
  text: (props: TextSectionType['fields']) => <TextSection {...props} />,
};

export default function ContentSection({ section }: { section: Entry<EntrySkeletonType> }) {
  const contentType = section.sys.contentType.sys.id;
  console.log('Content type:', contentType); // Debug log
  console.log('Section fields:', section.fields); // Debug log
  
  const Component = componentMap[contentType as keyof typeof componentMap];
  
  if (!Component) {
    console.warn(`No component found for content type: ${contentType}`);
    return null;
  }

  return Component(section.fields as any);
} 