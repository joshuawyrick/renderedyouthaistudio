
import React from 'react';
import { RYCard } from '@/components/ui/ry-card';
import { RYButton } from '@/components/ui/ry-button';

interface FallbackDesign {
  id: string;
  title: string;
  price: number;
  creatorName: string;
  creatorAge: string;
}

const fallbackDesigns: FallbackDesign[] = [
  {
    id: 'fallback-1',
    title: "Rainbow Dragon",
    price: 24.99,
    creatorName: "Emma",
    creatorAge: "8"
  },
  {
    id: 'fallback-2',
    title: "Space Adventure",
    price: 24.99,
    creatorName: "Lucas",
    creatorAge: "10"
  },
  {
    id: 'fallback-3',
    title: "Flower Power",
    price: 24.99,
    creatorName: "Sofia",
    creatorAge: "7"
  },
  {
    id: 'fallback-4',
    title: "Superhero Cat",
    price: 24.99,
    creatorName: "Max",
    creatorAge: "9"
  }
];

const FeaturedSectionFallbackGrid: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
      {fallbackDesigns.map((design) => (
        <RYCard key={design.id} className="p-0 overflow-hidden">
          {/* Design Image Placeholder */}
          <div className="aspect-square bg-gray-100 flex items-center justify-center border-b border-gray-200">
            <div className="text-center">
              <div className="text-4xl mb-2">👕</div>
              <p className="text-sm text-gray-500">{design.title}</p>
            </div>
          </div>
          
          <div className="p-4">
            <h3 className="font-semibold text-ry-black mb-1">
              {design.title}
            </h3>
            <p className="text-sm text-gray-600 mb-2">
              by {design.creatorName}, age {design.creatorAge}
            </p>
            <div className="flex justify-between items-center">
              <span className="font-bold text-ry-black">
                ${design.price.toFixed(2)}
              </span>
              <RYButton variant="primary" size="sm">
                View
              </RYButton>
            </div>
          </div>
        </RYCard>
      ))}
    </div>
  );
};

export default FeaturedSectionFallbackGrid;
