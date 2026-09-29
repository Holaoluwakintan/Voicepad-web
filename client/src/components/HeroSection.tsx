import type { ReactNode } from 'react';
import { ArrowDownRight, ArrowRight } from 'lucide-react';

type Props = {
  scrollTo: (id: string) => void;
  children: ReactNode;
};

export default function HeroSection({ scrollTo, children }: Props) {
  return (
    <div className="hero-content container">
      <div className="hero-copy">
        <div className="eyebrow eyebrow-light"><span className="eyebrow-dot" /> Your thoughts, in their best shape</div>
        <h1>Say it once.<br /><em>Keep it forever.</em></h1>
        <p className="hero-lede">VoicePad turns the things you say out loud into clear, useful notes — so the good ideas don’t disappear between one thought and the next.</p>
        <div className="hero-buttons">
          <button className="button button-coral" onClick={() => scrollTo("demo")}>Transcribe for free <ArrowDownRight size={17} /></button>
          <button className="text-button text-button-light" onClick={() => scrollTo("how-it-works")}>See how it works <ArrowRight size={16} /></button>
        </div>
        <div className="hero-proof">
          <div className="avatar-stack"><span>AN</span><span>JM</span><span>KS</span><span>+</span></div>
          <p><strong>Free during beta.</strong><br />No account or credit card required.</p>
        </div>
      </div>
      <div className="hero-product" id="demo">
        {children}
      </div>
    </div>
  );
}
