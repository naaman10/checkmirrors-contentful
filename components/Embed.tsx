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

  const { embedType } = section.fields as {
    embedType: string;
  };

  if (embedType === 'script') {
    return (
      <div 
        className="embed-container" 
        id="trustmary-container"
        data-trustmary-app="5S6TVoaG11"
      />
    );
  }

  return null;
} 