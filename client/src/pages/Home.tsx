import { useState } from 'react';
import Toast from '../components/Toast';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import StudioWorkspace from '../components/studio/StudioWorkspace';
import LogoStrip from '../components/sections/LogoStrip';
import HowItWorks from '../components/sections/HowItWorks';
import Features from '../components/sections/Features';
import UseCases from '../components/sections/UseCases';
import Pricing from '../components/sections/Pricing';
import FAQ from '../components/sections/FAQ';
import Footer from '../components/sections/Footer';
import AuthDialog from '../components/AuthDialog';
import { useAuth } from '../hooks/useAuth';

export default function Home() {
  const { user, savedNotes, setSavedNotes, refreshNotes, signOut, displayName } = useAuth();
  const [toast, setToast] = useState('');
  const [authOpen, setAuthOpen] = useState(false);

  const notify = (msg: string) => { setToast(msg); window.setTimeout(() => setToast(''), 3000); };
  const scrollTo = (id: string) => { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); };

  return (
    <div className="site-shell" id="top">
      <Toast message={toast} />
      <section className="hero-section">
        <div className="hero-glow hero-glow-one" />
        <div className="hero-glow hero-glow-two" />
        <Navbar
          user={user}
          onSignIn={() => setAuthOpen(true)}
          onSignOut={() => { void signOut(); notify("You're signed out."); }}
          scrollTo={scrollTo}
          displayName={displayName}
        />
        <HeroSection scrollTo={scrollTo}>
          <StudioWorkspace
            user={user}
            savedNotes={savedNotes}
            setSavedNotes={setSavedNotes}
            refreshNotes={refreshNotes}
            onAuthOpen={() => setAuthOpen(true)}
            notify={notify}
          />
        </HeroSection>
        <div className="scroll-cue">
          <span>Scroll to explore</span>
          <span className="scroll-line" />
        </div>
      </section>
      <LogoStrip />
      <HowItWorks scrollTo={scrollTo} />
      <Features scrollTo={scrollTo} notify={notify} />
      <UseCases scrollTo={scrollTo} />
      <Pricing scrollTo={scrollTo} notify={notify} />
      <FAQ notify={notify} />
      <Footer scrollTo={scrollTo} notify={notify} />
      {authOpen && (
        <AuthDialog
          onClose={() => setAuthOpen(false)}
          onAuthed={() => { setAuthOpen(false); notify('Welcome to VoicePad. Your future transcripts will be saved.'); }}
        />
      )}
    </div>
  );
}
