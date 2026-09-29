export default function Wave({ compact = false }: { compact?: boolean }) {
  const bars = [18,35,25,49,30,60,38,74,43,28,55,32,68,42,22,52,34,46,25,64,33,55,26,42,30,70,38,54,24,44,20,37];
  return (
    <div className={`wave ${compact ? "wave-compact" : ""}`} aria-hidden="true">
      {bars.map((height, index) => (
        <i key={index} style={{ height: `${compact ? height * 0.62 : height}%`, animationDelay: `${index * 24}ms` }} />
      ))}
    </div>
  );
}
