'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Entry, EntrySkeletonType, ChainModifiers } from 'contentful';

interface EmbedProps {
  section: Entry<EntrySkeletonType, ChainModifiers>;
}

export default function Embed({ section }: EmbedProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!section?.fields) {
    console.warn('Invalid section data in Embed component');
    return null;
  }

  const { embedType, embedCode } = section.fields as {
    embedType: string;
    embedCode?: string;
  };

  const html = useMemo(() => {
    if (embedType !== 'script' || !embedCode) return null;
    return embedCode;
  }, [embedType, embedCode]);

  if (embedType === 'script' && embedCode) {
    // Third-party embed scripts often mutate DOM differently client-side,
    // which causes hydration mismatches if rendered during SSR.
    // Render a stable placeholder on the server, then inject HTML after mount.
    if (!isMounted) {
      return <div className="embed-container" suppressHydrationWarning />;
    }

    return (
      <div 
        className="embed-container" 
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: html || '' }}
      />
    );
  }

  return null;
} 