// Télécharge une fois les polices (Google Fonts, licence SIL OFL) dans data/fonts/
// pour que la version portable de la page fonctionne sans connexion.
// Usage : node scripts/fetch-fonts.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dir = path.join(root, "data/fonts");
const CSS_URL =
  "https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,500..900&family=Public+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=IBM+Plex+Mono:wght@400;500&display=swap";
const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36";
const KEEP = new Set(["latin", "latin-ext"]); // suffisant pour le français et les noms propres

const css = await (await fetch(CSS_URL, { headers: { "User-Agent": UA } })).text();
fs.mkdirSync(dir, { recursive: true });
const blocks = [...css.matchAll(/\/\* ([\w-]+) \*\/\s*(@font-face\s*\{[^}]+\})/g)];
let outCss = "";
for (const [, subset, block] of blocks) {
  if (!KEEP.has(subset)) continue;
  const url = block.match(/url\((https:[^)]+\.woff2)\)/)[1];
  const file = path.basename(new URL(url).pathname);
  const dest = path.join(dir, file);
  if (!fs.existsSync(dest)) {
    const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
    fs.writeFileSync(dest, buf);
  }
  outCss += `/* ${subset} */\n${block.replace(url, file)}\n`;
}
fs.writeFileSync(path.join(dir, "fonts.css"), outCss);
console.log(`${outCss.match(/@font-face/g).length} déclarations, fichiers dans ${path.relative(root, dir)}`);
