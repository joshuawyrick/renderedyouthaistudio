
import React from 'react';
import { RYButton } from '@/components/ui/ry-button';
import { Input } from '@/components/ui/input';
import { X, GripVertical } from 'lucide-react';

interface ProductImage {
  id?: string;
  url: string;
  altText: string;
  sortOrder: number;
}

interface ProductImageGridProps {
  images: ProductImage[];
  readOnly?: boolean;
  onRemoveImage?: (index: number) => void;
  onUpdateAltText?: (index: number, altText: string) => void;
  onReorderImages?: (startIndex: number, endIndex: number) => void;
}

const ProductImageGrid: React.FC<ProductImageGridProps> = ({
  images,
  readOnly = false,
  onRemoveImage,
  onUpdateAltText,
  onReorderImages
}) => {
  const [draggedIndex, setDraggedIndex] = React.useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = React.useState<number | null>(null);

  if (readOnly) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {images.map((image, index) => (
          <div key={`readonly-${index}`} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={image.url}
              alt={image.altText}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    );
  }

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (draggedIndex !== null && draggedIndex !== dropIndex && onReorderImages) {
      onReorderImages(draggedIndex, dropIndex);
    }
    
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleRemoveImage = (index: number) => {
    
    onRemoveImage?.(index);
  };

  const handleAltTextChange = (index: number, altText: string) => {
    onUpdateAltText?.(index, altText);
  };

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-600 mb-2">
        <strong>Tip:</strong> Drag images to reorder them. The first image will be the main product image.
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-2">
        {images.map((image, index) => {
          const isMainImage = index === 0; // First image is now the main image
          const isDraggedOver = dragOverIndex === index;
          
          return (
            <div 
              key={`image-${index}`} 
              className={`relative group cursor-move ${isDraggedOver ? 'ring-2 ring-blue-400' : ''}`}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, index)}
            >
              {/* Drag Handle - Always visible on mobile, hover on desktop */}
              <div className="absolute top-2 left-2 z-10 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                <div className="bg-black/70 rounded p-1.5">
                  <GripVertical className="w-4 h-4 md:w-3 md:h-3 text-white" />
                </div>
              </div>

              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={image.url}
                  alt={image.altText}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Remove button - Always visible on mobile, hover on desktop */}
              {(!isMainImage || images.length > 1) && (
                <div className="absolute top-2 right-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                  <RYButton
                    variant="secondary"
                    size="sm"
                    onClick={() => handleRemoveImage(index)}
                    className="p-1.5 h-8 w-8 md:h-6 md:w-6 bg-red-500 hover:bg-red-600 text-white"
                  >
                    <X className="w-4 h-4 md:w-3 md:h-3" />
                  </RYButton>
                </div>
              )}
              
              <Input
                placeholder="Alt text"
                value={image.altText}
                onChange={(e) => handleAltTextChange(index, e.target.value)}
                className="mt-2 text-sm md:text-xs h-10 md:h-8"
              />
              
              {isMainImage && (
                <div className="absolute bottom-12 md:bottom-8 left-1 bg-blue-500 text-white text-sm md:text-xs px-2 py-1 rounded">
                  Main Image
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductImageGrid;
