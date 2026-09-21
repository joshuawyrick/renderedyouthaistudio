
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { StatsWidget } from '@/components/ui/stats-widget';
import { RYCard } from '@/components/ui/ry-card';
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  Package,
  Clock,
  CheckCircle,
  Star,
  Eye
} from 'lucide-react';

interface AdminStatsProps {
  onStatusClick?: (status: string) => void;
}

const AdminStats = ({ onStatusClick }: AdminStatsProps) => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-dashboard-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('admin_dashboard_stats')
        .select('*')
        .single();

      if (error) {
        console.error('Error fetching admin stats:', error);
        return null;
      }

      return data;
    },
  });

  const handleStatusClick = (status: string) => {
    if (onStatusClick) {
      onStatusClick(status);
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-32 bg-gray-200 animate-pulse rounded-lg"></div>
        ))}
      </div>
    );
  }

  if (!stats) {
    return (
      <RYCard className="p-6 text-center">
        <p className="text-gray-600">Unable to load dashboard statistics</p>
      </RYCard>
    );
  }

  return (
    <div className="space-y-8">
      {/* Design Management Stats */}
      <div>
        <h3 className="text-xl font-semibold text-ry-black mb-4">Design Management</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div onClick={() => handleStatusClick('pending_review')} className="cursor-pointer">
            <StatsWidget
              label="Pending Review"
              value={stats.pending_review_count?.toString() || '0'}
              icon={<Clock className="h-6 w-6" />}
              className="border-yellow-200 bg-yellow-50 hover:shadow-lg transition-shadow"
            />
          </div>
          <div onClick={() => handleStatusClick('mockups_ready')} className="cursor-pointer">
            <StatsWidget
              label="Ready for Creator Review"
              value={stats.mockups_ready_count?.toString() || '0'}
              icon={<Eye className="h-6 w-6" />}
              className="border-blue-200 bg-blue-50 hover:shadow-lg transition-shadow"
            />
          </div>
          <div onClick={() => handleStatusClick('selected')} className="cursor-pointer">
            <StatsWidget
              label="Selected by Creator"
              value={stats.selected_count?.toString() || '0'}
              icon={<Star className="h-6 w-6" />}
              className="border-purple-200 bg-purple-50 hover:shadow-lg transition-shadow"
            />
          </div>
          <div onClick={() => handleStatusClick('published')} className="cursor-pointer">
            <StatsWidget
              label="Published Products"
              value={stats.published_count?.toString() || '0'}
              icon={<CheckCircle className="h-6 w-6" />}
              className="border-green-200 bg-green-50 hover:shadow-lg transition-shadow"
            />
          </div>
        </div>
      </div>

      {/* Revenue & Sales Stats */}
      <div>
        <h3 className="text-xl font-semibold text-ry-black mb-4">Revenue & Sales (Last 30 Days)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsWidget
            label="Total Revenue"
            value={`$${(stats.revenue_last_30_days || 0).toFixed(2)}`}
            icon={<DollarSign className="h-6 w-6" />}
            className="border-green-200 bg-green-50"
          />
          <StatsWidget
            label="Your Revenue"
            value={`$${(stats.admin_revenue_last_30_days || 0).toFixed(2)}`}
            icon={<TrendingUp className="h-6 w-6" />}
            className="border-blue-200 bg-blue-50"
          />
          <StatsWidget
            label="Creator Commissions"
            value={`$${(stats.creator_commissions_last_30_days || 0).toFixed(2)}`}
            icon={<Users className="h-6 w-6" />}
            className="border-purple-200 bg-purple-50"
          />
          <StatsWidget
            label="Units Sold"
            value={stats.units_sold_last_30_days?.toString() || '0'}
            icon={<Package className="h-6 w-6" />}
            className="border-orange-200 bg-orange-50"
          />
        </div>
      </div>

      {/* Active Products */}
      <div>
        <h3 className="text-xl font-semibold text-ry-black mb-4">Store Management</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StatsWidget
            label="Active Products"
            value={stats.active_products_count?.toString() || '0'}
            icon={<Package className="h-6 w-6" />}
            className="border-green-200 bg-green-50"
          />
        </div>
      </div>
    </div>
  );
};

export default AdminStats;
