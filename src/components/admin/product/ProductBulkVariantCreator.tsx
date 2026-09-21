
import React, { useState } from 'react';
import { RYCard } from '@/components/ui/ry-card';
import { RYButton } from '@/components/ui/ry-button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';

interface ProductVariant {
  id?: string;
  size: string;
  color: string;
  priceAdjustment: number;
  isAvailable: boolean;
}

interface ProductBulkVariantCreatorProps {
  variants: ProductVariant[];
  onVariantsChange: (variants: ProductVariant[]) => void;
}

const PREDEFINED_SIZES = ['Youth XS', 'Youth S', 'Youth M', 'Youth L', 'Youth XL', 'XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];
const PREDEFINED_COLORS = ['Black', 'White', 'Navy', 'Gray', 'Red', 'Green', 'Blue', 'Purple', 'Yellow', 'Orange', 'Pink', 'Brown'];

const ProductBulkVariantCreator: React.FC<ProductBulkVariantCreatorProps> = ({
  variants,
  onVariantsChange
}) => {
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const { toast } = useToast();

  const handleSizeToggle = (size: string, checked: boolean) => {
    if (checked) {
      setSelectedSizes(prev => [...prev, size]);
    } else {
      setSelectedSizes(prev => prev.filter(s => s !== size));
    }
  };

  const handleAddBulkVariants = () => {
    if (!selectedColor || selectedSizes.length === 0) {
      toast({
        title: "Error",
        description: "Please select a color and at least one size",
        variant: "destructive",
      });
      return;
    }

    const newVariants: ProductVariant[] = [];
    const existingCombinations = variants.map(v => `${v.size}-${v.color}`);

    selectedSizes.forEach(size => {
      const combination = `${size}-${selectedColor}`;
      if (!existingCombinations.includes(combination)) {
        newVariants.push({
          size,
          color: selectedColor,
          priceAdjustment: 0,
          isAvailable: true
        });
      }
    });

    if (newVariants.length === 0) {
      toast({
        title: "Info",
        description: "All selected size and color combinations already exist",
        variant: "destructive",
      });
      return;
    }

    onVariantsChange([...variants, ...newVariants]);
    setSelectedColor('');
    setSelectedSizes([]);

    toast({
      title: "Success",
      description: `Added ${newVariants.length} new variants for ${selectedColor}`,
    });
  };

  const selectAllSizes = () => {
    setSelectedSizes([...PREDEFINED_SIZES]);
  };

  const clearAllSizes = () => {
    setSelectedSizes([]);
  };

  return (
    <RYCard className="p-4">
      <h3 className="text-lg font-semibold mb-4">Bulk Add Variants by Color</h3>
      
      <div className="space-y-4">
        <div>
          <Label>Select Color</Label>
          <Select value={selectedColor} onValueChange={setSelectedColor}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a color" />
            </SelectTrigger>
            <SelectContent>
              {PREDEFINED_COLORS.map(color => (
                <SelectItem key={color} value={color}>{color}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedColor && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Select Sizes for {selectedColor}</Label>
              <div className="flex gap-2">
                <RYButton variant="outline" size="sm" onClick={selectAllSizes}>
                  Select All
                </RYButton>
                <RYButton variant="outline" size="sm" onClick={clearAllSizes}>
                  Clear All
                </RYButton>
              </div>
            </div>
            
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {PREDEFINED_SIZES.map(size => {
                const isExisting = variants.some(v => v.size === size && v.color === selectedColor);
                return (
                  <div key={size} className="flex items-center space-x-2">
                    <Checkbox
                      id={`size-${size}`}
                      checked={selectedSizes.includes(size)}
                      disabled={isExisting}
                      onCheckedChange={(checked) => handleSizeToggle(size, checked as boolean)}
                    />
                    <label 
                      htmlFor={`size-${size}`} 
                      className={`text-sm ${isExisting ? 'text-gray-400 line-through' : 'cursor-pointer'}`}
                    >
                      {size}
                    </label>
                  </div>
                );
              })}
            </div>
            
            {selectedSizes.length > 0 && (
              <div className="mt-4 flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  {selectedSizes.length} size{selectedSizes.length !== 1 ? 's' : ''} selected
                </span>
                <RYButton onClick={handleAddBulkVariants}>
                  Add {selectedSizes.length} Variant{selectedSizes.length !== 1 ? 's' : ''}
                </RYButton>
              </div>
            )}
          </div>
        )}
      </div>
    </RYCard>
  );
};

export default ProductBulkVariantCreator;
