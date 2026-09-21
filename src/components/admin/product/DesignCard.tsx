
import React, { useState } from 'react';
import { RYCard } from '@/components/ui/ry-card';
import { RYButton } from '@/components/ui/ry-button';
import { Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { deleteEntireProduct } from '@/services/productDeletionService';
import ProductDeleteDialog from './ProductDeleteDialog';
import type { Design } from './types';

interface DesignCardProps {
  design: Design;
  creating: string | null;
  onCreateProduct: (design: Design) => void;
  onProductDeleted?: () => void;
  hasExistingProduct?: boolean;
  existingProductId?: string;
  existingProductTitle?: string;
}

const DesignCard: React.FC<DesignCardProps> = ({
  design,
  creating,
  onCreateProduct,
  onProductDeleted,
  hasExistingProduct = false,
  existingProductId,
  existingProductTitle
}) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { toast } = useToast();


  const handleDeleteProduct = async () => {
    if (!existingProductId) {
      console.error('❌ No product ID provided for deletion');
      toast({
        title: "Error",
        description: "No product ID found for deletion.",
        variant: "destructive",
      });
      return;
    }
    
    setDeleting(true);
    
    try {
      await deleteEntireProduct(existingProductId);
      
      toast({
        title: "Deleted Successfully",
        description: "Product and design have been permanently deleted.",
      });
      
      // Close dialog immediately
      setDeleteDialogOpen(false);
      
      // Trigger aggressive data refresh with longer delay
      if (onProductDeleted) {
        setTimeout(() => {
          onProductDeleted();
        }, 500); // Increased delay to ensure database changes propagate
      }
      
    } catch (error) {
      console.error('❌ Delete operation failed:', error);
      
      let errorMessage = "Failed to delete product permanently. Please try again.";
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

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  return (
    <>
      <RYCard className="p-4">
        <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
          {design.file_url ? (
            <img
              src={design.file_url}
              alt={design.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.setAttribute('style', 'display: flex');
              }}
            />
          ) : null}
          <div className="text-gray-400" style={{ display: design.file_url ? 'none' : 'flex' }}>
            No image
          </div>
        </div>
        
        <div className="space-y-2">
          <h4 className="font-medium text-ry-black">{design.title}</h4>
          <p className="text-sm text-gray-600">
            by {design.profiles?.first_name} {design.profiles?.last_name}
          </p>
          
          {hasExistingProduct ? (
            <div className="space-y-2">
              <p className="text-xs text-green-600 font-medium">✓ Product exists</p>
              <RYButton
                variant="outline"
                size="sm"
                onClick={handleDeleteClick}
                className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 hover:border-red-300"
                disabled={deleting}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                {deleting ? 'Deleting Forever...' : 'Delete Forever'}
              </RYButton>
            </div>
          ) : (
            <RYButton
              variant="primary"
              size="sm"
              onClick={() => onCreateProduct(design)}
              disabled={creating === design.id}
              className="w-full"
            >
              {creating === design.id ? (
                'Creating...'
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-1" />
                  Create Product ($25.00)
                </>
              )}
            </RYButton>
          )}
        </div>
      </RYCard>

      {hasExistingProduct && (
        <ProductDeleteDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          productTitle={existingProductTitle || design.title}
          onConfirm={handleDeleteProduct}
          loading={deleting}
        />
      )}
    </>
  );
};

export default DesignCard;
