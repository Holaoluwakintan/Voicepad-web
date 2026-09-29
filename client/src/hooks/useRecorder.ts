import { useRef, useState, useEffect } from 'react';

export type RecordingStatus = 'idle' | 'recording' | 'transcribing' | 'ready' | 'error';

export function useRecorder() {
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [status, setStatus] = useState<RecordingStatus>('idle');
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const audioUrl = useRef<string | null>(null);
  const audioPlayer = useRef<HTMLAudioElement | null>(null);
  const fileInput = useRef<HTMLInputElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!recording) return;
    const interval = window.setInterval(() => setSeconds((v) => v + 1), 1000);
    return () => window.clearInterval(interval);
  }, [recording]);

  useEffect(() => {
    return () => {
      if (audioUrl.current) URL.revokeObjectURL(audioUrl.current);
    };
  }, []);

  const startRecording = async (onBlob: (blob: Blob, filename: string) => void) => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setStatus('error');
      throw new Error('Your browser does not support microphone recording. Upload an audio file instead.');
    }
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    audioChunks.current = [];
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) audioChunks.current.push(e.data);
    };
    recorder.onstop = () => {
      stream.getTracks().forEach((t) => t.stop());
      const blob = new Blob(audioChunks.current, { type: recorder.mimeType || 'audio/webm' });
      if (audioUrl.current) URL.revokeObjectURL(audioUrl.current);
      audioUrl.current = URL.createObjectURL(blob);
      if (audioPlayer.current) audioPlayer.current.src = audioUrl.current;
      onBlob(blob, `voicepad-${Date.now()}.webm`);
    };
    recorder.start();
    mediaRecorder.current = recorder;
    setRecording(true);
    setStatus('recording');
    setSeconds(0);
  };

  const stopRecording = () => {
    mediaRecorder.current?.stop();
    setRecording(false);
    setStatus('transcribing');
  };

  const handleFileUpload = (file: File, onBlob: (blob: Blob, filename: string) => void) => {
    if (file.size > 25 * 1024 * 1024) {
      setStatus('error');
      throw new Error('That file is larger than 25MB. Choose a shorter recording and try again.');
    }
    if (audioUrl.current) URL.revokeObjectURL(audioUrl.current);
    audioUrl.current = URL.createObjectURL(file);
    if (audioPlayer.current) audioPlayer.current.src = audioUrl.current;
    onBlob(file, file.name);
  };

  const togglePlayback = () => {
    if (!audioPlayer.current) return;
    if (isPlaying) {
      audioPlayer.current.pause();
      setIsPlaying(false);
    } else {
      void audioPlayer.current.play();
      setIsPlaying(true);
    }
  };

  return {
    recording,
    seconds,
    status,
    setStatus,
    isPlaying,
    setIsPlaying,
    audioPlayer,
    fileInput,
    startRecording,
    stopRecording,
    handleFileUpload,
    togglePlayback,
  };
}

export function formatTime(value: number): string {
  const mins = String(Math.floor(value / 60)).padStart(2, '0');
  const secs = String(value % 60).padStart(2, '0');
  return `${mins}:${secs}`;
}
