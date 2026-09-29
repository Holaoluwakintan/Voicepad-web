import { Mic, Play, WandSparkles } from 'lucide-react';
import Wave from '../Wave';
import { formatTime } from '../../hooks/useRecorder';

type Props = {
  status: 'idle' | 'recording' | 'transcribing' | 'ready' | 'error';
  recording: boolean;
  seconds: number;
  onToggleRecording: () => void;
};

export default function RecordCard({ status, recording, seconds, onToggleRecording }: Props) {
  return (
    <div className={`record-card record-card-large ${recording ? "record-card-live" : ""} ${status === "transcribing" ? "record-card-loading" : ""}`}>
      <div className="record-card-top">
        <span className="record-card-icon">
          {status === "transcribing" ? <WandSparkles size={17} /> : <Mic size={17} fill="currentColor" />}
        </span>
        <div>
          <strong>{status === "transcribing" ? "Transcribing your voice..." : recording ? "Listening..." : "Capture the thought"}</strong>
          <small>{recording ? formatTime(seconds) : status === "transcribing" ? "Usually takes less than a minute" : "Start recording or upload a file"}</small>
        </div>
        <button className="record-trigger" onClick={onToggleRecording} disabled={status === "transcribing"}>
          {recording ? <span className="stop-square" /> : status === "transcribing" ? <span className="spinner" /> : <Play size={16} fill="currentColor" />}
        </button>
      </div>
      <Wave compact />
    </div>
  );
}
