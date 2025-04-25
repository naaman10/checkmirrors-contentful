'use client';

import Script from 'next/script';
import dynamic from 'next/dynamic';

const GoogleAnalyticsInit = dynamic(() => import('./GoogleAnalyticsInit'), {
  ssr: false
});

export default function GoogleAnalytics() {
  return (
    <>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-FS3R0VGR3Q"
        strategy="lazyOnload"
      />
      <GoogleAnalyticsInit />
    </>
  );
} 