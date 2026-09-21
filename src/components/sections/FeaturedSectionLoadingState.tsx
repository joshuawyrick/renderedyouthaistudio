
import React from 'react';
import { RYCard } from '@/components/ui/ry-card';

const FeaturedSectionLoadingState: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
      {[1, 2, 3, 4].map((i) => (
        <RYCard key={i} className="p-0 overflow-hidden">
          <div className="aspect-square bg-gray-100 animate-pulse"></div>
          <div className="p-4">
            <div className="h-4 bg-gray-200 rounded mb-2 animate-pulse"></div>
            <div className="h-3 bg-gray-200 rounded mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
          </div>
        </RYCard>
      ))}
    </div>
  );
};

export default FeaturedSectionLoadingState;
