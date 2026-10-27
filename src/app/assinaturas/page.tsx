import type { Metadata } from "next";
import { getPlans } from "@/lib/content";
import { bookingHref } from "@/lib/links";
import { Club } from "@/components/sections/Club";
import { ActionLink } from "@/components/ui/ActionLink";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";

export const metadata: Metadata = {
  title: "Clube de Assinaturas",
  description: "Planos mensais Dom Pablo: mantenha corte e barba impecáveis o mês inteiro, em Cuiabá.",
  alternates: { canonical: "/assinaturas" },
};

// Como funciona: só o fluxo. Regras comerciais entram quando forem definidas.
const steps = [
  { n: "01", title: "Escolha o plano", text: "Compare os planos e escolha o que combina com a sua rotina." },
  { n: "02", title: "Faça a assinatura", text: "Contratação on-line, em ambiente seguro do provedor de pagamentos." },
  { n: "03", title: "Agende quando quiser", text: "Use seus benefícios ao longo do mês, com o profissional de sua preferência." },
];

export default async function AssinaturasPage() {
  const plans = await getPlans();
  return (
    <>
      <div className="h-24 bg-graphite md:h-28" />
      <Club plans={plans} standalone />

      <section className="border-t border-line bg-ink py-28 md:py-40">
        <div className="gutter mx-auto max-w-[1600px]">
          <SectionLabel>Como funciona</SectionLabel>
          <ol className="mt-14 grid gap-px bg-line md:grid-cols-3">
            {steps.map((s, i) => (
              <Reveal as="li" key={s.n} delay={i * 0.1} className="bg-ink p-8 md:p-12">
                <span className="font-display text-2xl text-bronze-soft">{s.n}</span>
                <h2 className="display mt-6 text-4xl text-bone">{s.title}</h2>
                <p className="mt-4 max-w-xs text-sm leading-relaxed text-bone/60">{s.text}</p>
              </Reveal>
            ))}
          </ol>
          <Reveal className="mt-20 flex flex-col items-start gap-6 border-t border-line pt-12 md:flex-row md:items-center md:justify-between">
            <p className="display max-w-xl text-4xl text-bone md:text-5xl">Ficou com alguma dúvida sobre os planos?</p>
            <ActionLink href={bookingHref({ context: "informações sobre os planos de assinatura" })} variant="outline" event="whatsapp_click" eventLabel="assinaturas-duvida">
              Falar com a Dom Pablo
            </ActionLink>
          </Reveal>
        </div>
      </section>
    </>
  );
}
