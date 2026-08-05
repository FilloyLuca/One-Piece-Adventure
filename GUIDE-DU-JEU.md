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
  debug.js                     → outils de test développeur, indépendant du jeu (voir section dédiée plus bas)

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
<script src="js/debug.js"></script>
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
    vieMax: 100,           // seuil maximum de vie (voir section "Vie/Endurance : actuel vs max")
    endurance: 100,
    enduranceMax: 100,     // seuil maximum d'endurance
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

## ❤️🔋 Vie / Endurance : valeur actuelle vs seuil max

Contrairement aux autres stats (force, charisme...), `vie` et `endurance` fonctionnent avec **deux valeurs séparées**, affichées partout au format `actuel/max` (ex: `❤️ 80/100`) :

| Clé dans `joueur.stats` | Rôle |
|---|---|
| `vie` / `endurance` | Valeur **actuelle** — ce qu'il reste au joueur, monte et descend au fil des choix |
| `vieMax` / `enduranceMax` | Le **seuil maximum** — la capacité du personnage, en principe plus stable |

### Deux familles d'effets, deux usages différents

Un choix peut modifier l'une ou l'autre de ces valeurs via `effets`, selon ce que tu veux raconter :

```js
// ❤️ Effet PONCTUEL : dégâts, soin, fatigue passagère...
// Modifie uniquement la valeur ACTUELLE, plafonnée par le seuil max courant du joueur
// (donc "vie: +30" ne fait jamais dépasser vieMax, même si vieMax a changé entre-temps).
effets: { vie: -25 }        // le joueur encaisse 25 dégâts
effets: { endurance: -15 }  // fatigue passagère
effets: { vie: 20 }         // soin classique (auberge, médecin...)

// 💪 Effet PERMANENT : blessure durable, entraînement, capacité qui grandit...
// Modifie le SEUIL MAX. Une AUGMENTATION relève aussi la valeur actuelle d'autant
// (le joueur est soigné en même temps qu'il gagne en capacité). Une DIMINUTION ne fait
// que brider la valeur actuelle si elle dépassait le nouveau plafond (elle ne descend
// jamais artificiellement en dessous si le joueur était déjà en dessous du nouveau max).
effets: { vieMax: 10 }           // le personnage devient durablement plus robuste (+10 vie max, +10 vie actuelle)
effets: { enduranceMax: -20 }    // une blessure grave réduit durablement l'endurance max du personnage
```

Le seuil max ne peut jamais descendre en dessous de `1` (protection contre un seuil nul ou négatif).

### Exemple concret

```js
{
  texte: "Se faire briser le bras par le colosse",
  resultat: "Le craquement résonne. Ton bras ne sera peut-être plus jamais aussi fort qu'avant.",
  effets: { vie: -40, enduranceMax: -15 }, // dégâts immédiats + séquelle durable
  suivant: "EVENEMENT"
}
```

```js
{
  texte: "S'entraîner sans relâche pendant des mois",
  resultat: "Ton corps tout entier s'est endurci.",
  effets: { vieMax: 15 }, // capacité de vie durablement augmentée (et soigné d'autant)
  suivant: "EVENEMENT"
}
```

### Points d'entraînement de fin d'arc

Dans `STATS_ENTRAINABLES` (`moteur-scenes.js`), les entrées vie/endurance ciblent volontairement `vieMax`/`enduranceMax` plutôt que `vie`/`endurance` : un point investi en fin d'arc représente une progression **durable** du personnage. Cibler la valeur actuelle serait souvent inutile, puisque le joueur est généralement déjà proche de son plafond au moment de la répartition — le gain serait immédiatement écrêté.

### 💊 Régénération complète (`soinComplet`)

Comme pour `finArc`/`ellipse`, un choix peut définir, **en dehors** de `effets`, un champ `soinComplet: true` qui régénère intégralement `vie` et `endurance` jusqu'à leur **seuil max courant** (`vieMax`/`enduranceMax` — pas une valeur fixe à 100, qui pourrait être fausse si le joueur a déjà entraîné ses seuils). Pratique pour une auberge, un passage chez le médecin de bord, une nuit de repos bien méritée, ou toute ellipse narrative où le personnage doit repartir "comme neuf" sans avoir à calculer manuellement le montant exact à rendre.

```js
{
  texte: "Passer la nuit à l'auberge du port",
  resultat: "Un lit propre et un repas chaud plus tard, tu te sens comme neuf.",
  effets: { argent: -50 },
  soinComplet: true,   // vie et endurance remontent à leur seuil max courant
  suivant: "EVENEMENT"
}
```

Géré par `appliquerSoinComplet()` (`moteur-scenes.js`), appelée dans `choisirDansScene()`/`choisirDansEvenement()` juste **après** `appliquerEffets(resultat.effets)` — un choix peut donc combiner un effet ponctuel (dégât, coût en argent...) et un `soinComplet` sans risque que l'un écrase l'autre, puisque le soin est toujours appliqué en dernier. Le pill `❤️🔋 Soin complet` s'affiche automatiquement dans l'écran de résultat, en plus des pills classiques générés par `formaterEffetsPills()`.

⚠️ Contrairement à `effets: { vieMax: 10 }` (qui **augmente durablement** le seuil), `soinComplet` ne modifie **jamais** `vieMax`/`enduranceMax` — il ramène juste les valeurs actuelles à leur plafond existant. Pour une progression durable du seuil, voir `effets: { vieMax: ... }` plus haut ; les deux peuvent être combinés sur un même choix si besoin (ex: un entraînement qui endurcit **et** soigne en même temps).

