
import React, { useRef } from 'react';
import { RYButton } from '@/components/ui/ry-button';
import { Upload, User } from 'lucide-react';
import { useProfileImageUpload } from '@/hooks/useProfileImageUpload';

interface ProfileImageUploadProps {
  currentImageUrl?: string;
  onImageUpdate?: (url: string) => void;
}

const ProfileImageUpload: React.FC<ProfileImageUploadProps> = ({ 
  currentImageUrl, 
  onImageUpdate 
}) => {
  const { uploading, uploadProfileImage } = useProfileImageUpload();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload a JPG, PNG, or WebP image');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    const uploadedUrl = await uploadProfileImage(file);
    if (uploadedUrl && onImageUpdate) {
      onImageUpdate(uploadedUrl);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex items-center space-x-6">
      <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center border-2 border-ry-yellow overflow-hidden">
        {currentImageUrl ? (
          <img 
            src={currentImageUrl} 
            alt="Profile" 
            className="w-full h-full object-cover"
          />
        ) : (
          <User className="h-12 w-12 text-gray-400" />
        )}
      </div>
      <div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileSelect}
          className="hidden"
        />
        <RYButton 
          type="button" 
          variant="secondary" 
          size="sm"
          onClick={triggerFileSelect}
          disabled={uploading}
        >
          <Upload className="h-4 w-4 mr-2" />
          {uploading ? 'Uploading...' : 'Upload Photo'}
        </RYButton>
        <p className="text-sm text-gray-600 mt-2">
          JPG, PNG, or WebP, max 5MB
        </p>
      </div>
    </div>
  );
};

export default ProfileImageUpload;
