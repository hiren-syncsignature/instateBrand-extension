/**
 * Background service worker
 */

// Listen for installation
chrome.runtime.onInstalled.addListener(() => {
    console.log('LinkedIn Profile Customizer installed');
    
    // Initialize default storage values
    chrome.storage.sync.get(['activeTemplate', 'customSettings'], (result) => {
      if (!result.activeTemplate) {
        chrome.storage.sync.set({ activeTemplate: 'modern' });
      }
      
      if (!result.customSettings) {
        chrome.storage.sync.set({
          customSettings: {
            activeTemplateId: 'modern',
            customTextElements: {},
            customColors: {}
          }
        });
      }
    });
  });
  
  // Handle extension button (toolbar icon) click
  chrome.action.onClicked.addListener((tab) => {
    // Only activate if we're on a LinkedIn profile page
    if (tab.url?.includes('linkedin.com/in/')) {
      chrome.tabs.sendMessage(tab.id as number, { action: 'togglePanel' });
    } else {
      // If not on a LinkedIn profile page, show notification
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'assets/icon128.png',
        title: 'LinkedIn Profile Customizer',
        message: 'Please navigate to a LinkedIn profile page to use this extension.'
      });
    }
  });
  
  // Listen for messages
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // Handle updating active tab when requested
    if (message.action === 'activateTab') {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]) {
          chrome.tabs.sendMessage(tabs[0].id as number, { action: 'initialize' });
        }
      });
      sendResponse({ success: true });
    }
    
    // Handle storage operations
    if (message.action === 'getStorageData') {
      chrome.storage.sync.get(message.keys, (result) => {
        sendResponse({ data: result });
      });
      return true; // Required for async response
    }
    
    if (message.action === 'setStorageData') {
      chrome.storage.sync.set(message.data, () => {
        sendResponse({ success: true });
      });
      return true; // Required for async response
    }
  });
  
  // Listen for tab activation
  chrome.tabs.onActivated.addListener((activeInfo) => {
    chrome.tabs.get(activeInfo.tabId, (tab) => {
      if (tab.url?.includes('linkedin.com/in/')) {
        // Send message to initialize content script if on LinkedIn profile
        chrome.tabs.sendMessage(activeInfo.tabId, { action: 'initialize' });
      }
    });
  });