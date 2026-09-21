
import React, { useState } from 'react';
import { RYCard } from '@/components/ui/ry-card';
import ProductCard from './ProductCard';
import ProductEditDialog from './ProductEditDialog';
import type { Product } from './types';

interface ProductManagementTabProps {
  products: Product[];
  onToggleProductStatus: (product: Product) => void;
  onProductUpdated: () => void;
}

const ProductManagementTab: React.FC<ProductManagementTabProps> = ({
  products,
  onToggleProductStatus,
  onProductUpdated
}) => {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setEditDialogOpen(true);
  };

  const handleEditComplete = () => {
    setEditDialogOpen(false);
    setEditingProduct(null);
    onProductUpdated();
  };

  const handleStatusToggle = (productId: string, newStatus: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      onToggleProductStatus({ ...product, status: newStatus });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-gray-600">
          Manage existing products, pricing, and variants
        </p>
        <div className="text-sm text-gray-500">
          {products.length} product{products.length !== 1 ? 's' : ''}
        </div>
      </div>
      
      {products.length === 0 ? (
        <RYCard className="p-8 text-center">
          <p className="text-gray-500">No products created yet</p>
        </RYCard>
      ) : (
        <div className="space-y-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onStatusToggle={handleStatusToggle}
              onEdit={handleEditProduct}
              onProductDeleted={onProductUpdated}
            />
          ))}
        </div>
      )}

      <ProductEditDialog
        product={editingProduct}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onComplete={handleEditComplete}
      />
    </div>
  );
};

export default ProductManagementTab;
