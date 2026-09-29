import { useState, useRef, useEffect, type ChangeEvent } from 'react';
import {
  MoreHorizontal, ChevronDown, Mic, Upload, FileText, Star, Tags,
  CircleHelp, Command, Search, Sparkles, ArrowRight, Zap
} from 'lucide-react';
import type { User } from '@supabase/supabase-js';
import { CATEGORIES, insertTranscript, type Category, type VoiceNote, updateNote } from '../../lib/notes';
import { displayName, getAuthHeaders } from '../../lib/supabase';
import RecordCard from './RecordCard';
import TranscriptResult from './TranscriptResult';
import AISummary from './AISummary';
import NoteHistory from './NoteHistory';

const API_URL = (import.meta.env.VITE_TRANSCRIPTION_API_URL?.trim() || "https://voicepad-transcription.onrender.com").replace(/\/$/, "");

function friendlyError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  if (/failed to fetch|network/i.test(message)) return "We couldn't reach the transcription service. Check your connection and try again.";
  if (/timed out|abort/i.test(message)) return "The service took too long to respond. It may be waking up — please retry in a moment.";
  return message || "Something went wrong. Please try again.";
}

type Props = {
  user: User | null;
  savedNotes: VoiceNote[];
  setSavedNotes: React.Dispatch<React.SetStateAction<VoiceNote[]>>;
  refreshNotes: (userId?: string) => Promise<void>;
  onAuthOpen: () => void;
  notify: (msg: string) => void;
};

