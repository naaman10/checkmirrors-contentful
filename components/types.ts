import { EntrySkeletonType, Entry } from 'contentful'

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
  contentTypeId: 'pageBlogPost';
  fields: {
    title: string;
    slug: string;
    publishDate: string;
    author: {
      fields: {
        name: string;
        avatar?: {
          fields: {
            image: {
              fields: {
                file: {
                  url: string;
                };
                title: string;
              };
            };
          };
        };
      };
    };
    featureImage?: {
      fields: {
        image: {
          fields: {
            file: {
              url: string;
            };
            title: string;
          };
        };
      };
    };
    featuredImage?: {
      fields: {
        image: {
          fields: {
            file: {
              url: string;
            };
            title: string;
          };
        };
      };
    };
    content: string;
    excerpt?: string;
    category: string;
  };
  sys: {
    id: string;
    contentType: {
      sys: {
        id: string;
      };
    };
  };
}

export interface Instructor {
  contentTypeId: 'instructor'
  fields: {
    name: string
    bio: string
    qualifications?: string[]
    image?: {
      fields: {
        altText?: string;
        image: Array<{
          url: string;
          secure_url: string;
        }>;
      }
    }
    order?: number
    active?: boolean
    internalName?: string
    tags?: string[]
  }
}

export interface Testimonial {
  contentTypeId: 'testimonial'
  fields: {
    authorName: string
    authorTitle?: string
    testimonial: string
    authorImage?: {
      fields: {
        file: {
          url: string
        }
        title: string
      }
    }
  }
}

export type ContentType = BlogPost | Instructor | Testimonial

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
    internalName?: string;
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
        internalName?: string;
        title: string;
        text: string;
        cardImage?: {
          sys: {
            id: string;
            contentType: {
              sys: {
                id: string;
              };
            };
          };
          fields?: {
            altText?: string;
            image?: Array<{
              url?: string;
              secure_url?: string;
            }>;
          };
        };
        cta?: CTA;
      };
    }>;
    columns?: string;
    background?: string;
  };
}

export interface Listings {
  sys: {
    id: string;
    contentType: {
      sys: {
        id: 'componentListings';
      };
    };
  };
  fields: {
    items: Entry<BlogPost | Instructor | Testimonial>[];
    contentType: 'blog' | 'instructor' | 'testimonial';
    title?: string;
    subTitle?: string;
    columns?: string;
    pagination?: boolean;
    filter?: boolean;
  };
}

export type ContentSectionType = HeroBannerSection | TextSection | FeatureSection | CardGroup | Listings;

export interface BannerPromotion {
  fields: {
    internalName: string;
    title: string;
    cta?: CTA;
    background: string;
  };
} 