/**
 * Main React App component for LinkedIn Profile Customizer
 */
import React, { useEffect, useState } from 'react';
import { SidePanel } from './components/side-panel/SidePanel';
import { ProfileData } from './types/template';

interface AppProps {
  profileData: ProfileData | null;
  initiallyVisible?: boolean;
}

const App: React.FC<AppProps> = ({ profileData, initiallyVisible = true }) => {
  const [isLinkedInProfile, setIsLinkedInProfile] = useState(false);
  const [isPanelVisible, setIsPanelVisible] = useState(initiallyVisible);

  // Check if current page is a LinkedIn profile
  useEffect(() => {
    const checkPage = () => {
      const isProfile = window.location.href.includes('linkedin.com/in/');
      setIsLinkedInProfile(isProfile);
    };

    checkPage();

    // Listen for URL changes
    const observer = new MutationObserver(() => {
      checkPage();
    });

    observer.observe(document.querySelector('head > title') as Node, {
      subtree: true,
      characterData: true,
      childList: true
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  // Listen for toggle messages
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Only accept messages from our extension
      if (event.source !== window) return;
      
      const message = event.data;
      
      // Handle panel toggle request
      if (message.type === 'LINKEDIN_CUSTOMIZER_TOGGLE_PANEL') {
        setIsPanelVisible(message.visible);
      }
    };
    
    window.addEventListener('message', handleMessage);
    
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  // Notify content script when panel visibility changes
  useEffect(() => {
    window.postMessage(
      { 
        type: 'LINKEDIN_CUSTOMIZER_SET_PANEL_VISIBILITY', 
        visible: isPanelVisible 
      }, 
      '*'
    );
  }, [isPanelVisible]);

  // Don't render anything if not on a LinkedIn profile page
  if (!isLinkedInProfile) {
    return null;
  }

  return (
    <div className="font-sans text-gray-900">
      <SidePanel 
        profileData={profileData} 
        isVisible={isPanelVisible}
        onVisibilityChange={setIsPanelVisible}
      />
    </div>
  );
};

export default App;