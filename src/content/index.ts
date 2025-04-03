/**
 * Content script entry point
 */
import { initShadowDOM, injectStylesheet, createContainer, cleanupShadowDOM } from './shadow-dom';
import { 
  isProfilePage, 
  getBannerElement, 
  createCustomBanner,
  showCustomBanner,
  hideCustomBanner,
  showCustomProfilePicture,
  hideCustomProfilePicture,
  extractProfileData,
  createProfileObserver
} from './linkedin-dom';
import { injectReactApp } from './injection';

// Constants
const INIT_DELAY = 1000; // Wait for LinkedIn to fully load

// Global state
let isInitialized = false;
let isPanelVisible = false; // Start with panel hidden
let isActive = false; // Start inactive

// Initialize the customizer when the page is loaded
function initialize() {
  // Check if we're on a LinkedIn profile page
  if (!isProfilePage()) return;
  
  // Don't initialize multiple times
  if (isInitialized) return;
  
  console.log('LinkedIn Profile Customizer: Initializing...');
  
  try {
    // Initialize shadow DOM
    const shadowRoot = initShadowDOM();
    
    // Create container for React app
    const container = createContainer();
    
    // Extract profile data
    const profileData = extractProfileData();
    
    // Set up banner customization if banner element exists
    const bannerElement = getBannerElement();
    if (bannerElement) {
      createCustomBanner(bannerElement);
      // Keep banner hidden initially
      hideCustomBanner();
    }
    
    // Initially hide profile picture customization
    hideCustomProfilePicture();
    
    // Inject React app with show/hide state
    injectReactApp(container, profileData, isPanelVisible);
    
    isInitialized = true;
    console.log('LinkedIn Profile Customizer: Initialized successfully');
  } catch (error) {
    console.error('LinkedIn Profile Customizer: Initialization failed', error);
  }
}

// Activate the customizer (show panel and apply customizations)
function activate() {
  if (!isInitialized) {
    initialize();
  }
  
  isActive = true;
  togglePanel(true);
  
  // Show customizations
  showCustomBanner();
  showCustomProfilePicture();
}

// Deactivate the customizer (hide panel and remove customizations)
function deactivate() {
  if (!isInitialized) return;
  
  isActive = false;
  togglePanel(false);
  
  // Hide customizations
  hideCustomBanner();
  hideCustomProfilePicture();
}

// Toggle the panel visibility
function togglePanel(visible?: boolean) {
  if (visible !== undefined) {
    isPanelVisible = visible;
  } else {
    isPanelVisible = !isPanelVisible;
  }
  
  // If not initialized yet, initialize first
  if (!isInitialized) {
    initialize();
  }
  
  // Send toggle message to the React app
  window.postMessage(
    { 
      type: 'LINKEDIN_CUSTOMIZER_TOGGLE_PANEL', 
      visible: isPanelVisible 
    }, 
    '*'
  );
  
  // If panel is made visible, activate customizations
  if (isPanelVisible) {
    showCustomBanner();
    showCustomProfilePicture();
  }
}

// Reset the customizer
function reset() {
  if (isInitialized) {
    cleanupShadowDOM();
    isInitialized = false;
    isPanelVisible = false;
    isActive = false;
  }
}

// Wait for the page to be fully loaded
function waitForLinkedIn() {
  // Check if critical elements are loaded
  const bannerElement = getBannerElement();
  
  if (bannerElement) {
    initialize();
    // Start with everything inactive and hidden
    hideCustomBanner();
    hideCustomProfilePicture();
  } else {
    // Retry after delay
    setTimeout(waitForLinkedIn, INIT_DELAY);
  }
}

// Start the initialization process
if (document.readyState === 'complete') {
  waitForLinkedIn();
} else {
  window.addEventListener('load', waitForLinkedIn);
}

// Create observer to detect page navigation
createProfileObserver(() => {
  console.log('LinkedIn Profile Customizer: Profile page changed, reinitializing...');
  reset();
  setTimeout(() => {
    initialize();
    // Restore active state if needed
    if (isActive) {
      activate();
    }
  }, INIT_DELAY);
});

// Listen for messages from the background script or popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'checkStatus') {
    sendResponse({ 
      active: isProfilePage(), 
      initialized: isInitialized,
      panelVisible: isPanelVisible,
      isActive: isActive
    });
  }
  
  if (message.action === 'initialize') {
    if (!isInitialized) {
      initialize();
    }
    sendResponse({ success: true });
  }
  
  if (message.action === 'togglePanel') {
    // If customizer not active, activate it
    if (!isActive) {
      activate();
    } else {
      // Otherwise just toggle panel
      togglePanel();
    }
    sendResponse({ success: true, visible: isPanelVisible });
  }
  
  if (message.action === 'activate') {
    activate();
    sendResponse({ success: true });
  }
  
  if (message.action === 'deactivate') {
    deactivate();
    sendResponse({ success: true });
  }
  
  return true;
});

// Listen for messages from the React app
window.addEventListener('message', (event) => {
  // Only accept messages from our extension
  if (event.source !== window) return;
  
  const message = event.data;
  
  // Handle panel toggle request from React
  if (message.type === 'LINKEDIN_CUSTOMIZER_SET_PANEL_VISIBILITY') {
    isPanelVisible = message.visible;
    
    // If panel is hidden and customizer was active
    if (!isPanelVisible && isActive) {
      // Keep customizations visible
      showCustomBanner();
      showCustomProfilePicture();
    }
  }
  
  // Handle deactivation request from React
  if (message.type === 'LINKEDIN_CUSTOMIZER_DEACTIVATE') {
    deactivate();
  }
});