# 📖 Guide du projet — One Piece Adventure

Ce document explique comment fonctionne le jeu et comment ajouter ou modifier du contenu : nouvelles scènes, événements, stats, conditions de choix, classes, races, fruits du démon, objets, relations, etc.

Il est pensé pour être complété au fur et à mesure des ajouts futurs — chaque nouvelle fonctionnalité doit idéalement avoir sa section ici.

---

## 🗂️ Structure des fichiers

```
index.html                     → structure HTML de la page
style.css                      → tout le style visuel (bois, parchemin, badges...)

js/
  etat-jeu.js                  → déclare SCENES = {} et EVENEMENTS = [] (vide, rempli ensuite)
  audio.js                     → gestion de l'ambiance sonore et de la playlist musicale
  donnees/
    classes.js                 → définit CLASSES et CLASSES_FRUIT
    arc1.js                    → contenu narratif de l'arc 1 (scènes + événements)
    arc2.js, arc3.js...        → futurs arcs, même structure que arc1.js
    boutique.js                → définit BOUTIQUE_CATALOGUE et MAX_EQUIPEMENT_BOUTIQUE
    guide.js                   → définit pagesGuide (texte des pages du Manuel du Marin)
    succes.js                  → définit SUCCES_CATALOGUE (groupé par catégorie : Rangs, Titres, Richesse...)
  creation-personnage.js       → écran de création de personnage + état initial du joueur (RACES, ORIGINES, POSTES, ENTOURAGES)
  moteur-scenes.js             → toute la logique du jeu (affichage, choix, effets, fins)

audio/
  ambiance-vagues.mp3          → son de fond en boucle
  musique1.mp3, musique2.mp3... → playlist musicale aléatoire
```

**Règle d'or de l'ordre de chargement dans `index.html`** :

```html
<script src="js/audio.js"></script>
<script src="js/etat-jeu.js"></script>
<script src="js/donnees/classes.js"></script>
<script src="js/donnees/arc1.js"></script>
<!-- futurs arcs ici -->
<script src="js/donnees/boutique.js"></script>
<script src="js/donnees/guide.js"></script>
<script src="js/donnees/succes.js"></script>
<script src="js/creation-personnage.js"></script>
<script src="js/moteur-scenes.js"></script>
```

`etat-jeu.js` doit toujours être chargé **avant** les fichiers de `donnees/`, car ceux-ci remplissent les objets `SCENES` et `EVENEMENTS` qu'il déclare vides.

---

## 🧍 L'état du joueur (`joueur`)

L'objet `joueur` est déclaré à **deux endroits identiques** — il faut toujours les garder synchronisés :

1. `creation-personnage.js` → déclaration initiale (`let joueur = {...}`)
2. `moteur-scenes.js` → dans `retourMenuPrincipal()` (réinitialisation)

Structure actuelle :

```js
let joueur = {
  nom: "",
  sexe: null,
  age: 16,
  classe: null,          // "pirate" | "marine" | "revolutionnaire"
  classeFruit: null,      // "gomu" | "mera" | ... (clé de CLASSES_FRUIT)
  race: null,
  origine: null,
  poste: null,
  entourage: null,
  stats: {
    vie: 100,
    endurance: 100,
    force: 5,
    charisme: 5,
    intelligence: 5,
    vitesse: 5,
    reputation: 5,
    argent: 10,
    prime: 0
  },
  competences: [],
  objets: [],
  relations: [],         // [{ nom: "Luffy", statut: "Allié" }, ...]
  journalArc: [],         // titres des scènes/événements de l'arc en cours
  historique: []          // [{ numeroArc, age, evenements: [...] }, ...]
};
```

⚠️ Si tu ajoutes une nouvelle propriété à `joueur`, pense à l'ajouter **aux deux endroits** ci-dessus.

---

## ➕ Ajouter une nouvelle stat

1. Ajoute-la dans `joueur.stats` (les deux endroits).
2. Choisis un emoji et ajoute-le partout où les stats sont affichées :
   - `mettreAJourFiche()` (fiche du haut, dans `moteur-scenes.js`)
   - `afficherDetailsPersonnage()` (modale WANTED)
   - `afficherRecap()` (écran récapitulatif de création, dans `creation-personnage.js`)
