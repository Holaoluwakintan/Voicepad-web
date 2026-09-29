import { ArrowRight, Zap, Lightbulb, Sparkles } from 'lucide-react';

export default function UseCases({ scrollTo }: { scrollTo: (id: string) => void }) {
  return (
    <section className="dark-section" id="use-cases">
      <div className="container use-case-heading">
        <div>
          <div className="eyebrow eyebrow-light"><span className="eyebrow-dot" /> A place for all of it</div>
          <h2>Big ideas. Tiny errands.<br /><em>Everything in between.</em></h2>
        </div>
        <p>One calm home for the thoughts that make up your work, your life, and the person you’re becoming.</p>
      </div>
      <div className="container use-case-grid">
        <button className="use-case-card use-case-card-active" onClick={() => scrollTo("demo")}>
          <span className="use-case-icon"><Zap size={19} /></span>
          <small>FOR YOUR WORK</small>
          <h3>Meetings that<br /><em>move forward.</em></h3>
          <span className="use-case-link">Transcribe a meeting <ArrowRight size={15} /></span>
        </button>
        <button className="use-case-card use-case-card-lilac" onClick={() => scrollTo("demo")}>
          <span className="use-case-icon"><Lightbulb size={19} /></span>
          <small>FOR YOUR LIFE</small>
          <h3>Thoughts worth<br /><em>coming back to.</em></h3>
          <span className="use-case-link">Capture a life note <ArrowRight size={15} /></span>
        </button>
        <button className="use-case-card use-case-card-yellow" onClick={() => scrollTo("demo")}>
          <span className="use-case-icon"><Sparkles size={19} /></span>
          <small>FOR YOUR IDEAS</small>
          <h3>Catch the spark<br /><em>before it fades.</em></h3>
          <span className="use-case-link">Save an idea <ArrowRight size={15} /></span>
        </button>
      </div>
    </section>
  );
}
