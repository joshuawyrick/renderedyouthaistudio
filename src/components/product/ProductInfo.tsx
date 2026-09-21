
import React from 'react';
import { Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { ProductDetail } from './types';

interface ProductInfoProps {
  product: ProductDetail;
}

const ProductInfo: React.FC<ProductInfoProps> = ({ product }) => {
  const navigate = useNavigate();

  const handleCreatorClick = () => {
    // Navigate to creator page using the creator's user_id
    navigate(`/creator/${product.designs.user_id}`);
  };

  // Get creator display name
  const creatorFirstName = product.designs.profiles?.first_name || 'Unknown';
  const creatorLastName = product.designs.profiles?.last_name || 'Creator';
  const creatorFullName = `${creatorFirstName} ${creatorLastName}`.trim();

  return (
    <div className="space-y-6">
      {/* Title and Creator */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-ry-black mb-3">
          {product.title}
        </h1>
        
        {/* Creator Info Section - Enhanced Layout */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Created by + Name in one group */}
          <div className="flex items-center gap-2">
            <span className="text-sm sm:text-base text-gray-600 whitespace-nowrap">Created by</span>
            <button
              onClick={handleCreatorClick}
              className="text-sm sm:text-base font-medium text-ry-black hover:text-ry-yellow transition-colors underline decoration-2 underline-offset-2 hover:decoration-ry-yellow"
            >
              {creatorFullName}
            </button>
          </div>
          
          {/* Age Badge - Compact design */}
          {product.designs.profiles?.age_bracket && (
            <span className="inline-flex items-center px-2.5 py-0.5 bg-ry-yellow text-ry-black text-xs sm:text-sm font-medium rounded-full whitespace-nowrap">
              Age {product.designs.profiles.age_bracket}
            </span>
          )}
        </div>
      </div>

      {/* Price */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <span className="text-3xl font-bold text-ry-black">
          ${Number(product.price).toFixed(2)}
        </span>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star key={star} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
          ))}
          <span className="text-gray-600 ml-2">(42 reviews)</span>
        </div>
      </div>

      {/* Product Description */}
      {product.description && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-ry-black mb-2">About This Design</h3>
          <p className="text-gray-700 leading-relaxed">
            {product.description}
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductInfo;
