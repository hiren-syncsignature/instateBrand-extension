/**
 * Panel header component
 */
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Info } from 'lucide-react';

interface PanelHeaderProps {
  activeTab: 'banner' | 'profile';
  setActiveTab: (tab: 'banner' | 'profile') => void;
}

export const PanelHeader: React.FC<PanelHeaderProps> = ({
  activeTab,
  setActiveTab
}) => {
  return (
    <div className="flex flex-col p-4 border-b border-[rgba(255,255,255,0.1)] panel-header">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">
          LinkedIn Customizer
        </h2>
        
        <div className="flex items-center space-x-2">
          <button 
            className="text-xs text-[var(--primary)] hover:text-[var(--primary-dark)] flex items-center"
            onClick={(e) => {
              e.preventDefault();
              // Show help modal or documentation
            }}
          >
            <Info className="w-4 h-4 mr-1" />
            Help
          </button>
        </div>
      </div>
      
      <div className="bg-[var(--surface)] rounded-md p-1">
        <div className="grid grid-cols-2 gap-1">
          <button
            className={`py-2 px-4 rounded-md text-sm transition-colors ${
              activeTab === 'banner'
                ? 'bg-[var(--primary)] text-white'
                : 'bg-transparent text-[var(--text-secondary)] hover:bg-[var(--surface-light)]'
            }`}
            onClick={() => setActiveTab('banner')}
          >
            Banner Editor
          </button>
          <button
            className={`py-2 px-4 rounded-md text-sm transition-colors ${
              activeTab === 'profile'
                ? 'bg-[var(--primary)] text-white'
                : 'bg-transparent text-[var(--text-secondary)] hover:bg-[var(--surface-light)]'
            }`}
            onClick={() => setActiveTab('profile')}
          >
            Profile Picture
          </button>
        </div>
      </div>
    </div>
  );
};