export default function StudioWorkspace({ user, savedNotes, setSavedNotes, refreshNotes, onAuthOpen, notify }: Props) {
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [status, setStatus] = useState<"idle" | "recording" | "transcribing" | "ready" | "error">("idle");
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState("");
  const [workspaceTab, setWorkspaceTab] = useState<"recent" | "starred">("recent");
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedNote, setSelectedNote] = useState<VoiceNote | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<"All" | Category>("All");
  const [category, setCategory] = useState<Category>("Personal");
  const [summary, setSummary] = useState("");
  const [summaryBusy, setSummaryBusy] = useState(false);

  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const audioUrl = useRef<string | null>(null);
  const audioPlayer = useRef<HTMLAudioElement | null>(null);
  const fileInput = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!recording) return;
    const interval = window.setInterval(() => setSeconds((value) => value + 1), 1000);
    return () => window.clearInterval(interval);
  }, [recording]);

  useEffect(() => () => { if (audioUrl.current) URL.revokeObjectURL(audioUrl.current); }, []);

  const titleFromText = (text: string) => {
    const firstSentence = text.split(/[.!?\n]/)[0]?.trim() || "Untitled voice note";
    return firstSentence.slice(0, 52) + (firstSentence.length > 52 ? "…" : "");
  };

  const saveTranscript = async (text = transcript) => {
    if (!text.trim()) return;
    if (!user) { onAuthOpen(); return; }
    try {
      const note = await insertTranscript(user.id, text.trim(), titleFromText(text), category);
      setSavedNotes((current) => [note, ...current.filter((item) => item.id !== note.id)]);
      setSelectedNote(note);
      notify("Saved to your VoicePad history.");
    } catch {
      notify("Transcript is ready, but we couldn't save it. Please sign in again.");
    }
  };

  const summarizeTranscript = async (text = transcript) => {
    if (!text.trim()) return;
    setSummaryBusy(true); setError("");
    try {
      const response = await fetch(`${API_URL}/summarize`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...await getAuthHeaders() },
        body: JSON.stringify({ text })
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok) throw new Error(payload?.error || "AI summary could not be generated.");
      const nextSummary = payload?.summary?.trim();
      if (!nextSummary) throw new Error("AI summary came back empty.");
      setSummary(nextSummary);
      if (selectedNote) {
        const updated = await updateNote(selectedNote.id, { summary: nextSummary });
        setSelectedNote(updated);
        setSavedNotes((current) => current.map((item) => item.id === updated.id ? updated : item));
      }
      notify("Summary and action items are ready.");
    } catch (requestError) {
      setError(friendlyError(requestError));
    } finally {
      setSummaryBusy(false);
    }
  };

  const chooseNote = (note: VoiceNote) => {
    setSelectedNote(note);
    setTranscript(note.transcript || note.content || "");
    setSummary(note.summary || "");
    setCategory(note.category || "Personal");
    setStatus("ready");
  };

  const filteredNotes = savedNotes.filter((note) => {
    const matchesSearch = !searchQuery.trim() || `${note.title} ${note.transcript || note.content} ${note.summary || ""}`.toLowerCase().includes(searchQuery.trim().toLowerCase());
    const matchesCategory = categoryFilter === "All" || note.category === categoryFilter;
    const matchesTab = workspaceTab === "recent" || note.pinned;
    return matchesSearch && matchesCategory && matchesTab;
  });

  const transcribe = async (blob: Blob, filename: string) => {
    setStatus("transcribing"); setError(""); setTranscript("");
    const form = new FormData();
    form.append("file", blob, filename);
    form.append("mode", "english");
    try {
      const response = await fetch(`${API_URL}/transcribe`, { method: "POST", headers: await getAuthHeaders(), body: form });
      const payload = await response.json().catch(() => null);
      if (!response.ok) throw new Error(payload?.error || `Transcription failed (${response.status})`);
      if (!payload?.text) throw new Error("The service returned an empty transcript.");
      const cleanText = payload.text.trim();
      setTranscript(cleanText); setStatus("ready"); notify("Transcript ready — your words are now searchable.");
      if (user) await saveTranscript(cleanText);
    } catch (requestError) { setStatus("error"); setError(friendlyError(requestError)); }
  };

  const stopRecording = () => {
    mediaRecorder.current?.stop();
    setRecording(false); setStatus("transcribing");
  };

  const startRecording = async () => {
    setError("");
    if (!navigator.mediaDevices?.getUserMedia) { setError("Your browser does not support microphone recording. Upload an audio file instead."); setStatus("error"); return; }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      audioChunks.current = [];
      recorder.ondataavailable = (event) => { if (event.data.size > 0) audioChunks.current.push(event.data); };
      recorder.onstop = () => {
        stream.getTracks().forEach((track) => track.stop());
        const blob = new Blob(audioChunks.current, { type: recorder.mimeType || "audio/webm" });
        if (audioUrl.current) URL.revokeObjectURL(audioUrl.current);
        audioUrl.current = URL.createObjectURL(blob);
        if (audioPlayer.current) audioPlayer.current.src = audioUrl.current;
        void transcribe(blob, `voicepad-${Date.now()}.webm`);
      };
      recorder.start(); mediaRecorder.current = recorder; setRecording(true); setStatus("recording"); setSeconds(0); notify("Listening. Speak naturally — VoicePad will handle the rest.");
    } catch { setStatus("error"); setError("Microphone access is needed to record. You can allow it in your browser settings or upload a file instead."); }
  };

  const toggleRecording = () => recording ? stopRecording() : void startRecording();

  const handleUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 25 * 1024 * 1024) { setStatus("error"); setError("That file is larger than 25MB. Choose a shorter recording and try again."); return; }
    if (audioUrl.current) URL.revokeObjectURL(audioUrl.current);
    audioUrl.current = URL.createObjectURL(file);
    if (audioPlayer.current) audioPlayer.current.src = audioUrl.current;
    void transcribe(file, file.name);
    event.target.value = "";
  };

  const togglePlayback = () => {
    if (!audioPlayer.current) return;
    if (isPlaying) { audioPlayer.current.pause(); setIsPlaying(false); } else { void audioPlayer.current.play(); setIsPlaying(true); }
  };

  const copyTranscript = async () => { if (!transcript) return; await navigator.clipboard?.writeText(transcript); notify("Transcript copied to clipboard."); };

  return (
    <>
      <div className="product-window">
        <div className="window-topbar">
          <div className="window-dots"><i /><i /><i /></div>
          <div className="window-title">voicepad / transcription studio</div>
          <button className="window-menu"><MoreHorizontal size={17} /></button>
        </div>
        <div className="workspace-layout">
          <aside className="workspace-sidebar">
            <div className="workspace-profile">
              <div className="profile-avatar">VP</div>
              <div><strong>VoicePad beta</strong><span>Free transcription</span></div>
              <ChevronDown size={13} />
            </div>
            <button className="new-note-button" onClick={toggleRecording}>
              <span><Mic size={15} fill="currentColor" /></span>
              {recording ? "Stop recording" : "New thought"}
              <kbd>⌘ N</kbd>
            </button>
            <button className="upload-button" onClick={() => fileInput.current?.click()}>
              <Upload size={14} /> Upload audio
            </button>
            <input ref={fileInput} type="file" accept="audio/*,video/mp4" hidden onChange={handleUpload} />
            <div className="workspace-nav">
              <button className="workspace-nav-active"><FileText size={15} /> All notes <b>24</b></button>
              <button><Star size={15} /> Starred <b>6</b></button>
              <button><Tags size={15} /> Tags</button>
            </div>
            <div className="workspace-bottom">
              <button><CircleHelp size={15} /> Help center</button>
              <button><Command size={15} /> Shortcuts</button>
            </div>
          </aside>
          <main className="workspace-main">
            <div className="workspace-heading">
              <div>
                <span className="mini-label">LIVE TRANSCRIPTION STUDIO</span>
                <h3>{status === "ready" ? "Your transcript is ready." : status === "transcribing" ? "Finding the shape of it..." : "Say what’s on your mind."}</h3>
              </div>
              <button className="icon-button"><Search size={17} /></button>
            </div>
            <div className="workspace-controls">
              <div className="workspace-tabs">
                <button className={workspaceTab === "recent" ? "active" : ""} onClick={() => setWorkspaceTab("recent")}>Recent</button>
                <button className={workspaceTab === "starred" ? "active" : ""} onClick={() => setWorkspaceTab("starred")}>Starred</button>
              </div>
              <div className="workspace-filters">
                <input aria-label="Search saved notes" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search notes" />
                <select aria-label="Filter by category" value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value as "All" | Category)}>
                  <option value="All">All tags</option>
                  {CATEGORIES.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </div>
            </div>
            {transcript ? (
              <>
                <TranscriptResult 
                  transcript={transcript} 
                  selectedNote={selectedNote} 
                  category={category} 
                  setCategory={setCategory} 
                  onCopy={copyTranscript} 
                  onSave={() => void saveTranscript()} 
                  onSummarize={() => void summarizeTranscript()} 
                  summaryBusy={summaryBusy} 
                  summary={summary} 
                />
                <AISummary summary={summary} />
              </>
            ) : (
              <RecordCard status={status} recording={recording} seconds={seconds} onToggleRecording={toggleRecording} />
            )}
            {error && (
              <div className="inline-error">
                <span>!</span><p>{error}</p>
                <button onClick={() => { setError(""); setStatus("idle"); }}>Dismiss</button>
              </div>
            )}
            {user && (
              <NoteHistory notes={filteredNotes} selectedNoteId={selectedNote?.id || null} onSelectNote={chooseNote} />
            )}
            <div className="studio-hint">
              <span><Zap size={13} /></span>
              <p><strong>{user ? `Signed in as ${displayName(user)}` : "Free during beta"}</strong> · {user ? "Your transcripts are saved to your private history." : "Sign in to keep your transcripts."}</p>
            </div>
            <audio ref={audioPlayer} onEnded={() => setIsPlaying(false)} hidden />
          </main>
        </div>
      </div>
      <div className="floating-insight">
        <span className="insight-spark"><Sparkles size={15} /></span>
        <div>
          <small>VoicePad beta</small>
          <strong>{status === "ready" ? summary ? "AI insight ready" : "Transcript ready" : user ? "Your notes, saved" : "Free to try today"}</strong>
        </div>
        <ArrowRight size={16} />
      </div>
    </>
  );
}
