
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

interface TuckersTeesProductDisplayProps {
  products: TuckersProduct[];
  loading: boolean;
}

const TuckersTeesProductDisplay: React.FC<TuckersTeesProductDisplayProps> = ({ 
  products, 
  loading 
}) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-lg">
        <div className="flex items-center justify-center h-48 bg-gray-100 rounded-lg mb-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ry-yellow mx-auto mb-2"></div>
            <p className="text-gray-500 text-sm">Loading designs...</p>
          </div>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-lg">
        <div className="flex items-center justify-center h-48 bg-gray-100 rounded-lg mb-4">
          <div className="text-center">
            <div className="text-4xl mb-2">🎨</div>
            <p className="text-gray-500 text-sm">No designs yet</p>
            <p className="text-xs text-gray-400 mt-1">Assign designs to see them here</p>
          </div>
        </div>
        <div className="text-center">
          <h4 className="font-semibold text-ry-black">Tucker's Collection</h4>
          <p className="text-sm text-gray-600">Coming Soon</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Use ProductCard for the first product to make it clickable */}
      {products.slice(0, 1).map((product) => (
        <div key={product.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
          <ProductCard product={product} />
        </div>
      ))}
      
      {products.length > 1 && (
        <div className="text-center">
          <p className="text-sm text-gray-600">
            +{products.length - 1} more design{products.length > 2 ? 's' : ''}
          </p>
        </div>
      )}
    </div>
  );
};

export default TuckersTeesProductDisplay;
