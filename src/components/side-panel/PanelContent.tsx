/**
 * Panel content component
 */
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { BannerEditor } from '../banner/BannerEditor';
import { ProfileEditor } from '../profile/ProfileEditor';
import { ProfileData } from '../../types/template';

interface PanelContentProps {
  activeTab: 'banner' | 'profile';
  profileData: ProfileData | null;
}

export const PanelContent: React.FC<PanelContentProps> = ({
  activeTab,
  profileData
}) => {
  return (
    <div className="flex-1 overflow-y-auto">
      {activeTab === 'banner' ? (
        <BannerEditor profileData={profileData} />
      ) : (
        <ProfileEditor profileData={profileData} />
      )}
    </div>
  );
};