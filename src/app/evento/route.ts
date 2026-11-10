// Recebe visitas e cliques do próprio site e repassa ao app da Dom Pablo (tela "Site"), com a cidade aproximada que a Vercel
// informa. Não grava IP. Só existe no build de produção: a prévia estática (npm run preview) deixa esta pasta de fora.
const APP = process.env.CAREERS_APP_URL ?? "https://dom-performance-production.up.railway.app";
const FIELDS = ["kind", "button", "label", "sid", "secs", "path", "query", "referrer"] as const;

const header = (h: Headers, name: string) => {
  const v = h.get(name);
  if (!v) return null;
  try {
    return decodeURIComponent(v);
  } catch {
    return v;
  }
};

export async function POST(req: Request) {
  let data: Record<string, unknown>;
  try {
    data = JSON.parse((await req.text()).slice(0, 4000));
  } catch {
    return new Response(null, { status: 400 });
  }
  if (!data || typeof data !== "object") return new Response(null, { status: 400 });
  const h = req.headers;
  const body: Record<string, unknown> = {};
  for (const f of FIELDS) if (data[f] !== undefined) body[f] = data[f];
  body.ua = (h.get("user-agent") ?? "").slice(0, 400);
  body.city = header(h, "x-vercel-ip-city");
  body.region = header(h, "x-vercel-ip-country-region");
  body.country = header(h, "x-vercel-ip-country");
  // Internet do celular (Vivo, Claro, TIM) costuma sair por São Paulo, e a Vercel acha que a pessoa está lá.
  // O fuso do aparelho não erra: celular em Mato Grosso usa America/Cuiaba. Nesse caso vale o fuso.
  if (data.tz === "America/Cuiaba" && body.region !== "MT") {
    body.city = "Cuiabá e região";
    body.region = "MT";
  }
  // robôs de busca não contam
  if (/bot|crawl|spider|facebookexternalhit|headless/i.test(String(body.ua))) return new Response(null, { status: 204 });

  const headers: Record<string, string> = { "content-type": "application/json" };
  const ip = h.get("x-forwarded-for")?.split(",")[0].trim();
  if (ip) headers["x-visitor-ip"] = ip; // só para o limite contra robô no app; não é gravado
  if (process.env.SITE_EVENTS_KEY) headers["x-site-key"] = process.env.SITE_EVENTS_KEY;
  try {
    await fetch(`${APP}/api/site/evento`, { method: "POST", headers, body: JSON.stringify(body), signal: AbortSignal.timeout(4000) });
  } catch {
    /* app fora do ar: a visita não entra, o site segue normal */
  }
  return new Response(null, { status: 204 });
}
