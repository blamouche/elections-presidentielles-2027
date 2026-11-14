// Génère dist/presidentielle-2027.html : un seul fichier HTML statique, données intégrées.
// Usage : node scripts/build.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { spawnSync } from "node:child_process";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const candDir = path.join(root, "data/candidates");
const warnings = [];

const candidats = fs
  .readdirSync(candDir)
  .filter((f) => f.endsWith(".json"))
  .sort()
  .map((f) => {
    const c = JSON.parse(fs.readFileSync(path.join(candDir, f), "utf8"));
    checkSources(c, f);
    return c;
  });

const documents = JSON.parse(fs.readFileSync(path.join(root, "data/documents.json"), "utf8"));

// Photos (Wikimedia Commons, licences libres) intégrées en data: URI, et sites officiels vérifiés.
const mediasPath = path.join(root, "data/medias.json");
const medias = fs.existsSync(mediasPath) ? JSON.parse(fs.readFileSync(mediasPath, "utf8")) : {};
for (const c of candidats) {
  const m = medias[c.id] || {};
  c.sites = m.sites || [];
  if (m.photo?.fichier && fs.existsSync(path.join(root, m.photo.fichier))) {
    const ext = m.photo.fichier.endsWith(".png") ? "png" : "jpeg";
    const b64 = fs.readFileSync(path.join(root, m.photo.fichier)).toString("base64");
    c.photo = { src: `data:image/${ext};base64,${b64}`, auteur: m.photo.auteur, licence: m.photo.licence, licenceUrl: m.photo.licenceUrl, page: m.photo.page };
  } else warnings.push(`${c.id} : pas de photo`);
  if (!medias[c.id]?.sites) warnings.push(`${c.id} : sites officiels non renseignés dans data/medias.json`);
  // Positions de politique extérieure (data/international/<id>.json)
  const ip = path.join(root, "data/international", c.id + ".json");
  if (fs.existsSync(ip)) {
    c.international = JSON.parse(fs.readFileSync(ip, "utf8"));
    for (const [k, a] of Object.entries(c.international.axes || {})) {
      if (a.position !== null && a.position !== undefined && !(a.sources || []).length) warnings.push(`${c.id} : axe international « ${k} » sans source`);
      if (![-2, -1, 0, 1, 2, null, undefined].includes(a.position)) warnings.push(`${c.id} : position invalide sur « ${k} »`);
    }
  } else warnings.push(`${c.id} : pas de positions internationales`);
}

