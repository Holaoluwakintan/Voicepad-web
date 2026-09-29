import { Check, ArrowRight, Sparkles, Mic, WandSparkles, MoreHorizontal } from 'lucide-react';

type Props = { scrollTo: (id: string) => void; notify: (msg: string) => void; };

export default function Features({ scrollTo, notify }: Props) {
  return (
    <section className="section feature-section" id="features">
      <div className="container feature-grid">
        <div className="feature-copy">
          <div className="eyebrow"><span className="eyebrow-dot" /> Less organizing, more doing</div>
          <h2>From scattered thoughts to <em>solid ground.</em></h2>
          <p>VoicePad brings a little editorial care to the messiest part of thinking: the moment before an idea becomes a plan.</p>
          <div className="feature-list">
            <div>
              <span className="feature-check"><Check size={14} /></span>
              <p><strong>Transcription you can trust</strong><br />Fast, accurate text that keeps your voice intact.</p>
            </div>
            <div>
              <span className="feature-check"><Check size={14} /></span>
              <p><strong>Works with your existing recordings</strong><br />Upload audio or record right here in the browser.</p>
            </div>
            <div>
              <span className="feature-check"><Check size={14} /></span>
              <p><strong>Free while we build</strong><br />Try the core experience before paid plans arrive.</p>
            </div>
          </div>
          <button className="text-button" onClick={() => scrollTo("demo")}>Transcribe something now <ArrowRight size={16} /></button>
        </div>
        <div className="transcript-panel">
          <div className="panel-header">
            <span><span className="live-dot" /> VoicePad transcript</span>
            <span>Just now</span>
          </div>
          <div className="speaker-line">
            <span className="speaker-avatar">VP</span>
            <p><strong>Your voice</strong><br /><span>“The best ideas rarely arrive fully formed. They arrive as a sentence you almost forget...”</span></p>
          </div>
          <div className="highlight-line">
            <span className="highlight-icon"><Sparkles size={15} /></span>
            <div><small>VoicePad found a thread</small><strong>Keep the thought. Find the next move.</strong></div>
          </div>
          <div className="panel-actions">
            <button onClick={() => scrollTo("demo")}><Mic size={14} /> Try the recorder</button>
            <button onClick={() => notify("AI summaries will be available in the next beta update.")}><WandSparkles size={14} /> Summarize</button>
            <button><MoreHorizontal size={15} /></button>
          </div>
        </div>
      </div>
    </section>
  );
}
