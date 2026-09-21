import { supabase } from '@/integrations/supabase/client';

export interface CreatorProfile {
  id: string;
  displayName: string;
  username: string;
  ageBracket?: string;
  state?: string;
  avatarUrl?: string;
  designCount: number;
  created_at: string;
}

export const fetchCreatorProfiles = async (): Promise<CreatorProfile[]> => {
  try {
    
    // Get creator profiles with published designs count
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select(`
        id,
        first_name,
        last_name,
        username,
        age_bracket,
        state,
        profile_image_url,
        created_at,
        account_type
      `)
      .eq('account_type', 'creator')
      .order('created_at', { ascending: false })
      .limit(9);

    if (profilesError) {
      console.error('Error fetching creator profiles:', profilesError);
      return [];
    }

    if (!profiles || profiles.length === 0) {
      return [];
    }

    // Get design counts for each creator
    const creatorIds = profiles.map(profile => profile.id);
    const { data: designCounts, error: designError } = await supabase
      .from('designs')
      .select('user_id')
      .eq('status', 'published')
      .in('user_id', creatorIds);

    if (designError) {
      console.error('Error fetching design counts:', designError);
    }

    // Count designs per creator
    const designCountMap = (designCounts || []).reduce((acc, design) => {
      acc[design.user_id] = (acc[design.user_id] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Format the data for the UI
    const formattedProfiles: CreatorProfile[] = profiles.map(profile => ({
      id: profile.id,
      displayName: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Young Creator',
      username: profile.username || profile.id,
      ageBracket: profile.age_bracket || undefined,
      state: profile.state || undefined,
      avatarUrl: profile.profile_image_url || undefined,
      designCount: designCountMap[profile.id] || 0,
      created_at: profile.created_at
    }));

    
    return formattedProfiles;
  } catch (error) {
    console.error('Error in fetchCreatorProfiles:', error);
    return [];
  }
};