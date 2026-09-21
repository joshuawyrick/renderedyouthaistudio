
import React from 'react';
import { RYButton } from '@/components/ui/ry-button';

interface Design {
  id: string;
  title: string;
  file_url: string;
  profiles?: {
    first_name: string;
    last_name: string;
  };
}

interface TuckersDesignCardProps {
  design: Design;
  isAssigning: boolean;
  onAction: (designId: string) => void;
  actionText: string;
  actionLoadingText: string;
  variant?: 'primary' | 'secondary';
  className?: string;
}

const TuckersDesignCard = ({ 
  design, 
  isAssigning, 
  onAction, 
  actionText, 
  actionLoadingText,
  variant = 'primary',
  className = ''
}: TuckersDesignCardProps) => {
  return (
    <div className={`border rounded-lg p-4 ${className}`}>
      <div className="aspect-square bg-gray-100 rounded-lg mb-3 overflow-hidden">
        <img 
          src={design.file_url} 
          alt={design.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            target.nextElementSibling!.textContent = '🎨';
          }}
        />
        <div className="w-full h-full flex items-center justify-center text-4xl hidden">🎨</div>
      </div>
      <h4 className="font-medium text-ry-black mb-1">{design.title}</h4>
      <p className="text-sm text-gray-600 mb-3">
        By {design.profiles?.first_name} {design.profiles?.last_name}
      </p>
      <RYButton
        variant={variant}
        size="sm"
        onClick={() => onAction(design.id)}
        disabled={isAssigning}
        className={`w-full ${variant === 'primary' ? 'bg-ry-yellow hover:bg-ry-yellow/90' : ''}`}
      >
        {isAssigning ? actionLoadingText : actionText}
      </RYButton>
    </div>
  );
};

export default TuckersDesignCard;
