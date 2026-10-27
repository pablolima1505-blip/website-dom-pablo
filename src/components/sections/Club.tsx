import Image from "next/image";
import type { Plan } from "@/types/content";
import { pageHref } from "@/lib/links";
import { ActionLink } from "@/components/ui/ActionLink";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { SplitTitle } from "@/components/ui/SplitTitle";
import { PlanCard } from "./PlanCard";

export function Club({ plans, standalone = false }: { plans: Plan[]; standalone?: boolean }) {
  const hasDemo = plans.some((p) => p.isDemo);
  return (
    <section id="clube" className="relative overflow-hidden bg-graphite py-20 md:py-32">
      <div className="absolute inset-x-0 top-0 h-[70%] opacity-35" aria-hidden>
        <Image src="/images/clube.jpg" alt="" fill sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-graphite/40 via-graphite/80 to-graphite" />
      </div>

      <div className="gutter relative mx-auto max-w-[1600px]">
        <div className="mx-auto max-w-4xl text-center">
          <SectionLabel className="justify-center">Clube Dom Pablo</SectionLabel>
          <SplitTitle
            as={standalone ? "h1" : "h2"}
            lines={["Sua melhor versão", "não tem data marcada."]}
            className="display mt-8 text-[length:var(--text-headline)] text-bone"
          />
          <Reveal delay={0.2}>
            <p className="mx-auto mt-8 max-w-xl text-lg leading-[1.7] text-bone/70">
              Descubra a liberdade de manter sua imagem sempre impecável com os planos de assinatura Dom Pablo.
            </p>
          </Reveal>
          {hasDemo && (
            <Reveal delay={0.3}>
              <p className="mx-auto mt-6 max-w-lg text-xs leading-relaxed text-ash">
                Planos demonstrativos: nomes, valores e benefícios serão substituídos pelos dados oficiais.
              </p>
            </Reveal>
          )}
        </div>

        {/* Celular: carrossel com encaixe. Desktop: três colunas, plano do meio elevado */}
        <div className="-mx-5 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 md:mx-0 md:mt-16 md:grid md:grid-cols-3 md:items-stretch md:gap-6 md:overflow-visible md:px-0 [scrollbar-width:none]">
          {plans.map((plan, i) => (
            <Reveal
              key={plan.id}
              delay={i * 0.1}
              className={`w-[85%] shrink-0 snap-center sm:w-[60%] md:w-auto ${plan.featured ? "md:-translate-y-6" : ""}`}
            >
              <PlanCard plan={plan} compact={!standalone} />
            </Reveal>
          ))}
        </div>

        {!standalone && (
          <Reveal className="mt-10 flex flex-col items-center gap-5 text-center md:mt-14">
            <ActionLink href={pageHref("/assinaturas")} event="assinatura_click" eventLabel="clube-cta">
              Quero ser assinante
            </ActionLink>
            <ActionLink href={pageHref("/assinaturas")} variant="ghost" icon={false}>
              Ver todos os detalhes dos planos
            </ActionLink>
          </Reveal>
        )}
      </div>
    </section>
  );
}
