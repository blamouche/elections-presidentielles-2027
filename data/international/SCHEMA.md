# Positions de politique extérieure — schéma

Un fichier par candidat : `data/international/<id>.json` (même `id` que `data/candidates/<id>.json`).

Les règles absolues de `data/SCHEMA.md` s'appliquent : chaque position est sourcée, uniquement des URLs réellement renvoyées par WebSearch ou ouvertes avec succès par WebFetch, jamais d'URL inventée, pas de sources anonymes ni d'agrégateurs seuls.

## Axes et échelle

Chaque axe va de −2 (pôle A) à +2 (pôle B). La position décrit ce que le candidat **dit ou vote**, pas un jugement.

| id | Sujet | −2 (pôle A) | −1 | 0 | +1 | +2 (pôle B) |
|---|---|---|---|---|---|---|
| `europe` | Union européenne | Sortie de l'UE (Frexit) | Europe des nations : primauté du droit national, renégociation des traités, baisse de la contribution | Position ambivalente ou non tranchée | Pro-UE avec réformes (défense commune, souveraineté européenne) | Intégration renforcée, fédéralisme, extension du vote à la majorité |
| `otan` | OTAN et États-Unis | Sortie de l'OTAN | Sortie du commandement intégré / distance forte avec Washington | Ambivalent | Maintien dans l'OTAN avec pilier européen de défense | Atlantisme assumé, renforcement de l'OTAN |
| `trump` | Donald Trump | Opposition frontale | Critique | Neutre ou partagé | Approche conciliante ou pragmatique | Soutien ou proximité affichés |
| `russie` | Russie et Poutine | Rapprochement, levée des sanctions | Dialogue prioritaire, réserves sur les sanctions | Ambivalent | Fermeté avec ouverture diplomatique | Fermeté, sanctions renforcées, avoirs russes mobilisés |
| `ukraine` | Ukraine | Arrêt de l'aide militaire | Aide limitée, négociation immédiate prioritaire | Ambivalent | Soutien militaire et financier maintenu | Aide militaire accrue, garanties de sécurité, adhésion à l'UE |
| `chine` | Chine | Coopération renforcée | Pragmatisme commercial | Ambivalent | Réduction des dépendances (« de-risking ») | Fermeté, protection commerciale forte |
| `proche-orient` | Israël et Palestine | Soutien au gouvernement israélien | Soutien à Israël avec réserves | Équilibre | Critique du gouvernement israélien, cessez-le-feu, État palestinien | Sanctions contre Israël, embargo sur les armes |

## Format

```json
{
  "id": "prenom-nom",
  "derniereMiseAJour": "2026-11-13",
  "resume": "2-3 phrases neutres sur la vision internationale du candidat.",
  "axes": {
    "europe": {
      "position": -1,
      "titre": "Libellé court de la position (8 mots max)",
      "resume": "1-3 phrases factuelles : déclarations, votes, propositions, avec dates.",
      "date": "AAAA-MM-JJ",
      "sources": [ { "titre": "", "url": "https://...", "media": "", "date": "AAAA-MM-JJ" } ]
    },
    "otan": { ... }, "trump": { ... }, "russie": { ... }, "ukraine": { ... }, "chine": { ... }, "proche-orient": { ... }
  }
}
```

- Si aucune position publique n'est identifiable : `"position": null`, `"titre": "Pas de position publique identifiée"`, `sources` peut être vide.
- Privilégier les positions les plus récentes (2025-2026) ; signaler une évolution (« a changé de position en … ») dans `resume`.
- Sources préférées : déclarations du candidat (interviews, programme, discours), votes au Parlement européen (HowTheyVote.eu, site du Parlement) et à l'Assemblée (vote du 12/03/2024 sur l'accord de sécurité France-Ukraine, etc.), presse nationale de référence.
