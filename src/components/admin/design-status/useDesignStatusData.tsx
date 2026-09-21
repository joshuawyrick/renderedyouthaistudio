import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Design } from './types';

export const useDesignStatusData = () => {
  return useQuery({
    queryKey: ['admin-designs-by-status'],
    queryFn: async (): Promise<Design[]> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('designs')
        .select(`
          id, title, status,
          ai_status,
          ai_error, created_at, file_url, user_id,
          design_mockups(id),
          design_selections(id)
        `)
        .neq('status', 'consumed')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching designs:', error);
        return [];
      }

      // Batch fetch profiles
      const userIds = [...new Set((data || []).map(d => d.user_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, first_name, last_name')
        .in('id', userIds);

      const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);

      return (data || []).map(item => ({
        id: item.id,
        title: item.title,
        status: item.status,
        created_at: item.created_at,
        file_url: item.file_url,
        user_id: item.user_id,
        design_mockups: item.design_mockups || [],
        design_selections: item.design_selections || [],
        profiles: profileMap.get(item.user_id) || { first_name: null, last_name: null }
      }));
    },
  });
};
