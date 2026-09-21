
import React from 'react';
import { RYCard } from '@/components/ui/ry-card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface ProductBasicInfoFormProps {
  title: string;
  description: string;
  basePrice: number;
  onTitleChange: (title: string) => void;
  onDescriptionChange: (description: string) => void;
  onBasePriceChange: (price: number) => void;
}

const ProductBasicInfoForm: React.FC<ProductBasicInfoFormProps> = ({
  title,
  description,
  basePrice,
  onTitleChange,
  onDescriptionChange,
  onBasePriceChange
}) => {
  return (
    <RYCard className="p-4">
      <h3 className="text-lg font-semibold mb-4">Product Details</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="basePrice">Base Price ($)</Label>
          <Input
            id="basePrice"
            type="number"
            step="0.01"
            value={basePrice}
            onChange={(e) => onBasePriceChange(parseFloat(e.target.value))}
          />
        </div>
        <div className="col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            placeholder="Product description..."
          />
        </div>
      </div>
    </RYCard>
  );
};

export default ProductBasicInfoForm;
