
import React from 'react';
import { RYButton } from '@/components/ui/ry-button';
import { Plus } from 'lucide-react';
import { useProductImageManager } from '@/hooks/useProductImageManager';
import ProductImageGrid from './ProductImageGrid';
import ProductImageAddForm from './ProductImageAddForm';
import ProductImageUploadZone from './ProductImageUploadZone';

interface ProductImage {
  id?: string;
  url: string;
  altText: string;
  sortOrder: number;
}

interface ProductImageManagerProps {
  productId: string;
  images: ProductImage[];
  onImagesUpdate: (images: ProductImage[]) => void;
  readOnly?: boolean;
}

const ProductImageManager: React.FC<ProductImageManagerProps> = ({
  productId,
  images,
  onImagesUpdate,
  readOnly = false
}) => {
  const {
    newImageUrl,
    setNewImageUrl,
    isAddingImage,
    setIsAddingImage,
    uploadingFile,
    file,
    dragActive,
    handleDrag,
    handleDrop,
    handleFileInput,
    addImageByUrl,
    handleFileUpload,
    removeImage,
    updateImageAltText,
    reorderImages,
    cancelAdding
  } = useProductImageManager({ images, onImagesUpdate });

  if (readOnly) {
    return (
      <ProductImageGrid images={images} readOnly={true} />
    );
  }

  return (
    <div className="space-y-4">
      {/* Current Images */}
      <ProductImageGrid
        images={images}
        onRemoveImage={removeImage}
        onUpdateAltText={updateImageAltText}
        onReorderImages={reorderImages}
      />

      {/* Add New Image */}
      {!isAddingImage ? (
        <RYButton
          variant="outline"
          onClick={() => setIsAddingImage(true)}
          className="w-full"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Image
        </RYButton>
      ) : (
        <div className="border rounded-lg p-4 space-y-3">
          <ProductImageAddForm
            newImageUrl={newImageUrl}
            onUrlChange={setNewImageUrl}
            onAddUrl={addImageByUrl}
            onCancel={cancelAdding}
          />

          <ProductImageUploadZone
            dragActive={dragActive}
            file={file}
            uploadingFile={uploadingFile}
            onDrag={handleDrag}
            onDrop={handleDrop}
            onFileInput={handleFileInput}
            onFileUpload={handleFileUpload}
            onRemoveFile={cancelAdding}
          />
        </div>
      )}
    </div>
  );
};

export default ProductImageManager;
