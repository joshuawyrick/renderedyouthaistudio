
import { useState } from 'react';
import { useFileUpload } from '@/hooks/useFileUpload';

export const useImageUploadState = () => {
  const [newImageUrl, setNewImageUrl] = useState('');
  const [isAddingImage, setIsAddingImage] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const { file, dragActive, handleDrag, handleDrop, handleFileInput, removeFile } = useFileUpload();

  const resetState = () => {
    setIsAddingImage(false);
    setNewImageUrl('');
    removeFile();
    setUploadingFile(false);
  };

  return {
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
  };
};
