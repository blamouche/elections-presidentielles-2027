// Récupère pour chaque candidat : photo sous licence libre (Wikimedia Commons, via Wikidata P18)
// et site(s) déclaré(s) sur Wikidata (P856). Écrit data/photos/<id>.jpg et met à jour data/medias.json.
// Usage : node scripts/fetch-medias.mjs [id ...]   (sans argument : tous les candidats sans photo)
// Les entrées déjà présentes dans medias.json ne sont pas écrasées, sauf l'option --force.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const UA = { "User-Agent": "presidentielle-2027-comparateur/0.1 (static site build script)" };
const mediasPath = path.join(root, "data/medias.json");
const medias = fs.existsSync(mediasPath) ? JSON.parse(fs.readFileSync(mediasPath, "utf8")) : {};
const args = process.argv.slice(2);
const force = args.includes("--force");
const only = args.filter((a) => !a.startsWith("--"));
fs.mkdirSync(path.join(root, "data/photos"), { recursive: true });

const FREE = /^(CC0|CC BY(-SA)? ?\d|Public domain|PD|Attribution|GFDL|FAL)/i;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
// Wikimedia limite le débit : pause entre appels et nouvelles tentatives si la réponse n'est pas du JSON.
async function getJSON(url, tries = 5) {
  for (let i = 0; i < tries; i++) {
    await sleep(2500 * (i + 1) ** 2);
    const txt = await (await fetch(url, { headers: UA })).text();
    try { return JSON.parse(txt); } catch { console.log(`  (limite de débit, nouvel essai ${i + 1})`); }
  }
  throw new Error("API Wikimedia indisponible : " + url);
}
const strip = (h) => String(h || "").replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();

for (const f of fs.readdirSync(path.join(root, "data/candidates")).filter((x) => x.endsWith(".json"))) {
  const c = JSON.parse(fs.readFileSync(path.join(root, "data/candidates", f), "utf8"));
  if (only.length && !only.includes(c.id)) continue;
  if (medias[c.id]?.photo && !force) continue;
  const name = `${c.prenom} ${c.nom}`;
  const s = await getJSON(`https://www.wikidata.org/w/api.php?action=wbsearchentities&format=json&language=fr&uselang=fr&limit=5&search=${encodeURIComponent(name)}`);
  const hit = (s.search || []).find((h) => /polit|homme|femme|judo|journalist|avocat|essayist|écrivain|militant|syndical|enseignant|french/i.test(h.description || "")) || s.search?.[0];
  if (!hit) { console.log(`✗ ${c.id} : aucune entité Wikidata`); continue; }
  const ent = (await getJSON(`https://www.wikidata.org/wiki/Special:EntityData/${hit.id}.json`)).entities[hit.id];
  const claim = (p) => (ent.claims[p] || []).filter((x) => x.rank !== "deprecated").map((x) => x.mainsnak.datavalue?.value).filter(Boolean);
  const birth = claim("P569")[0]?.time?.slice(1, 11) || null;
  const sites = claim("P856");
  const entry = { wikidata: hit.id, wikidataLabel: hit.label, wikidataDescription: hit.description, naissanceWikidata: birth, sitesWikidata: sites, ...(medias[c.id] || {}) };
  entry.wikidata = hit.id; entry.naissanceWikidata = birth; entry.sitesWikidata = sites;
  const img = claim("P18")[0];
  if (img) {
    const q = await getJSON(`https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo&iiprop=url|extmetadata|mime&iiurlwidth=300&titles=${encodeURIComponent("File:" + img)}`);
    const info = Object.values(q.query.pages)[0].imageinfo?.[0];
    const md = info?.extmetadata || {};
    const licence = strip(md.LicenseShortName?.value);
    if (info && FREE.test(licence)) {
      const buf = Buffer.from(await (await fetch(info.thumburl, { headers: UA })).arrayBuffer());
      const ext = info.thumburl.toLowerCase().endsWith(".png") ? "png" : "jpg";
      const fichier = `data/photos/${c.id}.${ext}`;
      fs.writeFileSync(path.join(root, fichier), buf);
      entry.photo = {
        fichier,
        auteur: strip(md.Artist?.value) || "Auteur inconnu",
        licence,
        licenceUrl: md.LicenseUrl?.value || null,
        page: info.descriptionurl,
        date: strip(md.DateTimeOriginal?.value).slice(0, 10) || null,
      };
    } else console.log(`  ${c.id} : image « ${img} » écartée (licence « ${licence} »)`);
  }
  medias[c.id] = entry;
  fs.writeFileSync(mediasPath, JSON.stringify(medias, null, 2) + "\n"); // sauvegarde au fil de l'eau
  const okBirth = !c.profil?.naissance?.date || !birth || c.profil.naissance.date === birth;
  console.log(`${entry.photo ? "✓" : "–"} ${c.id.padEnd(22)} ${hit.id.padEnd(10)} ${String(hit.description).slice(0, 40).padEnd(40)} naissance ${okBirth ? "ok" : `≠ (fiche ${c.profil.naissance.date} / wikidata ${birth})`} · photo ${entry.photo ? entry.photo.licence + " · " + entry.photo.auteur.slice(0, 30) : "aucune"} · sites ${sites.join(" ") || "-"}`);
}
fs.writeFileSync(mediasPath, JSON.stringify(medias, null, 2) + "\n");
