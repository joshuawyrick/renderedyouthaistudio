
import React from 'react';
import { ProductCard } from '@/components/ui/product-card';

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

interface TuckersTeesGridProps {
  products: TuckersProduct[];
}

const TuckersTeesGrid: React.FC<TuckersTeesGridProps> = ({ products }) => {
  if (products.length <= 1) {
    return null;
  }

  return (
    <div className="mt-8 pt-8 border-t border-ry-yellow/20">
      <h4 className="text-lg font-semibold text-ry-black mb-4 text-center">More from Tucker's Collection</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {products.slice(1).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default TuckersTeesGrid;
