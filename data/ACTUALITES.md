# Actualités de campagne — format

`data/actualites.json` : faits marquants de la campagne intégrés à chaque mise à jour du site (onglet « Actualités » avant « Sources & méthode », encadré dans chaque fiche candidat, et section du PDF).

```json
{
  "miseAJour": "2026-11-16",
  "periode": "2026-11-01/2026-11-16",
  "items": [
    { "date": "2026-11-14", "candidats": ["raphael-glucksmann"], "categorie": "candidature | programme | judiciaire | sondage | ralliement | international | autre", "titre": "Phrase factuelle et neutre, 20 mots max", "sources": [ { "titre": "", "url": "https://...", "media": "", "date": "2026-11-14" } ] }
  ]
}
```

Règles de `data/SCHEMA.md` : chaque entrée est sourcée par une URL réellement consultée, rédaction factuelle et neutre. `candidats` ne contient que des ids de `data/candidates/` (vide si la personne n'a pas de fiche). Trier par date décroissante.
