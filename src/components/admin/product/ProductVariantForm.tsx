
import React from 'react';
import { RYCard } from '@/components/ui/ry-card';
import { RYButton } from '@/components/ui/ry-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';

interface ProductVariantFormProps {
  newVariantSize: string;
  newVariantColor: string;
  customSize: string;
  customColor: string;
  onNewVariantSizeChange: (size: string) => void;
  onNewVariantColorChange: (color: string) => void;
  onCustomSizeChange: (size: string) => void;
  onCustomColorChange: (color: string) => void;
  onAddVariant: () => void;
}

// Updated size order from smallest to largest, including youth sizes
const PREDEFINED_SIZES = ['Youth XS', 'Youth S', 'Youth M', 'Youth L', 'Youth XL', 'XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];
const PREDEFINED_COLORS = ['Black', 'White', 'Navy', 'Gray', 'Red', 'Green', 'Blue', 'Purple', 'Yellow', 'Orange', 'Pink', 'Brown'];

const ProductVariantForm: React.FC<ProductVariantFormProps> = ({
  newVariantSize,
  newVariantColor,
  customSize,
  customColor,
  onNewVariantSizeChange,
  onNewVariantColorChange,
  onCustomSizeChange,
  onCustomColorChange,
  onAddVariant
}) => {
  return (
    <RYCard className="p-4">
      <h3 className="text-lg font-semibold mb-4">Add Size & Color Variant</h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div>
          <Label>Size</Label>
          <Select value={newVariantSize} onValueChange={onNewVariantSizeChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select size" />
            </SelectTrigger>
            <SelectContent>
              {PREDEFINED_SIZES.map(size => (
                <SelectItem key={size} value={size}>{size}</SelectItem>
              ))}
              <SelectItem value="custom">Custom Size</SelectItem>
            </SelectContent>
          </Select>
          {newVariantSize === 'custom' && (
            <Input
              className="mt-2"
              placeholder="Enter custom size"
              value={customSize}
              onChange={(e) => onCustomSizeChange(e.target.value)}
            />
          )}
        </div>
        
        <div>
          <Label>Color</Label>
          <Select value={newVariantColor} onValueChange={onNewVariantColorChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select color" />
            </SelectTrigger>
            <SelectContent>
              {PREDEFINED_COLORS.map(color => (
                <SelectItem key={color} value={color}>{color}</SelectItem>
              ))}
              <SelectItem value="custom">Custom Color</SelectItem>
            </SelectContent>
          </Select>
          {newVariantColor === 'custom' && (
            <Input
              className="mt-2"
              placeholder="Enter custom color"
              value={customColor}
              onChange={(e) => onCustomColorChange(e.target.value)}
            />
          )}
        </div>
        
        <div className="md:col-span-2">
          <RYButton 
            onClick={onAddVariant}
            className="w-full h-12 text-base font-semibold"
            disabled={!newVariantSize || !newVariantColor}
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Variant
          </RYButton>
        </div>
      </div>
    </RYCard>
  );
};

export default ProductVariantForm;
