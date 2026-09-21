import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import TopNav from '@/components/navigation/TopNav';
import Footer from '@/components/layout/Footer';
import CreatorDashboardHeader from '@/components/creator/CreatorDashboardHeader';
import CreatorStatsGrid from '@/components/creator/CreatorStatsGrid';
import RecentDesignsSection from '@/components/creator/RecentDesignsSection';
import PendingApprovalsSection from '@/components/creator/PendingApprovalsSection';
import QuickActionsSection from '@/components/creator/QuickActionsSection';
import CreatorEarningsSection from '@/components/creator/CreatorEarningsSection';
import StripeConnectSetup from '@/components/creator/StripeConnectSetup';
import { useCreatorEarnings } from '@/hooks/useCreatorEarnings';
import { supabase } from '@/integrations/supabase/client';

interface RecentDesign {
  id: string;
  title: string;
  status: string;
  uploadDate: string;
  sales: number;
  earnings: number;
}

interface PendingDesign {
  id: string;
  title: string;
  status: string;
  created_at: string;
}

const CreatorDashboard = () => {
  const { user } = useAuth();
  const { summary: earningsSummary } = useCreatorEarnings();
  const [recentDesigns, setRecentDesigns] = useState<RecentDesign[]>([]);
  const [pendingApprovalsCount, setPendingApprovalsCount] = useState(0);
  const [totalDesigns, setTotalDesigns] = useState(0);
  const [pendingDesigns, setPendingDesigns] = useState<PendingDesign[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    if (!user) return;

    try {
      const { data: designs, error } = await supabase
        .from('designs')
        .select('id, title, status, created_at')
        .eq('user_id', user.id)
        .neq('status', 'consumed')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const designsData = designs || [];
      setTotalDesigns(designsData.length);
      
      const pendingDesignsData = designsData.filter(d => 
        d.status === 'pending_review' || d.status === 'mockups_ready'
      );
      setPendingApprovalsCount(pendingDesignsData.length);
      setPendingDesigns(pendingDesignsData);

      const formattedDesigns: RecentDesign[] = designsData.slice(0, 5).map(design => ({
        id: design.id,
        title: design.title,
        status: design.status || 'pending',
        uploadDate: design.created_at,
        sales: 0,
        earnings: 0
      }));

      setRecentDesigns(formattedDesigns);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user, fetchDashboardData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <TopNav />
        <div className="pt-40 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="animate-pulse space-y-6">
              <div className="h-24 bg-muted rounded" />
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-32 bg-muted rounded" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <div className="pt-40">
        <div className="max-w-7xl mx-auto p-6">
          <CreatorDashboardHeader />
          
          <CreatorStatsGrid
            totalEarnings={earningsSummary.total_earnings}
            teesSold={earningsSummary.total_sales}
            pendingApprovalsCount={pendingApprovalsCount}
            totalDesigns={totalDesigns}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-2">
              <CreatorEarningsSection />
            </div>
            <div>
              <StripeConnectSetup />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <RecentDesignsSection recentDesigns={recentDesigns} />
            <div className="space-y-8">
              <PendingApprovalsSection pendingDesigns={pendingDesigns} />
              <QuickActionsSection />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CreatorDashboard;
