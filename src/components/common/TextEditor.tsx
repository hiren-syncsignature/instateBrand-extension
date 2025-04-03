/**
 * Text editor component
 */
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { ColorPicker } from './ColorPicker';

interface TextEditorProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  color: string;
  onColorChange: (color: string) => void;
}

export const TextEditor: React.FC<TextEditorProps> = ({
  label,
  value,
  onChange,
  color,
  onColorChange
}) => {
  const [text, setText] = useState(value);
  
  useEffect(() => {
    setText(value);
  }, [value]);
  
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    onChange(newText);
  };
  
  return (
    <div className="space-y-2">
      <Label className="text-xs text-[var(--text-secondary)]">{label}</Label>
      
      <textarea
        value={text}
        onChange={handleTextChange}
        className="min-h-[60px] text-sm w-full p-2 rounded bg-[var(--surface-light)] text-[var(--text-primary)] border border-[rgba(255,255,255,0.1)] focus:ring-1 focus:ring-[var(--primary)] focus:outline-none"
        placeholder={`Enter ${label.toLowerCase()} text...`}
      />
      
      <div>
        <Label className="text-xs block mb-1 text-[var(--text-secondary)]">Text Color</Label>
        <ColorPicker 
          color={color}
          onChange={onColorChange}
        />
      </div>
    </div>
  );
};