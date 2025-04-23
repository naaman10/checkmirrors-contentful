export const getTransformations = (contentType: string) => {
  switch (contentType) {
    case 'instructors':
      return 'g_face:center/t_square/';
    default:
      return '';
  }
};

export const getCloudinaryUrl = (url: string, width: number, height: number, contentType: string, crop: string = 'fill') => {
  if (!url) return null;
  
  // Check if it's already a Cloudinary URL
  if (!url.includes('cloudinary.com')) return url;
  
  // Insert transformation parameters into the URL
  const parts = url.split('/upload/');
  if (parts.length !== 2) return url;
  
  const customTransformations = getTransformations(contentType);
  const heightParam = height > 0 ? `,h_${height}` : '';
  
  return `${parts[0]}/upload/${customTransformations}c_${crop},w_${width}${heightParam}/${parts[1]}`;
};

export const getImageDimensions = (contentType: string) => {
  switch (contentType) {
    case 'blog':
    case 'pageblogpost':
    case 'articles':
      return { width: 350, height: 200 };
    case 'instructors':
      return { width: 300, height: 300 };
    case 'testimonials':
      return { width: 200, height: 200 };
    case 'featured':
      return { width: 1200, height: 600 };
    case 'avatar':
      return { width: 40, height: 40 };
    default:
      return { width: 350, height: 150 };
  }
}; 