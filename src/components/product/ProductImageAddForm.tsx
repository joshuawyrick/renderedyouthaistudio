
import React from 'react';
import { RYButton } from '@/components/ui/ry-button';
import { Input } from '@/components/ui/input';

interface ProductImageAddFormProps {
  newImageUrl: string;
  onUrlChange: (url: string) => void;
  onAddUrl: () => void;
  onCancel: () => void;
}

const ProductImageAddForm: React.FC<ProductImageAddFormProps> = ({
  newImageUrl,
  onUrlChange,
  onAddUrl,
  onCancel
}) => {
  return (
    <div className="flex gap-2">
      <Input
        placeholder="Enter image URL"
        value={newImageUrl}
        onChange={(e) => onUrlChange(e.target.value)}
        className="flex-1"
      />
      <RYButton onClick={onAddUrl} disabled={!newImageUrl.trim()}>
        Add URL
      </RYButton>
      <RYButton variant="secondary" onClick={onCancel}>
        Cancel
      </RYButton>
    </div>
  );
};

export default ProductImageAddForm;
