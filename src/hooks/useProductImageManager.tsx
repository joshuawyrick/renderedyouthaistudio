
import { useToast } from '@/components/ui/use-toast';
import { useImageOperations } from './useImageOperations';
import { useImageUploadState } from './useImageUploadState';

interface ProductImage {
  id?: string;
  url: string;
  altText: string;
  sortOrder: number;
}

interface UseProductImageManagerProps {
  images: ProductImage[];
  onImagesUpdate: (images: ProductImage[]) => void;
}

export const useProductImageManager = ({ images, onImagesUpdate }: UseProductImageManagerProps) => {
  const { toast } = useToast();
  const {
    newImageUrl,
    setNewImageUrl,
    isAddingImage,
    setIsAddingImage,
    uploadingFile,
    setUploadingFile,
    file,
    dragActive,
    handleDrag,
    handleDrop,
    handleFileInput,
    removeFile,
    resetState
  } = useImageUploadState();

  const {
    addImageByUrl: performAddImageByUrl,
    addImageFromFile,
    removeImage,
    updateImageAltText,
    reorderImages
  } = useImageOperations({ images, onImagesUpdate });

  const addImageByUrl = () => {
    performAddImageByUrl(newImageUrl);
    resetState();
  };

  const handleFileUpload = async () => {
    if (!file) return;

    setUploadingFile(true);
    try {
      await addImageFromFile(file);
      resetState();
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload the image file",
        variant: "destructive",
      });
    } finally {
      setUploadingFile(false);
    }
  };

  const cancelAdding = () => {
    resetState();
  };

  return {
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
    removeFile,
    addImageByUrl,
    handleFileUpload,
    removeImage,
    updateImageAltText,
    reorderImages,
    cancelAdding
  };
};
