/**
 * Hook for LinkedIn DOM manipulation
 */
import { useState, useEffect, useCallback } from 'react';
import { 
  getBannerElement, 
  getProfilePictureElement,
  applyCustomBannerBackground,
  applyCustomProfilePicture,
  resetBanner,
  resetProfilePicture,
  createCustomBanner,
  extractProfileData
} from '../content/linkedin-dom';
import { ProfileData, BannerTemplate } from '../types/template';

export function useLinkedInDOM() {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [bannerElement, setBannerElement] = useState<HTMLElement | null>(null);
  const [customBannerElement, setCustomBannerElement] = useState<HTMLElement | null>(null);
  const [profilePicElement, setProfilePicElement] = useState<HTMLImageElement | null>(null);
  
  // Initialize and find all LinkedIn elements
  useEffect(() => {
    const banner = getBannerElement();
    const profilePic = getProfilePictureElement();
    
    setBannerElement(banner);
    setProfilePicElement(profilePic);
    
    if (banner && !customBannerElement) {
      const customBanner = createCustomBanner(banner);
      setCustomBannerElement(customBanner);
    }
    
    // Extract profile data
    const data = extractProfileData();
    setProfileData(data);
  }, []);
  
  /**
   * Apply a template to the LinkedIn banner
   */
  const applyTemplate = useCallback((template: BannerTemplate) => {
    if (!customBannerElement) return;
    
    // Apply background
    applyCustomBannerBackground(customBannerElement, template.background);
    
    // Create text elements inside the banner
    customBannerElement.innerHTML = '';
    
    // Apply text elements
    template.textElements.forEach(textElement => {
      const element = document.createElement('div');
      element.innerText = textElement.content;
      element.style.position = 'absolute';
      
      // Set position based on the text element position
      switch (textElement.position) {
        case 'top-left':
          element.style.top = '20px';
          element.style.left = '20px';
          break;
        case 'top-center':
          element.style.top = '20px';
          element.style.left = '50%';
          element.style.transform = 'translateX(-50%)';
          break;
        case 'top-right':
          element.style.top = '20px';
          element.style.right = '20px';
          break;
        case 'center-left':
          element.style.top = '50%';
          element.style.left = '20px';
          element.style.transform = 'translateY(-50%)';
          break;
        case 'center':
          element.style.top = '50%';
          element.style.left = '50%';
          element.style.transform = 'translate(-50%, -50%)';
          break;
        case 'center-right':
          element.style.top = '50%';
          element.style.right = '20px';
          element.style.transform = 'translateY(-50%)';
          break;
        case 'bottom-left':
          element.style.bottom = '20px';
          element.style.left = '20px';
          break;
        case 'bottom-center':
          element.style.bottom = '20px';
          element.style.left = '50%';
          element.style.transform = 'translateX(-50%)';
          break;
        case 'bottom-right':
          element.style.bottom = '20px';
          element.style.right = '20px';
          break;
      }
      
      // Apply text styling
      element.style.color = textElement.color;
      element.style.fontSize = `${textElement.fontSize}px`;
      element.style.fontWeight = textElement.fontWeight;
      element.style.fontFamily = textElement.fontFamily;
      element.style.zIndex = '2';
      
      // Add edit capability
      element.contentEditable = 'true';
      element.style.cursor = 'text';
      element.dataset.elementId = textElement.id;
      
      // Prevent LinkedIn events from firing
      element.addEventListener('click', (e) => {
        e.stopPropagation();
      });
      
      customBannerElement.appendChild(element);
    });
  }, [customBannerElement]);
  
  /**
   * Apply a custom profile picture
   */
  const applyProfilePicture = useCallback((imageUrl: string) => {
    if (profilePicElement) {
      applyCustomProfilePicture(imageUrl);
    }
  }, [profilePicElement]);
  
  /**
   * Reset customization
   */
  const resetCustomization = useCallback(() => {
    resetBanner();
    resetProfilePicture();
    
    // Re-create custom banner to start fresh
    if (bannerElement) {
      const customBanner = createCustomBanner(bannerElement);
      setCustomBannerElement(customBanner);
    }
  }, [bannerElement]);
  
  return {
    profileData,
    applyTemplate,
    applyProfilePicture,
    resetCustomization,
    bannerElement,
    customBannerElement,
    profilePicElement
  };
}