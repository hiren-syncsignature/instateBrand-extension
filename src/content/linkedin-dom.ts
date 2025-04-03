/**
 * LinkedIn DOM manipulation utilities
 */
import { ProfileData } from '../types/template';

// Selectors for LinkedIn elements
const SELECTORS = {
  // Banner selectors
  BANNER_CAROUSEL: '.profile-background-image',
  BANNER_SIMPLE: '.profile-topcard-background-image-edit',
  ACTIVE_BANNER_ITEM: '.artdeco-carousel__item.active',
  BANNER_IMAGE: '.profile-background-image__carousel-image',
  
  // Profile picture selectors
  PROFILE_PICTURE: '.pv-top-card-profile-picture__image',
  PROFILE_PICTURE_CONTAINER: '.pv-top-card__photo-wrapper',
  
  // Profile data selectors - multiple formats for different LinkedIn versions
  PROFILE_NAME: [
    '.text-heading-xlarge', 
    'h1.text-heading-xlarge',
    'h1.break-words',
    'h1.BlcuwDCpUKhJljnLEPpnpbEZdnCZercBJWIfIFRU'
  ],
  PROFILE_TITLE: [
    '.text-body-medium.break-words', 
    '.pv-text-details__left-panel .text-body-medium',
    '.text-body-medium.mt2'
  ],
  PROFILE_LOCATION: [
    '.text-body-small.inline.t-black--light.break-words',
    '.pv-text-details__left-panel .text-body-small'
  ],
  PROFILE_COMPANY: [
    '.inline-show-more-text',
    '.pv-text-details__right-panel .inline-show-more-text'
  ],
};

/**
 * Helper function to query with multiple possible selectors
 * @param selectors Array of possible selectors
 * @returns The first matching element or null
 */
function queryMultiSelectors(selectors: string[]): Element | null {
  for (const selector of selectors) {
    const element = document.querySelector(selector);
    if (element) return element;
  }
  return null;
}

/**
 * Check if the current page is a LinkedIn profile page
 */
export function isProfilePage(): boolean {
  return window.location.href.includes('linkedin.com/in/');
}

/**
 * Get the banner element
 */
export function getBannerElement(): HTMLElement | null {
  const carouselBanner = document.querySelector(SELECTORS.BANNER_CAROUSEL) as HTMLElement;
  const simpleBanner = document.querySelector(SELECTORS.BANNER_SIMPLE) as HTMLElement;
  
  return carouselBanner || simpleBanner;
}

/**
 * Get the active banner image element
 */
export function getActiveBannerImage(): HTMLImageElement | null {
  // Check carousel first
  const carouselBanner = document.querySelector(SELECTORS.BANNER_CAROUSEL);
  if (carouselBanner) {
    const activeItem = carouselBanner.querySelector(SELECTORS.ACTIVE_BANNER_ITEM);
    if (activeItem) {
      return activeItem.querySelector(SELECTORS.BANNER_IMAGE) as HTMLImageElement;
    }
  }
  
  // Check simple banner
  const simpleBanner = document.querySelector(SELECTORS.BANNER_SIMPLE);
  if (simpleBanner) {
    return simpleBanner.querySelector('img') as HTMLImageElement;
  }
  
  return null;
}

/**
 * Get the profile picture element
 */
export function getProfilePictureElement(): HTMLImageElement | null {
  return document.querySelector(SELECTORS.PROFILE_PICTURE) as HTMLImageElement;
}

/**
 * Get the profile picture container element
 */
export function getProfilePictureContainer(): HTMLElement | null {
  return document.querySelector(SELECTORS.PROFILE_PICTURE_CONTAINER) as HTMLElement;
}

/**
 * Extract profile data from the LinkedIn page
 */
