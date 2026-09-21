import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import { useAuth } from '@/contexts/AuthContext';

type Artist = Database['public']['Tables']['artists']['Row'];
type ArtistInsert = Database['public']['Tables']['artists']['Insert'];

export function useArtists() {
  const { session } = useAuth();
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!session) return;
    const { data, error } = await supabase
      .from('artists')
      .select('*')
      .eq('parent_id', session.user.id)
      .order('created_at', { ascending: true });
    if (!error && data) setArtists(data as Artist[]);
    setLoading(false);
  }, [session]);

  useEffect(() => { load(); }, [load]);

  const addArtist = useCallback(async (input: Omit<ArtistInsert, 'parent_id'>) => {
    if (!session) return { error: 'Not signed in.' };
    const { data, error } = await supabase
      .from('artists')
      .insert({ ...input, parent_id: session.user.id })
      .select()
      .single();
    if (error) return { error: error.message };
    if (data) setArtists(prev => [...prev, data as Artist]);
    return { error: null };
  }, [session]);

  const deleteArtist = useCallback(async (id: string) => {
    const { error } = await supabase.from('artists').delete().eq('id', id);
    if (error) return { error: error.message };
    setArtists(prev => prev.filter(a => a.id !== id));
    return { error: null };
  }, []);

  return { artists, loading, addArtist, deleteArtist, reload: load };
}
