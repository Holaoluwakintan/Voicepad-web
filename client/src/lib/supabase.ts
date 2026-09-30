import { createClient, type User } from '@supabase/supabase-js';

const url = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.trim() || 'https://vfwdrpvfcvwsrhxuabak.supabase.co';
const anonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined)?.trim() || 'sb_publishable_c7Dqa3N6mHOmrN64oPDkHw_saVtTEFK';

export const supabase =
  url && anonKey
    ? createClient(url.replace(/\/$/, ''), anonKey, {
        auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
      })
    : null;

export async function getAuthHeaders(): Promise<Record<string, string>> {
  if (!supabase) return {};
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token
    ? { Authorization: `Bearer ${data.session.access_token}` }
    : {};
}

export function displayName(user: User | null): string {
  return user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'VoicePad user';
}