### ⚠️ Points d'attention

- Un objet de la Boutique qui offre un bonus de vie/endurance "de départ" (`appliquerEquipementDepart()`, appelé quand le joueur a déjà toute sa vie/endurance) doit cibler `vieMax`/`enduranceMax` et non `vie`/`endurance`, sinon le bonus est immédiatement plafonné et donc perdu. C'est le cas de l'objet `log_pose` (`js/donnees/boutique.js`), qui utilise `enduranceMax: 10`.
- Les bonus `vie`/`endurance` des objets `RACES`, `ORIGINES`, `POSTES`, `ENTOURAGES` (création de personnage) restent inchangés dans leur écriture — `choisir()` (`creation-personnage.js`) les applique automatiquement à la fois sur la valeur actuelle **et** sur le seuil max, puisqu'ils représentent la constitution innée du personnage. Pas besoin de dupliquer `vie`/`endurance` en `vieMax`/`enduranceMax` dans ces objets de données.
- `etatCritiqueAtteint()` (fins prématurées) continue de comparer les valeurs **actuelles** (`vie <= 0`, `endurance <= -50`) — le seuil max n'entre pas en jeu dans cette vérification.

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

⚠️ Ce système avec `>=` est un **seuil dur** : à stats égales, le résultat est toujours identique d'une partie à l'autre. Pratique pour des conditions simples, mais sans tension — un joueur qui atteint le seuil réussit à 100% des essais. Pour un vrai hasard pondéré par les stats, voir la section suivante.

### Choix à issue probabiliste (`tirageProbabiliste`)

Pour introduire du **hasard pondéré par les stats** — plus la stat du joueur est haute par rapport à la difficulté, plus la chance de réussite augmente, sans jamais atteindre 0% ou 100% — deux fonctions sont disponibles dans `moteur-scenes.js` (déclarées avant la section "RENDU D'UNE SCÈNE") :

```js
// Convertit un écart stat/difficulté en probabilité de réussite (0 à 1)
function calculerChanceReussite(statJoueur, difficulte, pente = 3) {
  const proba = 1 / (1 + Math.exp(-(statJoueur - difficulte) / pente));
  return Math.min(0.92, Math.max(0.08, proba)); // jamais 0% ni 100% garanti
}

// Fonction à utiliser directement dans `issue` d'un choix
function tirageProbabiliste(statJoueur, difficulte, pente = 3) {
  const chance = calculerChanceReussite(statJoueur, difficulte, pente);
  return Math.random() < chance;
}
```

**Paramètres :**
- `difficulte` : le seuil "pivot" — la stat à partir de laquelle le joueur a environ 50% de chances de réussir.
- `pente` : contrôle à quel point l'écart de stat influence le résultat.
  - **Pente basse (2-3)** → très prévisible : un perso costaud gagne presque toujours, un perso faible perd presque toujours. À réserver aux combats physiques tranchés.
  - **Pente haute (5-6)** → presque 50/50 quoi qu'il arrive : la chance/le destin joue un vrai rôle (tempête, pari, bluff). Même un perso costaud peut se planter.

Exemple de conversion avec `difficulte = 8`, `pente = 3` :

| Stat du joueur | Chance de réussite approx. |
|---|---|
| 5 | ~13% |
| 8 (seuil pivot) | 50% |
| 12 | ~90% |

**Utilisation dans un choix :**

```js
{
  texte: "Défier ton rival en duel",
  issue: (j) => tirageProbabiliste(j.stats.force, 8, 3),
  succes: {
    resultat: "Tu prends le dessus dans un combat acharné.",
    effets: { force: 2, reputation: 3 },
    suivant: "EVENEMENT"
  },
  echec: {
    resultat: "Ton rival te bat, mais tu as tenu tête.",
    effets: { force: 1, vie: -15 },
    suivant: "EVENEMENT"
  }
}
```

