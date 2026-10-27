"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { Testimonial } from "@/types/content";
import { PlaceholderTag } from "@/components/ui/PlaceholderTag";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { SplitTitle } from "@/components/ui/SplitTitle";

export function Testimonials({ items }: { items: Testimonial[] }) {
  const [[index, dir], setState] = useState<[number, number]>([0, 1]);
  const go = (d: number) => setState(([i]) => [(i + d + items.length) % items.length, d]);
  const t = items[index];
  if (!t) return null;

  return (
    <section id="depoimentos" aria-roledescription="carrossel" className="relative border-t border-line bg-ink-deep py-20 md:py-32">
      <div className="gutter mx-auto max-w-[1600px]">
        <div className="grid gap-16 md:grid-cols-12">
          <div className="md:col-span-4">
            <SectionLabel>Depoimentos</SectionLabel>
            <SplitTitle lines={["A experiência", "fala por si."]} className="display mt-8 text-[clamp(2.75rem,5vw,4.5rem)] text-bone" />
          </div>

          <div className="md:col-span-7 md:col-start-6">
            <div className="relative min-h-[18rem] md:min-h-[20rem]">
              <span aria-hidden className="pointer-events-none absolute -left-1 -top-20 font-serif text-[9rem] leading-none text-bronze-soft/25 md:-left-10 md:-top-16">
                “
              </span>
              <AnimatePresence mode="wait" custom={dir}>
                <motion.figure
                  key={t.id}
                  custom={dir}
                  initial={{ opacity: 0, x: dir * 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: dir * -40 }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.25}
                  onDragEnd={(_, info) => {
                    if (info.offset.x < -60) go(1);
                    else if (info.offset.x > 60) go(-1);
                  }}
                  className="relative cursor-grab active:cursor-grabbing"
                  aria-roledescription="slide"
                  aria-label={`${index + 1} de ${items.length}`}
                >
                  {t.isPlaceholder && <PlaceholderTag className="mb-8">Espaço reservado · não é uma avaliação real</PlaceholderTag>}
                  <blockquote
                    className={`font-serif text-[clamp(1.75rem,3.2vw,2.75rem)] leading-[1.25] ${t.isPlaceholder ? "italic text-bone/45" : "text-bone"}`}
                  >
                    {t.text}
                  </blockquote>
                  <figcaption className="mt-10 flex items-center gap-4 text-[0.7rem] uppercase tracking-[0.24em]">
                    <span className="h-px w-8 bg-bronze-soft" aria-hidden />
                    <span className={t.isPlaceholder ? "text-ash" : "text-bone"}>{t.author}</span>
                    {t.date && <span className="text-ash">· {t.date}</span>}
                  </figcaption>
                </motion.figure>
              </AnimatePresence>
            </div>

            <div className="mt-12 flex items-center gap-6">
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Depoimento anterior"
                className="flex size-12 items-center justify-center rounded-full border border-bone/20 text-bone transition-colors duration-500 hover:border-bronze hover:bg-bronze hover:text-bone"
              >
                <ArrowLeft strokeWidth={1.4} className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Próximo depoimento"
                className="flex size-12 items-center justify-center rounded-full border border-bone/20 text-bone transition-colors duration-500 hover:border-bronze hover:bg-bronze hover:text-bone"
              >
                <ArrowRight strokeWidth={1.4} className="size-4" />
              </button>
              <div className="relative ml-2 h-px flex-1 bg-line" aria-hidden>
                <motion.span
                  className="absolute inset-y-0 left-0 bg-bronze"
                  animate={{ width: `${((index + 1) / items.length) * 100}%` }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
              <span className="font-display text-lg tabular-nums text-ash">
                {String(index + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
