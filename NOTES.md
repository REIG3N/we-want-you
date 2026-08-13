# NOTES

## Stack

- **Backend** : Node.js + Express (JavaScript, modules ESM)
- **Frontend** : Vue 3 + Vite + TypeScript
- **Stockage** : en mémoire. 

## Lancer le projet

Deux terminaux.

**Backend** (port 3333) :

    cd backend
    npm install
    npm run dev

**Frontend** (port 5173) :

    cd frontend
    npm install
    npm run dev

Puis ouvrir http://localhost:5173

Le backend autorise l'origine `http://localhost:5173` via CORS. Si Vite démarre sur un autre
port, il faut l'ajouter dans `backend/src/server.js`.

## Structure

    backend/src/store.js     état en mémoire + les 5 règles métier, sans notion HTTP
    backend/src/server.js    Express, les 3 endpoints, traduction cause métier -> code HTTP
    frontend/src/            client API, liste, détail, formulaire d'enchère

`store.js` renvoie une cause métier (`MONTANT_TROP_BAS`, `ANNONCE_TERMINEE`…) et `server.js` la
traduit en code de statut. La logique métier reste ainsi indépendante du protocole.

## Codes HTTP

| Cas | Code |
|---|---|
| Annonce inexistante | `404` |
| Pseudo vide ou montant invalide | `400` |
| Annonce terminée | `410` |
| Montant inférieur ou égal à la meilleure enchère actuelle | `409` |
| Montant sous le pas d'enchère | `422` |

Les règles sont évaluées dans l'ordre `RM1 -> RM5 -> RM2 -> RM3 -> RM4`. RM3 est testée avant RM4
car le seuil de RM4 est plus haut : l'ordre inverse rendrait le `409` inatteignable. 

## Hypothèses

- Statut et meilleure enchère sont calculés par le serveur à chaque réponse, pas stockés.
- La date d'une enchère est générée par le serveur, jamais reçue du client.
- Un montant exactement égal au minimum requis est accepté.
- `GET /api/annonces` expose toutes les annonces, terminées comprises, avec leur statut.

## Question 1 — Deux utilisateurs enchérissent en même temps

Mon implémentation stocke tout en mémoire. La fonction qui ajoute une enchère ne fait aucune opération asynchrone : elle lit la meilleure enchère, compare et écrit sans qu'aucune autre requête ne puisse s'intercaler. Node étant mono-thread, deux requêtes simultanées sont traitées l'une après l'autre. Le cas est donc esquivé par le choix de stockage, pas traité explicitement.

Avec une base de données, la lecture devient asynchrone : deux requêtes peuvent lire le même état avant qu'aucune n'écrive, et accepter deux enchères qui auraient dû s'exclure. Je traiterais alors les enchères d'une même annonce en série, via une file par annonce, pour retrouver la garantie que j'ai aujourd'hui par défaut. 

## Question 2 — Des milliers d'annonces et d'utilisateurs

Remplacer le stockage mémoire par une base de données pour avoir une persistance des données et les centraliser entre plusieurs instances du serveur. Ensuite ne plus charger tout l'historique d'une annonce : puisque toute enchère acceptée doit dépasser la précédente, la meilleure enchère est forcément la dernière, il suffit de la lire au lieu de parcourir des milliers de lignes. L'historique complet ne serait chargé qu'à la demande, par tranches. Enfin, s'il y a vraiment beaucoup d'annonces, ajouter une barre de recherche avec des filtres, et ne renvoyer les résultats que par pages, envoyer tout le catalogue à chaque appel n'est plus tenable.

## Difficultés rencontrées

- Bascule de stack : commencé sur .NET, non pratiqué depuis deux ans, abandonné au profit de
  Node/Express pour tenir le délai.
- Vue : venant de React, l'interface a d'abord été prototypée en HTML/JS vanilla pour valider les
  appels API et les cas d'erreur, avant portage en Vue 3.

## Ce qui n'a pas été fait

- Tests automatisés. Le découpage a été fait pour les rendre simples à écrire (`store.js` est
  testable sans serveur), mais ils n'ont pas été écrits.
- Aucun bonus de la Partie 3 (filtre, tri, temps restant, rafraîchissement automatique).
- Pas de gestion d'identité : le pseudo est saisi librement et envoyé dans le corps de la requête.