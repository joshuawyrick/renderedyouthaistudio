
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface CreatorEarning {
  id: string;
  gross_amount: number;
  creator_share: number;
  platform_fee: number;
  commission_rate: number;
  payout_status: string;
  payout_date: string | null;
  created_at: string;
  product_title?: string;
}

interface EarningsSummary {
  total_earnings: number;
  pending_earnings: number;
  paid_earnings: number;
  total_sales: number;
}

export const useCreatorEarnings = () => {
  const { user } = useAuth();
  const [earnings, setEarnings] = useState<CreatorEarning[]>([]);
  const [summary, setSummary] = useState<EarningsSummary>({
    total_earnings: 0,
    pending_earnings: 0,
    paid_earnings: 0,
    total_sales: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchCreatorEarnings();
    }
  }, [user]);

  const fetchCreatorEarnings = async () => {
    if (!user) return;

    try {
      
      // Fetch individual earnings
      const { data: earningsData, error: earningsError } = await supabase
        .from('creator_earnings')
        .select(`
          id,
          gross_amount,
          creator_share,
          platform_fee,
          commission_rate,
          payout_status,
          payout_date,
          created_at,
          products!inner(title)
        `)
        .eq('creator_user_id', user.id)
        .order('created_at', { ascending: false });

      if (earningsError) {
        console.error('Error fetching earnings:', earningsError);
        return;
      }

      // Format earnings data
      const formattedEarnings = (earningsData || []).map(earning => ({
        ...earning,
        product_title: earning.products?.title || 'Unknown Product'
      }));

      setEarnings(formattedEarnings);

      // Calculate summary
      const totalEarnings = formattedEarnings.reduce((sum, e) => sum + Number(e.creator_share), 0);
      const pendingEarnings = formattedEarnings
        .filter(e => e.payout_status === 'pending')
        .reduce((sum, e) => sum + Number(e.creator_share), 0);
      const paidEarnings = formattedEarnings
        .filter(e => e.payout_status === 'paid')
        .reduce((sum, e) => sum + Number(e.creator_share), 0);

      setSummary({
        total_earnings: totalEarnings,
        pending_earnings: pendingEarnings,
        paid_earnings: paidEarnings,
        total_sales: formattedEarnings.length
      });


    } catch (error) {
      console.error('Error in fetchCreatorEarnings:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    earnings,
    summary,
    loading,
    refetch: fetchCreatorEarnings
  };
};
