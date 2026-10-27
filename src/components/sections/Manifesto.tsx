"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { ParallaxImage } from "@/components/ui/ParallaxImage";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { SplitTitle } from "@/components/ui/SplitTitle";
import { ActionLink } from "@/components/ui/ActionLink";

export function Manifesto() {
  const band = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: band, offset: ["start end", "end start"] });
  const x1 = useTransform(scrollYProgress, [0, 1], ["6%", "-10%"]);
  const x2 = useTransform(scrollYProgress, [0, 1], ["-4%", "8%"]);

  return (
    <section id="manifesto" className="relative bg-ink pt-20 md:pt-32">
      {/* Frase de posicionamento, trazida da abertura */}
      <div className="gutter mx-auto max-w-[1600px] pb-16 md:pb-28">
        <Reveal>
          <p className="mx-auto max-w-4xl text-balance text-center font-serif text-[clamp(1.75rem,3.4vw,3.1rem)] italic leading-[1.25] text-bone/90">
            Acreditamos que todo homem carrega uma história, constrói um legado e deixa sua{" "}
            <span className="text-bronze-soft">marca</span>. Nós cuidamos de como você se apresenta ao mundo.
          </p>
        </Reveal>
        <Reveal delay={0.2} className="mx-auto mt-10 h-px w-24 bg-bronze-soft md:mt-14">
          <span className="sr-only">—</span>
        </Reveal>
      </div>
      <div className="gutter mx-auto grid max-w-[1600px] gap-14 md:grid-cols-12 md:gap-8">
        <div className="-mx-5 md:col-span-5 md:mx-0 lg:col-span-4 lg:col-start-2">
          <ParallaxImage
            src="/images/manifesto.jpg"
            alt="Lavagem de cabelo na Dom Pablo: mãos massageando o couro cabeludo com espuma, toalha apoiando a cabeça do cliente no lavatório"
            sizes="(min-width: 768px) 45vw, 100vw"
            className="aspect-[4/3] w-full md:aspect-[4/5]"
            position="60% 58%"
          />
        </div>

        <div className="flex flex-col justify-center md:col-span-6 md:col-start-7 lg:col-span-6 lg:col-start-7">
          <SectionLabel>A Dom Pablo</SectionLabel>
          <SplitTitle
            lines={["Não é apenas", "sobre aparência."]}
            className="display mt-8 text-[length:var(--text-display)] text-bone"
          />
          <Reveal delay={0.2}>
            <p className="mt-10 max-w-lg text-lg leading-[1.75] text-bone/70">
              Acreditamos que a excelência não está apenas no resultado, mas em cada detalhe da jornada. Do primeiro contato ao último
              olhar no espelho, tudo é pensado para proporcionar uma experiência extraordinária.
            </p>
          </Reveal>
          <Reveal delay={0.3} className="mt-10">
            <ActionLink href="#servicos" variant="ghost">
              Conhecer os serviços
            </ActionLink>
          </Reveal>
        </div>
      </div>

      {/* Destaque: CADA DETALHE IMPORTA. Duas linhas que deslizam em sentidos opostos */}
      <div ref={band} className="mt-16 overflow-hidden pb-16 md:mt-28 md:pb-28" aria-label="Cada detalhe importa.">
        <motion.p
          aria-hidden
          style={reduce ? undefined : { x: x1 }}
          className="display whitespace-nowrap text-[clamp(3.5rem,13vw,13rem)] leading-[0.85] text-bone"
        >
          Cada detalhe <span className="text-outline">Cada detalhe</span>
        </motion.p>
        <motion.p
          aria-hidden
          style={reduce ? undefined : { x: x2 }}
          className="whitespace-nowrap text-right font-serif text-[clamp(3.25rem,11vw,11rem)] italic leading-[0.9] text-bronze-soft"
        >
          importa.
        </motion.p>
      </div>
    </section>
  );
}
