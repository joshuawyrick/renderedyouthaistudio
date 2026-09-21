
import React from 'react';
import type { ProductVariant } from './types';

interface ProductOptionsProps {
  variants: ProductVariant[];
  selectedSize: string;
  selectedColor: string;
  onSizeChange: (size: string) => void;
  onColorChange: (color: string) => void;
  onPriceChange: (basePrice: number, adjustment: number) => void;
}

// Size order from smallest to largest
const SIZE_ORDER = ['Youth XS', 'Youth S', 'Youth M', 'Youth L', 'Youth XL', 'XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];

const ProductOptions: React.FC<ProductOptionsProps> = ({
  variants,
  selectedSize,
  selectedColor,
  onSizeChange,
  onColorChange,
  onPriceChange
}) => {
  // Get unique sizes and colors from variants, then sort sizes by order
  const availableSizes = [...new Set(variants.filter(v => v.is_available).map(v => v.size))]
    .sort((a, b) => {
      const aIndex = SIZE_ORDER.indexOf(a);
      const bIndex = SIZE_ORDER.indexOf(b);
      
      // If both sizes are in our predefined order, sort by that
      if (aIndex !== -1 && bIndex !== -1) {
        return aIndex - bIndex;
      }
      
      // If only one is in predefined order, that one comes first
      if (aIndex !== -1 && bIndex === -1) return -1;
      if (aIndex === -1 && bIndex !== -1) return 1;
      
      // If neither is in predefined order, sort alphabetically
      return a.localeCompare(b);
    });

  const availableColors = [...new Set(variants.filter(v => v.is_available).map(v => v.color))];

  // Find the current variant to get price adjustment
  const currentVariant = variants.find(v => 
    v.size === selectedSize && 
    v.color === selectedColor && 
    v.is_available
  );

  // Handle size change and update price
  const handleSizeChange = (size: string) => {
    onSizeChange(size);
    const variant = variants.find(v => v.size === size && v.color === selectedColor && v.is_available);
    if (variant) {
      onPriceChange(0, variant.price_adjustment); // Base price will be handled in parent
    }
  };

  // Handle color change and update price
  const handleColorChange = (color: string) => {
    onColorChange(color);
    const variant = variants.find(v => v.size === selectedSize && v.color === color && v.is_available);
    if (variant) {
      onPriceChange(0, variant.price_adjustment);
    }
  };

  return (
    <div className="space-y-6">
      {/* Size Selection */}
      {availableSizes.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-ry-black mb-3">Size</h3>
          <div className="flex gap-2 flex-wrap">
            {availableSizes.map((size) => (
              <button
                key={size}
                onClick={() => handleSizeChange(size)}
                className={`px-4 py-2 border-2 rounded-lg font-medium transition-colors ${
                  selectedSize === size
                    ? 'border-ry-yellow bg-ry-yellow text-ry-black'
                    : 'border-gray-300 text-gray-700 hover:border-gray-400'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Color Selection */}
      {availableColors.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-ry-black mb-3">Color</h3>
          <div className="flex gap-2 flex-wrap">
            {availableColors.map((color) => (
              <button
                key={color}
                onClick={() => handleColorChange(color)}
                className={`px-4 py-2 border-2 rounded-lg font-medium transition-colors ${
                  selectedColor === color
                    ? 'border-ry-yellow bg-ry-yellow text-ry-black'
                    : 'border-gray-300 text-gray-700 hover:border-gray-400'
                }`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Variant Info */}
      {currentVariant && currentVariant.price_adjustment !== 0 && (
        <div className="text-sm text-gray-600">
          {currentVariant.price_adjustment > 0 
            ? `+$${currentVariant.price_adjustment.toFixed(2)} for this variant`
            : `$${Math.abs(currentVariant.price_adjustment).toFixed(2)} discount for this variant`
          }
        </div>
      )}
    </div>
  );
};

export default ProductOptions;
