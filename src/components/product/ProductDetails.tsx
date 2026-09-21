
import React from 'react';
import { RYCard } from '@/components/ui/ry-card';
import { RYButton } from '@/components/ui/ry-button';
import { useNavigate } from 'react-router-dom';
import type { ProductDetail } from './types';

interface ProductDetailsProps {
  product: ProductDetail;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
  const navigate = useNavigate();

  const handleViewCreatorProfile = () => {
    navigate(`/creator/${product.designs.user_id}`);
  };

  // Get creator display name
  const creatorFirstName = product.designs.profiles?.first_name || 'Unknown';
  const creatorLastName = product.designs.profiles?.last_name || 'Creator';
  const creatorFullName = `${creatorFirstName} ${creatorLastName}`.trim();

  return (
    <div className="space-y-6">
      {/* Product Info */}
      <RYCard className="p-6">
        <h3 className="text-lg font-semibold text-ry-black mb-4">Product Details</h3>
        <div className="space-y-2 text-gray-600">
          <p>• 100% Cotton</p>
          <p>• Machine washable</p>
          <p>• Printed with eco-friendly inks</p>
          <p>• Supporting young artists</p>
          <p>• High-quality screen printing</p>
        </div>
      </RYCard>

      {/* Creator Support Message */}
      <RYCard className="p-6 bg-yellow-50 border-yellow-200">
        <h3 className="text-lg font-semibold text-ry-black mb-2">
          Supporting Young Artists 🎨
        </h3>
        <p className="text-gray-700 mb-4">
          By purchasing this design, you're directly supporting{' '}
          <button
            onClick={handleViewCreatorProfile}
            className="font-medium text-ry-black hover:text-ry-yellow transition-colors underline decoration-2 underline-offset-2 hover:decoration-ry-yellow"
          >
            {creatorFirstName}
          </button>{' '}
          and helping young artists turn their creativity into income. 70% of your purchase goes 
          directly to the creator!
        </p>
        <RYButton
          variant="secondary"
          size="sm"
          onClick={handleViewCreatorProfile}
          className="w-full sm:w-auto"
        >
          View {creatorFirstName}'s Profile
        </RYButton>
      </RYCard>
    </div>
  );
};

export default ProductDetails;
