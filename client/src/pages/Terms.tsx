import { TERMS_SECTIONS } from '../lib/constants';
import Logo from '../components/Logo';

export default function Terms() {
  return (
    <div className="site-shell" id="top">
      <header className="site-nav container">
        <Logo inverted />
        <div className="nav-actions">
          <a href="/" className="button button-small button-light">Back to Home</a>
        </div>
      </header>
      <main className="container page-content" style={{ padding: '6rem 0' }}>
        <h1>Terms of Service</h1>
        <div className="legal-content">
          {TERMS_SECTIONS.map((section, idx) => (
            <div key={idx} style={{ marginBottom: '2rem' }}>
              <h3>{section.title}</h3>
              <p>{section.content}</p>
            </div>
          ))}
        </div>
        <div style={{ marginTop: '4rem' }}>
          <a href="/privacy" style={{ color: 'var(--coral)' }}>View Privacy Policy</a>
        </div>
      </main>
    </div>
  );
}
