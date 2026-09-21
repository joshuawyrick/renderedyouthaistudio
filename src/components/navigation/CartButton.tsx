import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

interface CartButtonProps {
  onNavigate?: () => void;
}

const CartButton: React.FC<CartButtonProps> = ({ onNavigate }) => {
  const { itemCount } = useCart();

  return (
    <a
      href="/cart"
      onClick={onNavigate}
      aria-label={`Cart, ${itemCount} item${itemCount === 1 ? '' : 's'}`}
      className="relative inline-flex items-center text-ry-yellow hover:text-ry-white transition-colors p-2"
    >
      <ShoppingBag className="h-6 w-6" />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 flex items-center justify-center rounded-full bg-ry-yellow text-ry-black text-xs font-bold">
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </a>
  );
};

export default CartButton;
