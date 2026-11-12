// API de Conversões da Meta (servidor). O token vem de META_CAPI_ACCESS_TOKEN nas variáveis da Vercel: nunca vai para o
// navegador nem para o GitHub. Cada evento leva o mesmo event_id que o Pixel usou no navegador, e a Meta junta os dois.
// Só envia o que o visitante aceitou no aviso de cookies. Nada de nome, telefone ou e-mail: só IP e navegador (exigidos pela
// Meta para reconhecer o evento) e os cookies da própria Meta (_fbp/_fbc).

// aceito = a Meta respondeu que recebeu todos os eventos (events_received); erro = recusou ou não respondeu;
// sem_aceite = visitante não aceitou cookies (nada enviado); teste = foi para a aba "Testar eventos" (não é resultado real).
export type MetaStatus = "aceito" | "erro" | "sem_aceite" | "teste";

const NAMES = new Set(["PageView", "Contact"]); // Lead não sai do site: só com contato confirmado
const ID = /^[A-Za-z0-9._-]{8,64}$/;
const FB_COOKIE = /^fb\.\d\.\d{10,16}\.[A-Za-z0-9_.-]{1,500}$/;

type Incoming = { name?: unknown; id?: unknown; params?: unknown };

function cleanParams(p: unknown): Record<string, string> | undefined {
  if (!p || typeof p !== "object") return undefined;
  const out: Record<string, string> = {};
  for (const k of ["content_name", "content_category"]) {
    const v = (p as Record<string, unknown>)[k];
    if (typeof v === "string" && v) out[k] = v.slice(0, 80);
  }
  return Object.keys(out).length ? out : undefined;
}

/** Monta os eventos para a Meta a partir do que o navegador mandou. Ignora qualquer coisa fora do combinado. */
export function buildEvents(data: Record<string, unknown>, ip: string | null, ua: string, now = Date.now()) {
  const list = Array.isArray(data.meta) ? (data.meta as Incoming[]).slice(0, 3) : [];
  const url = typeof data.url === "string" && /^https?:\/\//.test(data.url) ? data.url.slice(0, 500) : undefined;
  const fbp = typeof data.fbp === "string" && FB_COOKIE.test(data.fbp) ? data.fbp : undefined;
  const fbc = typeof data.fbc === "string" && FB_COOKIE.test(data.fbc) ? data.fbc : undefined;
  return list
    .filter((e) => typeof e?.name === "string" && NAMES.has(e.name) && typeof e.id === "string" && ID.test(e.id))
    .map((e) => {
      const custom = cleanParams(e.params);
      return {
        event_name: e.name as string,
        event_time: Math.floor(now / 1000),
        event_id: e.id as string,
        action_source: "website",
        ...(url ? { event_source_url: url } : {}),
        user_data: {
          ...(ip ? { client_ip_address: ip } : {}),
          client_user_agent: ua,
          ...(fbp ? { fbp } : {}),
          ...(fbc ? { fbc } : {}),
        },
        ...(custom ? { custom_data: custom } : {}),
      };
    });
}

/**
 * Envia para a Meta. Devolve null quando não há o que enviar (botão que não é contato, ou Meta não configurada),
 * "sem_aceite" quando o visitante não aceitou cookies, "aceito" (a Meta confirmou o recebimento), "teste" ou "erro".
 */
export async function sendToMeta(data: Record<string, unknown>, ip: string | null, ua: string): Promise<MetaStatus | null> {
  const pixel = process.env.META_PIXEL_ID;
  const token = process.env.META_CAPI_ACCESS_TOKEN;
  if (!pixel || !token || !/^\d{5,20}$/.test(pixel)) return null;
  const isContact = data.kind === "clique" && (data.button === "agendar" || data.button === "whatsapp");
  if (data.consent !== true) return isContact ? "sem_aceite" : null;
  const events = buildEvents(data, ip, ua);
  if (!events.length) return null;
  const graph = process.env.META_GRAPH_URL ?? "https://graph.facebook.com";
  const version = process.env.META_GRAPH_VERSION ?? "v23.0";
  const body: Record<string, unknown> = { data: events, access_token: token };
  const test = Boolean(process.env.META_TEST_EVENT_CODE);
  if (test) body.test_event_code = process.env.META_TEST_EVENT_CODE;
  try {
    const r = await fetch(`${graph}/${version}/${pixel}/events`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(4000),
    });
    const text = (await r.text()).slice(0, 500);
    let received = -1;
    try {
      received = Number(JSON.parse(text).events_received);
    } catch {
      /* resposta fora do padrão */
    }
    if (r.ok && received === events.length) return test ? "teste" : "aceito";
    console.error("Meta CAPI recusou:", r.status, text.slice(0, 300)); // resposta da Meta, sem o token
    return "erro";
  } catch (err) {
    console.error("Meta CAPI fora do ar:", (err as Error).message);
    return "erro";
  }
}