**Combiner plusieurs stats :** pondère leur importance respective avant de les passer au tirage (les coefficients doivent s'additionner à 1) :

```js
issue: (j) => tirageProbabiliste((j.stats.force * 0.7 + j.stats.vitesse * 0.3), 8, 3)
```

Ici, la force compte pour 70% du résultat et la vitesse pour 30% — un personnage rapide mais peu puissant garde une vraie chance, sans que ce soit sa qualité dominante.

⚠️ Rien ne change côté affichage ni côté moteur : `issue` est déjà appelé silencieusement dans `choisirDansScene()` / `choisirDansEvenement()`, qu'il s'agisse d'un seuil dur ou d'un tirage probabiliste. Le joueur voit le choix normalement (pas grisé, aucune condition affichée), clique, et découvre le résultat — la surprise est préservée dans les deux cas.

---

## 🏷️ Effets possibles dans un choix

```js
effets: {
  // Stats numériques (n'importe laquelle de joueur.stats)
  force: 1,
  vie: -10,              // valeur ACTUELLE seulement — voir "Vie / Endurance : valeur actuelle vs seuil max"
  vieMax: 5,              // seuil MAX — voir la même section
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

⚠️ `vie`/`endurance` et `vieMax`/`enduranceMax` ne se comportent **pas** comme les autres stats numériques (simple addition) : voir la section [❤️🔋 Vie / Endurance : valeur actuelle vs seuil max](#-vie--endurance--valeur-actuelle-vs-seuil-max) plus haut pour le détail du plafonnage et de la répercussion sur la valeur actuelle.

Un choix peut aussi définir, **en dehors** de `effets` :

```js
classe: "pirate",           // change joueur.classe
classeFruit: "gomu",         // change joueur.classeFruit
finArc: true,                 // déclenche avancerAge() après ce choix
ellipse: 2,                   // fait avancer l'âge de N années (voir "Ellipse temporelle")
soinComplet: true             // régénère vie et endurance à leur seuil max courant (voir "💊 Régénération complète")
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

| Mot-clé détecté | Couleur | Sens |
|---|---|---|
| "nakama" | doré | Membre à part entière de l'équipage/du cercle proche |
| "maître" / "maitre" | bleu | Figure d'autorité, mentor, supérieur hiérarchique |
| "allié" / "ami" | vert | Relation positive, sans lien aussi fort que Nakama |
| "rival" | orange/ambre | Ni ami ni ennemi, une tension compétitive |
| "ennemi" | rouge | Relation hostile |
| *(autre)* | brun neutre | Statut personnalisé non reconnu par les mots-clés ci-dessus |

Pour ajouter un nouveau statut, ajoute une ligne `if (s.includes("motcle")) return "#couleur";` **avant** les vérifications génériques, dans `couleurStatutRelation()`.

### ☠️ Marquer une relation comme décédée

La mort d'un personnage lié au joueur **n'est pas un statut** (elle ne remplace ni n'écrase Rival/Allié/Nakama/etc.) : c'est un champ booléen séparé, `mort: true`, affiché **à côté** du statut existant plutôt qu'à sa place. Ainsi un Rival qui meurt reste affiché comme "Rival ☠️", un Allié comme "Allié ☠️", etc. — l'historique de la relation est conservé.

```js
// Exemple : faire mourir un personnage lié au joueur, dans les effets d'un choix
// (le statut existant, ex: "Allié", est conservé — seul le marqueur ☠️ s'ajoute)
effets: {
  relations: [{ nom: "Coby", mort: true }]
}
```

`appliquerEffets()` fusionne les champs fournis sur l'entrée existante (`Object.assign(existante, r)`) plutôt que d'écraser uniquement `statut` — ce qui permet de passer `mort: true` seul, sans redéfinir le statut. Si la relation n'existe pas encore, une nouvelle entrée est créée avec les champs fournis (typiquement `nom` + `statut` + `mort`, si tu veux introduire et tuer un personnage dans le même choix).

Le marqueur `☠️` est affiché automatiquement partout où les relations apparaissent : la fiche du haut (`mettreAJourFiche()`), la modale WANTED (`afficherDetailsPersonnage()`), et la pastille d'effet après un choix (`formaterEffetsPills()`).

Un succès dédié existe dans `succes.js` (`relation_perte`, groupe "Relations") qui se déclenche si au moins une relation a `mort: true` en fin de partie.

---

## 🎂 Système d'âge et fin de partie

- Le joueur commence à **16 ans**.
- L'âge avance de +1 uniquement sur un choix marqué `finArc: true` (fin d'un arc), via `avancerAge()`.
- À **40 ans**, `finRetraite()` se déclenche automatiquement, choisissant un texte de fin selon les stats.
- À chaque `avancerAge()`, le `journalArc` en cours est archivé dans `historique`, puis vidé pour le prochain arc.

### ⏳ Ellipse temporelle (sauter plusieurs années d'un coup)

`avancerAge()` accepte un paramètre optionnel `nombreAnnees` (défaut : `1`, comme avant) : `avancerAge(2)` fait vieillir le joueur de 2 ans en une seule fois. Utile pour simuler un entraînement en solitaire, un exil, un coma, ou tout saut narratif du type *« Deux ans plus tard... »*.

Deux façons de le déclencher depuis un choix, via le champ `ellipse` :

**1. Ellipse en fin d'arc**, combinée avec `finArc: true` — l'écran de points d'entraînement s'affiche ensuite normalement :

```js
{
  texte: "Partir t'entraîner seul, loin de tout",
  resultat: "Deux années s'écoulent, faites de sueur et de solitude...",
  effets: { force: 3 },
  finArc: true,
  ellipse: 2,          // fait vieillir le joueur de 2 ans au lieu d'1 seul
  suivant: "arc4_debut"
}
```

**2. Ellipse "libre"**, en plein milieu d'un arc, sans passer par l'écran de points ni par la logique de fin d'arc — juste un saut narratif ponctuel :

```js
{
  texte: "Accepter de dormir jusqu'à la fin de la tempête",
  resultat: "À ton réveil, deux années ont passé sans que tu t'en rendes compte.",
  effets: {},
  ellipse: 2,          // avance directement l'âge de 2 ans
  suivant: "arc3_reveil_tardif"
}
```

⚠️ Dans les deux cas, si l'ellipse fait franchir le seuil de 40 ans, `finRetraite()` se déclenche automatiquement comme avec un `avancerAge()` normal — pas besoin de vérifier ce seuil manuellement dans les données de scène.

### 🎯 Personnaliser le nombre de points d'entraînement par fin d'arc

Par défaut, chaque fin d'arc (`finArc: true`) propose `POINTS_ENTRAINEMENT_PAR_ARC` points à répartir (3 par défaut, voir constante en haut de `moteur-scenes.js`). Ce nombre peut être :

- **Changé globalement** en modifiant directement la constante `POINTS_ENTRAINEMENT_PAR_ARC`.
- **Personnalisé pour un choix précis**, via le champ optionnel `pointsEntrainement` sur ce choix :

```js
{
  texte: "Achever cet arc éprouvant",
  resultat: "Cette épreuve t'a transformé plus qu'aucune autre.",
  effets: {},
  finArc: true,
  pointsEntrainement: 5,   // remplace les 3 points par défaut, seulement pour cette fin d'arc
  suivant: "arc5_debut"
}
```

Si `pointsEntrainement` n'est pas fourni, la valeur par défaut (`POINTS_ENTRAINEMENT_PAR_ARC`) s'applique automatiquement — aucune modification nécessaire sur les scènes existantes.

💡 Cohérent avec le [guide de progression des récompenses](./GUIDE-PROGRESSION-RECOMPENSES.md) : les points d'entraînement peuvent eux aussi croître au fil des arcs (ex : 3 en début de jeu, 4-5 en fin de jeu) pour accompagner la montée en puissance du personnage.

### Fins prématurées

`etatCritiqueAtteint()` vérifie si `vie <= 0` ou `endurance <= -50` → déclenche `afficherFinPrematuree()` (mort ou surmenage) via `terminerPartie()`.

Par défaut, cette fin affiche un titre et une raison **génériques**, qui dépendent uniquement de la stat en cause :

| Cause | Titre par défaut | Raison par défaut | `typeFin` |
|---|---|---|---|
| `vie <= 0` | "Mort tragique" | "Tu as été gravement blessé et n'as pas survécu à tes blessures." | `premature_vie` |
| `endurance <= -50` | "Surmenage fatal" | "Tu n'as pas su gérer ton endurance et ton corps a lâché." | `premature_endurance` |

#### 💀 Personnaliser le texte d'une mort précise (`mortPersonnalisee`)

Si un choix précis doit provoquer la mort (`vie <= 0`) et que tu veux que l'écran de fin raconte **cette mort en particulier**, plutôt que d'afficher le texte générique "Mort tragique" — ajoute un champ optionnel `mortPersonnalisee` sur le résultat du choix (au même niveau que `effets`, `resultat`, `suivant`...) :

```js
{
  texte: "Manger un second fruit du démon, malgré la légende qui dit que c'est mortel",
  resultat: "Une douleur indescriptible envahit chaque cellule de ton corps. Deux pouvoirs démoniaques ne peuvent cohabiter...",
  effets: { vie: -999, competences: ["Second Fruit Ingéré"] },
  mortPersonnalisee: {
    titre: "Le prix du second pouvoir",
    raison: "Ton corps n'a pas supporté d'accueillir un second fruit du démon. Ambitieux jusqu'au bout, tu t'effondres, dévoré de l'intérieur par ta propre soif de puissance."
  },
  suivant: "EVENEMENT"
}
```

Points importants :

- **`effets: { vie: -999 }`** (ou toute valeur qui ramène `vie` à 0 ou moins) est ce qui déclenche réellement `etatCritiqueAtteint()` — `mortPersonnalisee` ne fait que personnaliser le texte affiché, il ne provoque pas la mort à lui seul.
- **`titre` et `raison` sont tous les deux optionnels** : tu peux ne remplacer que l'un des deux (ex: garder la raison générique mais donner un titre spécifique) en omettant l'autre champ.
- **`typeFin` n'est jamais modifié** par `mortPersonnalisee` : une mort par `vie <= 0` reste classée `premature_vie`, même avec un texte personnalisé. Les succès qui dépendent de `typeFin` (ex: `destin_mort`, groupe "Destins") continuent donc de se déclencher normalement, sans rien à changer côté `succes.js`.
- Fonctionne aussi bien sur un choix de scène classique que sur un résultat `succes`/`echec` d'un choix à `issue` (voir "Choix à issue variable" plus haut) — `mortPersonnalisee` est simplement lu sur l'objet résultat final (`derniereIssue`), peu importe son origine.
- Un choix qui ne définit pas `mortPersonnalisee` continue de produire le texte générique "Mort tragique" comme avant — ce champ est entièrement optionnel, aucune scène existante n'a besoin d'être modifiée.

💡 Combine bien avec le système de compétences pour aussi débloquer un succès dédié à cette mort précise, comme le fait déjà `destin_fruit_interdit` (`succes.js`) avec la compétence `"Second Fruit Ingéré"` de l'exemple ci-dessus.

#### 🏝️ Personnaliser une fin de partie non-mortelle (`finPersonnalisee`)

`mortPersonnalisee` couvre les fins prématurées par `vie <= 0`. Mais un choix peut aussi vouloir mener à une **fin de partie volontaire et non-mortelle** — le personnage ne meurt pas, il choisit simplement un autre destin (rester sur son île natale, abandonner la piraterie, se retirer du jeu politique...). Pour ça, un choix peut définir un champ optionnel `finPersonnalisee` (au même niveau que `effets`, `resultat`, `suivant`...) sur un résultat dont le `suivant` vaut `"FIN"` :

```js
{
  texte: "Rester sur l'île, pour de bon",
  resultat: "Tu as décidé de ne pas répondre à l'appel de l'aventure, et as préféré vivre toute ta vie sur ton île d'enfance.",
  effets: {},
  finPersonnalisee: {
    titre: "Une vie sans vagues",
    raison: "Loin des tempêtes et des batailles, tu as choisi la tranquillité de ton île natale. Ton nom ne sera jamais gravé dans l'histoire de Grand Line — mais tu as vécu la vie que tu voulais.",
    typeFin: "refus_aventure"
  },
  suivant: "FIN"
}
```

Points importants :

- **`titre`, `raison` et `typeFin` sont tous les trois optionnels** : n'importe lequel peut être omis pour garder la valeur générique calculée normalement par `finDePartie()` (titre selon la prime/classe, raison "Ton aventure touche à sa fin, pour l'instant...", `typeFin: "normale"`).
- **`typeFin` est une chaîne libre**, comme pour n'importe quel autre champ de données (`titre` narratif, noms d'objets...) — tu peux inventer la valeur que tu veux (ex: `"refus_aventure"`), tant qu'elle reste cohérente avec ce que testeront tes succès. Elle vient s'ajouter aux valeurs déjà utilisées par le moteur (`"normale"`, `"retraite"`, `"premature_vie"`, `"premature_endurance"`).
- **`finDePartie()` accepte ce paramètre** (`finDePartie(resultat.finPersonnalisee)`), appelé automatiquement par `continuerApresChoix()` dans les deux endroits où `finDePartie()` est déclenché (fin d'arc avec `suivant: "FIN"`, et fin directe hors `finArc`) — rien à modifier côté données au-delà du champ `finPersonnalisee` lui-même.
- Contrairement à `mortPersonnalisee` (réservé aux morts par `vie <= 0`, où `typeFin` reste toujours `premature_vie`), `finPersonnalisee` peut librement changer `typeFin` puisqu'il ne s'agit pas d'une fin prématurée déclenchée par `etatCritiqueAtteint()`.

💡 Comme pour `mortPersonnalisee`, pense à créer un succès dédié dans `succes.js` qui teste ce nouveau `typeFin` :

```js
{
  id: "destin_ile_natale",
  groupe: "Destins",
  nom: "Une vie sans vagues",
  emoji: "🏝️",
  desc: "Refuse l'appel de l'aventure et termine ta vie sur ton île natale.",
  recompense: { pieces: 10 },
  condition: (j, c) => c.typeFin === "refus_aventure"
}
```

⚠️ Piège fréquent (le même que documenté plus haut pour `scenesVisitees`/`objets`/`competences`) : la chaîne passée à `condition` doit être **copiée-collée à l'identique** depuis `finPersonnalisee.typeFin` dans la scène — pas depuis le nom de la scène, ni reformulée de mémoire. Une différence d'orthographe, même minime, ne provoque aucune erreur : le succès ne se débloquera simplement jamais.

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

### Succès basés sur un objet, une compétence ou une relation précise

`objets` et `competences` ne sont pas des catalogues déclarés à l'avance (contrairement à `CLASSES` ou `CLASSES_FRUIT`) : ce sont de simples tableaux de chaînes de texte, remplis au fil des choix via `effets` (voir "🏷️ Effets possibles dans un choix"). Pour qu'un succès se déclenche sur la possession d'un objet ou d'une compétence précise, il suffit donc de vérifier sa présence dans le tableau, avec le **nom exact** utilisé dans la scène qui l'accorde :

```js
// Le choix qui donne l'objet, quelque part dans arcX.js
effets: { objets: ["Amulette des Anciens"] }

// Le succès correspondant, dans succes.js
{
  id: "possede_amulette",
  groupe: "Objets",
  nom: "Collectionneur d'artefacts",
  emoji: "🏺",
  desc: "Termine une partie en possédant l'Amulette des Anciens.",
  recompense: { pieces: 20 },
  condition: (j) => (j.objets || []).includes("Amulette des Anciens")
}
```

Même principe pour une compétence :

```js
condition: (j) => (j.competences || []).includes("Élasticité")
```

⚠️ La comparaison est une égalité stricte de texte (`.includes()`) : accents, majuscules/minuscules et espaces doivent correspondre exactement entre la scène qui accorde l'objet/la compétence et la condition du succès. Si le même objet peut être obtenu depuis plusieurs scènes différentes, veille à toujours utiliser rigoureusement la même orthographe.

**Cas particulier des relations** : contrairement à `objets`/`competences`, `joueur.relations` n'est pas un tableau de chaînes mais un tableau d'objets `{ nom, statut, mort? }` (voir "🤝 Statuts de relation et couleurs"). Il faut donc chercher l'entrée correspondante avec `.find()` plutôt que `.includes()`, puis tester son `statut` (ou son champ `mort`) :

```js
// Le choix qui crée/fait évoluer la relation, quelque part dans arcX.js
effets: { relations: [{ nom: "Coby", statut: "Nakama" }] }

// Succès basé sur le statut exact d'une relation précise
{
  id: "coby_nakama",
  groupe: "Relations",
  nom: "Fidèle jusqu'au bout",
  emoji: "🤝",
  desc: "Termine une partie avec Coby comme Nakama.",
  recompense: { pieces: 20 },
  condition: (j) => {
    const rel = (j.relations || []).find(r => r.nom === "Coby");
    return !!rel && rel.statut === "Nakama";
  }
}

// Succès basé sur la mort d'un personnage précis (indépendant du statut)
{
  id: "coby_perdu",
  groupe: "Destins",
  nom: "Un ami de moins",
  emoji: "☠️",
  desc: "Termine une partie après la mort de Coby.",
  recompense: { pieces: 15 },
  condition: (j) => {
    const rel = (j.relations || []).find(r => r.nom === "Coby");
    return !!rel && rel.mort === true;
  }
}
```

⚠️ Même règle d'orthographe stricte que pour `objets`/`competences` : le `nom` du personnage (`"Coby"`) doit être écrit exactement pareil partout où il apparaît dans les choix (`relations: [{ nom: "..." }]`), sans quoi `.find()` ne retrouvera jamais la bonne entrée. Si tu veux un succès qui se déclenche sur **n'importe quelle** relation avec un statut donné (peu importe le nom du personnage), utilise plutôt `.some()` comme le fait déjà `relation_nakama` dans le catalogue actuel : `(j.relations || []).some(r => r.statut.toLowerCase().includes("nakama"))`.

### Succès basés sur une stat numérique (`j.stats`)

Comme pour `objets`/`competences`/`relations`, aucune déclaration préalable n'est nécessaire : `condition` peut directement lire n'importe quelle clé de `j.stats` (voir la liste complète dans "🧍 L'état du joueur").

```js
{
  id: "statistiques_vie_150",
  groupe: "Statistiques",
  nom: "Bonne santé",
  emoji: "❤️",
  desc: "Termine une partie avec une vie max d'au moins 150.",
  recompense: { pieces: 10 },
  condition: (j) => j.stats.vieMax >= 150
}
```

⚠️ **Piège fréquent** : rien ne vérifie automatiquement que le texte de `desc` correspond réellement à ce que teste `condition` — ce sont deux champs complètement indépendants aux yeux du moteur. Une faute de copier-coller (ex: `desc` qui parle de "force" alors que `condition` teste `j.stats.vie`) ne provoque **aucune erreur** : le succès fonctionnera très bien techniquement, mais affichera une description trompeuse au joueur. Relis toujours `desc` et `condition` côte à côte avant de valider un nouveau succès.

⚠️ Autre piège : `vie`/`endurance` (valeur actuelle) et `vieMax`/`enduranceMax` (seuil max) sont deux clés distinctes (voir "❤️🔋 Vie / Endurance : valeur actuelle vs seuil max") — un succès voulant récompenser un seuil max durablement élevé doit bien cibler `vieMax`/`enduranceMax`, pas `vie`/`endurance`, sous peine de dépendre de l'état ponctuel du joueur à l'instant précis de `terminerPartie()` plutôt que de sa progression réelle.

### Succès basés sur une scène ou un événement précis atteint (`j.scenesVisitees`)

Contrairement à `objets`/`competences`/`relations`/`stats`, **atteindre une scène ou un événement n'est pas enregistré nulle part par défaut** — `joueur` ne garde aucune trace des `SCENES`/`EVENEMENTS` traversés au fil de la partie. Pour débloquer un succès du type *« Découvre tel lieu »* ou *« Tombe sur tel événement rare »*, il faut donc un tableau dédié : `joueur.scenesVisitees` (tableau d'ids, rempli automatiquement par le moteur).

