/**
 * Banner editor component
 */
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ImageUploader } from '../common/ImageUploader';
import { ColorPicker } from '../common/ColorPicker';
import { TemplateSelector } from './TemplateSelector';
import { BannerPreview } from './BannerPreview';
import { TextEditor } from '../common/TextEditor';
import { useTemplates } from '../../hooks/useTemplates';
import { useLinkedInDOM } from '../../hooks/useLinkedInDOM';
import { useImageStorage } from '../../hooks/useStorage';
import { ProfileData } from '../../types/template';
import { Download } from 'lucide-react';
import { captureBanner, generateFilename, downloadDataUrl } from '@/lib/download-utils';

interface BannerEditorProps {
  profileData: ProfileData | null;
}

export const BannerEditor: React.FC<BannerEditorProps> = ({ profileData }) => {
  const [customBackgroundImage, setCustomBackgroundImage] = useState<string | null>(null);

  // Hooks
  const { 
    templates, 
    activeTemplateId, 
    activeTemplate, 
    customSettings,
    changeTemplate, 
    updateCustomSettings,
    updateTextElement
  } = useTemplates(profileData);

  const { 
    applyTemplate, 
    resetCustomization
  } = useLinkedInDOM();

  const {
    bannerImage, 
    saveBannerImage
  } = useImageStorage();

  // Apply template when it changes
  useEffect(() => {
    if (activeTemplate) {
      applyTemplate(activeTemplate);
    }
  }, [activeTemplate, applyTemplate]);

  // Load custom background image if exists
  useEffect(() => {
    if (customSettings?.customBackgroundImage) {
      setCustomBackgroundImage(customSettings.customBackgroundImage);
    } else if (bannerImage) {
      setCustomBackgroundImage(bannerImage);
    }
  }, [customSettings, bannerImage]);

  // Handle template change
  const handleTemplateChange = (templateId: string) => {
    changeTemplate(templateId);
  };

  // Handle background image upload
  const handleBackgroundUpload = async (dataUrl: string) => {
    setCustomBackgroundImage(dataUrl);
    await saveBannerImage(dataUrl);
    
    // Update custom settings
    updateCustomSettings({
      customBackgroundImage: dataUrl
    });

    // Update active template
    if (activeTemplate) {
      const updatedTemplate = {
        ...activeTemplate,
        background: {
          type: 'image',
          value: dataUrl
        }
      };
      
      applyTemplate(updatedTemplate);
    }
  };

  // Handle text content change
  const handleTextChange = (elementId: string, content: string) => {
    updateTextElement(elementId, content);
  };

  // Handle background color change
  const handleColorChange = (color: string) => {
    // Update custom settings
    updateCustomSettings({
      customColors: {
        ...(customSettings?.customColors || {}),
        background: color
      }
    });

    // Update active template
    if (activeTemplate) {
      const updatedTemplate = {
        ...activeTemplate,
        background: {
          type: 'color',
          value: color
        }
      };
      
      applyTemplate(updatedTemplate);
    }
  };

  // Reset to default
  const handleReset = () => {
    resetCustomization();
    
    // Re-apply current template
    if (activeTemplate) {
      applyTemplate(activeTemplate);
    }
  };
  
  // Handle banner download
  const handleDownloadBanner = async () => {
    try {
      // Get the custom banner element
      const bannerElement = document.getElementById('linkedin-custom-banner');
      
      if (!bannerElement) {
        console.error('Banner element not found');
        return;
      }
      
      // Generate banner image
      const dataUrl = await captureBanner(bannerElement);
      
      // Download the image
      const filename = generateFilename('linkedin_banner');
      downloadDataUrl(dataUrl, filename);
    } catch (error) {
      console.error('Failed to download banner:', error);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <TemplateSelector 
        templates={templates}
        activeTemplateId={activeTemplateId}
        onChange={handleTemplateChange}
      />
      
      <Separator className="my-4" />
      
      {activeTemplate && (
        <div className="mb-4">
          <Label htmlFor="banner-preview" className="text-xs block mb-2">Preview</Label>
          <BannerPreview 
            template={activeTemplate}
            customBackgroundImage={customBackgroundImage}
          />
          <p className="text-xs text-gray-500 mt-1 text-center">
            This is a preview of how your banner will look
          </p>
        </div>
      )}
      
      <Separator className="my-4" />
      
      <Accordion type="single" collapsible defaultValue="background">
        <AccordionItem value="background">
          <AccordionTrigger className="text-sm font-medium">
            Background
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="background-type" className="text-xs">
                  Type
                </Label>
                <select 
                  id="background-type"
                  className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={activeTemplate?.background.type || 'image'}
                  onChange={(e) => {
                    if (activeTemplate) {
                      const updatedTemplate = {
                        ...activeTemplate,
                        background: {
                          ...activeTemplate.background,
                          type: e.target.value as 'color' | 'gradient' | 'image'
                        }
                      };
                      
                      applyTemplate(updatedTemplate);
                    }
                  }}
                >
                  <option value="color">Solid Color</option>
                  <option value="gradient">Gradient</option>
                  <option value="image">Image</option>
                </select>
              </div>
              
              {activeTemplate?.background.type === 'color' && (
                <div>
                  <Label className="text-xs">Background Color</Label>
                  <ColorPicker 
                    color={customSettings?.customColors?.background || activeTemplate.background.value}
                    onChange={handleColorChange}
                  />
                </div>
              )}
              
              {activeTemplate?.background.type === 'image' && (
                <div>
                  <Label className="text-xs">Background Image</Label>
                  <ImageUploader onUpload={handleBackgroundUpload} />
                  
                  {customBackgroundImage && (
                    <div className="mt-2">
                      <p className="text-xs text-gray-500 mb-1">Current Image</p>
                      <img 
                        src={customBackgroundImage} 
                        alt="Custom background" 
                        className="w-full h-24 object-cover rounded-md"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="text">
          <AccordionTrigger className="text-sm font-medium">
            Text Elements
          </AccordionTrigger>
          <AccordionContent>
            {activeTemplate?.textElements.map((element) => (
              <div key={element.id} className="mb-4">
                <TextEditor 
                  label={element.isTitle ? 'Title' : element.isSlogan ? 'Slogan' : 'Text'}
                  value={element.content}
                  onChange={(content) => handleTextChange(element.id, content)}
                  color={element.color}
                  onColorChange={(color) => {
                    if (activeTemplate) {
                      const updatedElements = [...activeTemplate.textElements];
                      const index = updatedElements.findIndex(el => el.id === element.id);
                      
                      if (index !== -1) {
                        updatedElements[index] = {
                          ...updatedElements[index],
                          color
                        };
                        
                        const updatedTemplate = {
                          ...activeTemplate,
                          textElements: updatedElements
                        };
                        
                        applyTemplate(updatedTemplate);
                      }
                    }
                  }}
                />
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
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
            onClick={handleDownloadBanner}
            className="flex items-center"
          >
            <Download className="w-4 h-4 mr-1" />
            Download
          </Button>
          
          <Button size="sm" onClick={() => {
            // Apply changes permanently
            if (activeTemplate) {
              applyTemplate(activeTemplate);
            }
          }}>
            Apply Changes
          </Button>
        </div>
      </div>
    </div>
  );
};