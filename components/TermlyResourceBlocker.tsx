'use client';

import { useEffect } from 'react';

const TERMLY_RESOURCE_BLOCKER_SRC =
  'https://app.termly.io/resource-blocker/4abaa4ac-3838-4826-8ca3-948594216c72?autoBlock=on';

/**
 * Injects Termly after React hydration. Loading with next/script beforeInteractive
 * runs before hydration and Termly mutates <head>, causing metadata tree mismatches.
 */
export default function TermlyResourceBlocker() {
  useEffect(() => {
    if (document.querySelector(`script[src="${TERMLY_RESOURCE_BLOCKER_SRC}"]`)) return;
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = TERMLY_RESOURCE_BLOCKER_SRC;
    document.head.appendChild(script);
  }, []);

  return null;
}