**Mise en place (une seule fois, déjà faite dans le projet) :**

1. **`creation-personnage.js`** — le champ est déclaré vide à l'état initial du joueur, comme les autres tableaux (`objets`, `competences`...) :

```js
let joueur = {
  // ...
  journalArc: [],
  historique: [],
  scenesVisitees: []   // ids des scènes/événements déjà atteints, pour les succès de découverte
};
```

2. **`moteur-scenes.js`** — chaque scène et chaque événement s'ajoute automatiquement au tableau dès qu'il s'affiche, dans `demarrerScene()` :

```js
const scene = SCENES[id];
if (!scene) return;

// 🏅 Marque cette scène comme visitée (pour les succès basés sur scenesVisitees)
if (!joueur.scenesVisitees) joueur.scenesVisitees = [];
if (!joueur.scenesVisitees.includes(id)) joueur.scenesVisitees.push(id);
```

...et de la même façon dans `afficherEvenement()`, avec `evenement.id` à la place de `id`. Le `if (!joueur.scenesVisitees) ...` protège les sauvegardes déjà existantes en `localStorage`, créées avant l'ajout de ce champ.

**Écrire le succès**, en utilisant l'**id exact** de la scène (la clé dans `SCENES`) ou de l'événement (`ev.id`) — jamais le `titre` affiché, qui peut être réécrit narrativement sans que ça casse le succès :

