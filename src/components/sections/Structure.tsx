"use client";

import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRef } from "react";
import type { StructureItem } from "@/types/content";
import { PlaceholderTag } from "@/components/ui/PlaceholderTag";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { SplitTitle } from "@/components/ui/SplitTitle";

/**
 * Galeria horizontal do espaço: uma tela de altura, desliza com o dedo
 * (ou setas no computador). Substitui a composição vertical, bem mais longa.
 */
export function Structure({ items }: { items: StructureItem[] }) {
  const track = useRef<HTMLUListElement>(null);
  const scroll = (dir: number) => {
    const el = track.current;
    if (!el) return;
    const card = el.querySelector("li");
    el.scrollBy({ left: dir * ((card?.clientWidth ?? 400) + 24), behavior: "smooth" });
  };

  return (
    <section id="estrutura" className="relative overflow-hidden bg-ink py-20 md:py-32">
      <div className="gutter mx-auto max-w-[1600px]">
        <div className="grid gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <SectionLabel>Nossa estrutura</SectionLabel>
            <SplitTitle
              lines={["Um ambiente à altura", "da sua experiência."]}
              className="display mt-8 text-[length:var(--text-headline)] text-bone"
            />
          </div>
          <Reveal className="flex flex-col gap-8 md:col-span-4 md:col-start-9" delay={0.15}>
            <p className="max-w-sm text-base leading-[1.75] text-bone/65">
              Cada espaço foi pensado para transformar um momento de cuidado em uma experiência memorável.
            </p>
            <div className="hidden gap-3 md:flex">
              {[
                { d: -1, Icon: ArrowLeft, label: "Fotos anteriores" },
                { d: 1, Icon: ArrowRight, label: "Próximas fotos" },
              ].map(({ d, Icon, label }) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => scroll(d)}
                  aria-label={label}
                  className="flex size-12 items-center justify-center rounded-full border border-bone/20 text-bone transition-colors duration-500 hover:border-bronze hover:bg-bronze hover:text-bone"
                >
                  <Icon strokeWidth={1.4} className="size-4" />
                </button>
              ))}
            </div>
          </Reveal>
        </div>
      </div>

      <Reveal className="mt-10 md:mt-16">
        <ul
          ref={track}
          className="gutter flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto pb-2 md:scroll-px-10 md:gap-6 xl:scroll-px-16 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {items.map((item, i) => (
            <li key={item.id} className="group w-[82%] shrink-0 snap-start sm:w-[55%] md:w-[38%] lg:w-[30%]">
              <div className="relative aspect-[4/5] overflow-hidden bg-graphite">
                <Image
                  src={item.image}
                  alt={`${item.label}: ${item.text}`}
                  fill
                  sizes="(min-width: 1024px) 30vw, (min-width: 768px) 38vw, 82vw"
                  className="object-cover transition-transform duration-[1.4s] ease-luxe group-hover:scale-105"
                />
                {item.isProvisional && <PlaceholderTag className="absolute bottom-3 left-3">Imagem provisória</PlaceholderTag>}
              </div>
              <div className="mt-5 flex items-start justify-between gap-4 border-t border-line pt-4">
                <div className="min-w-0">
                  <p className="eyebrow text-bronze-soft">{item.label}</p>
                  <h3 className="display mt-2 text-2xl text-bone md:text-3xl">{item.title}</h3>
                </div>
                <span className="shrink-0 whitespace-nowrap font-display text-lg tabular-nums text-ash">
                  {String(i + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
