import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase, displayName } from '../lib/supabase';
import { listNotes, type VoiceNote } from '../lib/notes';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [savedNotes, setSavedNotes] = useState<VoiceNote[]>([]);

  const refreshNotes = async (userId?: string) => {
    try {
      const notes = await listNotes(userId || user?.id);
      setSavedNotes(notes);
    } catch {
      // Silently fall back to empty
    }
  };

  useEffect(() => {
    // Initial load from local or supabase
    void refreshNotes();

    if (!supabase) return;
    let active = true;

    try {
      supabase.auth
        .getSession()
        .then(({ data }) => {
          if (!active) return;
          setUser(data.session?.user ?? null);
          if (data.session?.user) void refreshNotes(data.session.user.id);
        })
        .catch((err) => {
          console.warn('Could not fetch Supabase session, using local mode:', err);
        });

      const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
        if (!active) return;
        setUser(session?.user ?? null);
        if (session?.user) void refreshNotes(session.user.id);
        else {
          void refreshNotes();
        }
      });

      return () => {
        active = false;
        listener?.subscription?.unsubscribe?.();
      };
    } catch (err) {
      console.warn('Supabase auth listener setup failed:', err);
    }
  }, []);

  const signOut = async () => {
    try {
      await supabase?.auth.signOut();
    } catch {}
    setUser(null);
    void refreshNotes();
  };

  return { user, savedNotes, setSavedNotes, refreshNotes, signOut, displayName };
}
