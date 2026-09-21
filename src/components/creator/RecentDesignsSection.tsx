
import React from 'react';
import { RYCard } from '@/components/ui/ry-card';
import { RYButton } from '@/components/ui/ry-button';
import { Eye } from 'lucide-react';

interface RecentDesign {
  id: string;
  title: string;
  status: string;
  uploadDate: string;
  sales: number;
  earnings: number;
}

interface RecentDesignsSectionProps {
  recentDesigns: RecentDesign[];
}

const RecentDesignsSection: React.FC<RecentDesignsSectionProps> = ({ recentDesigns }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'approved': return 'bg-blue-100 text-blue-800';
      case 'selected': return 'bg-purple-100 text-purple-800';
      case 'mockups_ready': return 'bg-orange-100 text-orange-800';
      case 'pending_review': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'mockups_ready': return 'Ready for Review';
      case 'pending_review': return 'Pending Review';
      default: return status;
    }
  };

  const handleReviewMockups = (designId: string) => {
    window.location.href = `/design-review?design=${designId}`;
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-ry-black mb-6">My Designs</h2>
      <div className="grid gap-4">
        {recentDesigns.map((design) => (
          <RYCard key={design.id} className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-2">
                  <h3 className="text-lg font-semibold text-ry-black">
                    {design.title}
                  </h3>
                  <span className={`px-2 py-1 text-xs rounded-lg font-medium ${getStatusColor(design.status)}`}>
                    {getStatusLabel(design.status)}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  Uploaded on {new Date(design.uploadDate).toLocaleDateString()}
                </p>
                
                {design.status === 'mockups_ready' && (
                  <div className="mt-3">
                    <RYButton
                      variant="primary"
                      size="sm"
                      onClick={() => handleReviewMockups(design.id)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Review Mockups
                    </RYButton>
                  </div>
                )}
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-ry-black">
                  ${design.earnings.toFixed(2)}
                </p>
                <p className="text-sm text-gray-600">
                  {design.sales} sales
                </p>
              </div>
            </div>
          </RYCard>
        ))}
      </div>
      
      <div className="mt-6 text-center">
        <RYButton 
          variant="outline" 
          onClick={() => window.location.href = '/creator/collection'}
        >
          View All Designs
        </RYButton>
      </div>
    </div>
  );
};

export default RecentDesignsSection;
