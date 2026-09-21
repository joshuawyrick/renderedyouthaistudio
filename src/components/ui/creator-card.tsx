
import React from 'react';
import { RYCard } from '@/components/ui/ry-card';
import { RYButton } from '@/components/ui/ry-button';
import { cn } from "@/lib/utils";

interface CreatorCardProps {
  creator: {
    id: string;
    displayName: string;
    username: string;
    ageBracket?: string;
    state?: string;
    avatarUrl?: string;
    designCount?: number;
  };
  className?: string;
}

const CreatorCard = ({ creator, className }: CreatorCardProps) => {
  return (
    <RYCard className={cn(
      "text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-xl cursor-pointer",
      className
    )}>
      {/* Avatar */}
      <div className="flex justify-center mb-4">
        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center border-2 border-ry-yellow">
          {creator.avatarUrl ? (
            <img 
              src={creator.avatarUrl} 
              alt={creator.displayName}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <span className="text-2xl">👤</span>
          )}
        </div>
      </div>

      {/* Creator Info */}
      <h3 className="text-lg font-semibold text-ry-black mb-2">
        {creator.displayName}
      </h3>

      {/* Age and State Tags */}
      <div className="flex justify-center gap-2 mb-4">
        {creator.ageBracket && (
          <span className="px-2 py-1 bg-ry-yellow text-ry-black text-xs rounded-lg font-medium">
            Ages {creator.ageBracket}
          </span>
        )}
        {creator.state && (
          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-lg font-medium">
            {creator.state}
          </span>
        )}
      </div>

      {/* Design Count */}
      {creator.designCount !== undefined && (
        <p className="text-sm text-gray-600 mb-4">
          {creator.designCount} design{creator.designCount !== 1 ? 's' : ''}
        </p>
      )}

      {/* Shop Button */}
      <RYButton 
        variant="primary" 
        size="sm"
        onClick={() => window.location.href = `/creator/${creator.id}`}
      >
        Shop Collection
      </RYButton>
    </RYCard>
  );
};

export { CreatorCard };
