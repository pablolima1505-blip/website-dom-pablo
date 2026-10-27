// Converte o export estático (out/) em uma pasta com caminhos relativos (preview/),
// para abrir em qualquer subcaminho (pré-visualização publicada, pen drive, etc.).
import { cpSync, readdirSync, readFileSync, renameSync, rmSync, statSync, writeFileSync } from "node:fs";
import { join, extname } from "node:path";

const src = process.argv[2] ?? "out";
const dst = process.argv[3] ?? "preview";
rmSync(dst, { recursive: true, force: true });
cpSync(src, dst, { recursive: true });
// Alguns hosts reservam nomes que começam com "_": _next vira assets
renameSync(join(dst, "_next"), join(dst, "assets"));

const walk = (d) => readdirSync(d).flatMap((f) => (statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : [join(d, f)]));
const abs = /(["'(\s,=])\/(_next|images)\//g;

for (const file of walk(dst)) {
  const ext = extname(file);
  if (![".html", ".js", ".css", ".txt"].includes(ext)) continue;
  let s = readFileSync(file, "utf8");
  if (ext === ".css") s = s.replaceAll("url(/_next/static/media/", "url(../media/");
  else s = s.replace(abs, "$1./$2/");
  s = s.replaceAll("./_next/", "./assets/");
  // U+FFFD literal (polyfill de TextDecoder) vira escape equivalente
  if (ext === ".js") s = s.replaceAll("\uFFFD", "\\ufffd");
  writeFileSync(file, s);
}
console.log("preview pronto em", dst);
