'use client';

import React, { useEffect, useRef } from 'react';
import { Entry, EntrySkeletonType, ChainModifiers } from 'contentful';

interface EmbedProps {
  section: Entry<EntrySkeletonType, ChainModifiers>;
}

/**
 * Scripts inserted via innerHTML are inert and never fetch external src.
 * After parsing into the DOM, replace each <script> with a newly created element so the
 * browser runs them. querySelectorAll covers nested wrappers (importNode clones do not
 * execute inner scripts).
 */
function injectEmbeddableHtml(container: HTMLElement, html: string) {
  container.innerHTML = html;
  const toActivate = Array.from(container.querySelectorAll('script'));
  for (const oldScript of toActivate) {
    const script = document.createElement('script');
    for (const { name, value } of Array.from(oldScript.attributes)) {
      script.setAttribute(name, value);
    }
    script.textContent = oldScript.textContent;
    oldScript.parentNode?.replaceChild(script, oldScript);
  }
}

export default function Embed({ section }: EmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  if (!section?.fields) {
    console.warn('Invalid section data in Embed component');
    return null;
  }

  const { embedType, embedCode } = section.fields as {
    embedType: string;
    embedCode?: string;
  };

  const isScriptEmbed =
    typeof embedType === 'string' && embedType.trim().toLowerCase() === 'script';

  useEffect(() => {
    if (!isScriptEmbed || !embedCode || !containerRef.current) return;
    const el = containerRef.current;
    injectEmbeddableHtml(el, embedCode);
    return () => {
      el.innerHTML = '';
    };
  }, [isScriptEmbed, embedCode]);

  if (isScriptEmbed && embedCode) {
    return (
      <div
        ref={containerRef}
        className="embed-container"
        suppressHydrationWarning
      />
    );
  }

  return null;
} 