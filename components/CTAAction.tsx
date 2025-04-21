'use client';

import { useState } from 'react';
import type { ComponentCtaAction } from './types';
import ContactFormModal from './ContactFormModal';

interface CTAActionProps {
  cta: ComponentCtaAction;
}

export default function CTAAction({ cta }: CTAActionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      case 'Contact Form':
        setIsModalOpen(true);
        break;
      case 'Instructor Form':
        // Handle instructor form action
        console.log('Instructor form action');
        break;
      default:
        console.warn(`Unknown action type: ${action}`);
    }
  };

  return (
    <>
      <button 
        className={className}
        onClick={handleAction}
        aria-label={label}
        type="button"
      >
        {label}
      </button>
      <ContactFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
} 