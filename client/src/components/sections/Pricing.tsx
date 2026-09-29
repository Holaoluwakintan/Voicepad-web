import { Check, ArrowRight } from 'lucide-react';

export default function Pricing({ scrollTo, notify }: { scrollTo: (id: string) => void; notify: (msg: string) => void; }) {
  return (
    <section className="section pricing-section" id="pricing">
      <div className="container pricing-heading">
        <div>
          <div className="eyebrow"><span className="eyebrow-dot" /> Start with what matters</div>
          <h2>Room to think.<br /><em>No pressure to pay.</em></h2>
        </div>
        <p>Transcription is free while VoicePad is in beta. We’ll introduce paid plans later for people who want more storage, more AI, and more ways to work with their notes.</p>
      </div>
      <div className="container pricing-grid">
        <div className="price-card price-card-featured">
          <span className="price-badge">AVAILABLE NOW</span>
          <span className="price-label">BETA</span>
          <h3>For the everyday thinker.</h3>
          <p>Try the essential VoicePad experience while we build the next layer with you.</p>
          <div className="price"><strong>Free</strong><span>during beta</span></div>
          <button className="button button-coral" onClick={() => scrollTo("demo")}>Transcribe free <ArrowRight size={15} /></button>
          <ul>
            <li><Check size={14} /> Browser recording</li>
            <li><Check size={14} /> Audio file uploads</li>
            <li><Check size={14} /> Fast English transcripts</li>
          </ul>
        </div>
        <div className="price-card">
          <span className="price-label">FOCUS</span>
          <h3>For your best work.</h3>
          <p>Higher limits, AI summaries, and a searchable home for everything you’ve said.</p>
          <div className="price"><strong>$5</strong><span>/month</span></div>
          <button className="button button-dark" onClick={() => scrollTo("demo")}>Get Focus Plan <ArrowRight size={15} /></button>
          <ul>
            <li><Check size={14} /> Unlimited voice notes</li>
            <li><Check size={14} /> AI summaries & action items</li>
            <li><Check size={14} /> Custom tags and exports</li>
          </ul>
        </div>
        <div className="price-card">
          <span className="price-label">TEAM</span>
          <h3>For thinking together.</h3>
          <p>Shared spaces for teams who want to capture context and keep momentum.</p>
          <div className="price"><strong>Coming soon</strong></div>
          <button className="button button-outline-dark" onClick={() => notify("Team plan conversations are coming soon.")}>Talk to us <ArrowRight size={15} /></button>
          <ul>
            <li><Check size={14} /> Shared team spaces</li>
            <li><Check size={14} /> Admin controls</li>
            <li><Check size={14} /> Priority support</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
