/** Selo que identifica conteúdo provisório ou demonstrativo. Nunca removê-lo sem trocar o dado. */
export function PlaceholderTag({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-2 border border-bronze/35 bg-ink/70 px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.22em] text-bronze-soft backdrop-blur-sm ${className}`}
    >
      <span className="size-1 rounded-full bg-bronze" aria-hidden />
      {children}
    </span>
  );
}
