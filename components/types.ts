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

export type ContentSectionType = HeroBannerSection | TextSection; 