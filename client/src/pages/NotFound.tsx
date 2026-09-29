import Logo from '../components/Logo';

export default function NotFound() {
  return (
    <div className="site-shell" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <header className="site-nav container">
        <Logo inverted />
      </header>
      <main className="container" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
        <h1 style={{ fontSize: '4rem', marginBottom: '1rem' }}>404</h1>
        <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>We couldn't find the page you're looking for.</p>
        <a href="/" className="button button-coral">Return to Home</a>
      </main>
    </div>
  );
}
