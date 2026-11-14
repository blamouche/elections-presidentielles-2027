# Sondages d'intentions de vote — schéma

Un seul fichier : `data/sondages/sondages.json`. Il recense les sondages nationaux d'intentions de vote pour l'élection présidentielle de 2027 (premier tour et duels de second tour), publiés depuis 2022.

Les règles absolues de `data/SCHEMA.md` s'appliquent : uniquement des URLs réellement renvoyées par WebSearch ou ouvertes avec WebFetch, jamais d'URL construite. Pour chaque sondage, citer la publication de l'institut ou du média commanditaire (communiqué, rapport PDF, article). La notice déposée à la Commission des sondages est une source primaire bienvenue. Une liste agrégée (Wikipédia, etc.) peut servir d'index pour trouver les sondages, mais ne doit jamais être la seule source.

## Format

```json
{
  "derniereMiseAJour": "2026-11-14",
  "sondages": [
    {
      "id": "ifop-2026-11-05",
      "institut": "Ifop-Fiducial",
      "commanditaire": "Le Figaro, LCI, Sud Radio",
      "terrainDebut": "2026-11-03",
      "terrainFin": "2026-11-05",
      "publication": "2026-11-06",
      "echantillon": 1350,
      "methode": "Questionnaire auto-administré en ligne, méthode des quotas",
      "tour": 1,
      "hypotheses": [
        {
          "label": "Hypothèse 1 : Bardella (RN), Philippe (HOR), Retailleau (LR), Glucksmann (PP)…",
          "resultats": [ { "candidat": "Jordan Bardella", "id": "jordan-bardella", "pct": 35 } ]
        }
      ],
      "sources": [ { "titre": "", "url": "https://...", "media": "Ifop", "date": "AAAA-MM-JJ" } ]
    }
  ]
}
```

- **Un objet par sondage et par tour.** Un sondage qui teste le premier tour et des duels de second tour donne deux objets : `tour: 1` et `tour: 2`, avec le même `id` suffixé `-t1` et `-t2`.
- **`hypotheses`** : chaque scénario testé, dans l'ordre de publication de l'institut. Pour un duel de second tour, chaque duel est une hypothèse (ex. « Bardella / Philippe »). `resultats` est trié par pourcentage décroissant.
- **`pct`** : pourcentage des intentions exprimées, tel que publié (décimales si l'institut en donne).
- **`id`** de candidat : identifiant de la fiche dans `data/candidates/` si elle existe, sinon `null`.
- **Dates** au format ISO. `publication` = date de première diffusion.
- Champ facultatif `note` (une phrase) pour signaler une particularité : échantillon spécifique, scénario sans candidat déclaré…
- Trier `sondages` du plus récent au plus ancien, selon `terrainFin`.
