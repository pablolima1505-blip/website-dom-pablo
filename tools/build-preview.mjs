// Prévia estática: o export não aceita rotas POST, então a pasta src/app/evento (métricas) fica de fora só durante este build.
import { execSync } from "node:child_process";
import { renameSync, existsSync } from "node:fs";

const route = "src/app/evento";
const aside = "tools/.evento-fora";
if (existsSync(route)) renameSync(route, aside);
try {
  execSync("next build", { stdio: "inherit", env: { ...process.env, STATIC_EXPORT: "1", NEXT_PUBLIC_PREVIEW: "1" } });
  execSync("node tools/make-preview.mjs", { stdio: "inherit" });
} finally {
  if (existsSync(aside)) renameSync(aside, route);
}
