/**
 * Modelos de conteúdo do site. Hoje os dados vêm de src/content/*.ts;
 * no painel administrativo, estes mesmos tipos serão o contrato da API/CMS.
 * `null` significa "dado oficial ainda não informado": a interface mostra um
 * marcador "a definir" em vez de inventar a informação.
 */

export type Service = {
  id: string;
  number: string;
  name: string;
  description: string;
  /** Duração ou preço só aparecem quando informados. */
  duration: string | null;
  price: string | null;
  /** Link específico de agendamento do serviço (opcional). */
  bookingUrl?: string | null;
};

export type Plan = {
  id: string;
  name: string;
  /** Valor mensal formatado, ex.: "R$ 189". `null` = a definir. */
  monthlyPrice: string | null;
  tagline: string;
  includedServices: string[];
  benefits: string[];
  conditions: string[];
  featured?: boolean;
  /** Conteúdo demonstrativo até a Dom Pablo enviar os dados oficiais. */
  isDemo: boolean;
  /** URL do checkout do provedor de assinaturas (Asaas, Stripe, Pagar.me…). */
  checkoutUrl: string | null;
};

export type Professional = {
  id: string;
  name: string;
  role: string;
  specialty: string | null;
  photo: string | null;
  bookingUrl?: string | null;
  isDemo: boolean;
};

export type Testimonial = {
  id: string;
  author: string;
  text: string;
  date: string | null;
  source?: "google" | "instagram" | "presencial";
  /** Placeholders nunca são exibidos como avaliações reais. */
  isPlaceholder: boolean;
};

export type StructureItem = {
  id: string;
  label: string;
  title: string;
  text: string;
  image: string;
  /** Imagem provisória até o ensaio fotográfico do espaço. */
  isProvisional: boolean;
};

export type OpeningHours = { days: string; hours: string | null };
