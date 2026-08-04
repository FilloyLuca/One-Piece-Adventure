// ---------- CATALOGUE DE LA BOUTIQUE ----------
// La logique (achat, équipement, affichage) reste dans moteur-scenes.js.
// Ce fichier ne contient que le contenu : la liste des objets proposés au Bazar du Marchand.
//
// Pour ajouter un objet : ajoute une entrée ci-dessous avec un `id` unique.
//   prix   : coût en pièces de boutique (op_pieces_boutique)
//   effets : appliqués au joueur via appliquerEffets() au tout début d'une nouvelle partie,
//            si l'objet est équipé (voir appliquerEquipementDepart() dans moteur-scenes.js)

const BOUTIQUE_CATALOGUE = [
  {
    id: "sabre_aiguise",
    nom: "Sabre Aiguisé",
    emoji: "⚔️",
    desc: "Une lame de qualité, prête à en découdre dès le premier jour. (+3 Force)",
    prix: 100,
    effets: { objet: ["Sabre aiguisé"], force: 3 }
  },
  {
    id: "amulette_charisme",
    nom: "Amulette Porte-Bonheur",
    emoji: "🧿",
    desc: "Elle attire la sympathie... et parfois la chance. (+2 Charisme)",
    prix: 60,
    effets: { objet: ["Amulette porte bonheur"], charisme: 2 }
  },
  {
    id: "bourse_garnie",
    nom: "Bourse Bien Garnie",
    emoji: "💰",
    desc: "Un petit pécule pour bien commencer l'aventure. (+50 Argent)",
    prix: 50,
    effets: { argent: 500 }
  },
  {
    id: "carte_ancienne",
    nom: "Carte au Trésor Ancienne",
    emoji: "🗺️",
    desc: "Un vieux parchemin qui pourrait bien mener à un trésor oublié. (+1 Objet)",
    prix: 80,
    effets: { objets: ["Carte au Trésor Ancienne"] }
  },
  {
    id: "log_pose",
    nom: "Vieux Log Pose",
    emoji: "🧭",
    desc: "Un compas usé mais fiable, qui a déjà traversé bien des tempêtes. (+1 Objet, +10 Endurance)",
    prix: 120,
    effets: { objets: ["Vieux Log Pose"], enduranceMax: 10 }
  },
  {
    id: "bottes_agiles",
    nom: "Bottes Agiles",
    emoji: "🥾",
    desc: "Légères comme le vent, elles rendent chaque pas plus vif. (+3 Vitesse)",
    prix: 90,
    effets: { objets: ["Bottes agiles"], vitesse: 3 }
  },
  {
    id: "cape_legende",
    nom: "Cape du Roi des Pirates",
    emoji: "🧥",
    desc: "Une cape légendaire, réservée à ceux qui ont prouvé leur valeur. (+5 Charisme, +5 Réputation)",
    prix: 250,
    effets: { objets: ["Cape du Roi des Pirates"], charisme: 5, reputation: 5 },
    deblocage: { succes: "legende_pirate" }   // 👈 caché/verrouillé tant que ce succès n'est pas obtenu
  }
];

const MAX_EQUIPEMENT_BOUTIQUE = 3;