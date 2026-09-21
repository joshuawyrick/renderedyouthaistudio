
import React from 'react';
import { RYCard } from '@/components/ui/ry-card';
import { RYButton } from '@/components/ui/ry-button';
import { Clock, Eye } from 'lucide-react';

interface PendingDesign {
  id: string;
  title: string;
  status: string;
  created_at: string;
}

interface PendingApprovalsSectionProps {
  pendingDesigns?: PendingDesign[];
}

const PendingApprovalsSection: React.FC<PendingApprovalsSectionProps> = ({ 
  pendingDesigns = [] 
}) => {
  const handleReviewMockups = (designId: string) => {
    window.location.href = `/design-review?design=${designId}`;
  };

  const getActionButton = (design: PendingDesign) => {
    if (design.status === 'mockups_ready') {
      return (
        <RYButton
          variant="primary"
          size="sm"
          onClick={() => handleReviewMockups(design.id)}
        >
          <Eye className="h-4 w-4 mr-1" />
          Review Mockups
        </RYButton>
      );
    }
    return null;
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'mockups_ready': return 'Ready for Review';
      case 'pending_review': return 'Pending Review';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'mockups_ready': return 'bg-orange-50 border-orange-200 text-orange-800';
      case 'pending_review': return 'bg-amber-50 border-amber-200 text-amber-600';
      default: return 'bg-gray-50 border-gray-200 text-gray-600';
    }
  };

  return (
    <RYCard className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <Clock className="h-6 w-6 text-ry-yellow" />
        <h3 className="text-xl font-semibold text-ry-black">Pending Actions</h3>
      </div>
      
      {pendingDesigns.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No designs need your attention</p>
        </div>
      ) : (
        <div className="space-y-3">
          {pendingDesigns.map((design) => (
            <div key={design.id} className={`p-3 rounded-lg border ${getStatusColor(design.status)}`}>
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">{design.title}</span>
                <span className="text-sm">{getStatusText(design.status)}</span>
              </div>
              {getActionButton(design) && (
                <div className="mt-2">
                  {getActionButton(design)}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </RYCard>
  );
};

export default PendingApprovalsSection;
