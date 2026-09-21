
import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { RYCard } from '@/components/ui/ry-card';
import { RYButton } from '@/components/ui/ry-button';
import { Badge } from '@/components/ui/badge';
import {
  MoreHorizontal,
  Calendar,
  Package,
  Eye,
  Trash2,
  Sparkles,
  Loader2
} from 'lucide-react';
import type { Design, StatusInfo } from './types';
import { deleteDesignAndRelatedData } from '@/services/designDeletionService';
import { generateMockups } from '@/services/mockupGenerationService';
import { useToast } from '@/components/ui/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface DesignCardProps {
  design: Design;
  statusInfo: StatusInfo;
  onDesignClick: (design: Design) => void;
  onPublishClick: (design: Design) => void;
  onDelete?: (designId: string) => void;
}

const DesignCard: React.FC<DesignCardProps> = ({
  design,
  statusInfo,
  onDesignClick,
  onPublishClick,
  onDelete
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const hasAiMockups = design.ai_status === 'ready';

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const result = await generateMockups(design.id);
      if (result.success) {
        toast({
          title: "Designs generated",
          description: `${result.generated} design${result.generated === 1 ? '' : 's'} ready for the creator to choose from.`,
        });
        queryClient.invalidateQueries({ queryKey: ['admin-designs-by-status'] });
      } else {
        toast({
          title: "Generation failed",
          description: result.error || "Could not generate designs.",
          variant: "destructive",
        });
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteDesignAndRelatedData(design.id);
      if (result.success) {
        toast({
          title: "Design Deleted",
          description: "Design and all related data have been removed.",
        });
        onDelete?.(design.id);
      } else {
        toast({
          title: "Delete Failed",
          description: result.error || "Failed to delete design.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Delete Failed",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <RYCard className="p-4 hover:shadow-lg transition-shadow">
      <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
        <img
          src={design.file_url}
          alt={design.title}
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-ry-black truncate">{design.title}</h4>
          <Badge variant="secondary" className={statusInfo.color}>
            {statusInfo.label}
          </Badge>
        </div>
        
        <p className="text-sm text-gray-600 flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          {new Date(design.created_at).toLocaleDateString()}
        </p>

        {design.ai_status === 'failed' && design.ai_error && (
          <p className="text-xs text-destructive">
            AI generation failed: {design.ai_error}
          </p>
        )}

        {/* AI generation */}
        <RYButton
          variant={hasAiMockups ? 'secondary' : 'primary'}
          size="sm"
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-1" />
              {hasAiMockups ? 'Regenerate AI Designs' : 'Generate AI Designs'}
            </>
          )}
        </RYButton>

        <div className="flex gap-2">
          {design.status === 'pending_review' && (
            <RYButton
              variant="secondary"
              size="sm"
              onClick={() => onDesignClick(design)}
              className="flex-1"
            >
              <MoreHorizontal className="h-4 w-4 mr-1" />
              Upload Manually
            </RYButton>
          )}
          {design.status === 'selected' && (
            <RYButton
              variant="primary"
              size="sm"
              onClick={() => onPublishClick(design)}
              className="flex-1"
            >
              <Package className="h-4 w-4 mr-1" />
              Publish Product
            </RYButton>
          )}
          <RYButton
            variant="secondary"
            size="sm"
            onClick={() => window.open(design.file_url, '_blank')}
          >
            <Eye className="h-4 w-4" />
          </RYButton>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <RYButton
                variant="destructive"
                size="sm"
                disabled={isDeleting}
              >
                <Trash2 className="h-4 w-4" />
              </RYButton>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Design</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{design.title}"? This will permanently remove the design and all related data including mockups, selections, and products. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Deleting...' : 'Delete Design'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </RYCard>
  );
};

export default DesignCard;
