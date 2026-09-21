import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';
const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const backendConfigured = Boolean(url && key);
// Never connect a rebuild to the original production project by default.
const unavailableFetch: typeof fetch = async () => new Response(JSON.stringify({ message: 'The test backend has not been connected.', code: 'NOT_CONFIGURED' }), { status: 503, headers: { 'Content-Type': 'application/json' } });
export const supabase = createClient<Database>(url || 'https://backend-not-configured.invalid', key || 'not-configured', {
  auth: { persistSession: backendConfigured, autoRefreshToken: backendConfigured, detectSessionInUrl: backendConfigured },
  ...(!backendConfigured ? { global: { fetch: unavailableFetch } } : {}),
});