3. Ajoute-la dans l'objet `labels` utilisé par les fonctions de conditions (`formaterEffetsPills`, `texteConditionHTML`, `raisonIndisponibilite`, `raisonInterdiction`) dans `moteur-scenes.js` — cherche `const labels = {` (plusieurs occurrences).
4. Ajoute un bonus `0` (ou une valeur) pour cette stat dans **toutes** les entrées de `RACES`, `ORIGINES`, `POSTES`, `ENTOURAGES` (dans `creation-personnage.js`), pour éviter les incohérences.

---

## 📜 Ajouter une scène

Les scènes vivent dans `js/donnees/arcX.js`, ajoutées à `SCENES` via `Object.assign`.

```js
Object.assign(SCENES, {
  ma_nouvelle_scene: {
    categorie: "Moment de vie",   // détermine la couleur du tag (voir plus bas)
    titre: "Titre affiché en haut de la card",
    texte: () => `Texte de narration. Peut utiliser \${joueur.nom}, \${joueur.age}, etc.`,
    choix: [
      {
        texte: "Ce que le joueur voit sur le bouton",
        resultat: "Texte affiché après avoir cliqué (optionnel, sinon reprend `texte`)",
        effets: { force: 1, argent: -2 },
        suivant: "id_de_la_scene_suivante"   // ou "EVENEMENT" ou "FIN"
      }
    ]
  }
});
```

### Catégories et couleurs de tag

Chaque catégorie génère automatiquement une classe CSS `tag-nom-de-categorie` via `classeTagCategorie()`. Les couleurs actuellement définies dans `style.css` :

| Catégorie | Classe CSS | Couleur |
|---|---|---|
| Moment de vie | `.tag-moment-de-vie` | violet |
| Rencontre | `.tag-rencontre` | vert |
| Danger | `.tag-danger` | rouge/brun |
| Exploration | `.tag-exploration` | doré |
| Combat | `.tag-combat` | rouge foncé |
| Destin | (à définir si besoin) | — |
| Création du personnage | `.tag-creation` | bleu |
| *(aucune catégorie)* | `.tag-defaut` | brun neutre |

Pour ajouter une nouvelle catégorie, ajoute simplement une classe `.tag-nom-en-minuscule-avec-tirets` dans `style.css` — la fonction `classeTagCategorie()` convertit automatiquement le texte de la catégorie en nom de classe (accents supprimés, espaces → tirets).

---

## ⚡ Ajouter un événement aléatoire

Les événements sont indépendants des scènes — ils se déclenchent quand une scène a `suivant: "EVENEMENT"`. Ajoutés via `EVENEMENTS.push(...)` dans `arcX.js`.

```js
EVENEMENTS.push({
  id: "identifiant_unique",
  categorie: "Danger",
  titre: "Titre de l'événement",
  texte: () => `Texte de narration.`,
  poidsBase: 3,                          // poids de tirage (plus c'est grand, plus il a de chances de sortir)
  condition: (j) => (j.stats.reputation > 8 ? 2 : 1),  // multiplie le poids selon l'état du joueur (0 = événement désactivé)
  choix: [
    { 
      texte: "...", 
      effets: {...}, 
      suivant: "scene_suivante"  // accept aussi : "EVENEMENT", "AIGUILLAGE_CLASSE", ou "FIN"
    }
  ]
});
```

Le tirage pondéré est géré par `lancerEvenementAleatoire()` dans `moteur-scenes.js` — pas besoin d'y toucher pour ajouter un événement, juste le déclarer via `EVENEMENTS.push(...)`.

---

## 🔒 Système de conditions sur les choix (`requis` / `interdit`)

Chaque choix peut avoir des conditions qui déterminent s'il est cliquable, mis en valeur, ou bloqué. **4 états possibles** :

| État | Condition | Apparence | Cliquable |
|---|---|---|---|
| **Normal** | Aucune condition | Standard | ✅ |
| **Spécial** ⭐ | `requis` présent ET rempli | Bordure dorée | ✅ |
| **Indisponible** 🔒 | `requis` présent MAIS non rempli | Grisé | ❌ |
| **Interdit** 🚫 | `interdit` présent ET actif | Teinte rouge | ❌ |

