
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useProductEdit } from '@/hooks/useProductEdit';
import ProductEditBasicInfo from './ProductEditBasicInfo';
import ProductEditImages from './ProductEditImages';
import ProductEditVariants from './ProductEditVariants';
import ProductEditActions from './ProductEditActions';
import type { Product } from './types';

interface ProductEditDialogProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: () => void;
}

const ProductEditDialog: React.FC<ProductEditDialogProps> = ({
  product,
  open,
  onOpenChange,
  onComplete
}) => {
  const {
    title,
    setTitle,
    description,
    setDescription,
    basePrice,
    setBasePrice,
    variants,
    setVariants,
    images,
    setImages,
    loading,
    handleSave
  } = useProductEdit(product, open);

  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Product: {product.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <ProductEditBasicInfo
            title={title}
            description={description}
            basePrice={basePrice}
            onTitleChange={setTitle}
            onDescriptionChange={setDescription}
            onBasePriceChange={setBasePrice}
          />

          <ProductEditImages
            productId={product.id}
            images={images}
            onImagesUpdate={setImages}
          />

          <ProductEditVariants
            variants={variants}
            basePrice={basePrice}
            onVariantsChange={setVariants}
          />

          <ProductEditActions
            loading={loading}
            title={title}
            onSave={() => handleSave(onComplete, onOpenChange)}
            onCancel={() => onOpenChange(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductEditDialog;
