import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import { useAuth } from '@/contexts/AuthContext';

type Design = Database['public']['Tables']['designs']['Row'];
type DesignInsert = Database['public']['Tables']['designs']['Insert'];
type DesignUpdate = Database['public']['Tables']['designs']['Update'];

export function useDesigns() {
  const { session } = useAuth();
  const [designs, setDesigns] = useState<Design[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!session) return;
    const { data, error } = await supabase
      .from('designs')
      .select('*')
      .eq('parent_id', session.user.id)
      .order('created_at', { ascending: false });
    if (!error && data) setDesigns(data as Design[]);
    setLoading(false);
  }, [session]);

  useEffect(() => { load(); }, [load]);

  const addDesign = useCallback(async (input: Omit<DesignInsert, 'parent_id'>) => {
    if (!session) return { error: 'Not signed in.' };
    const { data, error } = await supabase
      .from('designs')
      .insert({ ...input, parent_id: session.user.id })
      .select()
      .single();
    if (error) return { error: error.message };
    if (data) setDesigns(prev => [data as Design, ...prev]);
    return { error: null, data: data as Design };
  }, [session]);

  const updateDesign = useCallback(async (id: string, patch: DesignUpdate) => {
    const { data, error } = await supabase
      .from('designs')
      .update(patch)
      .eq('id', id)
      .select()
      .single();
    if (error) return { error: error.message };
    if (data) setDesigns(prev => prev.map(d => d.id === id ? data as Design : d));
    return { error: null, data: data as Design };
  }, []);

  const deleteDesign = useCallback(async (id: string) => {
    const { error: mockupsErr } = await supabase.from('design_mockups').delete().eq('design_id', id);
    if (mockupsErr) return { error: mockupsErr.message };
    const { error } = await supabase.from('designs').delete().eq('id', id);
    if (error) return { error: error.message };
    setDesigns(prev => prev.filter(d => d.id !== id));
    return { error: null };
  }, []);

  const archiveDesign = useCallback(async (id: string) => {
    const { data, error } = await supabase.from('designs').update({ archived_at: new Date().toISOString() } as any).eq('id', id).select().single();
    if (error) return { error: error.message };
    if (data) setDesigns(prev => prev.map(d => d.id === id ? data as Design : d));
    return { error: null };
  }, []);

  const unarchiveDesign = useCallback(async (id: string) => {
    const { data, error } = await supabase.from('designs').update({ archived_at: null } as any).eq('id', id).select().single();
    if (error) return { error: error.message };
    if (data) setDesigns(prev => prev.map(d => d.id === id ? data as Design : d));
    return { error: null };
  }, []);

  return { designs, loading, addDesign, updateDesign, deleteDesign, archiveDesign, unarchiveDesign, reload: load };
}
