import { supabase } from '@/integrations/supabase/client';

export const ensureTuckersCollection = async (): Promise<void> => {
  const { data: existing, error: checkError } = await supabase
    .from('collections')
    .select('id')
    .eq('slug', 'tuckers-tees')
    .maybeSingle();

  if (checkError && checkError.code !== 'PGRST116') {
    throw checkError;
  }

  if (!existing) {
    const { error: createError } = await supabase
      .from('collections')
      .insert({
        name: "Tucker's Tees",
        description: "Special collection from co-founder Tucker",
        slug: 'tuckers-tees',
        is_active: true,
        sort_order: 0
      });

    if (createError) throw createError;
  }
};

export const fetchTuckersData = async () => {
  await ensureTuckersCollection();
  
  // Parallel fetch designs and collection
  const [designsResult, collectionResult] = await Promise.all([
    supabase
      .from('designs')
      .select('id, title, status, file_url, collection_id, created_at, user_id')
      .eq('status', 'published')
      .order('created_at', { ascending: false }),
    supabase
      .from('collections')
      .select('id, name, slug')
      .eq('slug', 'tuckers-tees')
      .single()
  ]);

  if (designsResult.error) throw designsResult.error;

  const designsData = designsResult.data || [];
  const userIds = [...new Set(designsData.map(d => d.user_id).filter(Boolean))];
  
  const { data: profilesData } = await supabase
    .from('profiles')
    .select('id, first_name, last_name')
    .in('id', userIds);

  const profileMap = new Map(profilesData?.map(p => [p.id, p]) || []);

  const designsWithProfiles = designsData.map(design => ({
    ...design,
    profiles: profileMap.get(design.user_id) || { first_name: 'Unknown', last_name: 'Creator' }
  }));

  return {
    designsWithProfiles,
    collection: collectionResult.data
  };
};

export const assignDesignToTuckers = async (designId: string, collectionId: string) => {
  const { error } = await supabase
    .from('designs')
    .update({ collection_id: collectionId })
    .eq('id', designId);

  if (error) throw error;
};

export const removeDesignFromTuckers = async (designId: string) => {
  const { error } = await supabase
    .from('designs')
    .update({ collection_id: null })
    .eq('id', designId);

  if (error) throw error;
};
