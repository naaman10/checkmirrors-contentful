'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import { CardGroup as CardGroupType, ComponentCtaLink } from './types';
import CTA from './CTA';

interface CardGroupProps {
  title: string;
  subTitle?: string;
  cards: Array<{
    fields: {
      title: string;
      text: string;
      cardImage: {
        fields: {
          altText: string;
          image: Array<{
            url: string;
            secure_url: string;
          }>;
        };
      };
      cta: ComponentCtaLink;
    };
  }>;
  columns?: string;
  background?: string;
}

export default function CardGroup({ title, subTitle, cards, columns = '3', background = 'Light' }: CardGroupProps) {
  console.log('CardGroup props:', { columns, cards: cards?.length });
  
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
  console.log('Grid class:', gridClass);

  return (
    <section className={`py-5 ${background === 'Dark' ? 'bg-dark text-white' : 'bg-light text-dark'}`}>
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="display-4 mb-3">{title}</h2>
          {subTitle && <p className="lead text-muted">{subTitle}</p>}
        </div>
        
        <div className="row g-4">
          {cards?.map((card, index) => (
            <div key={index} className={gridClass}>
              <div className="card h-100">
                {card.fields.cardImage?.fields?.image?.[0] && (
                  <img
                    src={card.fields.cardImage.fields.image[0].url}
                    alt={card.fields.cardImage.fields.altText}
                    className="card-img-top"
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                )}
                <div className="card-body">
                  <h3 className="card-title h4">{card.fields.title}</h3>
                  <div className="card-text">
                    <ReactMarkdown>{card.fields.text}</ReactMarkdown>
                  </div>
                </div>
                {card.fields.cta && (
                  <div className="card-footer bg-transparent border-top-0">
                    <CTA cta={card.fields.cta} />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 