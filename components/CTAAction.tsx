'use client';

import { useState } from 'react';
import type { ComponentCtaAction } from './types';
import ContactFormModal from './ContactFormModal';
import InstructorFormModal from './InstructorFormModal';

interface CTAActionProps {
  cta: ComponentCtaAction;
}

export default function CTAAction({ cta }: CTAActionProps) {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isInstructorModalOpen, setIsInstructorModalOpen] = useState(false);

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
        setIsContactModalOpen(true);
        break;
      case 'Instructor Form':
        setIsInstructorModalOpen(true);
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
        isOpen={isContactModalOpen} 
        onClose={() => setIsContactModalOpen(false)} 
      />
      <InstructorFormModal 
        isOpen={isInstructorModalOpen} 
        onClose={() => setIsInstructorModalOpen(false)} 
      />
    </>
  );
} 