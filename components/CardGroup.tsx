'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Entry, EntrySkeletonType, ChainModifiers } from 'contentful';
import CTA from './CTA';

interface CardGroupProps {
  section: Entry<EntrySkeletonType, ChainModifiers>;
}

export default function CardGroup({ section }: CardGroupProps) {


  const { title, subTitle, cards = [], columns = '3', background = 'Light' } = section.fields as {
    title: string;
    subTitle?: string;
    cards: Array<{
      sys: {
        id: string;
        contentType: {
          sys: {
            id: string;
          };
        };
      };
      fields: {
        title: string;
        text: string;
        cardImage?: {
          fields?: {
            altText?: string;
            image?: Array<{
              url?: string;
              secure_url?: string;
            }>;
          };
        };
        cta?: any;
      };
    }>;
    columns?: string;
    background?: string;
  };

  
  const getGridClasses = (cols: string) => {
    switch (cols) {
      case '1':
        return 'col-12';
      case '2':
        return 'col-12 col-md-6';
      case '3':
        return 'col-12 col-md-6 col-lg-4';
      case '4':
        return 'col-12 col-md-6 col-lg-3';
      default:
        return 'col-12 col-md-6 col-lg-4';
    }
  };

  const gridClass = getGridClasses(columns);

  return (
    <section className={`py-5 ${background === 'Dark' ? 'bg-dark text-white' : 'bg-light text-dark'}`}>
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="mb-3">{title}</h2>
          {subTitle && <p className="lead text-muted">{subTitle}</p>}
        </div>
        
        <div className="row g-4 justify-content-center">
          {cards.map((card, index) => {
            const imageUrl = card.fields.cardImage?.fields?.image?.[0]?.secure_url || 
                           card.fields.cardImage?.fields?.image?.[0]?.url;
            const altText = card.fields.cardImage?.fields?.altText || '';
            
            return (
              <div key={card.sys.id || index} className={gridClass}>
                <div className="card h-100">
                  {imageUrl && (
                    <div className="card-img-top">
                      <img
                        src={imageUrl}
                        alt={altText}
                        style={{ height: '200px', objectFit: 'cover' }}
                      />
                    </div>
                  )}
                  <div className="card-body d-flex flex-column justify-content-between">
                    <h3 className="card-title h4">{card.fields.title}</h3>
                    <div className="card-text">
                      <ReactMarkdown>{card.fields.text}</ReactMarkdown>
                    </div>
                    {card.fields.cta && (
                      <div>
                        <CTA cta={card.fields.cta} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
} 