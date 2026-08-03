// ---------- CATALOGUE DES SUCCÈS ----------
// La logique (vérification en fin de partie, stockage, affichage de l'onglet) reste dans
// moteur-scenes.js. Ce fichier ne contient que le contenu : la liste des succès du jeu.
//
// Chaque succès est vérifié en fin de partie (dans terminerPartie()).
// `condition(j, contexte)` reçoit le joueur au moment de la fin de partie, et un objet contexte :
//   { tierTitre, prime, arcs, typeFin }
//   - tierTitre : "bas" | "moyen" | "haut" | "legende"
//   - prime     : prime finale (nombre)
//   - arcs      : nombre d'arcs terminés (joueur.historique.length)
//   - typeFin   : "normale" | "retraite" | "premature_vie" | "premature_endurance"
//
// `recompense.pieces` est ajouté aux pièces de boutique à CHAQUE fois que le succès est obtenu
// (pas seulement la première fois) — un succès répété reste gratifiant, d'où le compteur ×N affiché.
//
// Les succès sont regroupés par `groupe` pour l'affichage dans l'onglet "Succès" — c'est ce champ
// qui détermine sous quel titre (Rangs, Titres, Richesse, Aventure...) chaque carte apparaît.
// Pour ajouter un nouveau succès : ajoute simplement une entrée ci-dessous, avec un `id` unique.
// Pour ajouter une nouvelle catégorie : donne simplement une nouvelle valeur à `groupe`,
// elle apparaîtra automatiquement comme un nouveau titre de section dans l'onglet.

