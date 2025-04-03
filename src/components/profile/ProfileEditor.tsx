/**
 * Profile picture editor component
 */
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
// import { Card } from '@/components/ui/card';
import { AvatarUploader } from './AvatarUploader';
import { ColorPicker } from '../common/ColorPicker';
import { useLinkedInDOM } from '../../hooks/useLinkedInDOM';
import { useImageStorage } from '../../hooks/useStorage';
import { useTemplates } from '../../hooks/useTemplates';
import { ProfileData } from '../../types/template';
import { Download } from 'lucide-react';
import { generateFilename, downloadDataUrl } from '../../lib/download-utils';

interface ProfileEditorProps {
  profileData: ProfileData | null;
}

export const ProfileEditor: React.FC<ProfileEditorProps> = ({ profileData }) => {
  const [customProfileImage, setCustomProfileImage] = useState<string | null>(null);
  const [borderWidth, setBorderWidth] = useState<number>(4);
  const [borderColor, setBorderColor] = useState<string>('#ffffff');
  
  // Hooks
  const { 
    applyProfilePicture,
    resetCustomization
  } = useLinkedInDOM();
  
  const {
    profilePicture,
    saveProfilePicture
  } = useImageStorage();
  
  const {
    activeTemplate,
    customSettings,
    updateCustomSettings
  } = useTemplates(profileData);
  
  // Load stored profile picture
  useEffect(() => {
    if (customSettings?.customProfileImage) {
      setCustomProfileImage(customSettings.customProfileImage);
    } else if (profilePicture) {
      setCustomProfileImage(profilePicture);
    }
    
    // Load border settings
    if (activeTemplate) {
      setBorderWidth(activeTemplate.profilePictureBorderWidth || 4);
      setBorderColor(activeTemplate.profilePictureBorderColor || '#ffffff');
    }
    
    if (customSettings?.customColors?.profileBorder) {
      setBorderColor(customSettings.customColors.profileBorder);
    }
  }, [activeTemplate, customSettings, profilePicture]);
  
  // Handle profile picture upload
  const handleProfilePictureUpload = async (dataUrl: string) => {
    setCustomProfileImage(dataUrl);
    await saveProfilePicture(dataUrl);
    
    // Apply to LinkedIn
    applyProfilePicture(dataUrl);
    
    // Update custom settings
    updateCustomSettings({
      customProfileImage: dataUrl
    });
  };
  
  // Handle border width change
  const handleBorderWidthChange = (value: number[]) => {
    const width = value[0];
    setBorderWidth(width);
    
    // Update profile picture style
    updateProfilePictureStyle(width, borderColor);
  };
  
  // Handle border color change
  const handleBorderColorChange = (color: string) => {
    setBorderColor(color);
    
    // Update custom settings
    updateCustomSettings({
      customColors: {
        ...(customSettings?.customColors || {}),
        profileBorder: color
      }
    });
    
    // Update profile picture style
    updateProfilePictureStyle(borderWidth, color);
  };
  
  // Update profile picture style (border)
  const updateProfilePictureStyle = (width: number, color: string) => {
    const profilePicElement = document.querySelector('.pv-top-card-profile-picture__image') as HTMLElement;
    if (profilePicElement) {
      profilePicElement.style.border = `${width}px solid ${color}`;
    }
  };
  
  // Reset to default
  const handleReset = () => {
    resetCustomization();
  };
  
  // Handle profile picture download
  const handleDownloadProfilePicture = () => {
    try {
      if (!customProfileImage && !profileData?.profilePictureUrl) {
        console.error('No profile picture to download');
        return;
      }
      
      // Get the image URL
      const imageUrl = customProfileImage || profileData?.profilePictureUrl || '';
      
      // Download the image
      const filename = generateFilename('linkedin_profile_picture');
      downloadDataUrl(imageUrl, filename);
    } catch (error) {
      console.error('Failed to download profile picture:', error);
    }
  };
  
  return (
    <div className="p-4 space-y-4">
      <h3 className="text-sm font-medium mb-2">Profile Picture</h3>
      
      <div className="space-y-4">
        <div className="flex justify-center">
          <div className="relative w-24 h-24">
            <img
              src={customProfileImage || profileData?.profilePictureUrl || ''}
              alt="Profile"
              className="w-full h-full rounded-full object-cover"
              style={{
                border: `${borderWidth}px solid ${borderColor}`
              }}
            />
            
            {!customProfileImage && !profileData?.profilePictureUrl && (
              <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            )}
          </div>
        </div>
        
        <AvatarUploader onUpload={handleProfilePictureUpload} />
        
        <Separator className="my-4" />
        
        <div className="space-y-3">
          <div>
            <Label className="text-xs block mb-1">Border Width</Label>
            <Slider
              value={[borderWidth]}
              min={0}
              max={10}
              step={1}
              onValueChange={handleBorderWidthChange}
            />
            <div className="flex justify-between mt-1">
              <span className="text-xs text-gray-500">None</span>
              <span className="text-xs text-gray-500">Thick</span>
            </div>
          </div>
          
          <div>
            <Label className="text-xs block mb-1">Border Color</Label>
            <ColorPicker 
              color={borderColor}
              onChange={handleBorderColorChange}
            />
          </div>
        </div>
      </div>
      
      <div className="pt-4 flex justify-between items-center">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={handleReset}
        >
          Reset
        </Button>
        
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleDownloadProfilePicture}
            className="flex items-center"
            disabled={!customProfileImage && !profileData?.profilePictureUrl}
          >
            <Download className="w-4 h-4 mr-1" />
            Download
          </Button>
          
          <Button size="sm" onClick={() => {
            // Apply changes
            if (customProfileImage) {
              applyProfilePicture(customProfileImage);
            }
            updateProfilePictureStyle(borderWidth, borderColor);
          }}>
            Apply Changes
          </Button>
        </div>
      </div>
    </div>
  );
};