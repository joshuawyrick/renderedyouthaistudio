
import React from 'react';
import { useToast } from '@/components/ui/use-toast';
import ProductVariantForm from './ProductVariantForm';
import ProductVariantList from './ProductVariantList';
import ProductBulkVariantCreator from './ProductBulkVariantCreator';

interface ProductVariant {
  id?: string;
  size: string;
  color: string;
  priceAdjustment: number;
  isAvailable: boolean;
}

interface ProductVariantManagerProps {
  variants: ProductVariant[];
  basePrice: number;
  onVariantsChange: (variants: ProductVariant[]) => void;
}

const ProductVariantManager: React.FC<ProductVariantManagerProps> = ({
  variants,
  basePrice,
  onVariantsChange
}) => {
  const [newVariantSize, setNewVariantSize] = React.useState('');
  const [newVariantColor, setNewVariantColor] = React.useState('');
  const [customSize, setCustomSize] = React.useState('');
  const [customColor, setCustomColor] = React.useState('');
  const { toast } = useToast();

  const addVariant = () => {
    const size = newVariantSize === 'custom' ? customSize : newVariantSize;
    const color = newVariantColor === 'custom' ? customColor : newVariantColor;

    if (!size || !color) {
      toast({
        title: "Error",
        description: "Please select both size and color",
        variant: "destructive",
      });
      return;
    }

    // Check if variant already exists
    const exists = variants.some(v => v.size === size && v.color === color);
    if (exists) {
      toast({
        title: "Error",
        description: "This size and color combination already exists",
        variant: "destructive",
      });
      return;
    }

    const newVariant: ProductVariant = {
      size,
      color,
      priceAdjustment: 0,
      isAvailable: true
    };

    onVariantsChange([...variants, newVariant]);
    setNewVariantSize('');
    setNewVariantColor('');
    setCustomSize('');
    setCustomColor('');
  };

  const removeVariant = (index: number) => {
    const newVariants = variants.filter((_, i) => i !== index);
    onVariantsChange(newVariants);
  };

  const updateVariant = (index: number, field: keyof ProductVariant, value: any) => {
    const newVariants = [...variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    onVariantsChange(newVariants);
  };

  return (
    <div className="space-y-6">
      <ProductBulkVariantCreator
        variants={variants}
        onVariantsChange={onVariantsChange}
      />
      
      <ProductVariantForm
        newVariantSize={newVariantSize}
        newVariantColor={newVariantColor}
        customSize={customSize}
        customColor={customColor}
        onNewVariantSizeChange={setNewVariantSize}
        onNewVariantColorChange={setNewVariantColor}
        onCustomSizeChange={setCustomSize}
        onCustomColorChange={setCustomColor}
        onAddVariant={addVariant}
      />
      
      <ProductVariantList
        variants={variants}
        basePrice={basePrice}
        onUpdateVariant={updateVariant}
        onRemoveVariant={removeVariant}
      />
    </div>
  );
};

export default ProductVariantManager;
