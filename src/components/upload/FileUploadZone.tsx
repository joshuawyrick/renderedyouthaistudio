
import React from 'react';
import { RYButton } from '@/components/ui/ry-button';
import { Upload, X } from 'lucide-react';

interface FileUploadZoneProps {
  file: File | null;
  dragActive: boolean;
  uploading: boolean;
  onDragEnter: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: () => void;
}

const FileUploadZone = ({
  file,
  dragActive,
  uploading,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onDrop,
  onFileSelect,
  onRemoveFile
}: FileUploadZoneProps) => {
  const handleButtonClick = () => {
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  };

  if (file) {
    return (
      <div className="border border-gray-300 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">📎</div>
            <div>
              <p className="font-medium text-ry-black">{file.name}</p>
              <p className="text-sm text-gray-600">
                {(file.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onRemoveFile}
            className="text-red-500 hover:text-red-700"
            disabled={uploading}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
        dragActive 
          ? 'border-ry-yellow bg-yellow-50' 
          : 'border-gray-300 hover:border-ry-yellow'
      }`}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <p className="text-lg text-gray-600 mb-2">
        Drag and drop your artwork here, or click to browse
      </p>
      <input
        type="file"
        onChange={onFileSelect}
        accept="image/jpeg,image/png,image/svg+xml"
        className="hidden"
        id="file-upload"
        disabled={uploading}
      />
      <RYButton 
        type="button" 
        variant="secondary" 
        size="lg" 
        disabled={uploading}
        onClick={handleButtonClick}
      >
        Choose File
      </RYButton>
    </div>
  );
};

export default FileUploadZone;
