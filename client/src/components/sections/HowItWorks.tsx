import { ArrowDownRight, Lightbulb, Check, Zap } from 'lucide-react';
import Wave from '../Wave';

export default function HowItWorks({ scrollTo }: { scrollTo: (id: string) => void }) {
  return (
    <section className="section section-intro" id="how-it-works">
      <div className="container intro-grid">
        <div>
          <div className="eyebrow"><span className="eyebrow-dot" /> The simple version</div>
          <h2>Your brain is for making connections.<br /><em>Not holding onto every word.</em></h2>
        </div>
        <div className="intro-aside">
          <p>VoicePad gives your passing thoughts a place to land. Speak naturally, and get back a note you can actually use.</p>
          <button className="circle-link" onClick={() => scrollTo("features")}><ArrowDownRight size={20} /></button>
        </div>
      </div>
      <div className="container process-grid">
        <div className="process-card process-card-coral">
          <div className="process-number">01</div>
          <div className="process-visual process-visual-wave">
            <Wave />
            <span className="visual-caption">Your raw voice</span>
          </div>
          <h3>Talk like you think</h3>
          <p>Record a meeting thought, a midnight idea, or a grocery list. No format, no friction.</p>
        </div>
        <div className="process-card process-card-lilac">
          <div className="process-number">02</div>
          <div className="process-visual transcript-visual">
            <div className="transcript-line width-long" />
            <div className="transcript-line width-mid" />
            <div className="transcript-line width-short" />
            <span className="visual-caption">Your clean transcript</span>
          </div>
          <h3>Get the shape of it</h3>
          <p>VoicePad transcribes what you said and gently clears away the noise.</p>
        </div>
        <div className="process-card process-card-yellow">
          <div className="process-number">03</div>
          <div className="process-visual insight-visual">
            <span><Lightbulb size={20} /></span>
            <span><Check size={18} /></span>
            <span><Zap size={18} /></span>
            <span className="visual-caption">Your useful next move</span>
          </div>
          <h3>Make it actionable</h3>
          <p>Find the ideas, decisions, and next steps hiding inside the recording.</p>
        </div>
      </div>
    </section>
  );
}
