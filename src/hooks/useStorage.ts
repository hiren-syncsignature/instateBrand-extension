/**
 * Hook for Chrome storage access
 */
import { useState, useEffect, useCallback } from 'react';
import { 
  getFromStorage, 
  saveToStorage, 
  saveProfileImages,
  getProfileImages
} from '../lib/storage';

export function useStorage<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(defaultValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Load initial value from storage
  useEffect(() => {
    const loadValue = async () => {
      try {
        setLoading(true);
        const storedValue = await getFromStorage<T>(key);
        setValue(storedValue || defaultValue);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    };
    
    loadValue();
  }, [key, defaultValue]);
  
  // Save value to storage
  const saveValue = useCallback(async (newValue: T) => {
    try {
      setLoading(true);
      await saveToStorage(key, newValue);
      setValue(newValue);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, [key]);
  
  return { value, setValue: saveValue, loading, error };
}

/**
 * Hook specifically for image storage
 */
export function useImageStorage() {
  const [profilePicture, setProfilePicture] = useState<string | undefined>(undefined);
  const [bannerImage, setBannerImage] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Load images from storage
  useEffect(() => {
    const loadImages = async () => {
      try {
        setLoading(true);
        const images = await getProfileImages();
        setProfilePicture(images.profilePicture);
        setBannerImage(images.bannerImage);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    };
    
    loadImages();
  }, []);
  
  /**
   * Save profile picture
   */
  const saveProfilePicture = useCallback(async (dataUrl: string) => {
    try {
      setLoading(true);
      await saveProfileImages({ profilePicture: dataUrl });
      setProfilePicture(dataUrl);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      return false;
    } finally {
      setLoading(false);
    }
  }, []);
  
  /**
   * Save banner image
   */
  const saveBannerImage = useCallback(async (dataUrl: string) => {
    try {
      setLoading(true);
      await saveProfileImages({ bannerImage: dataUrl });
      setBannerImage(dataUrl);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      return false;
    } finally {
      setLoading(false);
    }
  }, []);
  
  return {
    profilePicture,
    bannerImage,
    saveProfilePicture,
    saveBannerImage,
    loading,
    error
  };
}