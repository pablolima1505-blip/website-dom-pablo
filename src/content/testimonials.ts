import type { Testimonial } from "@/types/content";

/**
 * Nenhuma avaliação real cadastrada ainda. Os itens abaixo são ESPAÇOS RESERVADOS
 * (isPlaceholder: true) e a interface os identifica como tal.
 * Ao cadastrar avaliações reais, use isPlaceholder: false.
 */
export const testimonials: Testimonial[] = [
  {
    id: "placeholder-1",
    author: "Nome do cliente",
    text: "Espaço reservado para uma avaliação real de cliente da Dom Pablo, publicada com autorização ou importada do Google.",
    date: null,
    isPlaceholder: true,
  },
  {
    id: "placeholder-2",
    author: "Nome do cliente",
    text: "Espaço reservado. Aqui entra o relato de quem viveu a experiência, com nome e data da avaliação.",
    date: null,
    isPlaceholder: true,
  },
  {
    id: "placeholder-3",
    author: "Nome do cliente",
    text: "Espaço reservado para avaliação real. Nenhum depoimento é exibido sem ter sido dado por um cliente.",
    date: null,
    isPlaceholder: true,
  },
];
