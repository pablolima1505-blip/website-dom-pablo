import { site } from "@/config/site";

export const isPreview = process.env.NEXT_PUBLIC_PREVIEW === "1";

/** Link interno. Na pré-visualização estática, aponta para os arquivos .html. */
export function pageHref(path: string) {
  if (!isPreview || /^https?:\/\//.test(path)) return path;
  const [p, hash] = path.split("#");
  const file = p === "/" || p === "" ? "./index.html" : `.${p}.html`;
  return hash ? (p === "/" ? `#${hash}` : `${file}#${hash}`) : file;
}

export function whatsappHref(message?: string) {
  if (!site.whatsapp) return null;
  const text = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${site.whatsapp}${text}`;
}

/** Ordem: link do serviço/profissional → sistema de agendamento → WhatsApp. */
export function bookingHref(opts?: { url?: string | null; context?: string }) {
  if (opts?.url) return opts.url;
  if (site.bookingUrl) return site.bookingUrl;
  const msg = opts?.context
    ? `Olá, Dom Pablo! Quero agendar: ${opts.context}.`
    : "Olá, Dom Pablo! Quero agendar uma experiência.";
  return whatsappHref(msg);
}

export function instagramHref() {
  return site.instagram.handle ? `https://instagram.com/${site.instagram.handle}` : null;
}

export function routeHref() {
  if (site.geo) return `https://www.google.com/maps/dir/?api=1&destination=${site.geo.lat},${site.geo.lng}`;
  if (site.address.street)
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
      [site.address.street, site.address.district, `${site.city} - ${site.state}`, site.address.postalCode].filter(Boolean).join(", "),
    )}`;
  return null;
}
