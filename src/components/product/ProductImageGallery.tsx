
import React, { useState } from 'react';
import { X, ZoomIn, ZoomOut } from 'lucide-react';

interface ProductImage {
  url: string;
  altText: string;
  sortOrder: number;
}

interface ProductImageGalleryProps {
  images: ProductImage[];
  title: string;
}

const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({
  images,
  title
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  
  // Ensure we have at least one image
  const displayImages = images.length > 0 ? images : [
    { url: '/placeholder.svg', altText: title, sortOrder: 1 }
  ];

  const selectedImage = displayImages[selectedImageIndex];

  const openZoom = () => {
    setIsZoomed(true);
    setZoomLevel(1);
  };

  const closeZoom = () => {
    setIsZoomed(false);
    setZoomLevel(1);
  };

  const zoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.5, 3));
  };

  const zoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.5, 0.5));
  };

  return (
    <>
      <div className="space-y-4">
        {/* Main Image */}
        <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden cursor-zoom-in">
          <img
            src={selectedImage.url}
            alt={selectedImage.altText}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
            onClick={openZoom}
          />
        </div>
        
        {/* Thumbnail Grid */}
        {displayImages.length > 1 && (
          <div className="grid grid-cols-4 gap-2">
            {displayImages.slice(0, 4).map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImageIndex(index)}
                className={`aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 transition-colors ${
                  selectedImageIndex === index 
                    ? 'border-ry-yellow' 
                    : 'border-transparent hover:border-gray-300'
                }`}
              >
                <img
                  src={image.url}
                  alt={image.altText}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
        
        {/* Image Counter */}
        {displayImages.length > 1 && (
          <div className="text-center text-sm text-gray-500">
            {selectedImageIndex + 1} of {displayImages.length}
          </div>
        )}
      </div>

      {/* Zoom Modal */}
      {isZoomed && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
          {/* Close Button */}
          <button
            onClick={closeZoom}
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
          >
            <X size={32} />
          </button>

          {/* Zoom Controls */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-4 bg-black bg-opacity-50 rounded-lg px-4 py-2 z-10">
            <button
              onClick={zoomOut}
              disabled={zoomLevel <= 0.5}
              className="text-white hover:text-gray-300 disabled:text-gray-600"
            >
              <ZoomOut size={24} />
            </button>
            <span className="text-white text-sm min-w-12 text-center">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={zoomIn}
              disabled={zoomLevel >= 3}
              className="text-white hover:text-gray-300 disabled:text-gray-600"
            >
              <ZoomIn size={24} />
            </button>
          </div>

          {/* Thumbnail Navigation */}
          {displayImages.length > 1 && (
            <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
              {displayImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    selectedImageIndex === index 
                      ? 'bg-ry-yellow' 
                      : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Zoomable Image */}
          <div className="max-w-full max-h-full overflow-auto">
            <img
              src={selectedImage.url}
              alt={selectedImage.altText}
              className="transition-transform duration-200 cursor-grab active:cursor-grabbing"
              style={{ 
                transform: `scale(${zoomLevel})`,
                maxWidth: 'none',
                maxHeight: 'none'
              }}
              draggable={false}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ProductImageGallery;
