
import React from 'react';
import { RYButton } from '@/components/ui/ry-button';
import { ShoppingCart } from 'lucide-react';

interface ProductActionsProps {
  price: number;
  productTitle: string;
  selectedSize: string;
  selectedColor: string;
  onAddToCart: () => void;
  onBuyNow: () => void;
}

const ProductActions: React.FC<ProductActionsProps> = ({
  price,
  onAddToCart,
  onBuyNow
}) => {
  return (
    <div className="space-y-4">
      <RYButton
        variant="primary"
        size="lg"
        onClick={onBuyNow}
        className="w-full text-lg py-4"
      >
        Buy Now - ${Number(price).toFixed(2)}
      </RYButton>
      
      <RYButton
        variant="secondary"
        size="lg"
        onClick={onAddToCart}
        className="w-full"
      >
        <ShoppingCart className="h-5 w-5 mr-2" />
        Add to Cart
      </RYButton>
    </div>
  );
};

export default ProductActions;