const SUCCES_CATALOGUE = [

  // ---------- Groupe : Rangs ----------
  {
    id: "rang_pirate",
    groupe: "Rangs",
    nom: "Pirate",
    emoji: "🏴‍☠️",
    desc: "Termine une partie en tant que Pirate.",
    recompense: { pieces: 15 },
    condition: (j) => j.classe === "pirate"
  },
  {
    id: "rang_marine",
    groupe: "Rangs",
    nom: "Marine",
    emoji: "⚓",
    desc: "Termine une partie en tant que Marine.",
    recompense: { pieces: 15 },
    condition: (j) => j.classe === "marine"
  },
  {
    id: "rang_revolutionnaire",
    groupe: "Rangs",
    nom: "Révolutionnaire",
    emoji: "🔥",
    desc: "Termine une partie en tant que Révolutionnaire.",
    recompense: { pieces: 15 },
    condition: (j) => j.classe === "revolutionnaire"
  },
  {
    id: "rang_chasseur",
    groupe: "Rangs",
    nom: "Chasseur de primes",
    emoji: "🎯",
    desc: "Termine une partie en tant que Chasseur de primes.",
    recompense: { pieces: 15 },
    condition: (j) => j.classe === "chasseurDePrimes"
  },

  // ---------- Groupe : Titres ----------
  {
    id: "titre_legende",
    groupe: "Titres",
    nom: "Légende des mers",
    emoji: "👑",
    desc: "Termine une partie avec le rang de légende.",
    recompense: { pieces: 100 },
    condition: (j, c) => c.tierTitre === "legende"
  },
  {
    id: "titre_redoute",
    groupe: "Titres",
    nom: "Grande menace",
    emoji: "💀",
    desc: "Termine une partie avec un rang redouté.",
    recompense: { pieces: 40 },
    condition: (j, c) => c.tierTitre === "haut"
  },
  {
    id: "titre_reconnu",
    groupe: "Titres",
    nom: "Figure reconnue",
    emoji: "⭐",
    desc: "Termine une partie avec un rang reconnu.",
    recompense: { pieces: 20 },
    condition: (j, c) => c.tierTitre === "moyen"
  },
  {
    id: "titre_debutant",
    groupe: "Titres",
    nom: "Premiers pas",
    emoji: "🌱",
    desc: "Termine une première aventure, même modeste.",
    recompense: { pieces: 5 },
    condition: () => true // toujours vrai en fin de partie
  },
  {
    id: "titre_surnom",
    groupe: "Titres",
    nom: "Un nom qui circule",
    emoji: "📢",
    desc: "Termine une partie avec un surnom (épithète).",
    recompense: { pieces: 25 },
    condition: (j) => !!j.titre
  },

  // ---------- Groupe : Richesse ----------
  {
    id: "richesse_10m",
    groupe: "Richesse",
    nom: "Petite fortune",
    emoji: "🪙",
    desc: "Termine une partie avec une prime d'au moins 10 000 000 ฿.",
    recompense: { pieces: 10 },
    condition: (j, c) => c.prime >= 10_000_000
  },
  {
    id: "richesse_100m",
    groupe: "Richesse",
    nom: "Grande fortune",
    emoji: "💰",
    desc: "Termine une partie avec une prime d'au moins 100 000 000 ฿.",
    recompense: { pieces: 30 },
    condition: (j, c) => c.prime >= 100_000_000
  },
  {
    id: "richesse_300m",
    groupe: "Richesse",
    nom: "Fortune légendaire",
    emoji: "💎",
    desc: "Termine une partie avec une prime d'au moins 300 000 000 ฿.",
    recompense: { pieces: 60 },
    condition: (j, c) => c.prime >= 300_000_000
  },
  {
    id: "richesse_500m",
    groupe: "Richesse",
    nom: "Parmi les plus recherchés",
    emoji: "🏆",
    desc: "Termine une partie avec une prime d'au moins 500 000 000 ฿.",
    recompense: { pieces: 100 },
    condition: (j, c) => c.prime >= 500_000_000
  },

  // ---------- Groupe : Aventure ----------
  {
    id: "aventure_retraite",
    groupe: "Aventure",
    nom: "Retraite méritée",
    emoji: "🎂",
    desc: "Atteins 40 ans et pars à la retraite.",
    recompense: { pieces: 50 },
    condition: (j, c) => c.typeFin === "retraite"
  },
  {
    id: "aventure_3arcs",
    groupe: "Aventure",
    nom: "Vétéran des mers",
    emoji: "📜",
    desc: "Termine une partie après avoir vécu au moins 3 arcs.",
    recompense: { pieces: 20 },
    condition: (j, c) => c.arcs >= 3
  },
  {
    id: "aventure_survivant",
    groupe: "Aventure",
    nom: "Passé à un cheveu",
    emoji: "❤️‍🩹",
    desc: "Termine une partie alors que ta vie était presque à zéro.",
    recompense: { pieces: 15 },
    condition: (j) => j.stats.vie > 0 && j.stats.vie <= 10
  },

  // ---------- Groupe : Fruits du Démon ----------
  {
    id: "fruit_demon",
    groupe: "Fruits du Démon",
    nom: "Élu par le fruit",
    emoji: "🍎",
    desc: "Termine une partie après avoir mangé un fruit du démon.",
    recompense: { pieces: 25 },
    condition: (j) => !!j.classeFruit
  },

  // ---------- Groupe : Relations ----------
  {
    id: "relation_nakama",
    groupe: "Relations",
    nom: "Nakama pour la vie",
    emoji: "🤝",
    desc: "Termine une partie avec au moins un Nakama.",
    recompense: { pieces: 20 },
    condition: (j) => (j.relations || []).some(r => r.statut.toLowerCase().includes("nakama"))
  },
  {
    id: "relation_rival",
    groupe: "Relations",
    nom: "Rivalité éternelle",
    emoji: "⚔️",
    desc: "Termine une partie avec au moins un Rival.",
    recompense: { pieces: 15 },
    condition: (j) => (j.relations || []).some(r => r.statut.toLowerCase().includes("rival"))
  },
  {
    id: "relation_ennemi",
    groupe: "Relations",
    nom: "Ennemi juré",
    emoji: "💢",
    desc: "Termine une partie avec au moins un Ennemi.",
    recompense: { pieces: 15 },
    condition: (j) => (j.relations || []).some(r => r.statut.toLowerCase().includes("ennemi"))
  },

  // ---------- Groupe : Destins ----------
  {
    id: "destin_mort",
    groupe: "Destins",
    nom: "Repose en paix",
    emoji: "☠️",
    desc: "Meurs des suites de tes blessures.",
    recompense: { pieces: 10 },
    condition: (j, c) => c.typeFin === "premature_vie"
  },
  {
    id: "destin_surmenage",
    groupe: "Destins",
    nom: "Corps brisé",
    emoji: "🩹",
    desc: "Termine une partie à bout de forces, épuisé par le surmenage.",
    recompense: { pieces: 10 },
    condition: (j, c) => c.typeFin === "premature_endurance"
  }
];