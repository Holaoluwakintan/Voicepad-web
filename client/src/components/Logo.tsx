export default function Logo({ inverted = false }: { inverted?: boolean }) {
  return (
    <a href="#top" className={`brand ${inverted ? 'brand-inverted' : ''}`} aria-label="VoicePad home">
      <span className="brand-mark"><span /><span /><span /></span>
      <span>voicepad</span>
    </a>
  );
}
