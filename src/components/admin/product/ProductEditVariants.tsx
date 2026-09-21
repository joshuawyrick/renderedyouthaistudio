
import React from 'react';
import ProductVariantManager from './ProductVariantManager';

interface ProductVariant {
  id?: string;
  size: string;
  color: string;
  priceAdjustment: number;
  isAvailable: boolean;
}

interface ProductEditVariantsProps {
  variants: ProductVariant[];
  basePrice: number;
  onVariantsChange: (variants: ProductVariant[]) => void;
}

const ProductEditVariants: React.FC<ProductEditVariantsProps> = ({
  variants,
  basePrice,
  onVariantsChange
}) => {
  return (
    <ProductVariantManager
      variants={variants}
      basePrice={basePrice}
      onVariantsChange={onVariantsChange}
    />
  );
};

export default ProductEditVariants;
