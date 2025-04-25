'use client';

import { useEffect } from 'react';

interface ContactFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactFormModal({ isOpen, onClose }: ContactFormModalProps) {
  useEffect(() => {
    if (isOpen) {
      // Prevent body scrolling when modal is open
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      
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
            formId: "aae7163f-7c3d-447b-af1a-7b16229a8c81",
            target: "#hubspot-form"
          });
        }
      };

      return () => {
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
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
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1050,
        overflow: 'auto'
      }} 
      tabIndex={-1}
    >
      <div 
        className="modal-dialog modal-dialog-centered modal-xl"
        style={{ 
          margin: 'auto',
          display: 'block',
          overflow: 'auto',
          zIndex: 1051
        }}
      >
        <div 
        className="modal-content"
        style={{
          minHeight: '100%'
        }}
        >
          <div className="modal-header">
            <h5 className="modal-title">Contact Us</h5>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <div id="hubspot-form"></div>
          </div>
        </div>
      </div>
      <div 
        className="modal-backdrop fade show"
        style={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1049
        }}
      ></div>
    </div>
  );
} 