import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { RYButton } from '@/components/ui/ry-button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import MockupUploader from './MockupUploader';
import { Eye, Upload, X } from 'lucide-react';
import type { Design } from './design-status/types';

interface DesignActionsDialogProps {
  design: Design | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: () => void;
}

const DesignActionsDialog = ({ 
  design, 
  open, 
  onOpenChange, 
  onComplete 
}: DesignActionsDialogProps) => {
  const [showUploader, setShowUploader] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const { toast } = useToast();

  if (!design) return null;

  const handleReject = async () => {
    setIsRejecting(true);
    try {
      const { error } = await supabase
        .from('designs')
        .update({ status: 'rejected' })
        .eq('id', design.id);

      if (error) throw error;

      toast({
        title: "Design Rejected",
        description: "The design has been rejected",
        variant: "destructive",
      });

      onComplete();
      onOpenChange(false);
    } catch (error) {
      console.error('Error rejecting design:', error);
      toast({
        title: "Error",
        description: "Failed to reject design",
        variant: "destructive",
      });
    } finally {
      setIsRejecting(false);
    }
  };

  const handleMockupComplete = () => {
    setShowUploader(false);
    onComplete();
    onOpenChange(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatStatus = (status: string) => {
    return status.replace(/_/g, ' ');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Review Design: {design.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Design Preview */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Original Design</h3>
              <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                <img
                  src={design.file_url}
                  alt={design.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Design Details</h3>
              <dl className="space-y-3">
                <div>
                  <dt className="font-medium">Title</dt>
                  <dd className="text-muted-foreground">{design.title}</dd>
                </div>
                <div>
                  <dt className="font-medium">Submitted</dt>
                  <dd className="text-muted-foreground">{formatDate(design.created_at)}</dd>
                </div>
                <div>
                  <dt className="font-medium">Status</dt>
                  <dd className="text-muted-foreground capitalize">{formatStatus(design.status)}</dd>
                </div>
              </dl>

              <div className="mt-6">
                <RYButton
                  variant="secondary"
                  onClick={() => window.open(design.file_url, '_blank')}
                  className="w-full"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Full Size
                </RYButton>
              </div>
            </div>
          </div>

          {/* Actions */}
          {!showUploader ? (
            <div className="flex gap-3">
              <RYButton
                onClick={() => setShowUploader(true)}
                variant="primary"
                className="flex-1"
              >
                <Upload className="h-4 w-4 mr-2" />
                Create Mockups
              </RYButton>
              <RYButton
                onClick={handleReject}
                variant="secondary"
                className="px-6"
                disabled={isRejecting}
              >
                <X className="h-4 w-4 mr-2" />
                {isRejecting ? 'Rejecting...' : 'Reject'}
              </RYButton>
            </div>
          ) : (
            <MockupUploader
              designId={design.id}
              onComplete={handleMockupComplete}
              onCancel={() => setShowUploader(false)}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DesignActionsDialog;
