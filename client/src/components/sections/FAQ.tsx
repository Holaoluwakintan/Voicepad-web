import { useState } from 'react';
import { ArrowRight, X } from 'lucide-react';
import { FAQS } from '../../lib/constants';

export default function FAQ({ notify }: { notify: (msg: string) => void }) {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  return (
    <section className="section faq-section" id="faq">
      <div className="container faq-grid">
        <div>
          <div className="eyebrow"><span className="eyebrow-dot" /> Questions, answered</div>
          <h2>Good to know.<br /><em>Before you begin.</em></h2>
          <p>Still curious? <button onClick={() => notify("Email support is coming soon.")}>Say hello to our team <ArrowRight size={14} /></button></p>
        </div>
        <div className="faq-list">
          {FAQS.map(([question, answer], index) => (
            <div className={`faq-item ${activeFaq === index ? "faq-open" : ""}`} key={question}>
              <button className="faq-question" onClick={() => setActiveFaq(activeFaq === index ? null : index)}>
                <span>{question}</span>
                <span className="faq-icon">{activeFaq === index ? <X size={15} /> : <span className="plus-icon">+</span>}</span>
              </button>
              {activeFaq === index && <p className="faq-answer">{answer}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
