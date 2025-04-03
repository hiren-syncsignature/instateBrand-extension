/**
 * Side panel component
 */
import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Settings, Image, Download } from 'lucide-react';
import { PanelHeader } from './PanelHeader';
import { PanelContent } from './PanelContent';
import { ProfileData } from '../../types/template';

interface SidePanelProps {
  profileData: ProfileData | null;
  isVisible: boolean;
  onVisibilityChange: (visible: boolean) => void;
}

export const SidePanel: React.FC<SidePanelProps> = ({ 
  profileData,
  isVisible,
  onVisibilityChange
}) => {
  const [activeTab, setActiveTab] = useState<'banner' | 'profile'>('banner');
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Toggle panel collapsed/expanded state
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Handle visibility toggle from outside
  useEffect(() => {
    // If panel becomes visible, ensure it's not collapsed
    if (isVisible) {
      setIsCollapsed(false);
    }
  }, [isVisible]);

  // If panel is not visible, don't render anything
  if (!isVisible) {
    return (
      <div
        className="fixed top-1/2 right-0 transform -translate-y-1/2 z-50"
      >
        <button
          onClick={() => onVisibilityChange(true)}
          className="bg-[var(--primary)] text-white rounded-l-lg p-2 shadow-md hover:bg-[var(--primary-dark)] transition-colors"
          aria-label="Show customizer panel"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>
    );
  }

  // Deactivate customizer and hide panel
  const deactivateCustomizer = () => {
    // Send message to content script to deactivate
    window.postMessage(
      { type: 'LINKEDIN_CUSTOMIZER_DEACTIVATE' },
      '*'
    );
  };

  return (
    <div 
      className={`fixed top-0 right-0 h-full shadow-lg transition-all duration-300 z-50 flex side-panel ${
        isCollapsed ? 'w-14' : 'w-80'
      }`}
    >
      {/* Collapsed toggle button */}
      <div className="absolute top-1/2 -left-10 transform -translate-y-1/2">
        <button
          onClick={toggleCollapse}
          className="bg-[var(--primary)] text-white rounded-l-lg p-2 shadow-md hover:bg-[var(--primary-dark)] transition-colors"
          aria-label={isCollapsed ? 'Expand panel' : 'Collapse panel'}
        >
          {isCollapsed ? (
            <ChevronLeft className="w-5 h-5" />
          ) : (
            <ChevronRight className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Close button */}
      <div className="absolute top-16 -left-10">
        <button
          onClick={deactivateCustomizer}
          className="bg-[var(--error)] text-white rounded-l-lg p-2 shadow-md hover:opacity-90 transition-colors"
          aria-label="Deactivate customizer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Panel content */}
      <div className={`flex flex-col w-full overflow-hidden ${isCollapsed ? 'opacity-0' : 'opacity-100'}`}>
        <PanelHeader 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
        />
        
        <PanelContent 
          activeTab={activeTab}
          profileData={profileData}
        />
      </div>
      
      {/* Collapsed icon view */}
      {isCollapsed && (
        <div className="flex flex-col items-center w-full pt-16 bg-[var(--background)] h-full">
          <button 
            onClick={() => {
              setActiveTab('banner');
              setIsCollapsed(false);
            }}
            className="p-3 mb-4 hover:bg-[var(--surface)] rounded-md transition-colors text-[var(--text-primary)]"
            aria-label="Edit banner"
          >
            <Image className="w-6 h-6" />
          </button>
          
          <button 
            onClick={() => {
              setActiveTab('profile');
              setIsCollapsed(false);
            }}
            className="p-3 mb-4 hover:bg-[var(--surface)] rounded-md transition-colors text-[var(--text-primary)]"
            aria-label="Edit profile picture"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="8" r="5" />
              <path d="M20 21a8 8 0 10-16 0" />
            </svg>
          </button>
          
          <button 
            onClick={() => {
              // Handle download both
              setIsCollapsed(false);
            }}
            className="p-3 mb-4 hover:bg-[var(--surface)] rounded-md transition-colors text-[var(--text-primary)]"
            aria-label="Download assets"
          >
            <Download className="w-6 h-6" />
          </button>
          
          <button 
            onClick={() => {
              // Handle settings
              setIsCollapsed(false);
            }}
            className="p-3 mb-4 hover:bg-[var(--surface)] rounded-md transition-colors text-[var(--text-primary)]"
            aria-label="Settings"
          >
            <Settings className="w-6 h-6" />
          </button>
        </div>
      )}
    </div>
  );
};