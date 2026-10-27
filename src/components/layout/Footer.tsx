import { homeSections, navigation, site, fullAddress } from "@/config/site";
import { instagramHref, pageHref, whatsappHref } from "@/lib/links";
import Image from "next/image";

const pending = <span className="text-ash/60">A definir</span>;

export function Footer() {
  const year = new Date().getFullYear();
  const ig = instagramHref();
  const wa = whatsappHref();

  return (
    <footer className="relative z-10 overflow-hidden border-t border-line bg-ink-deep pb-28 pt-16 md:pb-10 md:pt-24">
      <div className="gutter mx-auto max-w-[1600px]">
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-12 md:gap-16">
          <div className="col-span-2 md:col-span-5">
            <Image src="/images/logo-dom-pablo.png" alt="Dom Pablo Barbearia" width={1600} height={400} className="h-auto w-56 md:w-64" />
            <p className="mt-6 font-serif text-3xl italic leading-tight text-bone md:text-5xl">{site.footerSlogan}</p>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-ash">
              Barbearia masculina premium em {site.city} — {site.state}. Imagem, autoestima e relacionamento, com atenção a cada detalhe.
            </p>
          </div>

          <nav aria-label="Rodapé" className="md:col-span-2 md:col-start-7">
            <p className="eyebrow text-bronze-soft">Navegação</p>
            <ul className="mt-6 space-y-3 text-sm text-bone/75">
              {navigation.map((n) => (
                <li key={n.href}>
                  <a href={pageHref(n.href)} className="transition-colors hover:text-bone">
                    {n.label}
                  </a>
                </li>
              ))}
              {homeSections.club && (
                <li>
                  <a href={pageHref("/assinaturas")} className="transition-colors hover:text-bone">
                    Clube de assinaturas
                  </a>
                </li>
              )}
            </ul>
          </nav>

          <div className="md:col-span-2">
            <p className="eyebrow text-bronze-soft">Contato</p>
            <ul className="mt-6 space-y-3 text-sm text-bone/75">
              <li>{fullAddress() ?? <>Endereço {pending}</>}</li>
              <li>{site.phoneDisplay ?? <>Telefone {pending}</>}</li>
              {site.email && <li>{site.email}</li>}
            </ul>
          </div>

          <div className="md:col-span-2">
            <p className="eyebrow text-bronze-soft">Redes</p>
            <ul className="mt-6 space-y-3 text-sm text-bone/75">
              <li>{ig ? <a href={ig} target="_blank" rel="noopener noreferrer" className="hover:text-bone">Instagram</a> : <>Instagram {pending}</>}</li>
              <li>{wa ? <a href={wa} target="_blank" rel="noopener noreferrer" className="hover:text-bone">WhatsApp</a> : <>WhatsApp {pending}</>}</li>
            </ul>
          </div>
        </div>

        <p aria-hidden className="display text-outline pointer-events-none mt-14 select-none whitespace-nowrap text-center text-[clamp(4rem,19.5vw,22rem)] leading-[0.8]">
          DOM PABLO
        </p>

        <div className="mt-10 flex flex-col gap-4 border-t border-line pt-8 text-[0.68rem] uppercase tracking-[0.2em] text-ash md:flex-row md:items-center md:justify-between">
          <p>© {year} Dom Pablo. Todos os direitos reservados.</p>
          <p className="flex gap-6">
            <a href={pageHref("/privacidade")} className="hover:text-bone">Privacidade</a>
            <span>{site.city} — {site.state}</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
