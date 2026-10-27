import { ArrowUpRight } from "lucide-react";
import type { Service } from "@/types/content";
import { bookingHref } from "@/lib/links";
import { ActionLink } from "@/components/ui/ActionLink";
import { Reveal } from "@/components/ui/Reveal";
import { ImageCarousel } from "@/components/ui/ImageCarousel";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { SplitTitle } from "@/components/ui/SplitTitle";

export function Services({ services }: { services: Service[] }) {
  return (
    <section id="servicos" className="relative border-t border-line bg-ink py-20 md:py-32">
      <div className="gutter mx-auto max-w-[1600px]">
        <div className="grid gap-12 md:grid-cols-12 md:items-center md:gap-8">
          <div className="md:col-span-6">
            <SectionLabel>Serviços</SectionLabel>
            <SplitTitle lines={["Nossos", "serviços"]} className="display mt-8 text-[length:var(--text-display)] text-bone" />
            <Reveal delay={0.15} className="mt-10">
              <p className="max-w-sm text-base leading-[1.75] text-bone/65">
                Cada atendimento começa com uma conversa. Técnica precisa, tempo respeitado e um resultado que combina com quem você é.
              </p>
              <ActionLink href={bookingHref()} event="agendar_click" eventLabel="servicos-topo" className="mt-8">
                Agendar horário
              </ActionLink>
            </Reveal>
          </div>
          <div className="-mx-5 md:col-span-5 md:col-start-8 md:mx-0">
            <ImageCarousel
              slides={[
                { src: "/images/servicos-1.jpg", alt: "Homem de terno claro e óculos escuros em ambiente com poltronas de couro e luz de fim de tarde" },
                { src: "/images/servicos-2.jpg", alt: "Mesa escura com caderno de couro, porta-cartões, abotoaduras, perfume e gravata" },
                { src: "/images/servicos-3.jpg", alt: "Homem de camisa preta e calça clara sentado à mesa de um café, de óculos escuros" },
                { src: "/images/servicos-4.jpg", alt: "Partida de xadrez sobre mesa de madeira, com um drinque ao lado" },
                { src: "/images/servicos-5.jpg", alt: "Detalhe de paletó de tweed com lenço no bolso, poltrona chesterfield e estante de livros ao fundo" },
              ]}
              interval={2500}
              sizes="(min-width: 768px) 40vw, 100vw"
              className="aspect-[4/5] w-full"
            />
          </div>
        </div>

        <ul className="mt-12 border-t border-line md:mt-20">
          {services.map((s, i) => (
            <Reveal as="li" key={s.id} delay={i * 0.06} y={20} className="group relative border-b border-line">
              {/* Painel que sobe no hover */}
              <span
                aria-hidden
                className="absolute inset-0 origin-bottom scale-y-0 bg-graphite transition-transform duration-700 ease-luxe group-hover:scale-y-100"
              />
              <span
                aria-hidden
                className="absolute bottom-[-1px] left-0 h-px w-full origin-left scale-x-0 bg-bronze-soft transition-transform duration-700 ease-luxe group-hover:scale-x-100"
              />
              <div className="relative grid grid-cols-[2.5rem_1fr_auto] items-center gap-x-3 gap-y-2 py-5 md:grid-cols-12 md:items-center md:gap-8 md:px-6 md:py-7">
                <span className="font-display text-2xl text-ash transition-colors duration-500 group-hover:text-bronze-soft md:col-span-1 md:text-3xl">
                  {s.number}
                </span>
                <h3 className="display text-[clamp(1.75rem,3.4vw,3rem)] text-bone transition-transform duration-700 ease-luxe group-hover:translate-x-3 md:col-span-4">
                  {s.name}
                </h3>
                <p className="col-span-2 col-start-2 max-w-md text-[0.9rem] leading-relaxed text-bone/60 transition-colors duration-500 group-hover:text-bone/85 md:col-span-4 md:col-start-auto">
                  {s.description}
                  {(s.duration || s.price) && (
                    <span className="mt-2 block text-xs uppercase tracking-[0.2em] text-ash">
                      {[s.duration, s.price].filter(Boolean).join(" · ")}
                    </span>
                  )}
                </p>
                <a
                  href={bookingHref({ url: s.bookingUrl, context: s.name }) ?? "#contato"}
                  aria-label={`Agendar ${s.name}`}
                  className="col-start-3 row-start-1 flex size-10 items-center justify-center border border-bone/20 text-bone md:hidden"
                >
                  <ArrowUpRight strokeWidth={1.4} className="size-4" />
                </a>
                <div className="hidden items-center justify-end gap-6 md:col-span-3 md:flex">
                  <span aria-hidden className="block h-px w-8 bg-bronze-soft/60 transition-all duration-700 ease-luxe group-hover:w-20 group-hover:bg-bronze-soft" />
                  <ActionLink
                    href={bookingHref({ url: s.bookingUrl, context: s.name })}
                    variant="row"
                    event="agendar_click"
                    eventLabel={`servico-${s.id}`}
                    ariaLabel={`Agendar ${s.name}`}
                  >
                    Agendar
                  </ActionLink>
                </div>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
