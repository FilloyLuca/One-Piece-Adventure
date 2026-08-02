# 🏴‍☠️ One Piece Adventure

Un jeu narratif à choix multiples, thématisé autour de l'univers One Piece. Crée ton personnage, navigue à travers des scènes et des événements aléatoires, façonne ton destin (Pirate, Marine ou Révolutionnaire), et écris ta propre légende jusqu'à ta retraite à 40 ans... ou avant, si le sort en décide autrement.

Aucune installation requise : le jeu tourne entièrement dans le navigateur, en HTML/CSS/JavaScript pur (pas de framework, pas de build).

---

## ✨ Fonctionnalités

- **Création de personnage** : sexe, nom (aléatoire ou choisi), race, origine, poste à bord, entourage — chacun influence les statistiques de départ.
- **Statistiques** : vie, endurance, force, charisme, intelligence, vitesse, réputation, argent, prime.
- **Scènes et événements aléatoires** organisés par arcs narratifs, avec des choix aux conséquences visibles.
- **Système de conditions** : certains choix sont verrouillés, interdits, ou spéciaux selon les stats, compétences, classe, race ou relations du joueur.
- **Classes** : Pirate, Marine, Révolutionnaire — et une classe secondaire pour les utilisateurs de fruits du démon.
- **Titre / surnom (épithète)** : un surnom narratif (ex. *« Le Cinquième Empereur »*) peut être accordé au fil de l'histoire, affiché sous le nom du personnage.
- **Prime** : évolue comme une statistique à part entière au fil des choix, distincte de l'argent courant du joueur.
- **Relations** avec d'autres personnages, avec des statuts colorés (Allié, Nakama, Rival, Ennemi...).
- **Objets et compétences** acquis au fil de l'aventure.
- **Vieillissement** : le personnage avance en âge à chaque fin d'arc, jusqu'à une fin automatique à 40 ans.
- **Fiche de personnage permanente** + affiche "WANTED" détaillée, consultables à tout moment.
- **Récapitulatif de fin de partie** : parcours détaillé arc par arc, avec possibilité de télécharger sa fiche WANTED en image.
- **Panthéon** des personnages précédents, sauvegardé localement.
- **Pièces boutique** : gagnées à chaque fin de partie selon la prime finale, cumulées dans une réserve permanente (en vue d'une future boutique).
- **Sauvegarde automatique** de la partie en cours (reprise possible via "Continuer l'aventure").
- **Ambiance sonore** : bruit de vagues en boucle + playlist musicale aléatoire, avec contrôle de volume.

---

## 🚀 Lancer le projet

Aucune dépendance à installer. Deux façons de lancer le jeu :

**Option 1 — Ouvrir directement le fichier**
Ouvre `index.html` dans ton navigateur.

**Option 2 — Via un serveur local (recommandé)**
Certaines fonctionnalités (chargement des scripts, audio) fonctionnent mieux via un vrai serveur plutôt qu'en ouvrant le fichier directement. Avec l'extension **Live Server** de VSCode par exemple : clic droit sur `index.html` → "Open with Live Server".

---

## 📁 Structure du projet

```
index.html                  → page principale
style.css                   → tous les styles (thème bois/parchemin)

js/
  etat-jeu.js                → initialise les banques de contenu (SCENES, EVENEMENTS)
  audio.js                   → gestion de l'ambiance sonore
  creation-personnage.js     → création de personnage + état du joueur
  moteur-scenes.js           → moteur de jeu (scènes, choix, effets, fins)
  donnees/
    classes.js                → classes principales et fruits du démon
    arc1.js                    → contenu narratif du premier arc

audio/
  ambiance-vagues.mp3         → son d'ambiance en boucle
  musique*.mp3                → playlist musicale
```

---

## 🛠️ Ajouter ou modifier du contenu

Toute la logique détaillée (comment ajouter une scène, un événement, une condition de choix, une nouvelle stat, un fruit du démon, etc.) est expliquée dans :

📖 **[GUIDE-DU-JEU.md](./GUIDE-DU-JEU.md)**

Ce guide est le point de référence pour comprendre et étendre le jeu — à consulter avant toute modification du contenu narratif ou des mécaniques.

---

## 🧱 Stack technique

- HTML / CSS / JavaScript vanilla — aucune dépendance externe, aucun build nécessaire.
- Polices via Google Fonts (Cinzel, Pirata One, Rye).
- [html2canvas](https://html2canvas.hertzen.com/) (via CDN) pour générer une image téléchargeable de la fiche WANTED en fin de partie.
- Sauvegarde via `localStorage` du navigateur (locale à l'appareil, pas de compte ni de serveur).

---

## 📌 Roadmap / idées futures

- Boutique dépensant les pièces accumulées en fin de partie (système de gain déjà en place).
- Arcs suivants (2, 3, ...), avec personnalisation par classe (voir le guide, section "Personnaliser l'histoire selon la classe").
- Système multi-appareils pour la sauvegarde (nécessiterait un backend).

---

*Projet en développement continu — n'hésite pas à consulter le guide pour comprendre comment chaque système s'articule avant d'ajouter du contenu.*