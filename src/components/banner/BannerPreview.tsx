/**
 * Banner preview component
 */
import React, { useRef, useEffect } from 'react';
import { BannerTemplate } from '../../types/template';
import { getPositionClass } from '../../lib/templates';

interface BannerPreviewProps {
  template: BannerTemplate;
  customBackgroundImage?: string | null;
}

export const BannerPreview: React.FC<BannerPreviewProps> = ({
  template,
  customBackgroundImage
}) => {
  const previewRef = useRef<HTMLDivElement>(null);
  
  // Apply the template to the preview
  useEffect(() => {
    if (!previewRef.current) return;
    
    // Set background
    const preview = previewRef.current;
    
    if (customBackgroundImage) {
      preview.style.backgroundImage = `url(${customBackgroundImage})`;
      preview.style.backgroundSize = 'cover';
      preview.style.backgroundPosition = 'center';
    } else if (template.background.type === 'image') {
      preview.style.backgroundImage = `url(${template.background.value})`;
      preview.style.backgroundSize = 'cover';
      preview.style.backgroundPosition = 'center';
    } else if (template.background.type === 'color') {
      preview.style.backgroundImage = 'none';
      preview.style.backgroundColor = template.background.value;
    } else if (template.background.type === 'gradient') {
      preview.style.backgroundImage = template.background.value;
    }
    
    // Clear previous text elements
    const textElements = preview.querySelectorAll('.preview-text-element');
    textElements.forEach(element => element.remove());
    
    // Create text elements
    template.textElements.forEach(textElement => {
      const element = document.createElement('div');
      element.className = `preview-text-element absolute ${getPositionClass(textElement.position)}`;
      element.textContent = textElement.content;
      element.style.color = textElement.color;
      element.style.fontSize = `${textElement.fontSize * 0.5}px`; // Scale down for preview
      element.style.fontWeight = textElement.fontWeight;
      element.style.fontFamily = textElement.fontFamily;
      element.style.maxWidth = '40%';
      element.style.wordBreak = 'break-word';
      element.style.textShadow = '0 1px 2px rgba(0, 0, 0, 0.3)';
      
      preview.appendChild(element);
    });
    
    // Add profile picture if needed
    if (template.showProfilePicture) {
      const profilePic = document.createElement('div');
      profilePic.className = 'absolute rounded-full bg-gray-300 flex items-center justify-center overflow-hidden';
      
      // Set size
      let size;
      switch (template.profilePictureSize) {
        case 'small':
          size = '40px';
          break;
        case 'medium':
          size = '60px';
          break;
        case 'large':
          size = '80px';
          break;
        default:
          size = '60px';
      }
      
      profilePic.style.width = size;
      profilePic.style.height = size;
      
      // Set position
      switch (template.profilePicturePosition) {
        case 'left':
          profilePic.style.left = '20px';
          profilePic.style.bottom = '20px';
          break;
        case 'center':
          profilePic.style.left = '50%';
          profilePic.style.bottom = '20px';
          profilePic.style.transform = 'translateX(-50%)';
          break;
        case 'right':
          profilePic.style.right = '20px';
          profilePic.style.bottom = '20px';
          break;
        default:
          profilePic.style.left = '20px';
          profilePic.style.bottom = '20px';
      }
      
      // Add border if needed
      if (template.profilePictureBorder) {
        profilePic.style.border = `${template.profilePictureBorderWidth || 3}px solid ${template.profilePictureBorderColor || '#ffffff'}`;
      }
      
      // Add profile icon
      const icon = document.createElement('svg');
      icon.setAttribute('viewBox', '0 0 24 24');
      icon.setAttribute('fill', 'none');
      icon.setAttribute('stroke', 'currentColor');
      icon.setAttribute('stroke-width', '1.5');
      icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />';
      icon.style.width = '60%';
      icon.style.height = '60%';
      icon.style.color = '#9ca3af';
      
      profilePic.appendChild(icon);
      preview.appendChild(profilePic);
    }
  }, [template, customBackgroundImage]);
  
  return (
    <div 
      ref={previewRef}
      className="w-full h-32 rounded-md overflow-hidden relative"
      style={{
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}
    />
  );
};