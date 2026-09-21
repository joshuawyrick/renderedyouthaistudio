
import React, { forwardRef, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import ProductPublishDialog from './product/ProductPublishDialog';
import { useDesignStatusData } from './design-status/useDesignStatusData';
import { getStatusInfo } from './design-status/statusConfig';
import StatusSection from './design-status/StatusSection';
import LoadingState from './design-status/LoadingState';
import type { Design } from './design-status/types';
import type { Design as ProductDesign } from './product/types';

interface DesignStatusCardsProps {
  onDesignClick: (design: any) => void;
}

const DesignStatusCards = forwardRef<HTMLDivElement, DesignStatusCardsProps>(
  ({ onDesignClick }, ref) => {
    const { toast } = useToast();
    const [publishDialogOpen, setPublishDialogOpen] = useState(false);
    const [selectedDesign, setSelectedDesign] = useState<ProductDesign | null>(null);
    
    const { data: designs = [], isLoading, refetch } = useDesignStatusData();

    const handlePublishClick = (design: Design) => {
      // Convert design-status Design to product Design format
      const productDesign: ProductDesign = {
        id: design.id,
        title: design.title,
        file_url: design.file_url,
        status: design.status,
        user_id: design.user_id,
        profiles: {
          first_name: design.profiles?.first_name || '',
          last_name: design.profiles?.last_name || ''
        }
      };
      setSelectedDesign(productDesign);
      setPublishDialogOpen(true);
    };

    const handlePublishComplete = () => {
      refetch();
      setPublishDialogOpen(false);
      setSelectedDesign(null);
    };

    const groupedDesigns = designs.reduce((acc, design) => {
      const status = design.status || 'pending_review';
      if (!acc[status]) acc[status] = [];
      acc[status].push(design);
      return acc;
    }, {} as Record<string, Design[]>);

    if (isLoading) {
      return <LoadingState />;
    }

    return (
      <>
        <div ref={ref} className="space-y-6">
          {Object.entries(groupedDesigns).map(([status, statusDesigns]) => {
            const statusInfo = getStatusInfo(status, 0, 0);
            
            return (
              <StatusSection
                key={status}
                status={status}
                designs={statusDesigns}
                statusInfo={statusInfo}
                onDesignClick={onDesignClick}
                onPublishClick={handlePublishClick}
              />
            );
          })}
        </div>

        <ProductPublishDialog
          design={selectedDesign}
          open={publishDialogOpen}
          onOpenChange={setPublishDialogOpen}
          onComplete={handlePublishComplete}
        />
      </>
    );
  }
);

DesignStatusCards.displayName = 'DesignStatusCards';

export default DesignStatusCards;
