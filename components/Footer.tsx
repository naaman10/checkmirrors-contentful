'use client';

import React, { useState } from 'react';
import ContactFormModal from './ContactFormModal';

export default function Footer() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  return (
    <footer className="footer-area section_gap">
      <div className="container mx-auto px-4">
        <div className="row footer-bottom d-flex justify-content-between">
          <div className="col-lg-4 col-sm-12 footer-social text-center my-3">
            <h3 className="text-xl font-bold">Get in touch</h3>
            <a href="https://www.facebook.com/pg/checkmirrors" target="_blank"><i className="fab fa-facebook-f" aria-hidden="true"></i></a>
            <a onClick={() => setIsContactModalOpen(true)} style={{ cursor: 'pointer' }}><i className="fas fa-envelope" aria-hidden="true"></i></a>
            <a href="tel:07821291783"><i className="fa fa-phone" data-wow-delay=".1s" aria-hidden="true"></i></a>
          </div>
          <div className="col-md-4 col-xs-12 my-3">
            <p className="pride text-center">
              <img src="https://res.cloudinary.com/njh101010/image/upload/q_auto/v1653654927/checkmirrors/pride-flag.webp" alt="Pride and BAME Flag" />
              <span>Supporter of all things Pride and BAME.</span>
            </p>
          </div>
          <div className="col-md-4 col-xs-12 my-3">
            <div className="footer-right text-center">
              <img className="footer-cert" src="https://res.cloudinary.com/njh101010/image/upload/q_auto/v1653654843/checkmirrors/dvsa.webp" alt="DVSA ADI" width="25%" />
              <img className="footer-cert" src="https://res.cloudinary.com/njh101010/image/upload/q_auto/v1637594586/checkmirrors/pass-plus_o3d744.webp" alt="Pass Pluss Certified" width="25%" />
              <img className="footer-cert" src="https://res.cloudinary.com/njh101010/image/upload/q_auto/v1653654762/checkmirrors/diamond.webp" alt="DIAmond Advanced Motorists" width="25%" />
            </div>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="row justify-content-center">
          <div className="col-8 text-center">
            <p>Copyright © checkmirrors 2025</p>
            <p>checkmirrors is a trading name of Checkmirrors Ltd.</p>
            <a href="#" className="termly-display-preferences">Consent Preferences</a>
            <p>Driving instructors associated with Checkmirrors Ltd are independent self-employed professionals. Checkmirrors Ltd is not liable for any transactions, agreements, or disputes between driving instructors and pupils. All dealings are solely the responsibility of the parties involved.</p>
          </div>
        </div>
      </div>
      <ContactFormModal 
        isOpen={isContactModalOpen} 
        onClose={() => setIsContactModalOpen(false)} 
      />
    </footer>
  );
} 