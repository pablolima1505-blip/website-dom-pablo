/**
 * Métricas próprias (tela "Site" no app da Dom Pablo). Anônimas: nada de cookie, IP, nome ou telefone.
 * Cada aba aberta ganha um código aleatório que some ao fechar (sessionStorage).
 * O envio vai para /evento (este site), que junta a cidade aproximada da Vercel e repassa ao app.
 *
 * Meta (Pixel + API de Conversões): só para quem tocou em "Aceitar" no aviso de cookies. Cada evento ganha um código
 * (event_id) que vai igual para o Pixel (navegador) e para a API de Conversões (servidor, em /evento), e a Meta junta
 * os dois em um só. O token da API fica só no servidor da Vercel; aqui no navegador não existe.
 */
import { isPreview } from "./links";

export type MetricButton = "agendar" | "whatsapp" | "vagas" | "instagram" | "rota" | "assinatura" | "navegacao" | "outro";

const SID = "dp_sid";
const T0 = "dp_t0";

function session(): { sid: string; t0: number; isNew: boolean } | null {
  try {
    let sid = sessionStorage.getItem(SID);
    let t0 = Number(sessionStorage.getItem(T0));
    const isNew = !sid || !t0;
    if (isNew) {
      sid = (crypto.randomUUID?.() ?? `${Date.now()}-${Math.random()}`).replace(/[^A-Za-z0-9-]/g, "").slice(0, 36);
      t0 = Date.now();
      sessionStorage.setItem(SID, sid);
      sessionStorage.setItem(T0, String(t0));
    }
    return { sid: sid!, t0, isNew };
  } catch {
    return null; // navegador bloqueou o armazenamento: não mede
  }
}

export const CONSENT_KEY = "dp-consent-v1";

/** O visitante aceitou os cookies de medição (aviso de cookies). Sem isso, nada vai para a Meta. */
export function consented() {
  try {
    return localStorage.getItem(CONSENT_KEY) === "granted";
  } catch {
    return false;
  }
}

declare global {
  interface Window {
    __dpPV?: string;
  }
}

const newId = () => crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;

/** Código do PageView desta página: o mesmo no Pixel (script do aviso de cookies) e na API de Conversões. */
export function pageViewId() {
  if (typeof window === "undefined") return "";
  return (window.__dpPV ||= newId());
}

type MetaEvent = { name: "PageView" | "Contact" | "Lead"; id: string; params?: Record<string, string> };

/** Dispara no Pixel (se já carregou) e devolve o mesmo evento para a API de Conversões. Sem aceite: nada. */
function metaEvent(name: MetaEvent["name"], params?: Record<string, string>): MetaEvent | null {
  if (!consented()) return null;
  const id = newId();
  try {
    window.fbq?.("track", name, params ?? {}, { eventID: id });
  } catch {
    /* Pixel bloqueado: a API de Conversões ainda recebe */
  }
  return { name, id, params };
}

const cookie = (name: string) => document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))?.[1] ?? null;
const FBC = "dp_fbc";

/** Identificadores da própria Meta (cookies _fbp/_fbc e fbclid do anúncio), que ajudam a Meta a reconhecer o clique. */
function metaIds() {
  let fbc = cookie("_fbc");
  try {
    const fbclid = new URLSearchParams(location.search).get("fbclid");
    if (fbclid && !sessionStorage.getItem(FBC)?.endsWith(`.${fbclid}`)) sessionStorage.setItem(FBC, `fb.1.${Date.now()}.${fbclid}`);
    fbc ||= sessionStorage.getItem(FBC);
  } catch {
    /* sem armazenamento */
  }
  return { fbp: cookie("_fbp"), fbc };
}

function withMeta(payload: Record<string, unknown>, events: (MetaEvent | null)[]) {
  const meta = events.filter((e): e is MetaEvent => Boolean(e));
  return { ...payload, consent: consented(), ...(meta.length ? { meta, url: location.href.slice(0, 500), ...metaIds() } : {}) };
}

