import { getAuthHeaders } from './supabase';

export const API_URL = (
  import.meta.env.VITE_TRANSCRIPTION_API_URL?.trim() || 'http://localhost:8787'
).replace(/\/$/, '');

export function friendlyError(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);
  if (/failed to fetch|network/i.test(message))
    return "We couldn't reach the transcription service. Check your connection and try again.";
  if (/timed out|abort/i.test(message))
    return 'The service took too long to respond. It may be waking up — please retry in a moment.';
  return message || 'Something went wrong. Please try again.';
}

export async function transcribeAudio(blob: Blob, filename: string): Promise<{ text: string; model?: string }> {
  const form = new FormData();
  form.append('file', blob, filename);
  form.append('mode', 'english');
  const response = await fetch(`${API_URL}/transcribe`, {
    method: 'POST',
    headers: await getAuthHeaders(),
    body: form,
  });
  const payload = await response.json().catch(() => null);
  if (!response.ok) throw new Error(payload?.error || `Transcription failed (${response.status})`);
  if (!payload?.text) throw new Error('The service returned an empty transcript.');
  return { text: payload.text.trim(), model: payload.model };
}

export async function summarizeText(text: string): Promise<{ summary: string; model?: string }> {
  const response = await fetch(`${API_URL}/summarize`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(await getAuthHeaders()) },
    body: JSON.stringify({ text }),
  });
  const payload = await response.json().catch(() => null);
  if (!response.ok) throw new Error(payload?.error || 'AI summary could not be generated.');
  const summary = payload?.summary?.trim();
  if (!summary) throw new Error('AI summary came back empty.');
  return { summary, model: payload.model };
}
