import { FileText, Star, Sparkles } from 'lucide-react';
import { CATEGORIES, type Category, type VoiceNote } from '../../lib/notes';

type Props = {
  transcript: string;
  selectedNote: VoiceNote | null;
  category: Category;
  setCategory: (c: Category) => void;
  onCopy: () => void;
  onSave: () => void;
  onSummarize: () => void;
  summaryBusy: boolean;
  summary: string;
};

export default function TranscriptResult({ transcript, selectedNote, category, setCategory, onCopy, onSave, onSummarize, summaryBusy, summary }: Props) {
  return (
    <div className="transcript-result">
      <div className="transcript-result-header">
        <span><span className="live-dot" /> TRANSCRIPT {selectedNote && <span className="saved-label">· SAVED</span>}</span>
        <button onClick={onCopy}><FileText size={13} /> Copy</button>
      </div>
      <p>{transcript}</p>
      <div className="transcript-result-footer">
        <span>{transcript.trim().split(/\s+/).length} words</span>
        <div className="result-actions">
          {!selectedNote && (
            <>
              <select aria-label="Choose note category" value={category} onChange={(event) => setCategory(event.target.value as Category)}>
                {CATEGORIES.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
              <button onClick={onSave}><Star size={13} /> Save note</button>
            </>
          )}
          {selectedNote && (
            <button onClick={onSummarize} disabled={summaryBusy}>
              <Sparkles size={13} /> {summaryBusy ? "Thinking..." : summary ? "Refresh AI insight" : "Summarize"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
