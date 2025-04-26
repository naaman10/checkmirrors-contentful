'use client';

import { useEffect } from 'react';

interface HubspotFormProps {
  formType: 'Contact' | 'Instructor';
  isDarkBackground?: boolean;
}

export default function HubspotForm({ formType, isDarkBackground = false }: HubspotFormProps) {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = '//js.hsforms.net/forms/shell.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (window.hbspt) {
        window.hbspt.forms.create({
          region: "na1",
          portalId: "5357756",
          formId: formType === 'Contact' 
            ? "aae7163f-7c3d-447b-af1a-7b16229a8c81"
            : "ce0fde8d-53d8-4053-a64c-49fe1c36d070",
          target: "#hubspot-form",
          css: isDarkBackground ? `
            .hs-form-field label {
              color: white !important;
            }
            .hs-input {
              color: white !important;
              background-color: transparent !important;
              border-color: white !important;
            }
            .hs-input::placeholder {
              color: rgba(255, 255, 255, 0.7) !important;
            }
            .hs-button {
              background-color: #fdc632 !important;
              color: #002347 !important;
            }
          ` : ''
        });
      }
    };

    return () => {
      document.body.removeChild(script);
    };
  }, [formType, isDarkBackground]);

  return null;
} 