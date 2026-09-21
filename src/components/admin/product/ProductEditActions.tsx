
import React from 'react';
import { RYButton } from '@/components/ui/ry-button';

interface ProductEditActionsProps {
  loading: boolean;
  title: string;
  onSave: () => void;
  onCancel: () => void;
}

const ProductEditActions: React.FC<ProductEditActionsProps> = ({
  loading,
  title,
  onSave,
  onCancel
}) => {
  return (
    <div className="flex gap-2 justify-end">
      <RYButton
        variant="secondary"
        onClick={onCancel}
        disabled={loading}
      >
        Cancel
      </RYButton>
      <RYButton
        variant="primary"
        onClick={onSave}
        disabled={loading || !title.trim()}
      >
        {loading ? 'Saving...' : 'Save Changes'}
      </RYButton>
    </div>
  );
};

export default ProductEditActions;
