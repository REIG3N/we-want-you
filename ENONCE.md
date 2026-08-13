# Test technique — Alternance Développeur Full-Stack

Bienvenue ! Ce test a pour objectif de comprendre **comment tu raisonnes et comment tu structures ton code**, pas de te piéger. Il n'y a pas de solution unique attendue.

## Choix de la stack

Tu choisis **l'une** des deux stacks suivantes (celle où tu es le plus à l'aise) :

| Option | Backend | Frontend |
|--------|---------|----------|
| **A** | C# / .NET (Web API) | React Typescript |
| **B** | Node.js (Framework au choix) | Vue 3 ou Nuxt Typescript |

> Indique ton choix dans le fichier `NOTES.md` (voir plus bas).

## Le sujet

Le sujet complet est décrit dans [`SUJET.md`](./SUJET.md) : une **mini plateforme d'enchères** avec une API et une petite interface.

## Ce qu'on attend de toi

- ⏱️ **Temps indicatif : 4 à 6 heures.** Il n'est pas nécessaire de tout finir. Il vaut mieux une partie propre et réfléchie qu'un projet complet mais bâclé.
- 🧠 **Ton raisonnement compte plus que le résultat.** Documente tes choix, tes hypothèses et ce que tu ferais avec plus de temps dans `NOTES.md`.
- 🧪 Quelques **tests** sur la logique métier principale sont un vrai plus (pas besoin de couverture complète).
- 🎨 Le design du frontend n'est **pas évalué**. Une interface fonctionnelle et lisible suffit.

## Contraintes techniques

- Pas de base de données obligatoire : un stockage **en mémoire** ou un fichier JSON suffit (les données de départ sont dans [`data/annonces.json`](./data/annonces.json)).
- Le backend expose une **API REST** consommée par le frontend.
- Le code doit se lancer facilement : documente les commandes dans `NOTES.md`.

## Livrables

1. Ton code dans les dossiers `backend/` et `frontend/` (ou une autre organisation si tu la justifies).
2. Un fichier **`NOTES.md`** à la racine contenant :
   - la stack choisie et les commandes pour lancer le projet ;
   - tes choix techniques et hypothèses ;
   - ce que tu n'as pas eu le temps de faire et comment tu l'aurais fait ;
   - les difficultés rencontrées.
3. Un historique Git avec des **commits réguliers et des messages clairs** (on regarde comment tu avances, pas seulement le résultat final).

## Rendu

- Pousse ton travail sur un fork ou un repo privé et invite-nous, **ou** envoie une archive `.zip` incluant le dossier `.git`.

## Une IA, c'est autorisé ?

Oui, les outils d'assistance (Copilot, ChatGPT, Claude...) sont autorisés — ils font partie du métier. En revanche, **tu dois être capable d'expliquer chaque ligne de ton code** : le test sera suivi d'un débrief oral où l'on te demandera de justifier tes choix et de faire évoluer ton code en live.

Bon courage ! 🚀
