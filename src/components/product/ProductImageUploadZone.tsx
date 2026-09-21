
import React from 'react';
import { RYButton } from '@/components/ui/ry-button';
import { Upload } from 'lucide-react';

interface ProductImageUploadZoneProps {
  dragActive: boolean;
  file: File | null;
  uploadingFile: boolean;
  onDrag: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onFileInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFileUpload: () => void;
  onRemoveFile: () => void;
}

const ProductImageUploadZone: React.FC<ProductImageUploadZoneProps> = ({
  dragActive,
  file,
  uploadingFile,
  onDrag,
  onDrop,
  onFileInput,
  onFileUpload,
  onRemoveFile
}) => {
  return (
    <div
      className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
        dragActive ? 'border-ry-yellow bg-yellow-50' : 'border-gray-300'
      }`}
      onDragEnter={onDrag}
      onDragLeave={onDrag}
      onDragOver={onDrag}
      onDrop={onDrop}
    >
      <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
      <p className="text-sm text-gray-600">
        Drag and drop an image file here, or{' '}
        <label className="text-ry-black underline cursor-pointer">
          browse
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={onFileInput}
          />
        </label>
      </p>
      {file && (
        <div className="mt-2 space-y-2">
          <div className="text-sm text-green-600">
            File selected: {file.name}
          </div>
          <div className="flex gap-2 justify-center">
            <RYButton
              onClick={onFileUpload}
              disabled={uploadingFile}
              size="sm"
            >
              {uploadingFile ? 'Adding...' : 'Add File'}
            </RYButton>
            <RYButton
              variant="secondary"
              size="sm"
              onClick={onRemoveFile}
              disabled={uploadingFile}
            >
              Remove
            </RYButton>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductImageUploadZone;
