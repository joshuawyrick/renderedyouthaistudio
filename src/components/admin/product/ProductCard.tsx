
import React, { useState } from 'react';
import { RYCard } from '@/components/ui/ry-card';
import { RYButton } from '@/components/ui/ry-button';
import { Badge } from '@/components/ui/badge';
import { Edit, Eye, EyeOff, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { deleteEntireProduct } from '@/services/productDeletionService';
import ProductDeleteDialog from './ProductDeleteDialog';
import type { Product } from './types';

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onStatusToggle: (productId: string, newStatus: string) => void;
  onProductDeleted: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onEdit,
  onStatusToggle,
  onProductDeleted
}) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { toast } = useToast();

  const handleStatusToggle = () => {
    const newStatus = product.status === 'active' ? 'inactive' : 'active';
    onStatusToggle(product.id, newStatus);
  };

  const handleDeleteProduct = async () => {
    setDeleting(true);
    
    try {
      await deleteEntireProduct(product.id);
      
      toast({
        title: "Deleted Successfully",
        description: "Product and all associated data have been permanently deleted.",
      });
      
      setDeleteDialogOpen(false);
      onProductDeleted();
      
    } catch (error) {
      console.error('❌ Delete operation failed:', error);
      
      let errorMessage = "Failed to delete product. Please try again.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Deletion Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <RYCard className="p-4">
        <div className="flex items-start gap-4">
          <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
            <img
              src={product.designs.file_url}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium text-ry-black truncate">{product.title}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  by {product.designs.profiles.first_name} {product.designs.profiles.last_name}
                </p>
                <p className="text-sm font-medium text-ry-black mt-1">
                  ${Number(product.price).toFixed(2)}
                </p>
                {product.collection_name && (
                  <p className="text-xs text-gray-500 mt-1">
                    Collection: {product.collection_name}
                  </p>
                )}
                {product.assigned_user_name && (
                  <p className="text-xs text-gray-500">
                    Assigned to: {product.assigned_user_name}
                  </p>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <Badge className={getStatusColor(product.status)}>
                  {product.status}
                </Badge>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-4 pt-4 border-t">
          <div className="text-xs text-gray-500">
            Created: {new Date(product.created_at).toLocaleDateString()}
          </div>
          
          <div className="flex items-center gap-2">
            <RYButton
              variant="outline"
              size="sm"
              onClick={() => onEdit(product)}
            >
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </RYButton>
            
            <RYButton
              variant="outline"
              size="sm"
              onClick={handleStatusToggle}
            >
              {product.status === 'active' ? (
                <>
                  <EyeOff className="w-4 h-4 mr-1" />
                  Deactivate
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 mr-1" />
                  Activate
                </>
              )}
            </RYButton>

            <RYButton
              variant="outline"
              size="sm"
              onClick={() => setDeleteDialogOpen(true)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Delete
            </RYButton>
          </div>
        </div>
      </RYCard>

      <ProductDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        productTitle={product.title}
        onConfirm={handleDeleteProduct}
        loading={deleting}
      />
    </>
  );
};

export default ProductCard;
