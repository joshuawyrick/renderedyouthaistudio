
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { RYButton } from './ry-button';

interface Product {
  id: string;
  title: string;
  slug: string;
  price: number;
  creatorName: string;
  creatorAge: string;
  creatorState: string;
  imageUrl?: string;
  collectionId?: string;
  design?: {
    file_url: string;
  };
  variants?: Array<{
    id: string;
    size: string;
    color: string;
    price_adjustment: number;
    is_available: boolean;
  }>;
}

interface ProductCardProps {
  product: Product;
  showViewButton?: boolean;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  showViewButton = false,
  className 
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/store/${product.id}`);
  };

  const handleViewClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/store/${product.id}`);
  };

  return (
    <div 
      className={cn(
        "group flex flex-col bg-card border border-border rounded-xl overflow-hidden cursor-pointer",
        "transition-all duration-300 ease-out",
        "hover:border-accent hover:shadow-xl hover:-translate-y-1",
        className
      )}
      onClick={handleClick}
    >
      {/* Product Image */}
      <div className="relative w-full pt-[100%] bg-secondary overflow-hidden">
        <img
          src={product.design?.file_url || product.imageUrl || '/placeholder.svg'}
          alt={product.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {product.variants && product.variants.length > 0 && (
          <span className="absolute top-3 right-3 px-3 py-1.5 bg-accent text-accent-foreground text-xs font-bold rounded uppercase tracking-wide">
            {product.variants.filter(v => v.is_available).length} sizes
          </span>
        )}
      </div>

      {/* Product Content */}
      <div className="flex flex-col gap-2 p-4">
        <h3 className="font-semibold text-foreground text-lg leading-tight line-clamp-2">
          {product.title}
        </h3>
        
        <p className="text-sm text-muted-foreground">
          by <span className="font-semibold text-foreground">{product.creatorName}</span> • Age {product.creatorAge}
        </p>
        
        <div className="flex items-center justify-between mt-2">
          <span className="text-xl font-bold text-foreground">
            ${Number(product.price).toFixed(2)}
          </span>
        </div>

        {showViewButton && (
          <RYButton
            variant="primary"
            size="sm"
            className="w-full mt-2"
            onClick={handleViewClick}
          >
            View Design
          </RYButton>
        )}
      </div>
    </div>
  );
};
