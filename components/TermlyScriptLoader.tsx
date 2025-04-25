'use client';

import dynamic from 'next/dynamic';

const TermlyScript = dynamic(() => import('./TermlyScript'), {
  ssr: false
});

export default function TermlyScriptLoader() {
  return <TermlyScript />;
} 