### Structure de `requis` (ce qu'il faut AVOIR)

```js
requis: {
  stats: { force: 6, argent: 10 },              // une ou plusieurs stats minimales
  competence: "Navigation basique",              // nom exact d'une compétence
  classe: "pirate",                               // clé de CLASSES
  race: "homme_poisson",                          // clé de RACES
  relation: { nom: "Luffy", statut: "Allié" },    // relation avec un statut précis
  ageMin: 20
}
```

### Structure de `interdit` (ce qui BLOQUE le choix)

```js
interdit: {
  stats: { force: 15 },              // bloqué SI la stat est ≥ ce seuil
  competence: "...",                  // bloqué SI le joueur a cette compétence
  classe: "marine",                   // bloqué SI le joueur est de cette classe
  race: "geant",                      // bloqué SI le joueur est de cette race
  relation: { nom: "...", statut: "Ennemi" },  // bloqué SI cette relation a ce statut
  siClasseFruit: true                 // bloqué SI le joueur a mangé un fruit du démon
}
```

### Exemple complet (nager, impossible avec un fruit du démon)

```js
{
  texte: "Plonger pour récupérer le trésor englouti",
  interdit: { siClasseFruit: true },
  resultat: "Tu plonges sans hésiter et remontes avec le trésor.",
  effets: { argent: 5 },
  suivant: "EVENEMENT"
}
```

### Choix à issue variable (succès / échec selon les stats)

```js
{
  texte: "Les défier pour prouver ta valeur",
  issue: (j) => j.stats.force >= 6,   // fonction qui retourne true/false
  succes: {
    resultat: "Ta force impressionne l'équipage.",
    effets: { force: 1, reputation: 2 },
    suivant: "EVENEMENT"
  },
  echec: {
    resultat: "Le combat tourne court.",
    effets: { force: 1, vie: -10 },
    suivant: "EVENEMENT"
  }
}
```

Le joueur voit toujours le choix (pas grisé), mais ne sait pas à l'avance s'il va réussir — seul le résultat (`succes` ou `echec`) est déterminé au clic.

---

## 🏷️ Effets possibles dans un choix

```js
effets: {
  // Stats numériques (n'importe laquelle de joueur.stats)
  force: 1,
  vie: -10,
  argent: 500000,
  prime: 1000000,

  // Compétences (tableau de noms, pas de doublons automatiques)
  competences: ["Navigation basique"],

  // Objets (tableau de noms, pas de doublons automatiques)
  objets: ["Cape de capitaine"],

  // Relations (ajoute ou met à jour le statut d'un personnage)
  relations: [{ nom: "Luffy", statut: "Allié" }]
}
```

Un choix peut aussi définir, **en dehors** de `effets` :

```js
classe: "pirate",           // change joueur.classe
classeFruit: "gomu",         // change joueur.classeFruit
finArc: true                 // déclenche avancerAge() après ce choix
```

---

## 🍎 Fruits du démon (classe secondaire)

Définis dans `js/donnees/classes.js`, sous `CLASSES_FRUIT` :

```js
const CLASSES_FRUIT = {
  gomu: { nom: "Utilisateur du Gomu Gomu no Mi", emoji: "🍑", couleur: "#c9770f" }
};
```

Pour donner un fruit à un choix, combine `classeFruit` + une compétence représentant la capacité :

```js
{
  texte: "Manger le fruit étrange trouvé sur l'épave",
  resultat: "Un pouvoir immense monte en toi.",
  classeFruit: "gomu",
  effets: { force: 2, competences: ["Élasticité"] },
  suivant: "EVENEMENT"
}
```

Le badge apparaît automatiquement à côté du nom du joueur (fiche + WANTED), et `interdit: { siClasseFruit: true }` permet de bloquer les choix incompatibles (nager, etc.) pour n'importe quel fruit.

---

## 👑 Titre / Surnom (épithète)

