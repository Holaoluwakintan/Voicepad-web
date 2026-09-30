import { supabase } from './supabase';

export const CATEGORIES = ['Personal', 'Meetings', 'Lectures', 'Sermons'] as const;
export type Category = (typeof CATEGORIES)[number];

export type VoiceNote = {
  id: string;
  user_id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  category: Category;
  pinned: boolean;
  transcript: string | null;
  summary: string | null;
  transcription_status: 'pending' | 'ready' | 'failed' | null;
  transcription_error: string | null;
};

const LOCAL_STORAGE_KEY = 'voicepad_local_notes';

function getLocalNotes(): VoiceNote[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalNotes(notes: VoiceNote[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(notes));
  } catch {}
}

export async function listNotes(userId?: string): Promise<VoiceNote[]> {
  if (supabase && userId && userId !== 'guest') {
    try {
      const { data, error } = await supabase
        .from('voicepad_notes')
        .select('*')
        .eq('user_id', userId)
        .is('deleted_at', null)
        .order('created_at', { ascending: false });
      if (!error && data && data.length > 0) return data as VoiceNote[];
    } catch {
      // Fallback to local storage if Supabase query fails
    }
  }
  return getLocalNotes();
}

export async function insertTranscript(
  userId: string,
  transcript: string,
  title: string,
  category: Category
): Promise<VoiceNote> {
  const id = `voice-${crypto.randomUUID().replaceAll('-', '').slice(0, 18)}`;
  const now = new Date().toISOString();
  const localNote: VoiceNote = {
    id,
    user_id: userId || 'guest',
    title,
    content: transcript,
    transcript,
    category,
    created_at: now,
    updated_at: now,
    pinned: false,
    summary: null,
    transcription_status: 'ready',
    transcription_error: null,
  };

  if (supabase && userId && userId !== 'guest') {
    try {
      const { data, error } = await supabase
        .from('voicepad_notes')
        .insert({
          id,
          user_id: userId,
          title,
          content: transcript,
          transcript,
          category,
          source: 'voice',
          transcription_status: 'ready',
          pinned: false,
        })
        .select()
        .single();
      if (!error && data) {
        // Also cache locally
        const existing = getLocalNotes().filter((n) => n.id !== id);
        saveLocalNotes([data as VoiceNote, ...existing]);
        return data as VoiceNote;
      }
    } catch {
      // Fallback to local storage
    }
  }

  const existing = getLocalNotes().filter((n) => n.id !== id);
  saveLocalNotes([localNote, ...existing]);
  return localNote;
}

export async function updateNote(
  id: string,
  patch: Partial<Pick<VoiceNote, 'title' | 'category' | 'pinned' | 'summary' | 'content' | 'transcript'>>
): Promise<VoiceNote> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('voicepad_notes')
        .update(patch)
        .eq('id', id)
        .select()
        .single();
      if (!error && data) {
        const local = getLocalNotes();
        const updated = local.map((n) => (n.id === id ? { ...n, ...patch } : n));
        saveLocalNotes(updated);
        return data as VoiceNote;
      }
    } catch {
      // Fallback to local
    }
  }

  const local = getLocalNotes();
  const existing = local.find((n) => n.id === id);
  const updated: VoiceNote = existing
    ? { ...existing, ...patch, updated_at: new Date().toISOString() }
    : {
        id,
        user_id: 'guest',
        title: patch.title || 'Untitled note',
        content: patch.content || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        category: patch.category || 'Personal',
        pinned: patch.pinned || false,
        transcript: patch.transcript || null,
        summary: patch.summary || null,
        transcription_status: 'ready',
        transcription_error: null,
      };

  const nextNotes = [updated, ...local.filter((n) => n.id !== id)];
  saveLocalNotes(nextNotes);
  return updated;
}
