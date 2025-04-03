
import { CustomizationSettings } from '../types/template';

export const STORAGE_KEYS = {
  ACTIVE_TEMPLATE: 'activeTemplate',
  CUSTOM_SETTINGS: 'customSettings',
  PROFILE_IMAGES: 'profileImages',
};

export async function getFromStorage<T>(key: string): Promise<T | null> {
  return new Promise((resolve) => {
    chrome.storage.sync.get([key], (result) => {
      resolve(result[key] || null);
    });
  });
}

export async function saveToStorage<T>(key: string, data: T): Promise<void> {
  return new Promise((resolve) => {
    chrome.storage.sync.set({ [key]: data }, () => {
      resolve();
    });
  });
}

export async function saveActiveTemplate(templateId: string): Promise<void> {
  return saveToStorage(STORAGE_KEYS.ACTIVE_TEMPLATE, templateId);
}

export async function getActiveTemplate(): Promise<string> {
  const activeTemplate = await getFromStorage<string>(STORAGE_KEYS.ACTIVE_TEMPLATE);
  return activeTemplate || 'modern'; // Default to 'modern' if none set
}

export async function saveCustomSettings(settings: CustomizationSettings): Promise<void> {
  return saveToStorage(STORAGE_KEYS.CUSTOM_SETTINGS, settings);
}

export async function getCustomSettings(): Promise<CustomizationSettings | null> {
  return getFromStorage<CustomizationSettings>(STORAGE_KEYS.CUSTOM_SETTINGS);
}

export async function saveProfileImages(data: {
  profilePicture?: string;
  bannerImage?: string;
}): Promise<void> {
  const existing = await getFromStorage<Record<string, string>>(STORAGE_KEYS.PROFILE_IMAGES) || {};
  
  return saveToStorage(STORAGE_KEYS.PROFILE_IMAGES, {
    ...existing,
    ...(data.profilePicture && { profilePicture: data.profilePicture }),
    ...(data.bannerImage && { bannerImage: data.bannerImage }),
  });
}

export async function getProfileImages(): Promise<{
  profilePicture?: string;
  bannerImage?: string;
}> {
  return getFromStorage<{
    profilePicture?: string;
    bannerImage?: string;
  }>(STORAGE_KEYS.PROFILE_IMAGES) || {};
}

/**
 * Clear all stored data
 */
export async function clearAllData(): Promise<void> {
  return new Promise((resolve) => {
    chrome.storage.sync.clear(() => {
      resolve();
    });
  });
}