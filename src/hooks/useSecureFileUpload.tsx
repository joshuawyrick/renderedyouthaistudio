
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { validateFileType, validateFileSize, validateFileMagicNumber, logSecurityEvent } from '@/services/securityService';

export const useSecureFileUpload = () => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const uploadFile = async (file: File, folder: string = 'designs'): Promise<string | null> => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to upload files",
        variant: "destructive",
      });
      return null;
    }

    // Enhanced file validation
    if (!validateFileType(file)) {
      toast({
        title: "Invalid file type",
        description: "Only JPEG, PNG, SVG, and WebP images are allowed",
        variant: "destructive",
      });
      await logSecurityEvent({
        action: 'FILE_UPLOAD_REJECTED',
        resource_type: 'file',
        metadata: { reason: 'invalid_type', filename: file.name, type: file.type }
      });
      return null;
    }

    if (!validateFileSize(file)) {
      toast({
        title: "File too large",
        description: "File size must be under 25MB",
        variant: "destructive",
      });
      await logSecurityEvent({
        action: 'FILE_UPLOAD_REJECTED',
        resource_type: 'file',
        metadata: { reason: 'size_exceeded', filename: file.name, size: file.size }
      });
      return null;
    }

    // Magic number validation for additional security
    const isValidMagicNumber = await validateFileMagicNumber(file);
    if (!isValidMagicNumber) {
      toast({
        title: "Invalid file format",
        description: "File appears to be corrupted or not a valid image",
        variant: "destructive",
      });
      await logSecurityEvent({
        action: 'FILE_UPLOAD_REJECTED',
        resource_type: 'file',
        metadata: { reason: 'invalid_magic_number', filename: file.name }
      });
      return null;
    }

    setUploading(true);
    
    try {
      // Create secure filename with user ID prefix
      const timestamp = Date.now();
      const fileExt = file.name.split('.').pop()?.toLowerCase();
      const secureFileName = `${user.id}/${timestamp}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${folder}/${secureFileName}`;

      // Upload to Supabase storage with user context
      const { data, error } = await supabase.storage
        .from('design-uploads')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('design-uploads')
        .getPublicUrl(filePath);

      // Log successful upload
      await logSecurityEvent({
        action: 'FILE_UPLOAD_SUCCESS',
        resource_type: 'file',
        resource_id: data.path,
        metadata: { filename: file.name, size: file.size, folder }
      });

      return publicUrl;
    } catch (error) {
      console.error('File upload error:', error);
      
      await logSecurityEvent({
        action: 'FILE_UPLOAD_ERROR',
        resource_type: 'file',
        metadata: { filename: file.name, error: error instanceof Error ? error.message : 'Unknown error' }
      });

      toast({
        title: "Upload failed",
        description: "Failed to upload file. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  return {
    uploading,
    uploadFile
  };
};
