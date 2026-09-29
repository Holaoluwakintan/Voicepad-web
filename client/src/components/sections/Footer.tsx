import Logo from '../Logo';

export default function Footer({ scrollTo, notify }: { scrollTo: (id: string) => void; notify: (msg: string) => void; }) {
  return (
    <footer className="site-footer">
      <div className="container footer-top">
        <div>
          <Logo />
          <p>A softer place for your<br />loudest thoughts.</p>
        </div>
        <div className="footer-links">
          <div>
            <span>Explore</span>
            <button onClick={() => scrollTo("how-it-works")}>How it works</button>
            <button onClick={() => scrollTo("pricing")}>Pricing</button>
            <button onClick={() => scrollTo("faq")}>FAQ</button>
          </div>
          <div>
            <span>Follow along</span>
            <button onClick={() => notify("Instagram link coming soon.")}>Instagram</button>
            <button onClick={() => notify("X link coming soon.")}>X / Twitter</button>
            <button onClick={() => notify("Email link coming soon.")}>Contact</button>
          </div>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© 2026 VoicePad, Inc.</span>
        <span>Free transcription during beta.</span>
        <span>Privacy · Terms</span>
      </div>
    </footer>
  );
}
