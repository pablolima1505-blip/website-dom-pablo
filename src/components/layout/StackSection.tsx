"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useLayoutEffect, useRef, useState } from "react";

/**
 * Transição em "cartas empilhadas" (padrão da referência): a seção gruda no
 * topo quando seu fim chega ao rodapé da tela e a próxima desliza por cima,
 * enquanto esta escurece levemente. Seções mais altas que a tela grudam pelo fim.
 */
export function StackSection({ children, z }: { children: React.ReactNode; z: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [top, setTop] = useState(0);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["end end", "end start"] });
  const dim = useTransform(scrollYProgress, [0, 1], [0, 0.65]);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setTop(Math.min(0, window.innerHeight - el.offsetHeight));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div ref={ref} data-stack className="sticky shadow-[0_-30px_60px_rgb(0_0_0/0.45)]" style={{ top, zIndex: z }}>
      {children}
      {!reduce && <motion.div aria-hidden className="pointer-events-none absolute inset-0 bg-ink-deep" style={{ opacity: dim }} />}
    </div>
  );
}
