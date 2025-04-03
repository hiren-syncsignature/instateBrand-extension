export interface TextElement {
    id: string;
    content: string;
    position: 'top-left' | 'top-center' | 'top-right' | 'center-left' | 'center' | 'center-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
    color: string;
    fontSize: number;
    fontWeight: 'normal' | 'bold' | 'light';
    fontFamily: string;
    isSlogan?: boolean;
    isTitle?: boolean;
    isCallToAction?: boolean;
}

export interface TemplateBackground {
    type: 'color' | 'gradient' | 'image';
    value: string; // HEX color, gradient string, or image URL
}

export interface BannerTemplate {
    id: string;
    name: string;
    thumbnail: string;
    background: TemplateBackground;
    textElements: TextElement[];
    showProfilePicture: boolean;
    profilePictureSize: 'small' | 'medium' | 'large';
    profilePicturePosition: 'left' | 'center' | 'right';
    profilePictureBorder: boolean;
    profilePictureBorderColor?: string;
    profilePictureBorderWidth?: number;
}

export interface ProfileData {
    name: string;
    title: string;
    company: string;
    location: string;
    profilePictureUrl: string;
    bannerImageUrl: string;
}

export interface CustomizationSettings {
    activeTemplateId: string;
    customBackgroundImage?: string;
    customProfileImage?: string;
    customTextElements: { [key: string]: Partial<TextElement> };
    customColors: {
        background?: string;
        profileBorder?: string;
    };
}