## PUSSANCE 4

En suivant plusieurs tutoriels je cherchais à comprendre le fonctionnement des machines à états c'est donc ce qui est mis en place dans ce repos.
J'ai aussi utilisé Typescript avec lequel je commence à lier quelques affinités, mais mon savoir dans cette discipline reste incomplet. 

La prochaine étape de ce projet sera d'ajouter un serveur node JS


## Objectif

L'objectif du projet est de créer un jeu de puissance 4 connecté ou 2 joueurs peuvent se défier.

- Le premier utilisateur choisit un pseudo et obtient l'URL  à partager pour inviter les autres joueurs
- Le joueur 2 choisit aussi un pseudo et rejoint la partie
- Les 2 joueurs choisissent une partie
- Le créateur de la partie lance la partie
- Les joueurs place des pions à tour de rôle dans une grille de 7x6
- Un joueur gagne si 4 pions sont alignés verticalement / horizontalement ou en diagonal

## Technologies

- NodeJS
- TypeScript
- React
- Xstate
- Websocket
- https://www.npmjs.com/package/reconnecting-websocket
- Fastify
- https://www.npmjs.com/package/@fastify/websocket

## Etapes

- Machine à état (tester tant que possible) -> DONE
- Interface -> DONE
- Jeu hors ligne -> DONE
- Mise en place du serveur *
- Jeu en ligne *
- Mise en ligne (déploiement)
