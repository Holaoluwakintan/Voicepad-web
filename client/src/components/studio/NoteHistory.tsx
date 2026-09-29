import { FileText, ArrowRight } from 'lucide-react';
import type { VoiceNote } from '../../lib/notes';

type Props = {
  notes: VoiceNote[];
  selectedNoteId: string | null;
  onSelectNote: (note: VoiceNote) => void;
};

export default function NoteHistory({ notes, selectedNoteId, onSelectNote }: Props) {
  return (
    <div className="history-panel">
      <div className="history-heading">
        <span><FileText size={13} /> YOUR SAVED NOTES</span>
        <small>{notes.length} {notes.length === 1 ? "note" : "notes"}</small>
      </div>
      {notes.length ? notes.slice(0, 3).map((note) => (
        <button className={`history-row ${selectedNoteId === note.id ? "history-row-active" : ""}`} key={note.id} onClick={() => onSelectNote(note)}>
          <span className={`history-note-dot history-note-dot-${note.category.toLowerCase()}`} />
          <span>
            <strong>{note.title}</strong>
            <small>{note.category} · {new Date(note.created_at).toLocaleDateString()}</small>
          </span>
          <ArrowRight size={13} />
        </button>
      )) : (
        <p className="history-empty">Your saved transcripts will appear here.</p>
      )}
    </div>
  );
}
