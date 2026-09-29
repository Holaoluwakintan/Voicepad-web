import { Sparkles } from 'lucide-react';

export default function AISummary({ summary }: { summary: string }) {
  if (!summary) return null;
  return (
    <div className="ai-summary">
      <div className="ai-summary-head">
        <span><Sparkles size={14} /> AI INSIGHT</span>
        <small>Summary + action items</small>
      </div>
      <div className="ai-summary-body">
        {summary.split(/\n+/).map((line, index) => line.trim() && (
          <p key={`${line}-${index}`} className={/^[-*]|\[ \]/.test(line.trim()) ? "ai-action-line" : line.startsWith("###") ? "ai-heading-line" : ""}>
            {line.replace(/^###\s*/, "")}
          </p>
        ))}
      </div>
    </div>
  );
}
