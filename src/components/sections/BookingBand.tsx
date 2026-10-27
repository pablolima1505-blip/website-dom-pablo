import { bookingHref, whatsappHref } from "@/lib/links";
import { ActionLink } from "@/components/ui/ActionLink";
import { Reveal } from "@/components/ui/Reveal";
import { SplitTitle } from "@/components/ui/SplitTitle";

/** Faixa clara de agendamento: a quebra de ritmo da referência, em off-white. */
export function BookingBand() {
  return (
    <section id="agendamento" className="relative bg-bone py-16 text-ink md:py-24">
      <div className="gutter mx-auto grid max-w-[1600px] gap-10 md:grid-cols-12 md:items-end">
        <div className="md:col-span-7">
          <p className="eyebrow flex items-center gap-4 text-ink/60">
            <span className="h-px w-10 bg-bronze-soft" aria-hidden />
            Agendamento
          </p>
          <SplitTitle lines={["Seu momento Dom Pablo", "começa antes de chegar."]} className="display mt-8 text-[length:var(--text-headline)] text-ink" />
        </div>
        <Reveal className="md:col-span-4 md:col-start-9" delay={0.15}>
          <p className="max-w-sm text-base leading-[1.75] text-ink/70">
            Escolha o serviço, o profissional e o horário. Nossa equipe confirma tudo com você, de forma rápida e sem burocracia.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ActionLink href={bookingHref()} event="agendar_click" eventLabel="faixa-agendamento" className="!bg-ink !text-bone hover:!text-ink">
              Agendar experiência
            </ActionLink>
            <ActionLink
              href={whatsappHref("Olá, Dom Pablo! Quero agendar um horário.")}
              variant="outline"
              event="whatsapp_click"
              eventLabel="faixa-agendamento"
              missing="Número de WhatsApp ainda não configurado."
              className="!border-ink/30 !text-ink hover:!text-bone [&>span:first-child]:!bg-ink"
            >
              Pelo WhatsApp
            </ActionLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
