
import React from 'react';
import { Heart } from 'lucide-react';
import { RYButton } from '@/components/ui/ry-button';

interface TuckersTeesStoryProps {
  onViewAllClick: () => void;
}

const TuckersTeesStory: React.FC<TuckersTeesStoryProps> = ({ onViewAllClick }) => {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Heart className="w-5 h-5 text-red-500 fill-current" />
        <span className="text-sm font-medium text-ry-yellow bg-ry-yellow/10 px-3 py-1 rounded-full">
          Co-Founder Collection
        </span>
      </div>
      <h3 className="text-2xl font-bold text-ry-black mb-4">
        Where It All Started
      </h3>
      <p className="text-gray-600 mb-6 leading-relaxed">
        Tucker's creative vision was the spark that started Rendered Youth. Originally conceived as "Tucker's Tees," 
        this platform has grown to celebrate the artistic talents of all young creators. Explore Tucker's original 
        designs that started this amazing journey.
      </p>
      <RYButton 
        onClick={onViewAllClick}
        className="bg-ry-yellow hover:bg-ry-yellow/90"
      >
        View All Tucker's Designs
      </RYButton>
    </div>
  );
};

export default TuckersTeesStory;
