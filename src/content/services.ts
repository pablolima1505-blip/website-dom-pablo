import type { Service } from "@/types/content";

// Descrições curtas e sem preço. Preço/duração entram quando a Dom Pablo informar.
export const services: Service[] = [
  {
    id: "corte",
    number: "01",
    name: "Corte masculino",
    description: "Leitura do seu rosto, do seu estilo e da sua rotina antes da primeira tesourada.",
    duration: null,
    price: null,
  },
  {
    id: "barba",
    number: "02",
    name: "Barba",
    description: "Desenho, toalha quente e acabamento na navalha. Precisão do contorno ao fio.",
    duration: null,
    price: null,
  },
  {
    id: "corte-barba",
    number: "03",
    name: "Corte + barba",
    description: "O ritual completo. Cabelo e barba pensados juntos, para uma imagem coerente.",
    duration: null,
    price: null,
  },
  {
    id: "tratamentos",
    number: "04",
    name: "Tratamentos capilares",
    description: "Cuidado para fios e couro cabeludo, com diagnóstico e indicação personalizada.",
    duration: null,
    price: null,
  },
  {
    id: "estetica",
    number: "05",
    name: "Estética masculina",
    description: "Sobrancelha, limpeza e cuidados de pele que completam a sua apresentação.",
    duration: null,
    price: null,
  },
  {
    id: "experiencias",
    number: "06",
    name: "Experiências exclusivas",
    description: "Momentos sob medida: datas especiais, noivos e atendimentos reservados.",
    duration: null,
    price: null,
  },
];
