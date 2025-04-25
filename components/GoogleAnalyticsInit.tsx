'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    dataLayer: any[];
  }
}

export default function GoogleAnalyticsInit() {
  useEffect(() => {
    // Initialize dataLayer
    window.dataLayer = window.dataLayer || [];
    
    // Define gtag function
    window.gtag = function gtag(...args: any[]) {
      window.dataLayer.push(args);
    };
    
    // Initialize tracking
    window.gtag('js', new Date());
    window.gtag('config', 'G-FS3R0VGR3Q');
  }, []);

  return null;
} 