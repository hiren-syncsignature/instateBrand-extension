/**
 * Color picker component
 */
import React, { useState, useEffect } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ color, onChange }) => {
  const [selectedColor, setSelectedColor] = useState(color || '#ffffff');
  
  useEffect(() => {
    setSelectedColor(color);
  }, [color]);
  
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setSelectedColor(newColor);
    onChange(newColor);
  };
  
  // Predefined colors
  const presetColors = [
    '#ffffff', // White
    '#000000', // Black
    '#0A66C2', // LinkedIn Blue
    '#2977C9', // Lighter Blue
    '#00A0DC', // Sky Blue
    '#E7A33E', // Gold
    '#C37D16', // Brown
    '#F5987E', // Salmon
    '#D6293E', // Red
    '#E9E5DF', // Light Gray
    '#F3F2F1', // Off-White
    '#86888A', // Medium Gray
  ];
  
  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center gap-2">
        <div 
          className="w-8 h-8 rounded-md border border-[rgba(255,255,255,0.1)]"
          style={{ backgroundColor: selectedColor }}
        />
        
        <input
          type="text"
          value={selectedColor}
          onChange={(e) => {
            setSelectedColor(e.target.value);
            onChange(e.target.value);
          }}
          className="w-24 h-8 text-sm bg-[var(--surface-light)] text-[var(--text-primary)] border border-[rgba(255,255,255,0.1)] rounded p-1"
        />
        
        <button
          className="px-2 py-1 text-xs bg-[var(--surface)] text-[var(--text-primary)] hover:bg-[var(--surface-light)] rounded border border-[rgba(255,255,255,0.1)]"
          onClick={() => {
            // Show color presets dropdown (simplified version)
            const dropdown = document.getElementById(`color-presets-${selectedColor}`);
            if (dropdown) {
              dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
            }
          }}
        >
          Presets
        </button>
      </div>
      
      <div 
        id={`color-presets-${selectedColor}`} 
        className="grid grid-cols-6 gap-1 mt-2" 
        style={{ display: 'none' }}
      >
        {presetColors.map((presetColor) => (
          <button
            key={presetColor}
            className="w-8 h-8 rounded-md border border-[rgba(255,255,255,0.1)] cursor-pointer transition-transform hover:scale-110"
            style={{ backgroundColor: presetColor }}
            onClick={() => {
              setSelectedColor(presetColor);
              onChange(presetColor);
              document.getElementById(`color-presets-${selectedColor}`)!.style.display = 'none';
            }}
            aria-label={`Select color ${presetColor}`}
          />
        ))}
      </div>
      
      <input
        type="color"
        value={selectedColor}
        onChange={handleColorChange}
        className="w-full h-8"
      />
    </div>
  );
};