export function extractProfileData(): ProfileData {
  // Try to get name from all possible selectors
  const nameElement = queryMultiSelectors(SELECTORS.PROFILE_NAME);
  
  // Try to get other fields from all possible selectors
  const titleElement = queryMultiSelectors(SELECTORS.PROFILE_TITLE);
  const locationElement = queryMultiSelectors(SELECTORS.PROFILE_LOCATION);
  const companyElement = queryMultiSelectors(SELECTORS.PROFILE_COMPANY);
  
  const profilePic = getProfilePictureElement();
  const bannerImg = getActiveBannerImage();
  
  // Extra check for name in specific format
  let name = nameElement?.textContent?.trim() || '';
  if (!name) {
    // Try the specific format mentioned
    const specificNameElement = document.querySelector('h1.BlcuwDCpUKhJljnLEPpnpbEZdnCZercBJWIfIFRU');
    if (specificNameElement) {
      name = specificNameElement.textContent?.trim() || '';
    }
  }
  
  return {
    name: name,
    title: titleElement?.textContent?.trim() || '',
    location: locationElement?.textContent?.trim() || '',
    company: companyElement?.textContent?.trim() || '',
    profilePictureUrl: profilePic?.src || '',
    bannerImageUrl: bannerImg?.src || '',
  };
}

/**
 * Create a custom banner element
 */
export function createCustomBanner(container: HTMLElement): HTMLElement {
  const existingBanner = document.getElementById('linkedin-custom-banner');
  if (existingBanner) {
    return existingBanner;
  }
  
  const customBannerContainer = document.createElement('div');
  customBannerContainer.id = 'linkedin-custom-banner';
  customBannerContainer.style.position = 'absolute';
  customBannerContainer.style.top = '0';
  customBannerContainer.style.left = '0';
  customBannerContainer.style.width = '100%';
  customBannerContainer.style.height = '100%';
  customBannerContainer.style.zIndex = '5';
  customBannerContainer.style.overflow = 'hidden';
  customBannerContainer.style.opacity = '0'; // Start invisible
  customBannerContainer.style.transition = 'opacity 0.3s ease';
  
  container.style.position = 'relative';
  container.appendChild(customBannerContainer);
  
  return customBannerContainer;
}

/**
 * Show the custom banner (make it visible)
 */
export function showCustomBanner(): void {
  const banner = document.getElementById('linkedin-custom-banner');
  if (banner) {
    banner.style.opacity = '1';
  }
}

/**
 * Hide the custom banner (make it invisible)
 */
export function hideCustomBanner(): void {
  const banner = document.getElementById('linkedin-custom-banner');
  if (banner) {
    banner.style.opacity = '0';
  }
}

/**
 * Apply custom profile picture
 */
export function applyCustomProfilePicture(imageUrl: string): void {
  const profilePic = getProfilePictureElement();
  if (profilePic) {
    // Store original for restoration if needed
    if (!profilePic.dataset.originalSrc) {
      profilePic.dataset.originalSrc = profilePic.src;
    }
    
    profilePic.src = imageUrl;
    profilePic.style.opacity = '1';
  }
}

/**
 * Hide custom profile picture
 */
export function hideCustomProfilePicture(): void {
  const profilePic = getProfilePictureElement();
  if (profilePic) {
    profilePic.style.opacity = '0.5';
  }
}

/**
 * Show custom profile picture
 */
export function showCustomProfilePicture(): void {
  const profilePic = getProfilePictureElement();
  if (profilePic) {
    profilePic.style.opacity = '1';
  }
}

/**
 * Apply custom banner background
 */
export function applyCustomBannerBackground(
  container: HTMLElement, 
  background: { type: string; value: string }
): void {
  if (background.type === 'image') {
    container.style.backgroundImage = `url(${background.value})`;
    container.style.backgroundSize = 'cover';
    container.style.backgroundPosition = 'center';
  } else if (background.type === 'color') {
    container.style.backgroundImage = 'none';
    container.style.backgroundColor = background.value;
  } else if (background.type === 'gradient') {
    container.style.backgroundImage = background.value;
  }
}

/**
 * Reset banner to original
 */
export function resetBanner(): void {
  hideCustomBanner();
}

/**
 * Reset profile picture to original
 */
export function resetProfilePicture(): void {
  const profilePic = getProfilePictureElement();
  if (profilePic && profilePic.dataset.originalSrc) {
    profilePic.src = profilePic.dataset.originalSrc;
  }
}

/**
 * Create an observer to detect LinkedIn page changes
 */
export function createProfileObserver(callback: () => void): MutationObserver {
  const observer = new MutationObserver((mutations) => {
    const urlChanged = mutations.some(
      mutation => 
        mutation.type === 'attributes' && 
        mutation.attributeName === 'href'
    );
    
    if (urlChanged && isProfilePage()) {
      callback();
    }
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['href']
  });
  
  return observer;
} 