export interface ComponentCtaLink {
  sys: {
    id: string;
    contentType: {
      sys: {
        id: 'componentCtaLink';
      };
    };
  };
  fields: {
    label: string;
    link: string;
    style: string;
  };
}

export interface ComponentCtaAction {
  sys: {
    id: string;
    contentType: {
      sys: {
        id: 'componentCtaAction';
      };
    };
  };
  fields: {
    label: string;
    action: string;
    style: string;
  };
}

export type CTA = ComponentCtaLink | ComponentCtaAction;

export interface HeroBannerSection {
  sys: {
    id: string;
    contentType: {
      sys: {
        id: string;
      };
    };
  };
  fields: {
    heading: string;
    subHeading: string;
    backgroundImage: Array<{
      url: string;
      secure_url: string;
    }>;
    size: string;
    buttons: CTA[];
  };
}

export interface TextSection {
  sys: {
    id: string;
    contentType: {
      sys: {
        id: string;
      };
    };
  };
  fields: {
    content: string;
  };
}

export interface FeatureSection {
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
    bodyText: string;
    media: {
      fields: {
        altText: string;
        image: Array<{
          url: string;
          secure_url: string;
        }>;
      };
    };
    alignment: 'Left' | 'Right';
    background: 'Light' | 'Dark';
    cta?: CTA;
  };
}

export interface BlogPost {
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
    slug: string;
    publishDate: string;
    author: {
      fields: {
        name: string;
        avatar?: {
          fields: {
            image: Array<{
              url: string;
              secure_url: string;
            }>;
          };
        };
      };
    };
    featuredImage?: {
      fields: {
        altText: string;
        image: Array<{
          url: string;
          secure_url: string;
        }>;
      };
    };
    content: string;
    excerpt?: string;
    tags?: string[];
  };
}

export interface CardGroup {
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
    subtitle?: string;
    items: Array<BlogPost | FeatureSection>;
    variant?: 'default' | 'feature' | 'blog';
    columns?: 1 | 2 | 3 | 4;
  };
}

export type ContentSectionType = HeroBannerSection | TextSection | FeatureSection | CardGroup;

export interface BannerPromotion {
  fields: {
    internalName: string;
    title: string;
    cta?: CTA;
    background: string;
  };
} 