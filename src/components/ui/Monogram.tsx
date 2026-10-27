/** Marca provisória (monograma DP). Substituir pelo logotipo oficial em SVG. */
export function Monogram({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden fill="none">
      <rect x="1" y="1" width="38" height="38" transform="rotate(45 20 20) translate(5.86 5.86) scale(0.707)" stroke="currentColor" strokeWidth="1.2" />
      <text x="20" y="25.2" textAnchor="middle" fontFamily="var(--font-bebas), sans-serif" fontSize="15" letterSpacing="0.5" fill="currentColor">
        DP
      </text>
    </svg>
  );
}

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <Monogram className="size-9 text-bronze-soft" />
      <span className="flex flex-col leading-none">
        <span className="font-display text-[1.6rem] tracking-[0.14em] text-bone">DOM PABLO</span>
        <span className="mt-0.5 text-[0.5rem] font-semibold uppercase tracking-[0.5em] text-ash">Barbearia · Cuiabá</span>
      </span>
    </span>
  );
}
