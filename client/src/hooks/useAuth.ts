import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase, displayName } from '../lib/supabase';
import { listNotes, type VoiceNote } from '../lib/notes';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [savedNotes, setSavedNotes] = useState<VoiceNote[]>([]);

  const refreshNotes = async (userId?: string) => {
    const id = userId || user?.id;
    if (!id) return;
    try {
      setSavedNotes(await listNotes(id));
    } catch {
      // Silently fail — caller can handle
    }
  };

  useEffect(() => {
    if (!supabase) return;
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setUser(data.session?.user ?? null);
      if (data.session?.user) void refreshNotes(data.session.user.id);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) void refreshNotes(session.user.id);
      else {
        setSavedNotes([]);
      }
    });
    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase?.auth.signOut();
  };

  return { user, savedNotes, setSavedNotes, refreshNotes, signOut, displayName };
}
