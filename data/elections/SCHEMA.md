# Historique des élections présidentielles — schéma

Un fichier par élection au suffrage universel direct : `data/elections/<annee>.json` (1965, 1969, 1974, 1981, 1988, 1995, 2002, 2007, 2012, 2017, 2022).

Les règles absolues de `data/SCHEMA.md` s'appliquent : chaque chiffre est sourcé, uniquement des URLs réellement renvoyées par WebSearch ou ouvertes avec succès par WebFetch, jamais d'URL construite.

## Sources à privilégier

1. **Conseil constitutionnel** : décision proclamant les résultats de chaque tour (voix officielles, inscrits, votants, exprimés). C'est la référence pour les chiffres.
2. **Ministère de l'Intérieur** (résultats et archives des élections).
3. Wikipédia (fr) en complément uniquement, par exemple pour le parti d'un candidat.

## Format

```json
{
  "annee": 2022,
  "contexte": "1-2 phrases neutres : président sortant, fait marquant (ex. première élection après une démission…).",
  "elu": "Emmanuel Macron",
  "tours": [
    {
      "tour": 1,
      "date": "2022-04-10",
      "inscrits": 48747876,
      "votants": 35923707,
      "blancs": 543609,
      "nuls": 247151,
      "blancsNuls": null,
      "exprimes": 35132947,
      "resultats": [
        {
          "candidat": "Emmanuel Macron",
          "parti": "La République en marche",
          "partiAbrev": "LREM",
          "famille": "centre",
          "id": null,
          "voix": 9783058,
          "pct": 27.85
        }
      ],
      "sources": [ { "titre": "", "url": "https://...", "media": "Conseil constitutionnel", "date": "AAAA-MM-JJ" } ]
    },
    { "tour": 2, "...": "même structure" }
  ],
  "derniereMiseAJour": "2026-11-14"
}
```

- **Résultats** : France entière, chiffres définitifs proclamés par le Conseil constitutionnel. `resultats` est trié par voix décroissantes.
- **`pct`** : pourcentage des suffrages exprimés, arrondi à 2 décimales. Le calculer comme `voix / exprimes × 100` et vérifier qu'il concorde avec la source.
- **Blancs et nuls** : depuis 2014, les blancs sont comptés à part (`blancs` et `nuls`, `blancsNuls: null`). Avant, renseigner `blancsNuls` et mettre `blancs` et `nuls` à `null`.
- **Contrôle** : la somme des `voix` doit être égale à `exprimes`, et `exprimes` + blancs + nuls doit être égal à `votants`.
- **`famille`** : `extreme-gauche` (trotskistes, anticapitalistes), `gauche` (PS, PCF, radicaux de gauche, LFI…), `ecologiste`, `centre` (centristes, UDF, MoDem, LREM…), `droite` (gaullistes, RPR, UMP, LR, droite souverainiste modérée…), `extreme-droite` (FN/RN, Reconquête, MNR…), `divers` (inclassables, ruralistes, régionalistes…). En cas de doute, choisir `divers`.
- **`id`** : identifiant de la fiche actuelle si le candidat en a une dans `data/candidates/` (marine-le-pen, jean-luc-melenchon, nicolas-dupont-aignan, nathalie-arthaud, francois-asselineau, jean-lassalle, francois-hollande, eric-zemmour, fabien-roussel…), sinon `null`.
- **`date`** : date du scrutin en métropole.
