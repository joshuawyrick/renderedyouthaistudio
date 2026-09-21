
import React from 'react';
import { RYCard } from '@/components/ui/ry-card';
import DesignCard from './DesignCard';
import type { Design, Product } from './types';

interface ProductCreationTabProps {
  availableDesigns: Design[];
  creating: string | null;
  onCreateProduct: (design: Design) => void;
  products: Product[];
  onProductDeleted: () => void;
}

const ProductCreationTab: React.FC<ProductCreationTabProps> = ({
  availableDesigns,
  creating,
  onCreateProduct,
  products,
  onProductDeleted
}) => {

  // Helper function to check if a design already has a product
  const getProductForDesign = (designId: string) => {
    const product = products.find(product => product.design_id === designId);
    return product;
  };

  const handleProductDeleted = async () => {
    // Force a complete refresh of all data
    await onProductDeleted();
  };

  return (
    <div className="space-y-4">
      <p className="text-gray-600">
        Convert published designs into sellable products or manage existing products
      </p>
      
      {availableDesigns.length === 0 ? (
        <RYCard className="p-8 text-center">
          <p className="text-gray-500">No designs available for product creation</p>
          <p className="text-sm text-gray-400 mt-1">
            All published designs have already been converted to products
          </p>
        </RYCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {availableDesigns.map((design) => {
            const existingProduct = getProductForDesign(design.id);
            
            return (
              <DesignCard
                key={design.id}
                design={design}
                creating={creating}
                onCreateProduct={onCreateProduct}
                onProductDeleted={handleProductDeleted}
                hasExistingProduct={!!existingProduct}
                existingProductId={existingProduct?.id}
                existingProductTitle={existingProduct?.title}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProductCreationTab;