```js
{
  id: "atteint_arc1_reveil",
  groupe: "Aventure",
  nom: "Le grand réveil",
  emoji: "🌅",
  desc: "Atteins la scène du réveil au tout début de l'aventure.",
  recompense: { pieces: 5 },
  condition: (j) => (j.scenesVisitees || []).includes("arc1_reveil")
}
```

```js
// Exemple avec un événement aléatoire rare (faible poidsBase dans EVENEMENTS)
{
  id: "rencontre_rare",
  groupe: "Aventure",
  nom: "Une rencontre inattendue",
  emoji: "🎲",
  desc: "Tombe sur l'événement « Le naufragé mystérieux ».",
  recompense: { pieces: 20 },
  condition: (j) => (j.scenesVisitees || []).includes("naufrage_mysterieux")
}
```

⚠️ Comme pour `objets`/`competences` (voir plus haut), la comparaison est une égalité stricte de texte : l'id passé à `.includes()` doit être copié-collé exactement depuis la clé de `SCENES` ou le champ `id` de l'entrée dans `EVENEMENTS`, sans quoi le succès ne se débloquera jamais silencieusement.

`joueur.scenesVisitees` fait partie de l'objet `joueur` comme n'importe quel autre champ : il est donc automatiquement sauvegardé et rechargé par `sauvegarderPartie()` / `chargerPartie()`, sans rien à faire de plus côté persistance. Sur une très longue partie (beaucoup d'arcs), le tableau grossit, mais reste négligeable en taille (juste une liste d'ids courts en `localStorage`).

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

