# Schéma des données candidats

Un fichier JSON par candidat : `data/candidates/<id>.json` (id = slug `prenom-nom`, minuscules, sans accents).

## Règles absolues

1. **Aucune information sans source.** Chaque fait (profil, mandat, affaire, proposition, chiffre, verdict) porte un tableau `sources` non vide.
2. **N'utiliser QUE des URLs réellement consultées** (renvoyées par une recherche ou ouvertes). Ne jamais construire/deviner une URL. Si une info n'est pas sourçable, on ne l'inclut pas.
3. Préférer les sources primaires (site du candidat/parti, JO, Assemblée nationale, Sénat, Parlement européen, Conseil constitutionnel, décisions de justice) et les médias de référence / fact-checkeurs (AFP Factuel, Le Monde Les Décodeurs, Libération CheckNews, franceinfo Vrai ou Fake, Institut Montaigne, Fondation iFRAP, OFCE, Cour des comptes, INSEE, Wikipédia seulement en complément).
4. Judiciaire : rigueur maximale, statut procédural exact à la date de mise à jour, rappeler la présomption d'innocence quand rien n'est définitif. Ne pas lister de simples polémiques sans procédure judiciaire.
5. Dates au format ISO `AAAA-MM-JJ` (ou `AAAA-MM` / `AAAA` si inconnu plus précisément).
6. Rédaction en français, factuelle, neutre.

## Objet `Source`

```json
{ "titre": "Titre de l'article ou de la page", "url": "https://...", "media": "Le Monde", "date": "2026-05-12" }
```

## Thèmes (utiliser exactement ces ids)

`economie-fiscalite`, `emploi-travail`, `retraites`, `pouvoir-achat-social`, `sante`, `education`, `securite-justice`, `immigration`, `environnement-energie`, `agriculture`, `logement`, `europe-international`, `defense`, `institutions-democratie`, `numerique-innovation`, `culture`, `territoires-services-publics`

## Verdicts de fact-check (exactement)

`vrai`, `plutot-vrai`, `trompeur`, `plutot-faux`, `faux`, `invérifiable`, `non-verifie`

- `non-verifie` : aucune vérification trouvée/faite ; `analyse` explique pourquoi.
- Pour une **proposition** (promesse), le fact-check porte sur : chiffrage/coût annoncé vs estimations indépendantes, faisabilité juridique (constitution, droit UE), et exactitude des chiffres invoqués pour la justifier.

## Structure d'un candidat

```json
{
  "id": "prenom-nom",
  "prenom": "", "nom": "",
  "parti": "Nom complet du parti", "partiAbrev": "XX",
  "famillePolitique": "extreme-gauche | gauche | ecologiste | centre | droite | extreme-droite | divers",
  "couleur": "#hex (couleur du parti)",
  "statutCandidature": "declare | potentiel | incertain | retire",
  "candidature": { "texte": "Déclaré le … (contexte : primaire, investiture…)", "date": "AAAA-MM-JJ", "sources": [Source] },
  "profil": {
    "naissance": { "date": "AAAA-MM-JJ", "lieu": "", "sources": [Source] },
    "resume": "3-5 phrases de présentation neutre",
    "formation": [ { "texte": "", "sources": [Source] } ],
    "professionHorsPolitique": [ { "texte": "", "sources": [Source] } ],
    "sources": [Source]
  },
  "parcoursPolitique": [
    { "debut": "AAAA", "fin": "AAAA | null (en cours)", "fonction": "Député de …", "details": "", "sources": [Source] }
  ],
  "judiciaire": {
    "note": "Synthèse d'une phrase (ex. 'Aucune condamnation connue à ce jour.')",
    "affaires": [
      {
        "titre": "Affaire des assistants parlementaires …",
        "statut": "condamnation-definitive | condamnation-non-definitive | proces-en-cours | mise-en-examen | enquete | relaxe | non-lieu | classement | autre",
        "role": "prévenu | mis en examen | témoin assisté | plaignant | …",
        "misEnCause": "true | false (facultatif) : le candidat est-il visé par la procédure ? Sans ce champ, le site le déduit de `role` (plaignant, victime, demandeur, requérant → non). À renseigner dès que le rôle est ambigu.",
        "resume": "Faits reprochés, étapes et décisions datées, peines éventuelles, recours en cours.",
        "chronologie": [ { "date": "AAAA-MM-JJ", "evenement": "", "sources": [Source] } ],
        "sources": [Source]
      }
    ]
  },
  "programme": {
    "statut": "Programme complet publié | Propositions partielles | Pas encore de programme",
    "resume": "Grandes lignes en 3-5 phrases",
    "documents": [Source],
    "propositions": [
      {
        "id": "slug-court-unique",
        "theme": "id de thème",
        "type": "proposition | declaration-chiffree",
        "titre": "Intitulé court",
        "description": "Contenu précis de la mesure ou de l'affirmation",
        "chiffres": [ "Coût annoncé : 10 Md€/an", "…" ],
        "date": "AAAA-MM-JJ",
        "sources": [Source],
        "factCheck": {
          "verdict": "vrai | plutot-vrai | trompeur | plutot-faux | faux | invérifiable | non-verifie",
          "analyse": "Explication en 2-5 phrases avec les données de référence",
          "sources": [Source]
        }
      }
    ]
  },
  "derniereMiseAJour": "AAAA-MM-JJ"
}
```
