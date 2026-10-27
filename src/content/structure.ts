import type { StructureItem } from "@/types/content";

// Imagens provisórias (geradas). Substitua pelas fotos do ensaio do espaço.
export const structure: StructureItem[] = [
  { id: "ambiente", label: "Ambiente interno", title: "Luz baixa, tempo seu", text: "Um salão pensado para desacelerar.", image: "/images/estrutura-ambiente.jpg", isProvisional: true },
  { id: "cadeiras", label: "Cadeiras de atendimento", title: "Cada estação, um palco", text: "Conforto e precisão no mesmo lugar.", image: "/images/estrutura-cadeiras.jpg", isProvisional: true },
  { id: "recepcao", label: "Recepção", title: "A experiência começa na porta", text: "Você é recebido pelo nome.", image: "/images/estrutura-recepcao.jpg", isProvisional: true },
  { id: "arquitetura", label: "Arquitetura", title: "Linhas que organizam o olhar", text: "Materiais nobres, nada em excesso.", image: "/images/estrutura-arquitetura.jpg", isProvisional: true },
  { id: "detalhes", label: "Detalhes do espaço", title: "O que ninguém nota, a gente cuida", text: "Ferramentas, acabamentos, aromas.", image: "/images/estrutura-detalhes.jpg", isProvisional: true },
  { id: "experiencia", label: "Experiência dos clientes", title: "Um momento que é só seu", text: "Conversa boa ou silêncio. Você escolhe.", image: "/images/estrutura-experiencia.jpg", isProvisional: true },
];
