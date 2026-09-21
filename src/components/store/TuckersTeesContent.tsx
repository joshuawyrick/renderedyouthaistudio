
import React from 'react';
import { RYCard } from '@/components/ui/ry-card';
import TuckersTeesStory from './TuckersTeesStory';
import TuckersTeesProductDisplay from './TuckersTeesProductDisplay';
import TuckersTeesGrid from './TuckersTeesGrid';

interface TuckersProduct {
  id: string;
  title: string;
  slug: string;
  price: number;
  creatorName: string;
  creatorAge: string;
  creatorState: string;
  creatorUserId: string;
  imageUrl?: string;
  collectionId?: string;
  design?: {
    file_url: string;
  };
  variants?: Array<{
    id: string;
    size: string;
    color: string;
    price_adjustment: number;
    is_available: boolean;
  }>;
}

interface TuckersTeesContentProps {
  products: TuckersProduct[];
  loading: boolean;
  onViewAllClick: () => void;
}

const TuckersTeesContent: React.FC<TuckersTeesContentProps> = ({ 
  products, 
  loading, 
  onViewAllClick 
}) => {
  return (
    <RYCard className="bg-gradient-to-br from-ry-yellow/10 to-ry-yellow/5 border-ry-yellow/20 p-8">
      <div className="grid md:grid-cols-2 gap-8 items-start">
        <TuckersTeesStory onViewAllClick={onViewAllClick} />
        
        <div className="relative">
          <TuckersTeesProductDisplay products={products} loading={loading} />
          
          {/* Decorative elements */}
          <div className="absolute -top-4 -right-4 w-8 h-8 bg-ry-yellow rounded-full opacity-20"></div>
          <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-ry-yellow rounded-full opacity-30"></div>
        </div>
      </div>

      <TuckersTeesGrid products={products} />
    </RYCard>
  );
};

export default TuckersTeesContent;
