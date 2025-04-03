/**
 * React app injection logic
 */
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from '../app';
import { ProfileData } from '../types/template';

/**
 * Injects the React app into a container element
 * @param container The container element
 * @param profileData The extracted LinkedIn profile data
 * @param isVisible Whether the panel should be initially visible
 */
export function injectReactApp(
  container: HTMLElement, 
  profileData: ProfileData,
  isVisible: boolean = true
): void {
  try {
    const root = createRoot(container);
    
    // Mount the React component with profile data and visibility state
    root.render(
      React.createElement(App, { 
        profileData,
        initiallyVisible: isVisible 
      })
    );
    
    console.log('LinkedIn Profile Customizer: React app injected');
  } catch (error) {
    console.error('LinkedIn Profile Customizer: Failed to inject React app', error);
  }
}