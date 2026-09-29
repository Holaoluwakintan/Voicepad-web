import { useState } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';
import Logo from './Logo';
import type { User } from '@supabase/supabase-js';

type Props = {
  user: User | null;
  onSignIn: () => void;
  onSignOut: () => void;
  scrollTo: (id: string) => void;
  displayName: (user: User | null) => string;
};

export default function Navbar({ user, onSignIn, onSignOut, scrollTo, displayName }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="site-nav container">
      <Logo inverted />
      <nav className={`nav-links ${menuOpen ? "nav-links-open" : ""}`}>
        <button onClick={() => { scrollTo("how-it-works"); setMenuOpen(false); }}>How it works</button>
        <button onClick={() => { scrollTo("use-cases"); setMenuOpen(false); }}>For your life</button>
        <button onClick={() => { scrollTo("pricing"); setMenuOpen(false); }}>Pricing</button>
        <button onClick={() => { scrollTo("faq"); setMenuOpen(false); }}>FAQ</button>
        <div className="mobile-nav-actions">
          <button className="nav-signin" onClick={() => user ? onSignOut() : onSignIn()}>{user ? "Sign out" : "Sign in"}</button>
          <button className="button button-small button-light" onClick={() => { scrollTo("demo"); setMenuOpen(false); }}>Try VoicePad <ArrowRight size={15} /></button>
        </div>
      </nav>
      <div className="nav-actions">
        <button className="nav-signin" onClick={() => user ? onSignOut() : onSignIn()}>{user ? displayName(user) : "Sign in"}</button>
        <button className="button button-small button-light" onClick={() => scrollTo("demo")}>Try VoicePad <ArrowRight size={15} /></button>
      </div>
      <button className="menu-toggle" onClick={() => setMenuOpen((open) => !open)} aria-label="Toggle menu">
        {menuOpen ? <X size={22} /> : <Menu size={22} />}
      </button>
    </header>
  );
}
