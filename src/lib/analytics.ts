/**
 * Eventos de conversão no Google Analytics. Só disparam quando o visitante aceitou cookies
 * e os IDs de GA4/Meta Pixel estão configurados (ver .env.example).
 */
type EventName = "agendar_click" | "whatsapp_click" | "assinatura_click" | "instagram_click" | "rota_click";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

export function track(event: EventName, params: Record<string, string> = {}) {
  if (typeof window === "undefined") return;
  window.gtag?.("event", event, params);
  // Meta (Pixel + API de Conversões) sai de lib/metrics.ts, com event_id para não contar em dobro.
}
