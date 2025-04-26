'use client';

import type { CTA, ComponentCtaLink, ComponentCtaAction } from './types';
import CTALinkComponent from './CTALink';
import CTAActionComponent from './CTAAction';

interface CTAProps {
  cta: CTA | null | undefined;
}

export default function CTA({ cta }: CTAProps) {
  if (!cta) return null;

  // Check the content type ID to determine which type of CTA it is
  const isLink = cta.sys.contentType.sys.id === 'componentCtaLink';
  
  if (isLink) {
    return <CTALinkComponent cta={cta as ComponentCtaLink} />;
  } else {
    return <CTAActionComponent cta={cta as ComponentCtaAction} />;
  }
} 