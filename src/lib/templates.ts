/**
 * Banner template definitions and utilities
 */
import { BannerTemplate } from '../types/template';

/**
 * Default banner templates
 */
export const DEFAULT_TEMPLATES: BannerTemplate[] = [
  {
    id: 'modern',
    name: 'Modern Gradient',
    thumbnail: 'assets/thumbnails/modern.png',
    background: {
      type: 'gradient',
      value: 'linear-gradient(135deg, #6366f1, #a855f7)'
    },
    textElements: [
      {
        id: 'title',
        content: 'Your Name',
        position: 'bottom-left',
        color: '#ffffff',
        fontSize: 24,
        fontWeight: 'bold',
        fontFamily: 'Inter, sans-serif',
        isTitle: true
      },
      {
        id: 'slogan',
        content: 'Your professional slogan here',
        position: 'bottom-left',
        color: '#e0e0e0',
        fontSize: 16,
        fontWeight: 'normal',
        fontFamily: 'Inter, sans-serif',
        isSlogan: true
      }
    ],
    showProfilePicture: true,
    profilePictureSize: 'large',
    profilePicturePosition: 'right',
    profilePictureBorder: true,
    profilePictureBorderColor: '#ffffff',
    profilePictureBorderWidth: 4
  },
  {
    id: 'professional',
    name: 'Professional Blue',
    thumbnail: 'assets/thumbnails/professional.png',
    background: {
      type: 'color',
      value: '#0A66C2' // LinkedIn blue
    },
    textElements: [
      {
        id: 'title',
        content: 'Your Name',
        position: 'center',
        color: '#ffffff',
        fontSize: 28,
        fontWeight: 'bold',
        fontFamily: 'Arial, sans-serif',
        isTitle: true
      },
      {
        id: 'slogan',
        content: 'Your professional title',
        position: 'center',
        color: '#e0e0e0',
        fontSize: 18,
        fontWeight: 'normal',
        fontFamily: 'Arial, sans-serif',
        isSlogan: true
      },
      {
        id: 'cta',
        content: 'Connect with me',
        position: 'bottom-right',
        color: '#ffffff',
        fontSize: 14,
        fontWeight: 'bold',
        fontFamily: 'Arial, sans-serif',
        isCallToAction: true
      }
    ],
    showProfilePicture: true,
    profilePictureSize: 'medium',
    profilePicturePosition: 'left',
    profilePictureBorder: true,
    profilePictureBorderColor: '#ffffff',
    profilePictureBorderWidth: 3
  },
  {
    id: 'minimal',
    name: 'Minimal White',
    thumbnail: 'assets/thumbnails/minimal.png',
    background: {
      type: 'color',
      value: '#ffffff'
    },
    textElements: [
      {
        id: 'title',
        content: 'Your Name',
        position: 'center-left',
        color: '#000000',
        fontSize: 24,
        fontWeight: 'light',
        fontFamily: 'Helvetica, sans-serif',
        isTitle: true
      },
      {
        id: 'slogan',
        content: 'Professional | Creative | Innovative',
        position: 'center-left',
        color: '#666666',
        fontSize: 16,
        fontWeight: 'light',
        fontFamily: 'Helvetica, sans-serif',
        isSlogan: true
      }
    ],
    showProfilePicture: false,
    profilePictureSize: 'small',
    profilePicturePosition: 'center',
    profilePictureBorder: false
  },
  {
    id: 'corporate',
    name: 'Corporate Pattern',
    thumbnail: 'assets/thumbnails/corporate.png',
    background: {
      type: 'image',
      value: 'assets/backgrounds/corporate-pattern.png'
    },
    textElements: [
      {
        id: 'title',
        content: 'Your Name',
        position: 'bottom-left',
        color: '#ffffff',
        fontSize: 26,
        fontWeight: 'bold',
        fontFamily: 'Roboto, sans-serif',
        isTitle: true
      },
      {
        id: 'slogan',
        content: 'Your Title at Company',
        position: 'bottom-left',
        color: '#e0e0e0',
        fontSize: 18,
        fontWeight: 'normal',
        fontFamily: 'Roboto, sans-serif',
        isSlogan: true
      }
    ],
    showProfilePicture: true,
    profilePictureSize: 'medium',
    profilePicturePosition: 'right',
    profilePictureBorder: true,
    profilePictureBorderColor: '#ffffff',
    profilePictureBorderWidth: 3
  },
  {
    id: 'creative',
    name: 'Creative Colorful',
    thumbnail: 'assets/thumbnails/creative.png',
    background: {
      type: 'gradient',
      value: 'linear-gradient(90deg, #FF9A8B 0%, #FF6A88 55%, #FF99AC 100%)'
    },
    textElements: [
      {
        id: 'title',
        content: 'Your Name',
        position: 'center-right',
        color: '#ffffff',
        fontSize: 30,
        fontWeight: 'bold',
        fontFamily: 'Montserrat, sans-serif',
        isTitle: true
      },
      {
        id: 'slogan',
        content: 'Creative Professional',
        position: 'center-right',
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'normal',
        fontFamily: 'Montserrat, sans-serif',
        isSlogan: true
      }
    ],
    showProfilePicture: true,
    profilePictureSize: 'large',
    profilePicturePosition: 'left',
    profilePictureBorder: false
  }
];

/**
 * Get a template by ID
 */
export function getTemplateById(id: string): BannerTemplate | undefined {
  return DEFAULT_TEMPLATES.find(template => template.id === id);
}

/**
 * Get the default template
 */
export function getDefaultTemplate(): BannerTemplate {
  return DEFAULT_TEMPLATES[0];
}

/**
 * Generate a CSS class name for text positioning
 */
export function getPositionClass(position: string): string {
  const positionMap: Record<string, string> = {
    'top-left': 'top-4 left-4',
    'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
    'top-right': 'top-4 right-4',
    'center-left': 'top-1/2 left-4 transform -translate-y-1/2',
    'center': 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2',
    'center-right': 'top-1/2 right-4 transform -translate-y-1/2',
    'bottom-left': 'bottom-4 left-4',
    'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2',
    'bottom-right': 'bottom-4 right-4'
  };
  
  return positionMap[position] || 'top-left';
}

/**
 * Apply profile data to template text
 */
export function applyProfileData(template: BannerTemplate, profileData: any): BannerTemplate {
  const updatedTemplate = { ...template };
  
  // Update text elements with profile data
  updatedTemplate.textElements = template.textElements.map(element => {
    const updatedElement = { ...element };
    
    if (element.isTitle) {
      updatedElement.content = profileData.name || element.content;
    } else if (element.isSlogan) {
      updatedElement.content = profileData.title || element.content;
    }
    
    return updatedElement;
  });
  
  return updatedTemplate;
}