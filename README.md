# Dom Pablo — website

Site institucional e comercial da barbearia Dom Pablo (Cuiabá — MT).
Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Motion · Lenis.

## Rodar

```bash
npm install
npm run dev          # http://localhost:3000
npm run build && npm start   # produção (Node/Vercel, com cabeçalhos de segurança)
```

Pré-visualização estática (pasta `preview/`, abre em qualquer subcaminho):

```bash
STATIC_EXPORT=1 NEXT_PUBLIC_PREVIEW=1 npx next build && node tools/make-preview.mjs
```

## Onde editar (futuro painel administrativo)

Todo o conteúdo passa por `src/lib/content.ts`. Hoje ele lê os arquivos abaixo;
para o painel, troque essas funções por chamadas à API/CMS sem mexer nos componentes.

| O quê | Arquivo |
| --- | --- |
| Endereço, WhatsApp, Instagram, horários, link de agendamento, mapa | `src/config/site.ts` |
| Serviços (nome, descrição, preço, duração, link próprio) | `src/content/services.ts` |
| Planos de assinatura (nome, valor, benefícios, checkout) | `src/content/plans.ts` |
| Profissionais | `src/content/team.ts` |
| Depoimentos | `src/content/testimonials.ts` |
| Fotos e textos da estrutura | `src/content/structure.ts` + `public/images/` |
| Tipos (contrato da futura API) | `src/types/content.ts` |

Campo `null` = dado oficial ainda não informado. A interface mostra "a definir" e nunca inventa.

## Placeholders a substituir

- **Fotos**: todas as imagens em `public/images/` são provisórias, geradas por `tools/generate-placeholders.py`. Substituir pelo ensaio fotográfico do espaço e da equipe.
- **Logotipo**: o monograma "DP" em `src/components/ui/Monogram.tsx` é provisório. Trocar pelo SVG oficial.
- **Dados comerciais**: endereço, WhatsApp, Instagram, horários, link de agendamento, mapa (`site.ts`).
- **Planos**: Essencial / Premium / Exclusive são demonstrativos (`isDemo: true`).
- **Time**: 4 perfis demonstrativos.
- **Depoimentos**: 3 espaços reservados (`isPlaceholder: true`), identificados como tal na tela.
- **Domínio**: `NEXT_PUBLIC_SITE_URL` (padrão `https://www.dompablo.com.br`, a confirmar).
- **Política de privacidade**: texto-base, revisar com o jurídico.

## Integrações prontas

- **Agendamento**: `bookingHref()` em `src/lib/links.ts`. Ordem: link do serviço/profissional → `site.bookingUrl` → WhatsApp com mensagem pronta.
- **Assinaturas**: cada plano tem `checkoutUrl` (Asaas, Stripe, Pagar.me, Mercado Pago…). Página dedicada em `/assinaturas`.
- **WhatsApp**: botão flutuante (desktop) e barra fixa de agendamento (celular).
- **GA4 e Meta Pixel**: preencha `.env.local` (ver `.env.example`). Só carregam depois do "Aceitar" no aviso de cookies (LGPD). Eventos: `agendar_click`, `whatsapp_click`, `assinatura_click`, `instagram_click`, `rota_click`.
- **SEO local**: metadata, Open Graph, `sitemap.xml`, `robots.txt` e JSON-LD `BarberShop` (só com os campos preenchidos).

## Acessibilidade e movimento

Rolagem suave (Lenis), revelação de títulos por linha, parallax discreto e cortina nas fotos.
Tudo é desligado para quem ativa "reduzir movimento" no sistema.
