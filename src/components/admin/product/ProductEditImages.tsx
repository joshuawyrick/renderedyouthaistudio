
import React from 'react';
import { RYCard } from '@/components/ui/ry-card';
import ProductImageManager from '@/components/product/ProductImageManager';
import type { ProductImage } from '@/services/productImageService';

interface ProductEditImagesProps {
  productId: string;
  images: ProductImage[];
  onImagesUpdate: (images: ProductImage[]) => void;
}

const ProductEditImages: React.FC<ProductEditImagesProps> = ({
  productId,
  images,
  onImagesUpdate
}) => {
  return (
    <RYCard className="p-4">
      <h3 className="text-lg font-semibold mb-4">Product Images</h3>
      <ProductImageManager
        productId={productId}
        images={images}
        onImagesUpdate={onImagesUpdate}
      />
    </RYCard>
  );
};

export default ProductEditImages;
