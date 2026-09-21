
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RYCard } from '@/components/ui/ry-card';
import { RYButton } from '@/components/ui/ry-button';
import { useToast } from '@/components/ui/use-toast';
import { Upload, X, Image } from 'lucide-react';

interface MockupUploaderProps {
  designId: string;
  onComplete: () => void;
  onCancel: () => void;
}

const MockupUploader = ({ designId, onComplete, onCancel }: MockupUploaderProps) => {
  const [mockupFiles, setMockupFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length + mockupFiles.length > 4) {
      toast({
        title: "Too many files",
        description: "Maximum 4 mockups allowed",
        variant: "destructive",
      });
      return;
    }

    setMockupFiles(prev => [...prev, ...imageFiles].slice(0, 4));
  };

  const removeFile = (index: number) => {
    setMockupFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadMockups = async () => {
    if (mockupFiles.length === 0) {
      toast({
        title: "No files selected",
        description: "Please select at least one mockup image",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      // Upload each mockup file
      const uploadPromises = mockupFiles.map(async (file, index) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `mockup-${designId}-${index + 1}.${fileExt}`;
        const filePath = `mockups/${fileName}`;

        const { data, error } = await supabase.storage
          .from('designs')
          .upload(filePath, file);

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
          .from('designs')
          .getPublicUrl(filePath);

        return {
          mockup_url: publicUrl,
          mockup_order: index + 1
        };
      });

      const mockupData = await Promise.all(uploadPromises);

      // Save mockups to database
      const { error: dbError } = await supabase
        .from('design_mockups')
        .insert(
          mockupData.map(mockup => ({
            design_id: designId,
            mockup_url: mockup.mockup_url,
            mockup_order: mockup.mockup_order
          }))
        );

      if (dbError) throw dbError;

      // Update design status to 'mockups_ready'
      await supabase
        .from('designs')
        .update({ status: 'mockups_ready' })
        .eq('id', designId);

      // Send notification email
      await supabase.functions.invoke('send-review-notification', {
        body: { designId }
      });

      toast({
        title: "Mockups Created!",
        description: "The creator has been notified that their design is ready for review",
      });

      onComplete();
    } catch (error) {
      console.error('Error uploading mockups:', error);
      toast({
        title: "Error",
        description: "Failed to upload mockups",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <RYCard className="p-6">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-ry-black mb-2">
          Upload Mockups
        </h3>
        <p className="text-gray-600">
          Upload up to 4 mockup images for the creator to review
        </p>
      </div>

      <div className="space-y-4">
        {/* File Upload Area */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-ry-yellow transition-colors">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            id="mockup-upload"
          />
          <label
            htmlFor="mockup-upload"
            className="cursor-pointer flex flex-col items-center"
          >
            <Upload className="h-12 w-12 text-gray-400 mb-4" />
            <span className="text-lg font-medium text-gray-700 mb-2">
              Choose mockup images
            </span>
            <span className="text-sm text-gray-500">
              PNG, JPG up to 10MB each (max 4 files)
            </span>
          </label>
        </div>

        {/* Preview Selected Files */}
        {mockupFiles.length > 0 && (
          <div className="grid grid-cols-2 gap-4">
            {mockupFiles.map((file, index) => (
              <div key={index} className="relative">
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Mockup ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <X className="h-4 w-4" />
                </button>
                <div className="text-center mt-2">
                  <span className="text-sm font-medium">Mockup {index + 1}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <RYButton
            onClick={uploadMockups}
            disabled={uploading || mockupFiles.length === 0}
            variant="primary"
            className="flex-1"
          >
            {uploading ? 'Uploading...' : 'Submit Mockups'}
          </RYButton>
          <RYButton
            onClick={onCancel}
            variant="secondary"
            disabled={uploading}
          >
            Cancel
          </RYButton>
        </div>
      </div>
    </RYCard>
  );
};

export default MockupUploader;
