const words = ["Cuiabá", "Corte", "Barba", "Tratamentos capilares", "Estética masculina", "Experiências exclusivas"];

/** Letreiro fino e espaçado entre a abertura e o manifesto, como na referência. */
export function Ticker() {
  const row = (
    <div className="flex shrink-0 items-center">
      {words.map((w) => (
        <span key={w} className="flex items-center">
          <span className="px-6 text-[0.68rem] font-medium uppercase tracking-[0.45em] text-bone/75 md:px-10 md:text-xs">{w}</span>
          <span className="size-1 rotate-45 bg-bronze" aria-hidden />
        </span>
      ))}
    </div>
  );
  return (
    <div className="relative overflow-hidden border-y border-line bg-ink py-4 md:py-5" aria-hidden>
      <div className="animate-marquee flex w-max">
        {row}
        {row}
      </div>
    </div>
  );
}