function send(payload: Record<string, unknown>) {
  if (typeof window === "undefined" || isPreview) return;
  const s = session();
  if (!s) return;
  let tz = "";
  try {
    tz = Intl.DateTimeFormat().resolvedOptions().timeZone ?? ""; // fuso do aparelho: celular em MT = America/Cuiaba
  } catch {
    /* sem fuso */
  }
  const body = JSON.stringify({ sid: s.sid, secs: Math.round((Date.now() - s.t0) / 1000), path: location.pathname, tz, ...payload });
  try {
    if (navigator.sendBeacon?.("/evento", new Blob([body], { type: "application/json" }))) return;
  } catch {
    /* tenta o fetch abaixo */
  }
  fetch("/evento", { method: "POST", body, headers: { "content-type": "application/json" }, keepalive: true }).catch(() => {});
}

/** 1ª página da visita: registra a origem (Instagram, Google, anúncio...). */
export function metricVisit() {
  const s = typeof window === "undefined" ? null : session();
  if (!s?.isNew) return;
  send({ kind: "visita", query: location.search.slice(0, 500), referrer: document.referrer.slice(0, 500) });
}

/** Toque em botão. Agendar abre a conversa no WhatsApp: vira Lead + Contact na Meta. WhatsApp: Contact. */
export function metricClick(button: MetricButton, label?: string | null) {
  const base = { kind: "clique", button, label: label?.slice(0, 80) ?? null };
  const params = label ? { content_name: label.slice(0, 80) } : undefined;
  if (button === "agendar") return send(withMeta(base, [metaEvent("Lead", params), metaEvent("Contact", params)]));
  if (button === "whatsapp") return send(withMeta(base, [metaEvent("Contact", params)]));
  send(base);
}

/** PageView para a API de Conversões (o Pixel dispara o seu no script do aviso de cookies, com o mesmo código). */
let pageViewSent = false;
export function metricPageView() {
  if (pageViewSent || !consented()) return;
  pageViewSent = true;
  send(withMeta({ kind: "pageview" }, [{ name: "PageView", id: pageViewId() }]));
}

export const metricExit = () => send({ kind: "saida" });

const FROM_EVENT: Record<string, MetricButton> = {
  agendar_click: "agendar",
  whatsapp_click: "whatsapp",
  assinatura_click: "assinatura",
  instagram_click: "instagram",
  rota_click: "rota",
};

/** Qual botão foi tocado: pelo data-ev do botão ou pelo endereço do link. */
export function classifyLink(a: HTMLAnchorElement): { button: MetricButton; label: string | null } {
  const ev = a.dataset.ev;
  const area = a.closest("header") ? "menu" : a.closest("footer") ? "rodape" : null;
  const text = (a.getAttribute("aria-label") || a.textContent || "").replace(/\s+/g, " ").trim().slice(0, 60) || null;
  if (ev && FROM_EVENT[ev]) return { button: FROM_EVENT[ev], label: a.dataset.label ?? area };
  const href = a.getAttribute("href") ?? "";
  let url: URL | null = null;
  try {
    url = new URL(href, location.href);
  } catch {
    /* link inválido */
  }
  if (url && /(^|\.)dompablobarbearia\.com\.br$|^localhost$/.test(url.hostname) && url.pathname.startsWith("/vagas")) return { button: "vagas", label: area };
  if (url?.pathname.startsWith("/vagas") && url.origin === location.origin) return { button: "vagas", label: area };
  if (/wa\.me|whatsapp\.com/.test(href)) return { button: "whatsapp", label: area ?? text };
  if (/instagram\.com/.test(href)) return { button: "instagram", label: area };
  if (/google\.[^/]+\/maps|maps\.app\.goo\.gl|maps\.google/.test(href)) return { button: "rota", label: area };
  if (href.startsWith("#") || url?.origin === location.origin) return { button: "navegacao", label: text };
  return { button: "outro", label: text };
}
