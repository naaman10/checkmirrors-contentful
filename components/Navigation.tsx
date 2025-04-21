'use client';

import React, { useEffect, useState } from 'react';
import { createClient, Entry, EntrySkeletonType } from 'contentful';
import CTA from './CTA';
import { ComponentCtaAction } from './types';

console.log('Navigation component file loaded');

interface NavigationMenuItem {
  sys: {
    id: string;
    contentType: {
      sys: {
        id: string;
      };
    };
  };
  fields: {
    label: string;
    url: string;
    order: number;
    subMenuItems?: Array<{
      sys: {
        type: 'Link';
        linkType: 'Entry';
        id: string;
      };
    }>;
  };
}

interface NavigationData {
  sys: {
    id: string;
  };
  fields: {
    name: string;
    menu: Array<Entry<EntrySkeletonType>>;
    cta?: ComponentCtaAction;
  };
}

export default function Navigation() {
  console.log('Navigation component rendering');
  
  const [navigationData, setNavigationData] = useState<NavigationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({});
  const [subMenuItems, setSubMenuItems] = useState<Record<string, NavigationMenuItem[]>>({});

  useEffect(() => {
    const fetchNavigation = async () => {
      try {
        const spaceId = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID;
        const accessToken = process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN;
        
        if (!spaceId || !accessToken) {
          throw new Error('Contentful credentials are missing. Please check your environment variables.');
        }

        const client = createClient({
          space: spaceId,
          accessToken: accessToken,
        });

        const entries = await client.getEntries({
          content_type: 'componentNavigationMainNavigation',
          include: 3
        });

        if (!entries.items || entries.items.length === 0) {
          throw new Error('No navigation entries found in Contentful');
        }

        const entry = entries.items[0];
        setNavigationData(entry as unknown as NavigationData);

        if (entry.fields && typeof entry.fields === 'object' && 'menu' in entry.fields) {
          const menuItems = (entry.fields.menu as Array<Entry<EntrySkeletonType>>).filter(item => 
            item.fields && typeof item.fields === 'object' && 'subMenuItems' in item.fields
          );
          
          for (const item of menuItems) {
            const subMenuLinks = (item.fields as any).subMenuItems;
            if (Array.isArray(subMenuLinks) && subMenuLinks.length > 0) {
              const subItems = await Promise.all(
                subMenuLinks.map(async (link) => {
                  const subItem = await client.getEntry<EntrySkeletonType>(link.sys.id);
                  return {
                    sys: subItem.sys,
                    fields: {
                      label: (subItem.fields as any).label,
                      url: (subItem.fields as any).url,
                      order: (subItem.fields as any).order || 0
                    }
                  } as NavigationMenuItem;
                })
              );
              setSubMenuItems(prev => ({
                ...prev,
                [item.sys.id]: subItems
              }));
            }
          }
        }
      } catch (err) {
        console.error('Navigation Error:', err instanceof Error ? err.message : 'Failed to fetch navigation data');
        setError(err instanceof Error ? err.message : 'Failed to fetch navigation data');
      } finally {
        setLoading(false);
      }
    };

    fetchNavigation();
  }, []);

  console.log('Navigation render state:', {
    loading,
    error,
    navigationData: navigationData ? 'Present' : 'Missing',
    hasCTA: navigationData?.fields?.cta ? 'Yes' : 'No',
    menuItems: navigationData?.fields?.menu?.length || 0
  });

  const toggleDropdown = (id: string) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  if (loading) {
    console.log('Navigation is loading...');
    return <div>Loading navigation...</div>;
  }
  if (error) {
    console.log('Navigation error:', error);
    return <div className="alert alert-danger">Error: {error}</div>;
  }
  if (!navigationData) {
    console.log('No navigation data available');
    return null;
  }
  if (!navigationData.fields?.menu) {
    console.log('No menu items found in navigation data');
    return <div>No navigation items found</div>;
  }

  console.log('Rendering navigation with data:', {
    menuItems: navigationData.fields.menu.length,
    hasCTA: !!navigationData.fields.cta
  });

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <div className="d-flex w-100 align-items-center">
          <a className="navbar-brand me-auto" href="/">
            <h2><span className="title-a">check</span><span className="title-b">mirrors</span><span className="title-tagline"> School of Motoring</span></h2>
          </a>
          <button
            className="navbar-toggler"
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`}>
            <ul className="navbar-nav ms-auto">
              {navigationData.fields.menu.map((item) => {
                const fields = item.fields as any;
                const hasSubMenuItems = subMenuItems[item.sys.id]?.length > 0;

                if (hasSubMenuItems) {
                  return (
                    <li key={item.sys.id} className="nav-item dropdown">
                      <a
                        className="nav-link dropdown-toggle"
                        href="#"
                        role="button"
                        data-bs-toggle="dropdown" 
                        onClick={(e) => {
                          e.preventDefault();
                          toggleDropdown(item.sys.id);
                        }}
                        aria-expanded={openDropdowns[item.sys.id]}
                      >
                        {fields.label}
                      </a>
                      <ul className={`dropdown-menu ${openDropdowns[item.sys.id] ? 'show' : ''}`}>
                        {subMenuItems[item.sys.id]?.map((subItem) => (
                          <li key={subItem.sys.id}>
                            <a className="dropdown-item" href={subItem.fields.url}>
                              {subItem.fields.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </li>
                  );
                }

                return (
                  <li key={item.sys.id} className="nav-item">
                    <a href={fields.url} className="nav-link">
                      {fields.label}
                    </a>
                  </li>
                );
              })}
            </ul>
            {navigationData.fields.cta && (
              <div className="ms-3">
                <CTA cta={navigationData.fields.cta} />
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 