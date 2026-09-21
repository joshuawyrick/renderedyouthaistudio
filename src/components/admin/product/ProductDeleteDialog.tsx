
import React from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { RYButton } from '@/components/ui/ry-button';
import { Trash2 } from 'lucide-react';

interface ProductDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productTitle: string;
  onConfirm: () => void;
  loading: boolean;
}

const ProductDeleteDialog: React.FC<ProductDeleteDialogProps> = ({
  open,
  onOpenChange,
  productTitle,
  onConfirm,
  loading
}) => {
  const handleConfirm = () => {
    onConfirm();
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Trash2 className="w-5 h-5 text-red-500" />
            Delete Forever
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to <strong>permanently delete</strong> "{productTitle}"?
            <br />
            <br />
            <strong className="text-red-600">This action cannot be undone.</strong> This will permanently delete:
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li><strong>The original design</strong></li>
              <li>The product and all its variants</li>
              <li>All additional images</li>
              <li>The main design image from storage</li>
              <li>All associated data</li>
            </ul>
            <br />
            <strong>The design will NOT reappear in the create products section.</strong>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading} onClick={handleCancel}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <RYButton 
              variant="outline" 
              onClick={handleConfirm}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 text-white border-red-600"
            >
              {loading ? 'Deleting Forever...' : 'Delete Forever'}
            </RYButton>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ProductDeleteDialog;
