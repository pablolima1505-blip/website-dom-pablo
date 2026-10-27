import type { Plan } from "@/types/content";

/**
 * PLANOS DEMONSTRATIVOS. Nomes, valores e benefícios são provisórios
 * e servem apenas para validar o layout. Substitua pelos dados oficiais.
 */
export const plans: Plan[] = [
  {
    id: "essencial",
    name: "Essencial",
    monthlyPrice: null,
    tagline: "Para manter o corte sempre em dia.",
    includedServices: ["Corte masculino"],
    benefits: ["Agendamento facilitado", "Atendimento com seu barbeiro de preferência"],
    conditions: ["Quantidade de visitas por mês a definir", "Fidelidade e regras de uso a definir"],
    isDemo: true,
    checkoutUrl: null,
  },
  {
    id: "premium",
    name: "Premium",
    monthlyPrice: null,
    tagline: "Cabelo e barba impecáveis, o mês inteiro.",
    includedServices: ["Corte masculino", "Barba"],
    benefits: ["Prioridade na agenda", "Condição especial em tratamentos", "Atendimento com seu barbeiro de preferência"],
    conditions: ["Quantidade de visitas por mês a definir", "Fidelidade e regras de uso a definir"],
    featured: true,
    isDemo: true,
    checkoutUrl: null,
  },
  {
    id: "exclusive",
    name: "Exclusive",
    monthlyPrice: null,
    tagline: "A experiência Dom Pablo completa.",
    includedServices: ["Corte masculino", "Barba", "Tratamento capilar", "Estética masculina"],
    benefits: ["Prioridade máxima na agenda", "Experiências exclusivas para assinantes", "Benefícios em produtos"],
    conditions: ["Quantidade de visitas por mês a definir", "Fidelidade e regras de uso a definir"],
    isDemo: true,
    checkoutUrl: null,
  },
];
