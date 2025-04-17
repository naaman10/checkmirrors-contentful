'use client';

import type { ComponentCtaAction } from './types';

interface CTAActionProps {
  cta: ComponentCtaAction;
}

export default function CTAAction({ cta }: CTAActionProps) {
  if (!cta?.fields) {
    console.warn('CTAAction component received invalid data');
    return null;
  }

  const { label, action, style } = cta.fields;
  
  if (!action) {
    console.warn('CTAAction is missing required action property');
    return null;
  }

  const buttonStyle = style?.toLowerCase() || 'primary';
  const className = `btn btn-${buttonStyle} me-2`;

  const handleAction = () => {
    switch (action) {
      case 'scroll':
        window.scrollTo({ top: 0, behavior: 'smooth' });
        break;
      case 'contact':
        // Handle contact form opening
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
          contactForm.scrollIntoView({ behavior: 'smooth' });
        }
        break;
      case 'book':
        // Handle booking form opening
        const bookingForm = document.getElementById('booking-form');
        if (bookingForm) {
          bookingForm.scrollIntoView({ behavior: 'smooth' });
        }
        break;
      default:
        console.warn(`Unknown action type: ${action}`);
    }
  };

  return (
    <button 
      className={className}
      onClick={handleAction}
      aria-label={label}
      type="button"
    >
      {label}
    </button>
  );
} 