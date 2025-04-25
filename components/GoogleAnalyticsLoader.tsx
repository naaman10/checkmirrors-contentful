'use client';

import dynamic from 'next/dynamic';

const GoogleAnalytics = dynamic(() => import('./GoogleAnalytics'), {
  ssr: false
});

export default function GoogleAnalyticsLoader() {
  return <GoogleAnalytics />;
} 