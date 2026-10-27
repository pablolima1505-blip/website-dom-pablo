"use client";

import { motion } from "motion/react";

type Props = {
  /** Uma linha por item. Cada linha sobe de dentro de uma máscara. */
  lines: React.ReactNode[];
  as?: "h1" | "h2" | "h3" | "p";
  className?: string;
  delay?: number;
  stagger?: number;
  /** Anima ao montar (hero) em vez de ao entrar na tela. */
  onMount?: boolean;
};

export function SplitTitle({ lines, as = "h2", className = "", delay = 0, stagger = 0.09, onMount }: Props) {
  const Tag = as;
  const trigger = onMount ? { animate: "show" } : { whileInView: "show", viewport: { once: true, margin: "0px 0px -10% 0px" } };
  return (
    <Tag className={className}>
      <motion.span className="block" initial="hidden" {...trigger} transition={{ staggerChildren: stagger, delayChildren: delay }}>
        {lines.map((line, i) => (
          <span key={i} className="-mt-[0.18em] block overflow-hidden pb-[0.06em] pt-[0.18em]">
            <motion.span
              className="block will-change-transform"
              variants={{ hidden: { y: "105%" }, show: { y: "0%" } }}
              transition={{ duration: 1.15, ease: [0.22, 1, 0.36, 1] }}
            >
              {line}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}
