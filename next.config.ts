import type { NextConfig } from "next";

// STATIC_EXPORT=1 gera uma versão estática (pré-visualização / hospedagem simples).
// Sem ele, o build é o de produção (Vercel ou Node), com cabeçalhos de segurança.
const isStaticExport = process.env.STATIC_EXPORT === "1";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

// Página de vagas: fica no app da Dom Pablo (Railway) e aparece dentro deste domínio.
// /assets e /api são do app (este site usa /_next e não tem /api).
const careersApp = process.env.CAREERS_APP_URL ?? "https://dom-performance-production.up.railway.app";
const careersRewrites = [
  { source: "/vagas", destination: `${careersApp}/vagas` },
  { source: "/vagas/:path*", destination: `${careersApp}/vagas/:path*` },
  { source: "/assets/:path*", destination: `${careersApp}/assets/:path*` },
  { source: "/api/:path*", destination: `${careersApp}/api/:path*` },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  ...(isStaticExport
    ? { output: "export", images: { unoptimized: true } }
    : {
        images: { formats: ["image/avif", "image/webp"] },
        async headers() {
          return [{ source: "/:path*", headers: securityHeaders }];
        },
        async rewrites() {
          return careersRewrites;
        },
      }),
};

export default nextConfig;
