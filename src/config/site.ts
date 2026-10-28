import type { OpeningHours } from "@/types/content";

/**
 * Configuração central da Dom Pablo.
 * Todo campo `null` é um dado comercial ainda não informado. O site exibe
 * "a definir" e não inventa nada. Preencha aqui (ou, no futuro, pelo painel).
 */
export const site = {
  name: "Dom Pablo",
  legalName: null as string | null,
  slogan: "Sua marca no mundo.",
  footerSlogan: "Excelência em cada detalhe.",
  description:
    "Barbearia masculina premium em Cuiabá. Corte, barba, tratamentos e experiências exclusivas, com atenção a cada detalhe.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.dompablobarbearia.com.br",
  locale: "pt_BR",

  city: "Cuiabá",
  state: "MT",
  address: {
    street: "Rua Mestre Teodoro Lourenço da Costa, 85" as string | null,
    district: "Consil" as string | null,
    postalCode: "78048-425" as string | null,
    complement: null as string | null,
  },
  geo: null as { lat: number; lng: number } | null,

  /** Somente dígitos com DDI, ex.: "5565999999999". */
  whatsapp: "5565993331949" as string | null,
  phoneDisplay: "(65) 9 9333-1949" as string | null,
  email: null as string | null,

  instagram: {
    handle: "dompablobarbeariaoficial" as string | null,
  },

  /** Sistema de agendamento (Trinks, AVEC, Booksy…). Vazio = usa o WhatsApp. */
  bookingUrl: null as string | null,

  maps: {
    /** URL "Incorporar um mapa" do Google Maps (src do iframe). */
    embedUrl: "https://www.google.com/maps?q=Dom+Pablo+Barbearia,+Rua+Mestre+Teodoro+Louren%C3%A7o+da+Costa,+85,+Consil,+Cuiab%C3%A1+-+MT,+78048-425&output=embed" as string | null,
    /** Link do perfil da empresa no Google Maps. */
    placeUrl: "https://www.google.com/maps/search/?api=1&query=Dom+Pablo+Barbearia,+Rua+Mestre+Teodoro+Louren%C3%A7o+da+Costa,+85,+Cuiab%C3%A1+-+MT" as string | null,
  },

  hours: [
    { days: "Segunda a quinta", hours: "09h às 20h" },
    { days: "Sexta e sábado", hours: "08h às 20h" },
    { days: "Domingo", hours: "Fechado" },
  ] as OpeningHours[],

  analytics: {
    ga4Id: process.env.NEXT_PUBLIC_GA4_ID || null,
    metaPixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID || null,
  },
} as const;

/**
 * Blocos opcionais da página inicial. Time e Depoimentos ficam desligados
 * até existirem fotos da equipe e avaliações reais. Ligue com `true`.
 */
export const homeSections = {
  club: false, // Clube de assinaturas (a página /assinaturas segue pronta no código)
  structure: false, // Nossa Estrutura (galeria do ambiente)
  team: false,
  testimonials: false,
};

const allNavigation = [
  { label: "Início", href: "/#inicio" },
  { label: "A Dom Pablo", href: "/#manifesto" },
  { label: "Serviços", href: "/#servicos" },
  { label: "Assinaturas", href: "/#clube" },
  { label: "Nosso Time", href: "/#time" },
  { label: "Contato", href: "/#contato" },
  // Página de vagas, hospedada no app da Dom Pablo (Railway) e mostrada no próprio domínio
  { label: "Faça parte do time", href: "https://www.dompablobarbearia.com.br/vagas" },
];

const hiddenAnchors: Record<string, boolean> = {
  "/#clube": !homeSections.club,
  "/#time": !homeSections.team,
};

export const navigation = allNavigation.filter((n) => !hiddenAnchors[n.href]);

export const fullAddress = () => {
  const { street, district, complement, postalCode } = site.address;
  if (!street) return null;
  const base = [street, complement, district, `${site.city} — ${site.state}`].filter(Boolean).join(", ");
  return postalCode ? `${base}, ${postalCode}` : base;
};

/** Números da casa exibidos na abertura (base: página /vagas). */
export const stats = [
  { value: 2016, suffix: "", label: "Fundada em Cuiabá" },
  { value: 15, suffix: " mil+", label: "Clientes atendidos" },
  { value: 25, suffix: "+", label: "Colaboradores" },
];
