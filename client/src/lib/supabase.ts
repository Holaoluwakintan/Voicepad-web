import { createClient, type User } from '@supabase/supabase-js';

function initSupabase() {
  try {
    let rawUrl = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.trim();
    let rawKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined)?.trim();

    // If not provided in environment, use defaults if available
    if (!rawUrl) rawUrl = 'https://vfwdrpvfcvwsrhxuabak.supabase.co';
    if (!rawKey) rawKey = 'sb_publishable_c7Dqa3N6mHOmrN64oPDkHw_saVtTEFK';

    // Strip wrapping quotes if entered in Vercel dashboard
    rawUrl = rawUrl.replace(/^["']|["']$/g, '').trim();
    rawKey = rawKey.replace(/^["']|["']$/g, '').trim();

    if (!rawUrl || !rawKey) return null;

    // Ensure protocol is valid HTTP or HTTPS
    if (!rawUrl.startsWith('http://') && !rawUrl.startsWith('https://')) {
      rawUrl = `https://${rawUrl}`;
    }
    rawUrl = rawUrl.replace(/\/+$/, '');

    return createClient(rawUrl, rawKey, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
    });
  } catch (err) {
    console.warn('Supabase initialization caught error, running in local mode:', err);
    return null;
  }
}

export const supabase = initSupabase();

export async function getAuthHeaders(): Promise<Record<string, string>> {
  if (!supabase) return {};
  try {
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token
      ? { Authorization: `Bearer ${data.session.access_token}` }
      : {};
  } catch {
    return {};
  }
}

export function displayName(user: User | null): string {
  return user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'VoicePad user';
}
