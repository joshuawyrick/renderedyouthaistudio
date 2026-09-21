
import React from 'react';
import { RYCard } from '@/components/ui/ry-card';
import { useCreatorEarnings } from '@/hooks/useCreatorEarnings';
import { DollarSign, Clock, CheckCircle, TrendingUp } from 'lucide-react';

const CreatorEarningsSection = () => {
  const { summary, earnings, loading } = useCreatorEarnings();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <RYCard key={i} className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              </div>
            </RYCard>
          ))}
        </div>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-amber-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'text-green-600 bg-green-50';
      case 'pending':
        return 'text-amber-600 bg-amber-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Earnings Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <RYCard className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Earnings</p>
              <p className="text-2xl font-bold text-ry-black">
                ${summary.total_earnings.toFixed(2)}
              </p>
            </div>
          </div>
        </RYCard>

        <RYCard className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Clock className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-ry-black">
                ${summary.pending_earnings.toFixed(2)}
              </p>
            </div>
          </div>
        </RYCard>

        <RYCard className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Sales</p>
              <p className="text-2xl font-bold text-ry-black">
                {summary.total_sales}
              </p>
            </div>
          </div>
        </RYCard>
      </div>

      {/* Recent Earnings */}
      <RYCard className="p-6">
        <h3 className="text-lg font-semibold text-ry-black mb-4">Recent Earnings</h3>
        
        {earnings.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <DollarSign className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No earnings yet</p>
            <p className="text-sm">Your earnings will appear here once your designs start selling!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {earnings.slice(0, 10).map((earning) => (
              <div key={earning.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-ry-black">{earning.product_title}</h4>
                  <p className="text-sm text-gray-600">
                    {new Date(earning.created_at).toLocaleDateString()} • 
                    Commission: {(earning.commission_rate * 100).toFixed(0)}%
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 mb-1">
                    {getStatusIcon(earning.payout_status)}
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(earning.payout_status)}`}>
                      {earning.payout_status}
                    </span>
                  </div>
                  <p className="font-semibold text-ry-black">
                    ${earning.creator_share.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500">
                    of ${earning.gross_amount.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </RYCard>
    </div>
  );
};

export default CreatorEarningsSection;
