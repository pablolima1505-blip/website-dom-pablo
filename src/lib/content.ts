/**
 * Camada de acesso ao conteúdo. As páginas só leem dados por aqui.
 * Para o painel administrativo, troque a implementação destas funções por
 * chamadas à API/CMS (ex.: fetch com revalidate) sem tocar nos componentes.
 */
import { services } from "@/content/services";
import { plans } from "@/content/plans";
import { team } from "@/content/team";
import { testimonials } from "@/content/testimonials";
import { structure } from "@/content/structure";

export async function getServices() {
  return services;
}
export async function getPlans() {
  return plans;
}
export async function getTeam() {
  return team;
}
export async function getTestimonials() {
  return testimonials;
}
export async function getStructure() {
  return structure;
}
