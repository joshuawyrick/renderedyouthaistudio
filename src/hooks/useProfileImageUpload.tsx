
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';

export const useProfileImageUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const uploadProfileImage = async (file: File): Promise<string | null> => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to upload an image",
        variant: "destructive",
      });
      return null;
    }

    setUploading(true);
    
    try {
      // Create filename with user ID and timestamp
      const fileName = `${user.id}-${Date.now()}.${file.name.split('.').pop()}`;
      const filePath = `profile-images/${fileName}`;

      // Upload to Supabase storage
      const { data, error } = await supabase.storage
        .from('design-uploads')
        .upload(filePath, file);

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('design-uploads')
        .getPublicUrl(filePath);

      // Update user profile with new image URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          profile_image_url: publicUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      setProfileImageUrl(publicUrl);
      
      toast({
        title: "Success",
        description: "Profile image updated successfully",
      });

      return publicUrl;
    } catch (error) {
      console.error('Error uploading profile image:', error);
      toast({
        title: "Error",
        description: "Failed to upload profile image",
        variant: "destructive",
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  return {
    uploading,
    profileImageUrl,
    setProfileImageUrl,
    uploadProfileImage
  };
};
