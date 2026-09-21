
import React from 'react';
import { RYCard } from '@/components/ui/ry-card';
import { RYButton } from '@/components/ui/ry-button';
import { Input } from '@/components/ui/input';
import { Trash2 } from 'lucide-react';

interface ProductVariant {
  id?: string;
  size: string;
  color: string;
  priceAdjustment: number;
  isAvailable: boolean;
}

interface ProductVariantListProps {
  variants: ProductVariant[];
  basePrice: number;
  onUpdateVariant: (index: number, field: keyof ProductVariant, value: any) => void;
  onRemoveVariant: (index: number) => void;
}

// Size order from smallest to largest
const SIZE_ORDER = ['Youth XS', 'Youth S', 'Youth M', 'Youth L', 'Youth XL', 'XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];

const ProductVariantList: React.FC<ProductVariantListProps> = ({
  variants,
  basePrice,
  onUpdateVariant,
  onRemoveVariant
}) => {
  // Sort variants by size order, then by color
  const sortedVariants = [...variants].sort((a, b) => {
    const aIndex = SIZE_ORDER.indexOf(a.size);
    const bIndex = SIZE_ORDER.indexOf(b.size);
    
    // If both sizes are in our predefined order, sort by that
    if (aIndex !== -1 && bIndex !== -1) {
      if (aIndex !== bIndex) return aIndex - bIndex;
      // If same size, sort by color
      return a.color.localeCompare(b.color);
    }
    
    // If only one is in predefined order, that one comes first
    if (aIndex !== -1 && bIndex === -1) return -1;
    if (aIndex === -1 && bIndex !== -1) return 1;
    
    // If neither is in predefined order, sort by size then color
    if (a.size !== b.size) return a.size.localeCompare(b.size);
    return a.color.localeCompare(b.color);
  });

  // Create a mapping from sorted variants back to original indices
  const getOriginalIndex = (sortedVariant: ProductVariant, sortedIndex: number) => {
    return variants.findIndex(v => 
      v.size === sortedVariant.size && 
      v.color === sortedVariant.color &&
      v.priceAdjustment === sortedVariant.priceAdjustment
    );
  };

  return (
    <RYCard className="p-4">
      <h3 className="text-lg font-semibold mb-4">Current Variants ({variants.length})</h3>
      {variants.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No variants added yet. Use the forms above to add size and color combinations.</p>
      ) : (
        <div className="max-h-96 overflow-y-auto">
          {/* Desktop Table View */}
          <div className="hidden md:block">
            <div className="grid grid-cols-7 gap-2 items-center p-2 bg-gray-50 rounded font-medium text-sm">
              <div>Size</div>
              <div>Color</div>
              <div>Price Adj. ($)</div>
              <div>Final Price</div>
              <div>Available</div>
              <div>Status</div>
              <div>Actions</div>
            </div>
            <div className="space-y-2 mt-2">
              {sortedVariants.map((variant, sortedIndex) => {
                const originalIndex = getOriginalIndex(variant, sortedIndex);
                return (
                  <div key={`${variant.size}-${variant.color}`} className="grid grid-cols-7 gap-2 items-center p-2 border rounded">
                    <div className="font-medium text-sm">{variant.size}</div>
                    <div className="text-sm">{variant.color}</div>
                    <Input
                      type="number"
                      step="0.01"
                      value={variant.priceAdjustment}
                      onChange={(e) => onUpdateVariant(originalIndex, 'priceAdjustment', parseFloat(e.target.value) || 0)}
                      className="text-sm h-8"
                    />
                    <div className="text-sm font-medium">
                      ${(basePrice + variant.priceAdjustment).toFixed(2)}
                    </div>
                    <label className="flex items-center justify-center">
                      <input
                        type="checkbox"
                        checked={variant.isAvailable}
                        onChange={(e) => onUpdateVariant(originalIndex, 'isAvailable', e.target.checked)}
                        className="h-4 w-4"
                      />
                    </label>
                    <div className="text-xs text-gray-500">
                      {variant.isAvailable ? 'Active' : 'Disabled'}
                    </div>
                    <RYButton
                      variant="outline"
                      size="sm"
                      onClick={() => onRemoveVariant(originalIndex)}
                      className="text-red-600 hover:text-red-800 h-8 w-8 p-0"
                    >
                      <Trash2 className="w-3 h-3" />
                    </RYButton>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-3">
            {sortedVariants.map((variant, sortedIndex) => {
              const originalIndex = getOriginalIndex(variant, sortedIndex);
              return (
                <div key={`${variant.size}-${variant.color}`} className="border rounded-lg p-3 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold text-base">{variant.size} - {variant.color}</div>
                      <div className="text-sm font-medium text-green-600">
                        ${(basePrice + variant.priceAdjustment).toFixed(2)}
                      </div>
                    </div>
                    <RYButton
                      variant="outline"
                      size="sm"
                      onClick={() => onRemoveVariant(originalIndex)}
                      className="text-red-600 hover:text-red-800 h-8 w-8 p-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </RYButton>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-gray-600">Price Adjustment ($)</label>
                      <Input
                        type="number"
                        step="0.01"
                        value={variant.priceAdjustment}
                        onChange={(e) => onUpdateVariant(originalIndex, 'priceAdjustment', parseFloat(e.target.value) || 0)}
                        className="text-sm h-10 mt-1"
                      />
                    </div>
                    
                    <div>
                      <label className="text-xs font-medium text-gray-600">Available</label>
                      <div className="flex items-center mt-2">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={variant.isAvailable}
                            onChange={(e) => onUpdateVariant(originalIndex, 'isAvailable', e.target.checked)}
                            className="h-5 w-5 mr-2"
                          />
                          <span className="text-sm">
                            {variant.isAvailable ? 'Active' : 'Disabled'}
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </RYCard>
  );
};

export default ProductVariantList;
