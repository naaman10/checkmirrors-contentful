'use client';

import Script from 'next/script';

export default function TermlyScript() {
  return (
    <Script
      src="https://app.termly.io/resource-blocker/4abaa4ac-3838-4826-8ca3-948594216c72?autoBlock=on"
      strategy="beforeInteractive"
    />
  );
} 