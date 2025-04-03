/**
 * Template selector component
 */
import React from 'react';
import { BannerTemplate } from '../../types/template';

interface TemplateSelectorProps {
  templates: BannerTemplate[];
  activeTemplateId: string;
  onChange: (templateId: string) => void;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  templates,
  activeTemplateId,
  onChange
}) => {
  return (
    <div className="space-y-3">
      <div className="flex overflow-x-auto pb-2 gap-2">
        {templates.map((template) => (
          <div
            key={template.id}
            className={`relative cursor-pointer template-card min-w-32 transition-all duration-200 ${
              activeTemplateId === template.id 
                ? 'ring-2 ring-[var(--primary)] scale-105' 
                : 'hover:ring-1 hover:ring-[rgba(255,255,255,0.3)]'
            }`}
            onClick={() => onChange(template.id)}
          >
            <div 
              className="w-32 h-18 rounded-md overflow-hidden"
              style={{
                background: template.background.type === 'image' 
                  ? `url(${template.background.value}) center/cover`
                  : template.background.type === 'gradient'
                  ? template.background.value
                  : template.background.value
              }}
            >
              {/* Show text sample */}
              {template.textElements.some(el => el.isTitle) && (
                <div
                  className="absolute bottom-2 left-2 text-xs font-bold"
                  style={{ 
                    color: template.textElements.find(el => el.isTitle)?.color || '#fff',
                    textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
                  }}
                >
                  Sample Title
                </div>
              )}
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 text-center text-xs text-white bg-black bg-opacity-50 py-1">
              {template.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};