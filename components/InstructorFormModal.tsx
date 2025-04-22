'use client';

import { useEffect } from 'react';

interface InstructorFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InstructorFormModal({ isOpen, onClose }: InstructorFormModalProps) {
  useEffect(() => {
    if (isOpen) {
      // Load HubSpot script
      const script = document.createElement('script');
      script.src = '//js.hsforms.net/forms/shell.js';
      script.async = true;
      document.body.appendChild(script);

      // Create form after script loads
      script.onload = () => {
        if (window.hbspt) {
          window.hbspt.forms.create({
            region: "na1",
            portalId: "5357756",
            formId: "ce0fde8d-53d8-4053-a64c-49fe1c36d070",
            target: "#hubspot-form"
          });
        }
      };

      return () => {
        document.body.removeChild(script);
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className="modal fade show" 
      style={{ 
        display: 'block',
        zIndex: 1050,
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%'
      }} 
      tabIndex={-1}
    >
      <div 
        className="modal-dialog modal-dialog-centered"
        style={{ zIndex: 1051 }}
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Become an Instructor</h5>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <div id="hubspot-form"></div>
          </div>
        </div>
      </div>
      <div 
        className="modal-backdrop fade show"
        style={{ zIndex: 1049 }}
      ></div>
    </div>
  );
} 