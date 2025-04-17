'use client';

import type { ComponentCtaLink } from './types';

interface CTALinkProps {
  cta: ComponentCtaLink;
}

export default function CTALink({ cta }: CTALinkProps) {
  if (!cta?.fields) {
    console.warn('CTALink component received invalid data');
    return null;
  }

  const { label, link, style } = cta.fields;
  
  if (!link) {
    console.warn('CTALink is missing required link property');
    return null;
  }

  const buttonStyle = style?.toLowerCase() || 'primary';
  const className = `btn btn-${buttonStyle} me-2`;

  // Check if the link is external
  const isExternal = link.startsWith('http');
  const linkProps = isExternal ? {
    target: '_blank',
    rel: 'noopener noreferrer'
  } : {};

  return (
    <a 
      href={link} 
      className={className}
      {...linkProps}
      aria-label={label}
    >
      {label}
    </a>
  );
} 