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
   {
    id: "titre_legende",
    groupe: "Rangs",
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
    id: "titre_bas",
    groupe: "Rangs",
    nom: "Inconnu",
    emoji: "🦯",
    desc: "Termine une partie avec un rang bas.",
    recompense: { pieces: 10 },
    condition: (j, c) => c.tierTitre === "bas"
  },

  // ---------- Groupe : Titres ----------
 
  {
    id: "legende_pirate",
    groupe: "Titres",
    nom: "Pirate légendaire",
    emoji: "🏴‍☠️👑",
    desc: "Termine une partie en tant que Pirate avec le rang de légende.",
    recompense: { pieces: 150 },
    condition: (j, c) => j.classe === "pirate" && c.tierTitre === "legende"
  },
  {
    id: "legende_marine",
    groupe: "Titres",
    nom: "Marine légendaire",
    emoji: "⚓👑",
    desc: "Termine une partie en tant que Marine avec le rang de légende.",
    recompense: { pieces: 150 },
    condition: (j, c) => j.classe === "marine" && c.tierTitre === "legende"
  },
  {
    id: "legende_revolutionnaire",
    groupe: "Titres",
    nom: "Révolutionnaire légendaire",
    emoji: "🔥👑",
    desc: "Termine une partie en tant que Révolutionnaire avec le rang de légende.",
    recompense: { pieces: 150 },
    condition: (j, c) => j.classe === "revolutionnaire" && c.tierTitre === "legende"
  },
   {
    id: "legende_chasseurDePrimes",
    groupe: "Titres",
    nom: "Chasseur de primes légendaire",
    emoji: "🎯👑",
    desc: "Termine une partie en tant que Chasseur de primes avec le rang de légende.",
    recompense: { pieces: 150 },
    condition: (j, c) => j.classe === "chasseurDePrimes" && c.tierTitre === "legende"
  },
  {
    id: "titre_debutant",
    groupe: "Titres",
    nom: "Premiers pas",
    emoji: "🌱",
    desc: "Termine une première aventure, même modeste.",
    recompense: { pieces: 1 },
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

  // ---------- Groupe : Wanted ----------
  {
    id: "wanted_10m",
    groupe: "Wanted",
    nom: "Petite star",
    emoji: "🪙",
    desc: "Termine une partie avec une prime d'au moins 10 000 000 ฿.",
    recompense: { pieces: 10 },
    condition: (j, c) => c.prime >= 10_000_000
  },
  {
    id: "wanted_100m",
    groupe: "Wanted",
    nom: "Supernova",
    emoji: "💰",
    desc: "Termine une partie avec une prime d'au moins 100 000 000 ฿.",
    recompense: { pieces: 30 },
    condition: (j, c) => c.prime >= 100_000_000
  },
  {
    id: "wanted_300m",
    groupe: "Wanted",
    nom: "Etoile montante",
    emoji: "💎",
    desc: "Termine une partie avec une prime d'au moins 300 000 000 ฿.",
    recompense: { pieces: 60 },
    condition: (j, c) => c.prime >= 300_000_000
  },
  {
    id: "wanted_500m",
    groupe: "Wanted",
    nom: "Star des mers",
    emoji: "🏆",
    desc: "Termine une partie avec une prime d'au moins 500 000 000 ฿.",
    recompense: { pieces: 100 },
    condition: (j, c) => c.prime >= 500_000_000
  },
  {
    id: "wanted_1md",
    groupe: "Wanted",
    nom: "La cour des grands",
    emoji: "🦣",
    desc: "Termine une partie avec une prime d'au moins 1 000 000 000 ฿.",
    recompense: { pieces: 150 },
    condition: (j, c) => c.prime >= 1_000_000_000
  },

  // ---------- Groupe : Aventure ----------
  {
    id: "atteint_arc1_reveil",
    groupe: "Aventure",
    nom: "Le grand réveil",
    emoji: "🌅",
    desc: "Debute ton aventure.",
    condition: (j) => (j.scenesVisitees || []).includes("arc1_reveil")
  },
  {
    id: "aventure_15arcs",
    groupe: "Aventure",
    nom: "Vétéran des mers",
    emoji: "📜",
    desc: "Termine une partie après avoir vécu au moins 15 arcs.",
    recompense: { pieces: 20 },
    condition: (j, c) => c.arcs >= 15
  },
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
    id: "aventure_survivant",
    groupe: "Aventure",
    nom: "Passé à un cheveu",
    emoji: "❤️‍🩹",
    desc: "Termine une partie alors que ta vie était presque à zéro.",
    recompense: { pieces: 15 },
    condition: (j) => j.stats.vie > 0 && j.stats.vie <= 10
  },

  // ---------- Groupe : Statistiques ----------
  {
    id: "statistiques_vie_150",
    groupe: "Statistiques",
    nom: "Bonne santé",
    emoji: "❤️",
    desc: "Termine une partie avec une vie max d'au moins 150.",
    condition: (j) => j.stats.vieMax >= 150
  },
  {
    id: "statistiques_endurance_150",
    groupe: "Statistiques",
    nom: "Bien vivant",
    emoji: "🔋",
    desc: "Termine une partie avec une endurance max d'au moins 150.",
    condition: (j) => j.stats.enduranceMax >= 150
  },
  {
    id: "statistiques_force_50",
    groupe: "Statistiques",
    nom: "Gonflette",
    emoji: "💪",
    desc: "Termine une partie avec une force d'au moins 50.",
    condition: (j) => j.stats.vie >= 50
  },
  {
    id: "statistiques_charisme_50",
    groupe: "Statistiques",
    nom: "Charmeur(euse)",
    emoji: "✨",
    desc: "Termine une partie avec un charisme d'au moins 50.",
    condition: (j) => j.stats.charisme >= 50
  },
  {
    id: "statistiques_intelligence_50",
    groupe: "Statistiques",
    nom: "Petit(e) futé(e)",
    emoji: "🧠",
    desc: "Termine une partie avec une intelligence d'au moins 50.",
    condition: (j) => j.stats.intelligence >= 50
  },
  {
    id: "statistiques_vitesse_50",
    groupe: "Statistiques",
    nom: "Pile électrique",
    emoji: "⚡",
    desc: "Termine une partie avec une vitesse d'au moins 50.",
    condition: (j) => j.stats.vitesse >= 50
  },
  {
    id: "statistiques_reputation_50",
    groupe: "Statistiques",
    nom: "Célèbrité",
    emoji: "🏆",
    desc: "Termine une partie avec une reputation d'au moins 50.",
    condition: (j) => j.stats.reputation >= 50
  },
    {
    id: "statistiques_vie_200",
    groupe: "Statistiques",
    nom: "Intuable",
    emoji: "❤️❤️",
    desc: "Termine une partie avec une vie max d'au moins 200.",
    condition: (j) => j.stats.vieMax >= 200
  },
  {
    id: "statistiques_endurance_200",
    groupe: "Statistiques",
    nom: "Inepuisable",
    emoji: "🔋🔋",
    desc: "Termine une partie avec une endurance max d'au moins 200.",
    condition: (j) => j.stats.enduranceMax >= 200
  },
  {
    id: "statistiques_force_100",
    groupe: "Statistiques",
    nom: "Surhumain(e)",
    emoji: "💪💪",
    desc: "Termine une partie avec une force d'au moins 100.",
    condition: (j) => j.stats.vie >= 100
  },
  {
    id: "statistiques_charisme_100",
    groupe: "Statistiques",
    nom: "Don Juan / Don Juanita",
    emoji: "✨✨",
    desc: "Termine une partie avec un charisme d'au moins 100.",
    condition: (j) => j.stats.charisme >= 100
  },
  {
    id: "statistiques_intelligence_100",
    groupe: "Statistiques",
    nom: "Génie",
    emoji: "🧠🧠",
    desc: "Termine une partie avec une intelligence d'au moins 100.",
    condition: (j) => j.stats.intelligence >= 100
  },
  {
    id: "statistiques_vitesse_100",
    groupe: "Statistiques",
    nom: "Une fusée",
    emoji: "⚡⚡",
    desc: "Termine une partie avec une vitesse d'au moins 100.",
    condition: (j) => j.stats.vitesse >= 100
  },
  {
    id: "statistiques_reputation_100",
    groupe: "Statistiques",
    nom: "Une légende",
    emoji: "🏆🏆",
    desc: "Termine une partie avec une reputation d'au moins 100.",
    condition: (j) => j.stats.reputation >= 100
  },




  // ---------- Groupe : Richesse ----------
  {
    id: "richesse_1m",
    groupe: "Richesse",
    nom: "Millionnaire",
    emoji: "💰",
    desc: "Termine une partie avec au moins 1 000 000 ฿.",
    condition: (j) => j.stats.argent >= 1000000
  },
  {
    id: "richesse_10m",
    groupe: "Richesse",
    nom: "Multi-millionnaire",
    emoji: "💰",
    desc: "Termine une partie avec au moins 10_000_000 ฿.",
    condition: (j) => j.stats.argent >= 10_000_000
  },
  {
    id: "richesse_1b",
    groupe: "Richesse",
    nom: "Milliardaire",
    emoji: "💰",
    desc: "Termine une partie avec au moins 1 000 000 000 ฿.",
    condition: (j) => j.stats.argent >= 1_000_000_000
  },



  // ---------- Groupe : Fruits du Démon ----------
  {
    id: "fruit_demon",
    groupe: "Fruits du Démon",
    nom: "Élu par le fruit",
    emoji: "🍈",
    desc: "Termine une partie après avoir mangé un fruit du démon.",
    recompense: { pieces: 25 },
    condition: (j) => !!j.classeFruit
  },
  {
    id: "legende_double_fruit",
    groupe: "Fruits du Démon",
    nom: "L'Impossible",
    emoji: "🍈🍎",
    desc: "Survis à l'ingestion d'un second fruit du démon.",
    recompense: { pieces: 100 },
    condition: (j) => (j.competences || []).includes("Survivant du Second Fruit")
  },
  


  // ---------- Groupe : Objets ----------

  // ---------- Groupe : Relations ----------
  
    {
        id: "relation_maitre",
        groupe: "Relations",
        nom: "Eleve discipliné(e)",
        emoji: "👨‍🏫",
        desc: "Termine une partie avec au moins un maitre.",
        recompense: { pieces: 20 },
        condition: (j) => (j.relations || []).some(r => r.statut.toLowerCase().includes("nakama"))
    },

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
  {
    id: "relation_perte",
    groupe: "Relations",
    nom: "Deuil en mer",
    emoji: "☠️",
    desc: "Termine une partie après avoir perdu un proche.",
    recompense: { pieces: 20 },
    condition: (j) => (j.relations || []).some(r => r.mort)
  },

  // ---------- Groupe : Competences ----------
  {
    id: "haki_armement",
    groupe: "Competences",
    nom: "Haki de l'armement",
    emoji: "💪⚫",
    desc: "Debloque le haki de l'armement.",
    condition: (j) => (j.competences || []).includes("haki de l'armement")
  },
  {
    id: "haki_observation",
    groupe: "Competences",
    nom: "Haki de l'observation",
    emoji: "👀⚫",
    desc: "Debloque le haki de l'observation.",
    condition: (j) => (j.competences || []).includes("haki de l'observation")
  },
  {
    id: "haki_Desrois",
    groupe: "Competences",
    nom: "Haki des rois",
    emoji: "👑⚫",
    desc: "Eveille le haki des rois qui est en toi.",
    condition: (j) => (j.competences || []).includes("haki des rois")
  },

  // ---------- Groupe : Destins ----------
  {
    id: "destin_mort",
    groupe: "Destins",
    nom: "Repose en paix",
    emoji: "☠️",
    desc: "Meurs des suites de tes blessures.",
    condition: (j, c) => c.typeFin === "premature_vie"
  },
  {
    id: "destin_surmenage",
    groupe: "Destins",
    nom: "Corps brisé",
    emoji: "🩹",
    desc: "Termine une partie à bout de forces, épuisé par le surmenage.",
    condition: (j, c) => c.typeFin === "premature_endurance"
  },
  {
    id: "destin_fruit_interdit",
    groupe: "Destins",
    nom: "Le prix du second pouvoir",
    emoji: "💀🍈",
    desc: "Meurs en ayant tenté de manger un second fruit du démon.",
    condition: (j) => (j.competences || []).includes("Second Fruit Ingéré")
  },
  {
    id: "destin_ile_natale",
    groupe: "Destins",
    nom: "Une vie sans vagues",
    emoji: "🏝️",
    desc: "Refuse l'appel de l'aventure et termine ta vie sur ton île natale.",
    recompense: { pieces: 10 },
    condition: (j, c) => c.typeFin === "refus_aventure"
  }
];