"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { PlaceholderTag } from "./PlaceholderTag";

type Props = {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  /** Intensidade do parallax em % da altura. Discreto por padrão. */
  strength?: number;
  provisional?: boolean;
  /** Revela a foto com uma cortina ao entrar na tela. */
  curtain?: boolean;
  /** Ponto focal da foto (CSS object-position), ex.: "45% 40%". */
  position?: string;
};

export function ParallaxImage({
  src,
  alt,
  className = "",
  sizes = "100vw",
  priority,
  strength = 8,
  provisional,
  curtain = true,
  position,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [`-${strength}%`, `${strength}%`]);

  return (
    <motion.div
      ref={ref}
      className={`relative overflow-hidden bg-graphite ${className}`}
      initial={curtain && !reduce ? { clipPath: "inset(12% 0% 12% 0%)" } : false}
      whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div className="absolute inset-[-12%_0]" style={reduce ? undefined : { y }}>
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" style={position ? { objectPosition: position } : undefined} />
      </motion.div>
      {provisional && <PlaceholderTag className="absolute bottom-3 left-3 z-10">Imagem provisória</PlaceholderTag>}
    </motion.div>
  );
}
