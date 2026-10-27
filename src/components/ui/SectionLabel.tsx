export function SectionLabel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`eyebrow flex items-center gap-4 text-ash ${className}`}>
      <span className="h-px w-10 bg-bronze-soft" aria-hidden />
      {children}
    </p>
  );
}
