
import React from 'react';
import ProductBasicInfoForm from './ProductBasicInfoForm';

interface ProductEditBasicInfoProps {
  title: string;
  description: string;
  basePrice: number;
  onTitleChange: (title: string) => void;
  onDescriptionChange: (description: string) => void;
  onBasePriceChange: (price: number) => void;
}

const ProductEditBasicInfo: React.FC<ProductEditBasicInfoProps> = ({
  title,
  description,
  basePrice,
  onTitleChange,
  onDescriptionChange,
  onBasePriceChange
}) => {
  return (
    <ProductBasicInfoForm
      title={title}
      description={description}
      basePrice={basePrice}
      onTitleChange={onTitleChange}
      onDescriptionChange={onDescriptionChange}
      onBasePriceChange={onBasePriceChange}
    />
  );
};

export default ProductEditBasicInfo;