Contrairement à `classe` et `classeFruit` (qui viennent de listes prédéfinies dans `classes.js`), le **titre** est une simple chaîne de texte libre, accordée manuellement comme récompense narrative sur n'importe quel choix — pas besoin de le déclarer nulle part à l'avance.

```js
{
  texte: "Écraser la flotte ennemie sans pitié",
  resultat: "Ton nom se répand comme une traînée de poudre. On te surnomme désormais...",
  titre: "Le Cinquième Empereur",
  effets: { reputation: 5, prime: 50000000 },
  suivant: "EVENEMENT"
}
```

Stocké dans `joueur.titre` (chaîne ou `null`). Chaque nouvelle attribution **remplace** l'ancien titre (comme dans One Piece, où le surnom évolue avec la réputation) — ce n'est pas un tableau cumulatif.

Affiché automatiquement en italique façon épithète (`« Le Cinquième Empereur »`) à trois endroits :
- Sous le nom, dans la fiche du haut (`mettreAJourFiche()`)
- Sous le nom, dans la modale WANTED (`afficherDetailsPersonnage()`)
- Sous le nom, dans l'écran de fin de partie (`terminerPartie()`)

---

## 🤝 Statuts de relation et couleurs

Gérés par `couleurStatutRelation()` dans `moteur-scenes.js`. Détection par mot-clé (insensible à la casse) :

| Mot-clé détecté | Couleur |
|---|---|
| "nakama" | doré |
| "allié" / "ami" | vert |
| "rival" | orange/ambre |
| "ennemi" | rouge |
| *(autre)* | brun neutre |

Pour ajouter un nouveau statut, ajoute une ligne `if (s.includes("motcle")) return "#couleur";` **avant** les vérifications génériques, dans `couleurStatutRelation()`.

---

## 🎂 Système d'âge et fin de partie

- Le joueur commence à **16 ans**.
- L'âge avance de +1 uniquement sur un choix marqué `finArc: true` (fin d'un arc), via `avancerAge()`.
- À **40 ans**, `finRetraite()` se déclenche automatiquement, choisissant un texte de fin selon les stats.
- À chaque `avancerAge()`, le `journalArc` en cours est archivé dans `historique`, puis vidé pour le prochain arc.

### Fins prématurées

`etatCritiqueAtteint()` vérifie si `vie <= 0` ou `argent <= -10` → déclenche `afficherFinPrematuree()` (mort ou ruine) via `terminerPartie()`.

### Récap final

`terminerPartie()` construit automatiquement un récapitulatif de tous les arcs traversés (`joueur.historique`), affiché dans l'écran de fin — pas besoin d'y toucher pour ajouter du contenu, il se remplit automatiquement au fil du jeu.

---

## 💾 Sauvegarde de partie

