
import React from 'react';
import { RYCard } from '@/components/ui/ry-card';
import { RYButton } from '@/components/ui/ry-button';
import { useSecureFileUpload } from '@/hooks/useSecureFileUpload';

import FileUploadZone from './FileUploadZone';
import DesignVisionFields, { DesignVision } from './DesignVisionFields';

interface SecureUploadFormProps {
  title: string;
  vision: DesignVision;
  file: File | null;
  dragActive: boolean;
  setTitle: (title: string) => void;
  setVision: (vision: DesignVision) => void;
  onDragEnter: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

const SecureUploadForm = ({
  title,
  vision,
  file,
  dragActive,
  setTitle,
  setVision,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onDrop,
  onFileSelect,
  onRemoveFile,
  onSubmit
}: SecureUploadFormProps) => {
  const { uploading } = useSecureFileUpload();

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val.length <= 100) {
      setTitle(val);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      {/* Title */}
      <RYCard className="p-6">
        <label className="block text-lg font-semibold text-ry-black mb-3">
          Design Title * <span className="text-sm text-gray-500">({title.length}/100)</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          placeholder="Give your artwork a catchy name..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ry-yellow focus:border-transparent text-lg"
          required
          disabled={uploading}
          maxLength={100}
        />
      </RYCard>

      {/* File Upload */}
      <RYCard className="p-6">
        <label className="block text-lg font-semibold text-ry-black mb-3">
          Upload Your Artwork *
        </label>
        <p className="text-sm text-gray-600 mb-4">
          Accepted formats: JPG, PNG, SVG, WebP | Maximum size: 25MB
        </p>

        <FileUploadZone
          file={file}
          dragActive={dragActive}
          uploading={uploading}
          onDragEnter={onDragEnter}
          onDragLeave={onDragLeave}
          onDragOver={onDragOver}
          onDrop={onDrop}
          onFileSelect={onFileSelect}
          onRemoveFile={onRemoveFile}
        />
      </RYCard>

      {/* Guided questions that steer the AI rendering */}
      <DesignVisionFields
        vision={vision}
        setVision={setVision}
        disabled={uploading}
      />

      {/* Submit Button */}
      <div className="text-center">
        <RYButton 
          type="submit" 
          variant="primary" 
          size="lg"
          disabled={uploading}
        >
          {uploading ? 'Uploading...' : 'Submit for Review'}
        </RYButton>
      </div>
    </form>
  );
};

export default SecureUploadForm;
