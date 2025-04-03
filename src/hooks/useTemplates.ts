/**
 * Hook for template management
 */
import { useState, useEffect, useCallback } from 'react';
import { DEFAULT_TEMPLATES, getTemplateById, applyProfileData } from '../lib/templates';
import { saveActiveTemplate, getActiveTemplate, saveCustomSettings, getCustomSettings } from '../lib/storage';
import { BannerTemplate, ProfileData, CustomizationSettings } from '../types/template';

export function useTemplates(profileData: ProfileData | null) {
  const [templates, setTemplates] = useState<BannerTemplate[]>(DEFAULT_TEMPLATES);
  const [activeTemplateId, setActiveTemplateId] = useState<string>('modern');
  const [activeTemplate, setActiveTemplate] = useState<BannerTemplate | null>(null);
  const [customSettings, setCustomSettings] = useState<CustomizationSettings | null>(null);
  
  // Load active template from storage
  useEffect(() => {
    const loadActiveTemplate = async () => {
      try {
        const templateId = await getActiveTemplate();
        const settings = await getCustomSettings();
        
        setActiveTemplateId(templateId);
        setCustomSettings(settings);
        
        // Get the template and apply profile data
        const template = getTemplateById(templateId);
        if (template && profileData) {
          const customizedTemplate = applyProfileData(template, profileData);
          setActiveTemplate(customizedTemplate);
        } else if (template) {
          setActiveTemplate(template);
        }
      } catch (error) {
        console.error('Failed to load template settings', error);
      }
    };
    
    loadActiveTemplate();
  }, [profileData]);
  
  /**
   * Change the active template
   */
  const changeTemplate = useCallback(async (templateId: string) => {
    try {
      const template = getTemplateById(templateId);
      if (!template) return;
      
      // Save to storage
      await saveActiveTemplate(templateId);
      setActiveTemplateId(templateId);
      
      // Apply profile data if available
      if (profileData) {
        const customizedTemplate = applyProfileData(template, profileData);
        setActiveTemplate(customizedTemplate);
      } else {
        setActiveTemplate(template);
      }
    } catch (error) {
      console.error('Failed to change template', error);
    }
  }, [profileData]);
  
  /**
   * Update custom settings
   */
  const updateCustomSettings = useCallback(async (newSettings: Partial<CustomizationSettings>) => {
    try {
      const updatedSettings = {
        ...customSettings,
        ...newSettings,
        activeTemplateId
      } as CustomizationSettings;
      
      // Save to storage
      await saveCustomSettings(updatedSettings);
      setCustomSettings(updatedSettings);
    } catch (error) {
      console.error('Failed to update custom settings', error);
    }
  }, [customSettings, activeTemplateId]);
  
  /**
   * Update a text element in the active template
   */
  const updateTextElement = useCallback((elementId: string, content: string) => {
    if (!activeTemplate) return;
    
    const updatedTemplate = { ...activeTemplate };
    const elementIndex = updatedTemplate.textElements.findIndex(el => el.id === elementId);
    
    if (elementIndex !== -1) {
      updatedTemplate.textElements[elementIndex] = {
        ...updatedTemplate.textElements[elementIndex],
        content
      };
      
      setActiveTemplate(updatedTemplate);
      
      // Update custom settings
      updateCustomSettings({
        customTextElements: {
          ...customSettings?.customTextElements,
          [elementId]: {
            content
          }
        }
      });
    }
  }, [activeTemplate, customSettings, updateCustomSettings]);
  
  return {
    templates,
    activeTemplateId,
    activeTemplate,
    customSettings,
    changeTemplate,
    updateCustomSettings,
    updateTextElement
  };
}