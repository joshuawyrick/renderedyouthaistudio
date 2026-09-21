import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';
const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const backendConfigured = Boolean(url && key);
export const supabase = createClient<Database>(url || 'https://backend-not-configured.invalid', key || 'not-configured', {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
});
