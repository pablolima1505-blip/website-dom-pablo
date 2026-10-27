import type { Metadata } from "next";
import { PlaceholderTag } from "@/components/ui/PlaceholderTag";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  alternates: { canonical: "/privacidade" },
};

export default function PrivacidadePage() {
  return (
    <section className="gutter mx-auto max-w-3xl pb-32 pt-40">
      <PlaceholderTag>Texto-base: revisar com o jurídico</PlaceholderTag>
      <h1 className="display mt-8 text-6xl text-bone md:text-7xl">Política de privacidade</h1>
      <div className="mt-10 space-y-6 text-[0.95rem] leading-[1.8] text-bone/70">
        <p>
          Este site usa cookies de medição (Google Analytics 4 e Meta Pixel) somente depois que você aceita no aviso de cookies. Sem o seu
          aceite, nenhuma dessas ferramentas é carregada.
        </p>
        <p>
          Os dados coletados servem para entender como o site é usado e para medir o resultado das nossas campanhas. Não vendemos dados
          pessoais.
        </p>
        <p>
          Quando você nos chama pelo WhatsApp ou agenda um horário, os dados informados são usados apenas para o atendimento, conforme a
          Lei Geral de Proteção de Dados (Lei nº 13.709/2018).
        </p>
        <p>Para pedir acesso, correção ou exclusão dos seus dados, fale com a Dom Pablo pelos canais de contato deste site.</p>
      </div>
    </section>
  );
}
