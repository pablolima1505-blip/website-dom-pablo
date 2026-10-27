import { Check } from "lucide-react";
import type { Plan } from "@/types/content";
import { ActionLink } from "@/components/ui/ActionLink";
import { PlaceholderTag } from "@/components/ui/PlaceholderTag";

export function PlanCard({ plan, compact = false }: { plan: Plan; compact?: boolean }) {
  const featured = plan.featured;
  return (
    <article
      className={`group relative flex h-full flex-col border p-7 transition-colors duration-700 ease-luxe md:p-9 ${
        featured ? "border-bronze/70 bg-graphite-2" : "border-line bg-graphite/60 hover:border-bone/25"
      }`}
    >
      {featured && (
        <span className="absolute -top-px left-7 right-7 h-px bg-bronze-soft md:left-9 md:right-9" aria-hidden />
      )}
      <div className="flex items-start justify-between gap-4">
        <p className="eyebrow text-bronze-soft">{featured ? "Plano em destaque" : "Plano"}</p>
        {plan.isDemo && <PlaceholderTag>Demonstrativo</PlaceholderTag>}
      </div>

      <h3 className={`display mt-6 text-bone ${compact ? "text-5xl md:text-6xl" : "text-6xl md:text-7xl"}`}>{plan.name}</h3>
      <p className="mt-3 text-sm text-bone/60">{plan.tagline}</p>

      <div className="mt-8 flex items-end gap-2 border-y border-line py-6">
        <span className="font-display text-5xl leading-none text-bone">{plan.monthlyPrice ?? "R$ —"}</span>
        <span className="pb-1 text-sm text-ash">/mês</span>
        {!plan.monthlyPrice && <span className="ml-auto pb-1 text-[0.65rem] uppercase tracking-[0.2em] text-ash">Valor a definir</span>}
      </div>

      <div className="mt-7 space-y-7 text-sm">
        <div>
          <p className="eyebrow text-ash">Serviços incluídos</p>
          <ul className="mt-3 space-y-2.5">
            {plan.includedServices.map((s) => (
              <li key={s} className="flex items-start gap-3 text-bone/85">
                <Check strokeWidth={1.5} className="mt-0.5 size-4 shrink-0 text-bronze-soft" />
                {s}
              </li>
            ))}
          </ul>
        </div>
        {!compact && (
        <>
        <div>
          <p className="eyebrow text-ash">Benefícios</p>
          <ul className="mt-3 space-y-2.5">
            {plan.benefits.map((b) => (
              <li key={b} className="flex items-start gap-3 text-bone/70">
                <span className="mt-2 h-px w-3 shrink-0 bg-bronze-soft" aria-hidden />
                {b}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="eyebrow text-ash">Condições de uso</p>
          <ul className="mt-3 space-y-1.5 text-xs leading-relaxed text-ash">
            {plan.conditions.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </div>
        </>
        )}
      </div>

      <div className={`mt-auto ${compact ? "pt-8" : "pt-10"}`}>
        <ActionLink
          href={plan.checkoutUrl}
          variant={featured ? "primary" : "outline"}
          event="assinatura_click"
          eventLabel={plan.id}
          missing={`Checkout do plano ${plan.name} ainda não configurado. Conecte o provedor de assinaturas em src/content/plans.ts.`}
          className="w-full"
        >
          Quero ser assinante
        </ActionLink>
      </div>
    </article>
  );
}
