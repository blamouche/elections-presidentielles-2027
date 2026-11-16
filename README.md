# Présidentielle 2027

Page HTML statique (un seul fichier) pour analyser et comparer les programmes des candidats à la présidentielle 2027 : fiches candidats (profil, parcours, judiciaire, international), propositions par thème, fact-checking, comparateur, carte positionnement × fiabilité × judiciaire, cartographie des positions de politique extérieure et index des sources.

- Site public (GitHub Pages) : https://blamouche.github.io/elections-presidentielles-2027/
- Version Artifact claude.ai (privée tant qu'elle n'est pas partagée) : https://claude.ai/artifact/MJAhMnwSDxZE11E8fkTbT1
- Dossier complet en PDF : `dist/presidentielle-2027.pdf` (A4, ~240 pages) — synthèse comparative puis, pour chaque candidat, profil, parcours, judiciaire, programme et fact-checks, positions internationales et sources numérotées. Il est généré à chaque build en imprimant la vue `#rapport` avec Chrome sans interface, et téléchargeable depuis le bouton « Export PDF » de la page (dans l'Artifact, via la capacité `downloads`).

## Organisation

| Chemin | Rôle |
|---|---|
| `data/candidates/*.json` | Une fiche par candidat (format décrit dans `data/SCHEMA.md`) |
| `data/international/*.json` | Positions de politique extérieure par candidat (7 axes, échelle −2 à +2, format dans `data/international/SCHEMA.md`) |
| `data/medias.json`, `data/photos/` | Photos sous licence libre (Wikimedia Commons, crédits) et sites officiels vérifiés |
| `data/elections/*.json` | Résultats officiels des présidentielles 1965-2022, 1er et 2nd tours (format dans `data/elections/SCHEMA.md`) |
| `data/sondages/sondages.json` | Sondages d'intentions de vote pour 2027 (format dans `data/sondages/SCHEMA.md`) |
| `data/actualites.json` | Faits marquants de la campagne intégrés à chaque mise à jour (format dans `data/ACTUALITES.md`) |
| `data/autres-candidatures.json` | Petites candidatures, noms évoqués et retraits, sans fiche détaillée |
| `data/documents.json` | Registre des documents et URLs ajoutés pour alimenter l'analyse |
| `documents/` | Copies locales des documents transmis (PDF, etc.) |
| `src/template.html` | Interface (HTML/CSS/JS sans dépendance) |
| `scripts/build.mjs` | Intègre les données dans la page, contrôle que chaque fait est sourcé et génère le PDF (Chrome requis, chemin modifiable via `CHROME_PATH`) |
| `data/fonts/` | Polices (Google Fonts, licence SIL OFL) intégrées à la page autonome et au PDF |
| `scripts/fetch-fonts.mjs` | Télécharge ces polices une fois (`node scripts/fetch-fonts.mjs`) |
| `scripts/fetch-medias.mjs` | Récupère les photos libres via Wikidata/Commons (`node scripts/fetch-medias.mjs <id>`) |
| `dist/` | Pages générées (`artifact.html` pour la publication, `index.html` autonome, `presidentielle-2027.pdf`) |

## Mettre à jour

Le site est régénéré depuis la conversation Claude : transmettre un document ou une URL, Claude met à jour les fiches JSON et le registre, puis :

```bash
node scripts/build.mjs
```

La commande affiche un avertissement pour toute information sans source.

GitHub Pages est mis à jour automatiquement à chaque push sur `main` (`.github/workflows/pages.yml` relance `node scripts/build.mjs` et publie `index.html` et le PDF).
