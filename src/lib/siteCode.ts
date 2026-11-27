/**
 * Código da visita (dono, 27/11/2026): vai no fim da mensagem pronta do WhatsApp ("(cód. K7M2Q)"). A recepção digita
 * esse código na tela "Conversas do site" do app e o app conta quem realmente iniciou conversa.
 * O código sai do código anônimo da visita (dp_sid), com a MESMA conta do app (dom-performance, shared/siteCode.ts):
 * mudou aqui, muda lá. 5 caracteres sem os que confundem (0/O, 1/I/L).
 */
export const CODE_ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";
export const CODE_LENGTH = 5;

export function siteCode(sessionId: string): string {
  // FNV-1a 32 bits
  let h = 0x811c9dc5;
  for (let i = 0; i < sessionId.length; i++) {
    h ^= sessionId.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  let out = "";
  for (let i = 0; i < CODE_LENGTH; i++) {
    out += CODE_ALPHABET[h % CODE_ALPHABET.length];
    h = Math.floor(h / CODE_ALPHABET.length);
  }
  return out;
}

const DEFAULT_TEXT = "Olá, Dom Pablo! Vim pelo site.";

/** Link do WhatsApp com o código no fim da mensagem (sem mensagem: usa uma padrão). Já tem código: não mexe. */
export function withCode(href: string, code: string): string {
  let url: URL;
  try {
    url = new URL(href);
  } catch {
    return href;
  }
  const text = url.searchParams.get("text") || DEFAULT_TEXT;
  if (/\(c[óo]d\. [A-Z0-9]{5}\)/i.test(text)) return href;
  return `${url.origin}${url.pathname}?text=${encodeURIComponent(`${text} (cód. ${code})`)}`;
}
