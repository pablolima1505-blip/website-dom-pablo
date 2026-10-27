import Image from "next/image";
import { Clock, Instagram, MapPin, MessageCircle } from "lucide-react";
import { site, fullAddress } from "@/config/site";
import { bookingHref, instagramHref, isPreview, routeHref, whatsappHref } from "@/lib/links";
import { ActionLink } from "@/components/ui/ActionLink";
import { PlaceholderTag } from "@/components/ui/PlaceholderTag";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { SplitTitle } from "@/components/ui/SplitTitle";

const Pending = () => <span className="text-ash/70">A definir</span>;

function MapPanel() {
  // O mapa do Google só carrega no site publicado; na pré-visualização fica o painel estilizado
  if (site.maps.embedUrl && !isPreview) {
    return (
      <iframe
        src={site.maps.embedUrl}
        title={`Mapa: Dom Pablo em ${site.city}`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="absolute inset-0 size-full grayscale invert-[0.92] contrast-[0.9]"
      />
    );
  }
  // Mapa estilizado até o endereço ser cadastrado
  return (
    <div className="absolute inset-0 overflow-hidden bg-graphite">
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(rgb(243 240 233 / 0.06) 1px, transparent 1px), linear-gradient(90deg, rgb(243 240 233 / 0.06) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div className="absolute left-[-10%] top-[58%] h-10 w-[120%] -rotate-[8deg] bg-bone/[0.04]" />
      <div className="absolute left-[38%] top-[-10%] h-[120%] w-7 rotate-[12deg] bg-bone/[0.04]" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-bronze/25"
            style={{ width: `${(i + 1) * 90}px`, height: `${(i + 1) * 90}px` }}
          />
        ))}
        <span className="relative flex size-14 items-center justify-center rounded-full bg-bronze text-bone shadow-[0_0_60px_rgb(107_68_48/0.55)]">
          <MapPin strokeWidth={1.5} className="size-6" />
        </span>
      </div>
      <div className="absolute bottom-5 left-5 right-5 flex flex-wrap items-end justify-between gap-3">
        <span className="display text-3xl text-bone">
          {site.address.district ? `${site.address.district} · ` : ""}
          {site.city}
        </span>
        {site.maps.placeUrl ? (
          <a
            href={site.maps.placeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="eyebrow border border-bone/25 bg-ink/60 px-4 py-2.5 text-bone backdrop-blur transition-colors hover:border-bronze-soft hover:text-bronze-soft"
          >
            Abrir no Google Maps
          </a>
        ) : (
          <PlaceholderTag>Mapa exibido após cadastrar o endereço</PlaceholderTag>
        )}
      </div>
    </div>
  );
}

export function Location() {
  const ig = instagramHref();
  const wa = whatsappHref();
  const address = fullAddress();
  const rows = [
    { icon: MapPin, label: "Endereço", value: address ?? <Pending /> },
    {
      icon: Clock,
      label: "Horário",
      value: (
        <ul className="space-y-1">
          {site.hours.map((h) => (
            <li key={h.days} className="flex justify-between gap-6">
              <span>{h.days}</span>
              <span className="tabular-nums">{h.hours ?? <Pending />}</span>
            </li>
          ))}
        </ul>
      ),
    },
    {
      icon: MessageCircle,
      label: "WhatsApp",
      value: wa ? (
        <a href={wa} target="_blank" rel="noopener noreferrer" className="hover:text-bronze-soft">
          {site.phoneDisplay ?? "Conversar agora"}
        </a>
      ) : (
        <Pending />
      ),
    },
    {
      icon: Instagram,
      label: "Instagram",
      value: ig ? (
        <a href={ig} target="_blank" rel="noopener noreferrer" className="hover:text-bronze-soft">
          @{site.instagram.handle}
        </a>
      ) : (
        <Pending />
      ),
    },
  ];

  return (
    <section id="contato" className="relative overflow-hidden bg-ink py-20 md:py-32">
      {/* Contato sobre foto do salão, escurecida, como na referência */}
      <div className="absolute inset-0" aria-hidden>
        <Image src="/images/estrutura-ambiente.jpg" alt="" fill sizes="100vw" className="object-cover opacity-45" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink/75 to-ink" />
      </div>
      <div className="gutter relative mx-auto max-w-[1600px]">
        <SectionLabel>Localização</SectionLabel>
        <SplitTitle
          lines={["Sua próxima experiência", "começa aqui."]}
          className="display mt-8 text-[length:var(--text-headline)] text-bone"
        />

        <div className="mt-10 grid gap-10 md:mt-16 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-5">
            <dl className="border-t border-line">
              {rows.map((r, i) => (
                <Reveal key={r.label} delay={i * 0.06} className="grid grid-cols-[2rem_1fr] gap-x-4 gap-y-1 border-b border-line py-4 sm:grid-cols-[2rem_7rem_1fr]">
                  <r.icon strokeWidth={1.3} className="mt-0.5 size-5 text-bronze-soft" aria-hidden />
                  <dt className="eyebrow pt-1 text-ash">{r.label}</dt>
                  <dd className="col-start-2 text-[0.95rem] text-bone/85 sm:col-start-3">{r.value}</dd>
                </Reveal>
              ))}
            </dl>
            <Reveal delay={0.2} className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ActionLink href={bookingHref()} event="agendar_click" eventLabel="localizacao">
                Agendar experiência
              </ActionLink>
              <ActionLink
                href={routeHref()}
                variant="outline"
                event="rota_click"
                missing="Rota indisponível: cadastre o endereço em src/config/site.ts."
              >
                Traçar rota
              </ActionLink>
            </Reveal>
          </div>

          <Reveal className="md:col-span-7" delay={0.1}>
            <div className="relative aspect-[16/10] w-full overflow-hidden border border-line md:aspect-auto md:h-full md:min-h-[26rem]">
              <MapPanel />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
