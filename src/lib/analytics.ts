/**
 * Eventos de conversão. Só disparam quando o visitante aceitou cookies
 * e os IDs de GA4/Meta Pixel estão configurados (ver .env.example).
 */
type EventName = "agendar_click" | "whatsapp_click" | "assinatura_click" | "instagram_click" | "rota_click";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

const META_EVENTS: Partial<Record<EventName, string>> = {
  agendar_click: "Schedule",
  whatsapp_click: "Contact",
  assinatura_click: "InitiateCheckout",
};

export function track(event: EventName, params: Record<string, string> = {}) {
  if (typeof window === "undefined") return;
  window.gtag?.("event", event, params);
  const metaEvent = META_EVENTS[event];
  if (metaEvent) window.fbq?.("track", metaEvent, params);
}