### ➕ Ajouter un objet à la Boutique

Le catalogue de la Boutique vit dans `js/donnees/boutique.js`, sous `BOUTIQUE_CATALOGUE` (un tableau) — toute la logique (achat, équipement, application au lancement d'une partie) reste dans `moteur-scenes.js`, tu n'as **rien à toucher côté moteur** pour ajouter un simple objet.

```js
{
  id: "identifiant_unique",          // doit être unique dans tout le catalogue
  nom: "Nom affiché de l'objet",
  emoji: "⚔️",
  desc: "Description courte, qui explique aussi l'effet entre parenthèses. (+3 Force)",
  prix: 100,                          // coût en pièces de boutique (op_pieces_boutique)
  effets: { objets: ["Nom affiché de l'objet"], force: 3 }   // appliqués via appliquerEffets()
}
```

Points importants :

- **`prix`** : en pièces de boutique, gagnées en fin de partie (voir `calculerPiecesGagnees()`) — indépendant de l'argent (`argent`) ou de la prime (`prime`) du personnage en jeu.
- **`effets`** : suit exactement les mêmes règles que les `effets` d'un choix de scène (voir "🏷️ Effets possibles dans un choix" plus haut) — stats numériques, `objets`, `competences`, etc. Ils ne sont appliqués qu'**au tout début d'une nouvelle partie** (`lancerAventure()` → `appliquerEquipementDepart()`), et seulement si le joueur a équipé l'objet.
- **Cas de `vie`/`endurance`** : comme le personnage démarre déjà avec sa vie/endurance actuelle au maximum, un effet `vie: 10` ou `endurance: 10` sur un objet de départ serait immédiatement plafonné et donc perdu (voir "❤️🔋 Vie / Endurance : valeur actuelle vs seuil max"). Pour un objet qui doit rendre le personnage durablement plus résistant dès le départ, utilise `vieMax`/`enduranceMax` à la place — c'est ce que fait l'objet `log_pose` du catalogue actuel (`effets: { objets: [...], enduranceMax: 10 }`).
- **`objets`** dans `effets` (tableau) sert à faire apparaître un badge 🎒 dans la fiche du personnage une fois la partie lancée — c'est une bonne pratique d'y répéter le nom de l'objet, même s'il n'a aucun effet mécanique.
- Pas besoin de gérer `MAX_EQUIPEMENT_BOUTIQUE` toi-même : c'est une constante globale (actuellement `3`) qui limite le nombre d'objets équipés simultanément, tous objets confondus — elle s'applique automatiquement au nouvel objet.
- Un objet peut aussi être verrouillé derrière un succès dès sa création, en lui ajoutant directement le champ `deblocage` décrit juste en dessous — pas besoin d'attendre pour l'ajouter après coup.

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

## 📖 Pagination interne d'une page du Guide (sous-pages)

Certaines pages du guide (`js/donnees/guide.js`, objet `pagesGuide`) peuvent devenir trop longues pour tenir proprement dans le livre (ex: "⚔️ Les Stats"). Plutôt que de laisser le contenu déborder, une page peut être **découpée en plusieurs sous-pages**, avec des boutons "Suite →" / "← Retour" affichés automatiquement en bas du contenu dès qu'il y a plus d'une sous-page.

### Comment ça marche

Une constante `GUIDE_SEPARATEUR` (déclarée en haut de `guide.js`) sert de marqueur de coupure :

```js
const GUIDE_SEPARATEUR = "<!--SUITE-->";
```

Pour découper une page, insère simplement `${GUIDE_SEPARATEUR}` à l'endroit voulu dans son texte :

```js
3: `
  <h2 class="book-title">⚔️ Les Stats</h2>
  <ul>...</ul>
  ${GUIDE_SEPARATEUR}
  <h2 class="book-title">⚔️ Les Stats (suite)</h2>
  <ul>...</ul>
`
```

Tu peux insérer `GUIDE_SEPARATEUR` plusieurs fois dans une même page si elle doit être coupée en 3 morceaux ou plus — rien à changer côté logique.

### Logique (moteur-scenes.js)

- `changerPageGuide(numPage)` : appelée depuis les boutons du sommaire, change de page principale et revient toujours à la première sous-page (`guideSousPage = 0`).
- `afficherSousPageGuide()` : découpe le contenu de la page courante via `.split(GUIDE_SEPARATEUR)`, affiche la sous-page en cours, et ajoute automatiquement la navigation ("← Retour" / compteur `X / Y` / "Suite →") **seulement si** la page contient plus d'une sous-page. Une page non découpée s'affiche donc exactement comme avant, sans aucun bouton superflu.
- `pageGuideSuivante()` / `pageGuidePrecedente()` : incrémentent/décrémentent `guideSousPage` puis rappellent `afficherSousPageGuide()`.

### Ajouter une nouvelle page découpée

1. Écris le contenu complet de la page dans `pagesGuide`, comme avant.
2. Repère où couper, et insère `${GUIDE_SEPARATEUR}` à cet endroit.
3. Rien d'autre à faire — la navigation est générée automatiquement selon le nombre de sous-pages détectées.

⚠️ Si tu ajoutes une propriété `guideSousPage` ou `guidePageActuelle` ailleurs dans le code par erreur (variables globales déclarées en haut de `moteur-scenes.js`, juste avant `afficherGuide()`), assure-toi de ne pas les redéclarer pour éviter d'écraser l'état de navigation en cours.

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

## 🛠️ Outils de debug (tester sans tout rejouer)

Sur un jeu à plusieurs arcs, rejouer toute l'aventure depuis le début pour vérifier une scène en particulier devient vite ingérable. `js/debug.js` permet de sauter directement à n'importe quelle scène ou événement, sans passer par la création de personnage ni l'historique.

Ce fichier est **entièrement indépendant** du reste du jeu : il ne fait qu'appeler des fonctions déjà existantes (`demarrerScene()`, `afficherEvenement()`, `mettreAJourFiche()`). Le jeu fonctionne normalement même si `js/debug.js` est retiré de `index.html` — c'est d'ailleurs recommandé avant tout déploiement public.

### Utilisation en console (F12 → onglet Console)

```js
sauterAScene("arc3_debut")
sauterAScene("arc5_duel", { force: 20, argent: 50000 })  // pour tester un choix requis/interdit
sauterAEvenement("naufrage_mysterieux")
```

Le deuxième paramètre (optionnel) permet de fixer des stats ou des champs `joueur` précis avant le saut — pratique pour tester un choix verrouillé par `requis`/`interdit` sans avoir à y accéder naturellement, ou pour forcer une classe/race donnée sur une scène qui en dépend.

### Panneau visuel (`?debug=1`)

Ouvrir le jeu avec `index.html?debug=1` fait apparaître un panneau en haut à gauche, listant toutes les scènes de `SCENES` et tous les événements de `EVENEMENTS` sous forme de boutons cliquables. Sans ce paramètre dans l'URL, le panneau ne s'affiche jamais — aucun risque qu'un joueur normal tombe dessus.

### ⚠️ Limites à garder en tête

- Un saut direct ne passe pas par `avancerAge()` : si tu sautes à l'arc 7 sans avoir vécu les arcs précédents, `joueur.historique` reste vide pour les arcs 1 à 6. Sans impact sur le test du contenu narratif en lui-même, mais l'écran de fin de partie (récap par arc) sera incomplet si tu testes jusque-là.
- `_preparerJoueurPourDebug()` fixe des valeurs par défaut minimales (`classe: "pirate"`, `race: "humain"`, `nom: "Testeur"`) uniquement si elles ne sont pas déjà définies, pour éviter les erreurs sur les scènes qui lisent `joueur.classe`/`joueur.race`. Pense à les surcharger via le deuxième paramètre si le contenu testé dépend d'une classe ou race précise (ex: `sauterAScene("arc4_marine_intro", { classe: "marine" })`).
- Avant un déploiement public, retire (ou commente) la ligne `<script src="js/debug.js"></script>` dans `index.html`.

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

*Dernière mise à jour de ce guide : ajout de la section "🛠️ Outils de debug" documentant `js/debug.js` (`sauterAScene`, `sauterAEvenement`, panneau visuel via `?debug=1`) — permet de tester n'importe quelle scène/événement sans rejouer toute la partie depuis le début ; et ajout de la section "🏝️ Personnaliser une fin de partie non-mortelle (`finPersonnalisee`)" (sous "Fins prématurées"), le pendant de `mortPersonnalisee` pour les fins de partie volontaires et non-mortelles (refus d'une aventure, retrait de la vie publique...), avec un `typeFin` librement personnalisable pour brancher des succès dédiés. Précédemment : ajout de la section "💊 Régénération complète (`soinComplet`)" (sous "Vie / Endurance"), un nouveau champ de choix qui remet `vie` et `endurance` à leur seuil max courant (`vieMax`/`enduranceMax`), géré par `appliquerSoinComplet()` (`moteur-scenes.js`) — utile pour une auberge, un médecin, ou toute ellipse narrative de repos, sans avoir à calculer manuellement le montant à rendre. Précédemment : ajout de la section "Succès basés sur une scène ou un événement précis atteint (`j.scenesVisitees`)" (sous la section Succès), qui documente le nouveau champ `joueur.scenesVisitees` — un tableau d'ids de scènes/événements traversés, alimenté automatiquement par `demarrerScene()` et `afficherEvenement()` — permettant de créer des succès de type "découverte" déclenchés par le simple fait d'atteindre une scène ou un événement précis, sans passer par une stat, un objet ou une compétence. Précédemment : ajout de la section "💀 Personnaliser le texte d'une mort précise (`mortPersonnalisee`)" (sous "Fins prématurées"), qui permet à un choix de remplacer le titre/la raison génériques d'une mort par `vie <= 0` par un texte narratif sur mesure, sans affecter `typeFin` ni les succès associés. Précédemment : sections "Succès basés sur un objet, une compétence ou une relation précise" et "Succès basés sur une stat numérique (`j.stats`)" (piège de la désynchronisation entre `desc` et `condition`, cas particulier des relations avec `.find()`), pagination interne des pages du Guide (`GUIDE_SEPARATEUR`, boutons "Suite →" / "← Retour"), ellipse temporelle (`avancerAge(nombreAnnees)` + champ `ellipse`), nombre de points d'entraînement personnalisable par fin d'arc (`pointsEntrainement`), système de hasard pondéré pour les choix à issue (`tirageProbabiliste`), compteur de succès débloqués/total, distinction succès décoratifs vs récompensés, système de déblocage d'objets Boutique via succès, et commandes de réinitialisation détaillées par clé `localStorage`.*