Système basé sur `localStorage` (propre à l'appareil/navigateur, ne synchronise pas entre appareils).

- `sauvegarderPartie()` : appelée automatiquement après chaque `appliquerEffets()`.
- `chargerPartie()` : appelée par le bouton "📖 Continuer l'aventure" sur le menu principal (visible seulement si une sauvegarde existe).
- `supprimerSauvegarde()` : appelée à la fin de partie (`terminerPartie()`), pour repartir propre après une victoire/mort.
- "Retour au menu" (`retourMenuPrincipal()`) ne supprime PAS la sauvegarde — c'est une pause, pas un abandon.

---

## 🏅 Système de succès

Les succès récompensent certains accomplissements en fin de partie (rang final, prime, survie, relations, etc.). Contrairement au Panthéon (qui garde une trace de chaque personnage), les succès sont **cumulatifs et persistants au niveau du joueur réel** : ils survivent à travers toutes les parties, et peuvent être obtenus plusieurs fois (un compteur `×N` s'affiche alors).

### Fichiers concernés

- `js/donnees/succes.js` → déclare `SUCCES_CATALOGUE`, le tableau de tous les succès du jeu, groupés par catégorie.
- `moteur-scenes.js` → contient toute la logique (`chargerSucces`, `sauvegarderSucces`, `verifierEtDebloquerSucces`, `afficherSucces`, `fermerSucces`), ainsi que le branchement dans `terminerPartie()`.
- `index.html` → section `#succes` (onglet accessible via le bouton "👑 Succès") + chargement de `js/donnees/succes.js` avant `moteur-scenes.js`.
- `style.css` → classes `.succes-*` pour l'affichage en grille, `.badge-succes` pour le récap de fin de partie, et `.book-item-verrouille` pour les objets boutique verrouillés par un succès.
- `js/donnees/boutique.js` + `mettreAJourBoutique()` (`moteur-scenes.js`) → gèrent le déblocage optionnel d'objets via le champ `deblocage.succes` (voir "Débloquer un objet de la Boutique via un succès" plus bas).

### Stockage

Les succès obtenus sont stockés dans `localStorage`, sous la clé `op_succes`, sous la forme :

```js
{ "richesse_100m": 3, "titre_legende": 1, ... } // id du succès → nombre de fois obtenu
```

Ce compteur n'est **jamais réinitialisé** entre deux parties (contrairement à `joueur`), c'est ce qui permet d'afficher `×2`, `×3`... sur les succès répétés.

### Ajouter un nouveau succès

Ajoute une entrée dans `SUCCES_CATALOGUE` (`js/donnees/succes.js`) :

```js
{
  id: "identifiant_unique",       // doit être unique dans tout le catalogue
  groupe: "Richesse",              // détermine sous quel titre le succès apparaît dans l'onglet
  nom: "Grande fortune",
  emoji: "💰",
  desc: "Termine une partie avec une prime d'au moins 100 000 000 ฿.",
  recompense: { pieces: 30 },      // pièces de boutique données à CHAQUE obtention (répétable)
  condition: (j, contexte) => contexte.prime >= 100_000_000
}
```

`condition` reçoit :
- `j` : l'objet `joueur` tel qu'il est à la toute fin de la partie (stats, classe, relations, objets, etc.)
- `contexte` : `{ tierTitre, prime, arcs, typeFin }`
  - `tierTitre` : `"bas"` | `"moyen"` | `"haut"` | `"legende"` (calculé dans `finRetraite()` / `finDePartie()`)
  - `prime` : prime finale
  - `arcs` : nombre d'arcs terminés (`joueur.historique.length`)
  - `typeFin` : `"normale"` (fin de contenu) | `"retraite"` (40 ans atteints) | `"premature_vie"` (mort) | `"premature_endurance"` (surmenage)

⚠️ Tous les succès sont vérifiés **uniquement en fin de partie**, dans `terminerPartie()` — pas besoin d'appeler quoi que ce soit ailleurs dans le code narratif (`arcX.js`) pour qu'un succès basé sur les stats/relations/objets du joueur fonctionne, du moment que ces informations sont encore présentes sur `joueur` au moment où la partie se termine.

### Groupes et affichage

L'onglet Succès (`afficherSucces()` dans `moteur-scenes.js`) regroupe automatiquement les entrées de `SUCCES_CATALOGUE` par leur champ `groupe`, dans l'ordre où elles apparaissent dans le fichier — pas besoin de déclarer les groupes à part. Les groupes actuels : **Rangs**, **Titres**, **Richesse**, **Aventure**, **Fruits du Démon**, **Relations**, **Destins** — libre à toi d'en ajouter d'autres en donnant simplement une nouvelle valeur à `groupe`.

Chaque carte affiche : emoji, nom, description et récompense en pièces (si le succès en donne — voir "Récompenses" ci-dessous). Un succès non encore obtenu reste **visible mais grisé** (pas de mystère façon "succès caché" pour l'instant — si tu veux ajouter des succès secrets plus tard, il suffira de masquer `nom`/`desc` tant que `compteur === 0` dans `afficherSucces()`).

En haut de l'onglet, un compteur global affiche **combien de succès sont débloqués sur le total** (`X / Y succès débloqués`), calculé à partir de `SUCCES_CATALOGUE.length` et du nombre d'entrées de `chargerSucces()` dont le compteur est `> 0`.

### Récompenses (succès décoratifs vs succès récompensés)

Le champ `recompense` sur un succès est **optionnel** :

- **Pas de `recompense`** → le succès est purement décoratif / orienté complétionniste. Il apparaît dans l'onglet, se débloque normalement, mais ne rapporte rien.
- **`recompense: { pieces: N }`** → à chaque obtention (y compris les répétitions), `N` pièces de boutique sont ajoutées à la réserve (`ajouterPiecesBoutique`), en plus des pièces habituelles de fin de partie (prime, arcs vécus, tier du titre).

```js
// Décoratif, aucune récompense
{
  id: "explorateur_complet",
  groupe: "Aventure",
  nom: "Cartographe complet",
  emoji: "🗺️",
  desc: "Un succès juste pour la fierté, sans récompense.",
  condition: (j) => /* ... */
}

// Récompensé en pièces
{
  id: "richesse_100m",
  groupe: "Richesse",
  nom: "Grande fortune",
  emoji: "💰",
  desc: "Termine une partie avec une prime d'au moins 100 000 000 ฿.",
  recompense: { pieces: 30 },
  condition: (j, c) => c.prime >= 100_000_000
}
```

Le récapitulatif de fin de partie (`terminerPartie()`) affiche la liste des succès obtenus **lors de cette partie précise**, avec leur compteur global si `> 1`.

⚠️ Les récompenses `objets` / `competences` directement sur un succès ne sont **pas** gérées (et volontairement pas prévues) : donner un objet à la fin de partie n'aurait aucun effet, puisque `joueur` est réinitialisé à la partie suivante. Pour donner accès à un objet de façon permanente via un succès, passe par le **déblocage d'objets boutique** ci-dessous.

### Débloquer un objet de la Boutique via un succès

Un objet de `BOUTIQUE_CATALOGUE` (`js/donnees/boutique.js`) peut être **verrouillé tant qu'un succès donné n'a pas été obtenu au moins une fois**, en ajoutant un champ `deblocage` :

```js
{
  id: "cape_legende",
  nom: "Cape du Roi des Pirates",
  emoji: "🧥",
  desc: "Une cape légendaire, réservée à ceux qui ont prouvé leur valeur. (+5 Charisme, +5 Réputation)",
  prix: 250,
  effets: { objets: ["Cape du Roi des Pirates"], charisme: 5, reputation: 5 },
  deblocage: { succes: "titre_legende" }   // id exact d'une entrée de SUCCES_CATALOGUE
}
```

Tant que le succès `titre_legende` n'a jamais été obtenu (`chargerSucces()["titre_legende"]` absent ou à `0`), l'objet apparaît dans la boutique sous forme de carte grisée `🔒 ???` avec le nom du succès requis, sans bouton d'achat actif (`mettreAJourBoutique()` dans `moteur-scenes.js`). Dès que le succès est débloqué (à n'importe quelle fin de partie, passée ou future), l'objet devient normalement achetable, comme n'importe quel autre article.

`acheterObjetBoutique()` revérifie aussi ce verrouillage côté logique (pas seulement à l'affichage), donc un objet verrouillé ne peut pas être acheté même en modifiant le DOM.

Un objet de la boutique sans champ `deblocage` reste, comme avant, disponible dès que le joueur a assez de pièces — ce système est entièrement optionnel, à ajouter seulement sur les objets que tu veux réserver.

---

## 🔊 Système audio

- **Ambiance de vagues** : boucle continue, indépendante de la musique, démarrée/coupée via le bouton 🎵.
- **Playlist musicale** (`PLAYLIST_MUSIQUES` dans `audio.js`) : une musique aléatoire différente de la précédente se lance à chaque fois que la précédente se termine.
- Le panneau de contrôle (bouton 🎵/🔇, slider vertical, boutons +/-) est **fixe sur le bord droit de l'écran**, visible en permanence (hors de `.cabin-frame`).

Pour ajouter une musique à la playlist : place le fichier dans `audio/`, puis ajoute son chemin dans le tableau `PLAYLIST_MUSIQUES` dans `js/audio.js`.

---

## 🎨 Badges affichés dans la fiche et le WANTED (ordre d'affichage)

1. **Objets** 🎒 (en premier)
2. **Compétences** 📘
3. **Relations** 🤝 (colorées selon le statut)

Le nom du joueur est accompagné, dans l'ordre, de : badge **race**, badge **classe**, badge **classe fruit**.

---

## 🎭 Personnaliser l'histoire selon la classe du joueur

Deux façons de faire vivre une histoire différente selon que le joueur est Pirate, Marine ou Révolutionnaire. **C'est l'Option A qui est utilisée actuellement dans le projet.**

### ✅ Option A (retenue) — Un seul arc, avec des scènes filtrées par classe

Toutes les classes traversent le **même fichier d'arc** (`arc2.js`, `arc3.js`...), mais certaines scènes/événements ne s'affichent (ou ne sont accessibles) que pour une classe donnée, via le système `requis`/`interdit` déjà en place, ou via un aiguillage dédié en début d'arc.

**Avantages** : un seul fichier à gérer par arc, cohérence temporelle entre les classes (tout le monde vit "la même période" de l'histoire), possibilité de réutiliser des scènes communes.

**Aiguillage vers une scène différente selon la classe**, en début d'arc :

```js
arc2_debut: {
  categorie: "Moment de vie",
  titre: "Un nouveau chapitre",
  texte: () => `Le temps a passé. ${joueur.nom} n'est plus le même qu'au premier jour.`,
  choix: [
    {
      texte: "Continuer",
      effets: {},
      suivant: "AIGUILLAGE_CLASSE" // valeur spéciale, gérée dans moteur-scenes.js
    }
  ]
}
```

Le moteur (`continuerApresChoix()` dans `moteur-scenes.js`) reconnaît cette valeur spéciale et redirige automatiquement vers `arc2_${joueur.classe}_intro` :

```js
} else if (resultat.suivant === "AIGUILLAGE_CLASSE") {
  const sceneClasse = `arc2_${joueur.classe}_intro`;
  demarrerScene(sceneClasse);
}
```

Il suffit ensuite d'écrire une scène d'intro par classe (`arc2_pirate_intro`, `arc2_marine_intro`, `arc2_revolutionnaire_intro`), qui peuvent reconverger vers une scène commune plus tard dans l'arc, ou continuer à diverger selon ce que tu veux raconter.

⚠️ Ne jamais écrire `suivant: joueur.classe === "pirate" ? "..." : "..."` directement dans les données — au moment où `SCENES` est rempli (chargement de la page), `joueur.classe` n'est pas encore défini. Toujours passer par une valeur spéciale interceptée dans le moteur, comme `"AIGUILLAGE_CLASSE"` ci-dessus.

**Pour un événement aléatoire réservé à une classe**, pas besoin d'aiguillage — utilise directement `condition` avec un poids de `0` pour les autres classes :

```js
{
  id: "patrouille_marine_traque",
  categorie: "Danger",
  titre: "Traqué par tes anciens frères d'armes",
  texte: () => `Une patrouille marine te reconnaît...`,
  poidsBase: 4,
  condition: (j) => (j.classe === "pirate" ? 1 : 0), // n'apparaît QUE pour les pirates
  choix: [ /* ... */ ]
}
```

### 🔮 Option B (non implémentée, pour plus tard) — Un arc séparé par classe

Idée à garder en tête si l'Option A devient trop contraignante : au lieu d'un seul `arc2.js`, créer un fichier par classe — par exemple `arc2_pirate.js`, `arc2_marine.js`, `arc2_revolutionnaire.js` — chacun avec sa propre trame `SCENES`/`EVENEMENTS`, complètement indépendante des autres.

**Avantages** : liberté totale pour adapter le ton, le rythme et les enjeux à chaque faction, sans avoir à faire "rentrer" toutes les classes dans les mêmes scènes.

**Inconvénients** : environ trois fois plus de contenu à écrire pour couvrir "un seul arc", et il faut gérer l'aiguillage vers le bon fichier dès la fin de l'arc précédent (techniquement simple — même principe d'aiguillage que l'Option A, mais vers des scènes qui vivent dans des fichiers différents plutôt que dans le même).

**Comment basculer vers cette option si besoin** :
1. Créer `js/donnees/arc2_pirate.js`, `arc2_marine.js`, `arc2_revolutionnaire.js` sur le modèle de `arc1.js`.
2. Charger les trois fichiers dans `index.html`, avant `creation-personnage.js`.
3. Utiliser le même système d'aiguillage `"AIGUILLAGE_CLASSE"` en fin d'arc précédent, mais qui pointe vers la première scène du bon fichier au lieu d'une simple scène d'intro dans le même fichier.

Les deux options ne sont pas mutuellement exclusives sur l'ensemble du jeu — rien n'empêche de garder l'Option A pour certains arcs et de basculer vers l'Option B pour un arc où les parcours divergent trop fortement.

---

## ✅ Checklist rapide pour ajouter un nouvel arc

1. Crée `js/donnees/arc2.js` sur le modèle de `arc1.js` (`Object.assign(SCENES, {...})` + `EVENEMENTS.push(...)`).
2. Ajoute `<script src="js/donnees/arc2.js"></script>` dans `index.html`, **avant** `creation-personnage.js`.
3. Fais pointer la dernière scène de l'arc précédent (`suivant: "..."`) vers la première scène du nouvel arc.
4. Ajoute une scène de choix de fin d'arc si besoin (comme `arc1_choix_destin`), avec `finArc: true` sur les choix qui doivent faire vieillir le joueur.
5. Pense aux nouvelles catégories de tags si tu en introduis (`categorie: "..."`) — ajoute la classe CSS correspondante si elle n'existe pas déjà.

---

## 🧹 Réinitialiser les données du jeu (localStorage)

Toutes les données persistantes du jeu vivent dans le `localStorage` du navigateur, chacune sous sa propre clé. Tu peux les effacer indépendamment les unes des autres — effacer le Panthéon n'efface pas les succès, effacer les succès n'efface pas la boutique, etc.

**Comment exécuter une commande de nettoyage :**

1. Ouvre la console de ton navigateur en appuyant sur `F12` (ou `Ctrl` + `Maj` + `I`).
2. Clique sur l'onglet **Console**.
3. Colle la commande souhaitée ci-dessous et appuie sur `Entrée`.

### Panthéon des Pirates (scores/légendes enregistrés)

```javascript
localStorage.removeItem("op_pantheon");
```

### Succès débloqués (compteurs `×N` de l'onglet "👑 Succès")

```javascript
localStorage.removeItem("op_succes");
```

⚠️ Réinitialiser cette clé **reverrouille aussi tout objet de boutique** dont le déblocage dépend d'un succès (`deblocage.succes`), même si l'objet avait déjà été acheté.

### Objets achetés dans la Boutique

```javascript
localStorage.removeItem("op_boutique_achats");
```

⚠️ Efface la possession des objets, **mais pas** les pièces déjà dépensées pour les acheter — elles ne sont pas remboursées.

### Équipement actif (objets sélectionnés pour la prochaine partie)

```javascript
localStorage.removeItem("op_boutique_equipement");
```

Sans effet sur les objets déjà possédés (`op_boutique_achats`) : ça vide juste la sélection des objets équipés pour la prochaine partie.

### Réserve de pièces de Boutique

```javascript
localStorage.removeItem("op_pieces_boutique");
```

### Sauvegarde de la partie en cours (bouton "Continuer l'aventure")

```javascript
localStorage.removeItem("op_sauvegarde");
```

### Tout réinitialiser d'un coup

```javascript
["op_pantheon", "op_succes", "op_boutique_achats", "op_boutique_equipement", "op_pieces_boutique", "op_sauvegarde"]
  .forEach(cle => localStorage.removeItem(cle));
```

⚠️ **Attention** : toutes ces actions sont irréversibles et suppriment définitivement les données concernées (scores, succès, objets possédés, pièces, ou progression en cours, selon la commande utilisée).

---

*Dernière mise à jour de ce guide : ajout du compteur de succès débloqués/total dans l'onglet Succès, distinction succès décoratifs vs récompensés (`recompense` optionnel), système de déblocage d'objets Boutique via succès (`deblocage.succes`), et commandes de réinitialisation détaillées par clé `localStorage`.*