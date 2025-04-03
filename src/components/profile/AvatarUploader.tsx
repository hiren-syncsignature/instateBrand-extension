/**
 * Avatar uploader component
 */
import React, { useState, useRef } from 'react';
import { Camera, Upload } from 'lucide-react';

interface AvatarUploaderProps {
  onUpload: (dataUrl: string) => void;
}

export const AvatarUploader: React.FC<AvatarUploaderProps> = ({ onUpload }) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsUploading(true);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        // Process image (resize if needed)
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          // Resize if image is too large
          const MAX_SIZE = 1024;
          if (width > MAX_SIZE || height > MAX_SIZE) {
            if (width > height) {
              height = Math.round((height * MAX_SIZE) / width);
              width = MAX_SIZE;
            } else {
              width = Math.round((width * MAX_SIZE) / height);
              height = MAX_SIZE;
            }
          }
          
          // Make square (crop to center)
          const size = Math.min(width, height);
          const x = (width - size) / 2;
          const y = (height - size) / 2;
          
          canvas.width = size;
          canvas.height = size;
          
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, x, y, size, size, 0, 0, size, size);
          
          // Get data URL and upload
          const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
          onUpload(dataUrl);
          setIsUploading(false);
          
          // Reset file input
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        };
        
        img.src = event.target.result as string;
      }
    };
    
    reader.readAsDataURL(file);
  };
  
  return (
    <div className="mt-2">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="sr-only"
      />
      
      <button
        onClick={handleUploadClick}
        disabled={isUploading}
        className="flex items-center justify-center w-full p-2 text-sm rounded bg-[var(--surface-light)] text-[var(--text-primary)] border border-[rgba(255,255,255,0.1)] hover:bg-[var(--surface)] transition-colors"
      >
        {isUploading ? (
          <span className="flex items-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-[var(--text-secondary)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </span>
        ) : (
          <span className="flex items-center">
            <Upload className="mr-2 h-4 w-4 text-[var(--primary)]" />
            Upload New Photo
          </span>
        )}
      </button>
    </div>
  );
};