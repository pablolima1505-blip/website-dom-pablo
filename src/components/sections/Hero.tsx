"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { bookingHref } from "@/lib/links";
import { stats } from "@/config/site";
import { ActionLink } from "@/components/ui/ActionLink";
import { CountUp } from "@/components/ui/CountUp";

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-22%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={ref} id="inicio" aria-label="Dom Pablo" className="relative flex h-[100svh] min-h-[640px] items-center justify-center overflow-hidden">
      <motion.div className="absolute inset-0" style={reduce ? undefined : { y: imgY }}>
        <div className="animate-kenburns absolute inset-0">
          <Image
            src="/images/hero.jpg"
            alt="Recepção da Dom Pablo em Cuiabá: balcão em mármore escuro, iluminação linear no teto e estações de atendimento ao fundo"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[50%_60%]"
          />
        </div>
      </motion.div>
      {/* Sobreposições: leitura do texto + transição para a próxima seção */}
      <div className="absolute inset-0 bg-ink/40" aria-hidden />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgb(16_16_16/0.35)_0%,transparent_45%,rgb(16_16_16/0.7)_95%)]" aria-hidden />
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink to-transparent" aria-hidden />

      <motion.div
        style={reduce ? undefined : { y: contentY, opacity: contentOpacity }}
        className="gutter relative z-10 flex w-full max-w-[1600px] flex-col items-center pb-16 text-center md:pb-24"
      >

        {/* Logotipo oficial (tipografia da marca) no lugar do título em texto */}
        <h1 className="w-[min(86vw,720px)]">
          <motion.span
            className="block"
            initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.2, delay: 0.2, ease }}
          >
            <Image
              src="/images/logo-dom-pablo.png"
              alt="Dom Pablo Barbearia"
              width={1600}
              height={400}
              priority
              className="h-auto w-full drop-shadow-[0_2px_24px_rgb(0_0_0/0.6)]"
            />
          </motion.span>
        </h1>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.0, delay: 0.7, ease }}
          className="mt-8 h-px w-24 origin-center bg-bronze-soft md:mt-10"
          aria-hidden
        />

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.8, ease }}
          className="display mt-6 text-[clamp(1.6rem,3.6vw,2.9rem)] tracking-[0.06em] text-bone md:mt-8"
        >
          Sua marca no <span className="text-bronze-soft">mundo.</span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.05, ease }}
          className="mt-10 flex w-full justify-center sm:w-auto md:mt-12"
        >
          <ActionLink href={bookingHref()} event="agendar_click" eventLabel="hero">
            Agendar experiência
          </ActionLink>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 1.3, ease }}
        style={reduce ? undefined : { opacity: contentOpacity }}
        className="gutter absolute inset-x-0 bottom-5 z-10 mx-auto flex max-w-[1600px] flex-col items-center gap-5 md:bottom-8 md:gap-7"
      >
        {/* Números da casa (editáveis em `stats`, src/config/site.ts) */}
        <dl className="flex items-start justify-center gap-7 md:gap-14">
          {stats.map((s, i) => (
            <div key={s.label} className="flex flex-col items-center text-center">
              <dt className="order-2 mt-1 text-[0.5rem] uppercase tracking-[0.22em] text-ash md:text-[0.6rem]">{s.label}</dt>
              <dd className="display order-1 text-[1.35rem] leading-none tracking-[0.04em] text-bone md:text-[1.75rem]">
                <CountUp to={s.value} suffix={s.suffix} delay={1.4 + i * 0.12} duration={1.8} />
              </dd>
            </div>
          ))}
        </dl>
        <a href="#manifesto" className="eyebrow flex flex-col items-center gap-2 text-ash transition-colors hover:text-bone">
          <span className="relative block h-6 w-px overflow-hidden bg-bone/15 md:h-8">
            <span className="animate-scrollcue absolute inset-0 bg-bronze" />
          </span>
          Role
        </a>
      </motion.div>
    </section>
  );
}
