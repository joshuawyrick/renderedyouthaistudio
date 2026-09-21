import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Collection {
  id: string;
  name: string;
  slug: string;
  is_active: boolean;
  sort_order: number;
}

export const useNavigationData = () => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [showAgeGroups, setShowAgeGroups] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchNavigationData();
  }, []);

  const fetchNavigationData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch both collections and settings in parallel for better performance
      const [collectionsResponse, settingsResponse] = await Promise.all([
        supabase
          .from('collections')
          .select('id, name, slug, is_active, sort_order')
          .eq('is_active', true)
          .order('sort_order', { ascending: true }),
        supabase
          .from('platform_settings')
          .select('setting_value')
          .eq('setting_key', 'show_age_groups_in_nav')
          .maybeSingle()
      ]);

      // Handle collections
      if (collectionsResponse.error) {
        console.error('Error fetching collections:', collectionsResponse.error);
      } else {
        setCollections(collectionsResponse.data || []);
      }

      // Handle settings
      if (settingsResponse.error && settingsResponse.error.code !== 'PGRST116') {
        console.error('Error fetching navigation settings:', settingsResponse.error);
      } else {
        setShowAgeGroups(settingsResponse.data?.setting_value !== 'false');
      }
    } catch (error) {
      console.error('Error fetching navigation data:', error);
      setShowAgeGroups(true);
    } finally {
      setIsLoading(false);
    }
  };

  return { collections, showAgeGroups, isLoading };
};