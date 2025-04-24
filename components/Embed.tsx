'use client';

import React from 'react';
import { Entry, EntrySkeletonType, ChainModifiers } from 'contentful';

interface EmbedProps {
  section: Entry<EntrySkeletonType, ChainModifiers>;
}

export default function Embed({ section }: EmbedProps) {
  if (!section?.fields) {
    console.warn('Invalid section data in Embed component');
    return null;
  }

  const { embedType, embedCode } = section.fields as {
    embedType: string;
    embedCode?: string;
  };

  if (embedType === 'script' && embedCode) {
    return (
      <div 
        className="embed-container" 
        dangerouslySetInnerHTML={{ __html: embedCode }}
      />
    );
  }

  return null;
} 