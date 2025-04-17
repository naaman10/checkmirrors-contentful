'use client';

import React, { useEffect, useState } from 'react';
import { createClient, Entry, EntrySkeletonType } from 'contentful';

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
  };
}

export default function Navigation() {
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

        const entry = await client.getEntry('6QijAygCRrf37WNFdnfXwI', { 
          include: 3
        });
        
        setNavigationData(entry as unknown as NavigationData);

        // Fetch subMenuItems for each menu item that has them
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
        setError(err instanceof Error ? err.message : 'Failed to fetch navigation data');
      } finally {
        setLoading(false);
      }
    };

    fetchNavigation();
  }, []);

  const toggleDropdown = (id: string) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  if (loading) return <div>Loading navigation...</div>;
  if (error) return <div className="alert alert-danger">Error: {error}</div>;
  if (!navigationData) return null;
  if (!navigationData.fields?.menu) return <div>No navigation items found</div>;

  // Filter and sort menu items
  const sortedMenuItems = (navigationData.fields.menu as Array<Entry<EntrySkeletonType>>)
    .filter((item): item is Entry<EntrySkeletonType> => 
      item.fields && typeof item.fields === 'object' && 'label' in item.fields
    )
    .sort((a, b) => 
      ((a.fields as any).order || 0) - ((b.fields as any).order || 0)
    );

  const renderMenuItem = (item: Entry<EntrySkeletonType>) => {
    const fields = item.fields as any;
    const hasSubMenuItems = subMenuItems[item.sys.id]?.length > 0;

    if (hasSubMenuItems) {
      return (
        <li key={item.sys.id} className="nav-item dropdown">
          <a
            className="nav-link dropdown-toggle"
            href="#"
            role="button"
            onClick={(e: React.MouseEvent) => {
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
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <a className="navbar-brand" href="/">
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
            {sortedMenuItems.map(renderMenuItem)}
          </ul>
        </div>
      </div>
    </nav>
  );
} 