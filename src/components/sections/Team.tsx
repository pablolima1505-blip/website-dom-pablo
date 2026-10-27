import Image from "next/image";
import type { Professional } from "@/types/content";
import { bookingHref } from "@/lib/links";
import { ActionLink } from "@/components/ui/ActionLink";
import { Monogram } from "@/components/ui/Monogram";
import { PlaceholderTag } from "@/components/ui/PlaceholderTag";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { SplitTitle } from "@/components/ui/SplitTitle";

function Portrait({ person }: { person: Professional }) {
  if (person.photo) {
    return (
      <Image
        src={person.photo}
        alt={`${person.name}, ${person.role} da Dom Pablo`}
        fill
        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 85vw"
        className="object-cover grayscale-[35%] transition-[transform,filter] duration-[1.2s] ease-luxe group-hover:scale-105 group-hover:grayscale-0"
      />
    );
  }
  // Retrato ainda não fotografado: moldura escura com luz de recorte
  return (
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_20%,#3a3129_0%,#1c1a18_45%,#0c0c0c_100%)] transition-transform duration-[1.2s] ease-luxe group-hover:scale-105">
      {/* Silhueta com luz de recorte, no lugar do retrato */}
      <svg viewBox="0 0 300 400" className="absolute inset-0 size-full" preserveAspectRatio="xMidYMax slice" aria-hidden>
        <defs>
          <linearGradient id="rim" x1="1" y1="0" x2="0" y2="0.6">
            <stop offset="0" stopColor="#8a5a3b" stopOpacity="0.55" />
            <stop offset="0.35" stopColor="#8a5a3b" stopOpacity="0.08" />
            <stop offset="1" stopColor="#8a5a3b" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M150 92c-30 0-50 24-50 58 0 26 12 48 29 58v18c-46 10-82 34-96 70-6 16-9 50-9 104h252c0-54-3-88-9-104-14-36-50-60-96-70v-18c17-10 29-32 29-58 0-34-20-58-50-58z"
          fill="#0b0b0b"
          stroke="url(#rim)"
          strokeWidth="2"
        />
      </svg>
      <Monogram className="absolute left-1/2 top-[64%] size-12 -translate-x-1/2 text-bronze-soft/25" />
    </div>
  );
}

export function Team({ team }: { team: Professional[] }) {
  return (
    <section id="time" className="relative border-t border-line bg-ink py-20 md:py-32">
      <div className="gutter mx-auto max-w-[1600px]">
        <div className="grid gap-10 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <SectionLabel>Nosso time</SectionLabel>
            <SplitTitle lines={["Quem cuida", "de você"]} className="display mt-8 text-[length:var(--text-display)] text-bone" />
          </div>
          <Reveal className="md:col-span-4 md:col-start-9" delay={0.15}>
            <p className="max-w-sm text-base leading-[1.75] text-bone/65">
              Profissionais que dominam a técnica e conhecem você pelo nome. Escolha com quem quer viver a experiência.
            </p>
          </Reveal>
        </div>

        <div className="-mx-5 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:px-0 md:mt-16 lg:grid-cols-4 [scrollbar-width:none]">
          {team.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.08} className="w-[78%] shrink-0 snap-center sm:w-auto">
              <article className="group">
                <div className="relative aspect-[3/4] overflow-hidden bg-graphite">
                  <Portrait person={p} />
                  {p.isDemo && <PlaceholderTag className="absolute left-3 top-3 z-10">Perfil demonstrativo</PlaceholderTag>}
                  <div className="absolute inset-x-0 bottom-0 z-10 hidden translate-y-full p-4 transition-transform duration-700 ease-luxe group-hover:translate-y-0 lg:block">
                    <ActionLink
                      href={bookingHref({ url: p.bookingUrl, context: `horário com ${p.name}` })}
                      event="agendar_click"
                      eventLabel={`time-${p.id}`}
                      className="w-full !h-12"
                    >
                      Agendar
                    </ActionLink>
                  </div>
                </div>
                <div className="mt-5 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="display text-3xl text-bone">{p.name}</h3>
                    <p className="mt-1.5 text-[0.7rem] uppercase tracking-[0.22em] text-ash">
                      {p.role} · <span className={p.specialty ? "text-bone/70" : ""}>{p.specialty ?? "Especialidade a definir"}</span>
                    </p>
                  </div>
                  <span className="mt-3 h-px w-6 bg-bronze-soft transition-all duration-700 ease-luxe group-hover:w-12" aria-hidden />
                </div>
                <ActionLink
                  href={bookingHref({ url: p.bookingUrl, context: `horário com ${p.name}` })}
                  variant="row"
                  event="agendar_click"
                  eventLabel={`time-${p.id}`}
                  className="mt-5 w-full lg:!hidden"
                >
                  Agendar com {p.name.split(" ")[0]}
                </ActionLink>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
