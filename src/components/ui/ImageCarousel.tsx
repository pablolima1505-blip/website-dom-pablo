"use client";

import Image from "next/image";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

type Slide = { src: string; alt: string };
type Props = {
  slides: Slide[];
  /** Tempo de cada imagem em milissegundos. */
  interval?: number;
  className?: string;
  sizes?: string;
};

/** Carrossel automático com transição suave; pausa fora da tela e respeita "reduzir movimento". */
export function ImageCarousel({ slides, interval = 2500, className = "", sizes = "100vw" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "0px 0px -10% 0px" });
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!inView || reduce || slides.length < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), interval);
    return () => clearInterval(id);
  }, [inView, reduce, slides.length, interval]);

  const slide = slides[index];

  return (
    <div ref={ref} className={`relative overflow-hidden bg-graphite ${className}`} aria-roledescription="carrossel">
      <AnimatePresence initial={false}>
        <motion.div
          key={slide.src}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ opacity: { duration: 0.9, ease: "easeOut" }, scale: { duration: interval / 1000 + 1, ease: "linear" } }}
        >
          <Image src={slide.src} alt={slide.alt} fill sizes={sizes} className="object-cover" />
        </motion.div>
      </AnimatePresence>

      {/* Indicadores: traço que preenche no tempo de cada imagem */}
      <div className="absolute inset-x-4 bottom-4 z-10 flex gap-1.5" aria-hidden>
        {slides.map((s, i) => (
          <span key={s.src} className="relative h-px flex-1 overflow-hidden bg-bone/25">
            {i === index && !reduce && (
              <motion.span
                key={`${s.src}-${index}`}
                className="absolute inset-0 origin-left bg-bone"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: inView ? 1 : 0 }}
                transition={{ duration: interval / 1000, ease: "linear" }}
              />
            )}
            {(i < index || (reduce && i === index)) && <span className="absolute inset-0 bg-bone/70" />}
          </span>
        ))}
      </div>
    </div>
  );
}
