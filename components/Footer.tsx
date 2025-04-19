import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h2 className="text-xl font-bold">checkmirrors</h2>
            <p className="text-sm">School of Motoring</p>
          </div>
          <div className="text-sm">
            <p>&copy; {new Date().getFullYear()} checkmirrors. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
} 