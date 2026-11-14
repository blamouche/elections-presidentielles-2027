# Comparateur Présidentielle 2027

Page HTML statique (un seul fichier) pour analyser et comparer les programmes des candidats à la présidentielle 2027 : fiches candidats (profil, parcours, judiciaire, international), propositions par thème, fact-checking, comparateur, carte positionnement × fiabilité × judiciaire, cartographie des positions de politique extérieure et index des sources.

- Site public (GitHub Pages) : https://blamouche.github.io/elections-presidentielles-2027/
- Version Artifact claude.ai (privée tant qu'elle n'est pas partagée) : https://claude.ai/artifact/MJAhMnwSDxZE11E8fkTbT1
- Version portable : `dist/presidentielle-2027-portable.html`, un seul fichier (~3 Mo) sans aucune ressource externe — données, photos et polices intégrées. S'ouvre par double-clic, hors connexion, et se partage par e-mail, clé USB, Drive, etc. Le bouton « Version portable » de la page (barre du haut et pied de page) la télécharge : le fichier portable se recopie lui-même ; dans l'Artifact, il est publié à côté de la page (`files`) et proposé via la capacité `downloads`.

## Organisation

| Chemin | Rôle |
|---|---|
| `data/candidates/*.json` | Une fiche par candidat (format décrit dans `data/SCHEMA.md`) |
| `data/international/*.json` | Positions de politique extérieure par candidat (7 axes, échelle −2 à +2, format dans `data/international/SCHEMA.md`) |
| `data/medias.json`, `data/photos/` | Photos sous licence libre (Wikimedia Commons, crédits) et sites officiels vérifiés |
| `data/autres-candidatures.json` | Petites candidatures, noms évoqués et retraits, sans fiche détaillée |
| `data/documents.json` | Registre des documents et URLs ajoutés pour alimenter l'analyse |
| `documents/` | Copies locales des documents transmis (PDF, etc.) |
| `src/template.html` | Interface (HTML/CSS/JS sans dépendance) |
| `scripts/build.mjs` | Intègre les données dans la page et contrôle que chaque fait est sourcé |
| `data/fonts/` | Polices (Google Fonts, licence SIL OFL) intégrées à la version portable |
| `scripts/fetch-fonts.mjs` | Télécharge ces polices une fois (`node scripts/fetch-fonts.mjs`) |
| `scripts/fetch-medias.mjs` | Récupère les photos libres via Wikidata/Commons (`node scripts/fetch-medias.mjs <id>`) |
| `dist/` | Pages générées (`artifact.html` pour la publication, `presidentielle-2027-portable.html` portable) |

## Mettre à jour

Le site est régénéré depuis la conversation Claude : transmettre un document ou une URL, Claude met à jour les fiches JSON et le registre, puis :

```bash
node scripts/build.mjs
```

La commande affiche un avertissement pour toute information sans source.

GitHub Pages est mis à jour automatiquement à chaque push sur `main` (`.github/workflows/pages.yml` relance `node scripts/build.mjs` et publie la version portable comme `index.html`).
