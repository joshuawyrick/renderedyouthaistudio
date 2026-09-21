
import React from 'react';
import { StatsWidget } from '@/components/ui/stats-widget';
import { DollarSign, TrendingUp, Eye, Upload } from 'lucide-react';

interface CreatorStatsGridProps {
  totalEarnings: number;
  teesSold: number;
  pendingApprovalsCount: number;
  totalDesigns: number;
}

const CreatorStatsGrid: React.FC<CreatorStatsGridProps> = ({
  totalEarnings,
  teesSold,
  pendingApprovalsCount,
  totalDesigns
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      <StatsWidget
        label="Total Earnings"
        value={`$${totalEarnings.toFixed(2)}`}
        icon={<DollarSign className="h-6 w-6" />}
      />
      <StatsWidget
        label="Tees Sold"
        value={teesSold.toString()}
        icon={<TrendingUp className="h-6 w-6" />}
      />
      <StatsWidget
        label="Pending Approvals"
        value={pendingApprovalsCount.toString()}
        icon={<Eye className="h-6 w-6" />}
      />
      <StatsWidget
        label="Total Designs"
        value={totalDesigns.toString()}
        icon={<Upload className="h-6 w-6" />}
      />
    </div>
  );
};

export default CreatorStatsGrid;