// Vérifie que chaque fait porte au moins une source avec une URL http(s).
function checkSources(c, file) {
  const need = (obj, label) => {
    const s = obj && obj.sources;
    if (!Array.isArray(s) || s.length === 0) warnings.push(`${file} : pas de source pour ${label}`);
    else s.forEach((src) => { if (!/^https?:\/\//.test(src.url || "")) warnings.push(`${file} : URL invalide (${label}) ${src.url}`); });
  };
  need(c.candidature, "candidature");
  need(c.profil, "profil");
  (c.parcoursPolitique || []).forEach((p) => need(p, `parcours « ${p.fonction} »`));
  (c.judiciaire?.affaires || []).forEach((a) => need(a, `affaire « ${a.titre} »`));
  (c.programme?.propositions || []).forEach((p) => {
    need(p, `proposition « ${p.titre} »`);
    if (!p.factCheck) warnings.push(`${file} : pas de fact-check pour « ${p.titre} »`);
    else if (p.factCheck.verdict !== "non-verifie") need(p.factCheck, `fact-check « ${p.titre} »`);
  });
}

const autresPath = path.join(root, "data/autres-candidatures.json");
const autres = fs.existsSync(autresPath) ? JSON.parse(fs.readFileSync(autresPath, "utf8")) : null;
const data = { generatedAt: new Date().toISOString().slice(0, 10), candidats, documents, autres };
const json = JSON.stringify(data).replace(/</g, "\\u003c");
const tpl = fs.readFileSync(path.join(root, "src/template.html"), "utf8");
const marker = "/*__DATA__*/null";
if (!tpl.includes(marker)) throw new Error("Marqueur de données introuvable dans src/template.html");
const out = tpl.replace(marker, () => json);
fs.mkdirSync(path.join(root, "dist"), { recursive: true });
// 1) Contenu brut pour la publication en Artifact (la plateforme ajoute le squelette HTML).
fs.writeFileSync(path.join(root, "dist/artifact.html"), out);
// 2) Page autonome (dist/index.html) : un seul fichier, sans ressource externe (polices intégrées).
//    Servie par GitHub Pages ; c'est aussi elle qu'on imprime en PDF.
const fontsDir = path.join(root, "data/fonts");
let standalone = out;
const fontsCss = path.join(fontsDir, "fonts.css");
if (fs.existsSync(fontsCss)) {
  const inlined = fs.readFileSync(fontsCss, "utf8").replace(/url\(([^)]+\.woff2)\)/g, (_, f) =>
    `url(data:font/woff2;base64,${fs.readFileSync(path.join(fontsDir, f)).toString("base64")})`);
  standalone = standalone.replace(/<link[^>]+fonts\.(googleapis|gstatic)\.com[^>]*>\n?/g, "");
  standalone = `<style>\n${inlined}</style>\n` + standalone;
} else {
  warnings.push("data/fonts absent : la page autonome chargera les polices en ligne (node scripts/fetch-fonts.mjs)");
}
const dest = path.join(root, "dist/index.html");
fs.writeFileSync(dest, `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><title>Comparateur Présidentielle 2027</title></head><body>\n${standalone}\n</body></html>\n`);
for (const f of ["presidentielle-2027.html", "presidentielle-2027-portable.html"]) fs.rmSync(path.join(root, "dist", f), { force: true }); // anciens noms

// 3) Dossier complet en PDF : impression de la vue #rapport par Chrome sans interface.
const pdf = path.join(root, "dist/presidentielle-2027.pdf");
const chrome = findChrome();
if (!chrome) {
  warnings.push("Chrome introuvable : PDF non généré (définir CHROME_PATH)");
} else {
  fs.rmSync(pdf, { force: true });
  const args = ["--headless", "--disable-gpu", "--no-first-run", "--no-default-browser-check", "--no-pdf-header-footer",
    "--generate-pdf-document-outline", "--virtual-time-budget=20000", `--print-to-pdf=${pdf}`,
    ...(process.platform === "linux" ? ["--no-sandbox"] : []), pathToFileURL(dest).href + "#rapport"];
  const r = spawnSync(chrome, args, { encoding: "utf8", timeout: 180000 });
  if (!fs.existsSync(pdf)) throw new Error("Échec de la génération du PDF :\n" + (r.stderr || r.error || ""));
}

const nProps = candidats.reduce((n, c) => n + (c.programme?.propositions?.length || 0), 0);
console.log(`${candidats.length} candidats, ${nProps} propositions, ${documents.length} documents ajoutés`);
console.log(`→ ${path.relative(root, dest)} (${Math.round(fs.statSync(dest).size / 1024)} Ko)`);
if (fs.existsSync(pdf)) console.log(`→ ${path.relative(root, pdf)} (${Math.round(fs.statSync(pdf).size / 1024)} Ko)`);
if (warnings.length) {
  console.log(`\n${warnings.length} avertissement(s) :`);
  warnings.forEach((w) => console.log("  - " + w));
}

function findChrome() {
  const candidates = [process.env.CHROME_PATH,
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium"].filter(Boolean);
  for (const c of candidates) if (fs.existsSync(c)) return c;
  for (const name of ["google-chrome", "google-chrome-stable", "chromium", "chromium-browser"]) {
    const r = spawnSync("which", [name], { encoding: "utf8" });
    if (r.status === 0 && r.stdout.trim()) return r.stdout.trim();
  }
  return null;
}
