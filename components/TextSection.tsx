'use client';

import React from 'react';
import { Entry, EntrySkeletonType, ChainModifiers } from 'contentful';

interface TextSectionProps {
  section: Entry<EntrySkeletonType, ChainModifiers>;
}

export default function TextSection({ section }: TextSectionProps) {
  if (!section?.fields) {
    console.warn('Invalid section data in TextSection component');
    return null;
  }

  const { content } = section.fields as {
    content: string;
  };

  return (
    <section className="text-section py-4">
      <div className="container">
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    </section>
  );
} 