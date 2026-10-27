import { ActionLink } from "@/components/ui/ActionLink";
import { pageHref } from "@/lib/links";

export default function NotFound() {
  return (
    <section className="gutter flex min-h-[80svh] flex-col items-start justify-center gap-8 pt-24">
      <p className="eyebrow text-bronze-soft">Erro 404</p>
      <h1 className="display text-[length:var(--text-display)] text-bone">Página não encontrada.</h1>
      <ActionLink href={pageHref("/")} variant="outline">
        Voltar ao início
      </ActionLink>
    </section>
  );
}
