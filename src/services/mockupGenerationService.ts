import { supabase } from '@/integrations/supabase/client';

export type AiStatus = 'pending' | 'generating' | 'ready' | 'failed';

export interface GenerateMockupsResult {
  success: boolean;
  generated?: number;
  failed?: number;
  error?: string;
}

/**
 * Ask the AI to render four print-ready shirt designs from a submitted drawing.
 * Safe to call from the creator's own device or from the admin dashboard - the
 * edge function authorizes the caller.
 */
export const generateMockups = async (
  designId: string,
): Promise<GenerateMockupsResult> => {
  const { data, error } = await supabase.functions.invoke('generate-mockups', {
    body: { designId },
  });

  if (error) {
    return { success: false, error: error.message ?? 'Generation failed' };
  }

  if (data?.error) {
    return { success: false, error: data.error };
  }

  return {
    success: true,
    generated: data?.generated ?? 0,
    failed: data?.failed ?? 0,
  };
};

/** Current AI generation state for a design. */
export const fetchAiStatus = async (
  designId: string,
): Promise<{ status: AiStatus; error: string | null } | null> => {
  const { data, error } = await supabase
    .from('designs')
    .select('ai_status, ai_error')
    .eq('id', designId)
    .maybeSingle();

  if (error || !data) return null;

  return {
    status: (data.ai_status as AiStatus) ?? 'pending',
    error: data.ai_error ?? null,
  };
};
