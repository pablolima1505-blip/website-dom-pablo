/**
 * Métricas próprias (tela "Site" no app da Dom Pablo). Anônimas: nada de cookie, IP, nome ou telefone.
 * Cada aba aberta ganha um código aleatório que some ao fechar (sessionStorage).
 * O envio vai para /evento (este site), que junta a cidade aproximada da Vercel e repassa ao app.
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

export const metricClick = (button: MetricButton, label?: string | null) => send({ kind: "clique", button, label: label?.slice(0, 80) ?? null });
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
