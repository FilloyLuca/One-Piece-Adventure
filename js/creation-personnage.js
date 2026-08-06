// ---------- 1. DONNÉES DE CRÉATION ----------
const RACES = {
  humain: {
    nom: "Humain",
    emoji: "🧑",
    desc: "La race la plus commune, mais aussi la plus adaptable.",
    bonus: { vie: 1, endurance: 1, force: 1, observation: 0, reputation: 0, charisme: 1, intelligence: 1, vitesse: 1, argent: 0, prime:0 }
  },
  buccaneers: {
    nom: "Buccaneer",
    emoji: "🩸",
    desc: "Une race spéciale d'humanoïdes presque éteinte, ils portent en eux un peu de sang géant.",
    bonus: { vie: 1, endurance: 2, force: 3, observation: 0, reputation: 0, charisme: 0, intelligence: 0, vitesse: 0, argent: 0, prime:0 }
  },
  cyborg: {
    nom: "Cyborg",
    emoji: "🤖",
    desc: "Une autre forme de vie humaine, modifiée avec des machines et des métaux.",
    bonus: { vie: 0, endurance: 2, force: 2, observation: 1, reputation: 0, charisme: 0, intelligence: 1, vitesse: 0, argent: 0, prime:0 }
  },
  geant: {
    nom: "Géant",
    emoji: "🪨",
    desc: "Une race d'êtres largement plus grands que les autres races connues.",
    bonus: { vie: 1, endurance: 0, force: 5, observation: 0, reputation: 0, charisme: 0, intelligence: 0, vitesse: 0, argent: 0, prime:0 }
  },
  homme_poisson: {
    nom: "Homme-poisson",
    emoji: "🐟",
    desc: "Biologiquement la fusion d'un homme et d'une espèce de poisson.",
    bonus: { vie: 0, endurance: 0, force: 2, observation: 0, reputation: 0, charisme: 1, intelligence: 0, vitesse: 4, argent: 0, prime:0 }
  }
};

const ORIGINES = {
  eastblue: {
    nom: "Natif d'East Blue",
    emoji: "🌊",
    desc: "Une mer calme, loin des grands dangers. Peu de gloire, mais on y survit facilement.",
    bonus: { vie: 0, endurance: 1, force: 1, observation: 1, reputation: 0, charisme: 1, intelligence: 1, vitesse: 1, argent: 0, prime:0 }
  },
  westblue: {
    nom: "Natif de West Blue",
    emoji: "🌊",
    desc: "Une mer réputée pour sa criminalité et la puissance de ses mafias.",
    bonus: { vie: 0, endurance: 2, force: 2, observation: 0, reputation: 0, charisme: 2, intelligence: 0, vitesse: 0, argent: 0, prime:100 }
  },
  northblue: {
    nom: "Natif de North Blue",
    emoji: "🌊",
    desc: "Une mer très influencée par le Royaume de Germa.",
    bonus: { vie: 0, endurance: 2, force: 0, observation: 0, reputation: 0, charisme: 0, intelligence: 0, vitesse: 0, argent: 0, prime:0 }
  },
  southblue: {
    nom: "Natif de South Blue",
    emoji: "🌊",
    desc: "Une mer connue pour sa faune marine unique et grande.",
    bonus: { vie: 2, endurance: 0, force: 0, observation: 2, reputation: 0, charisme: 2, intelligence: 0, vitesse: 0, argent: 100, prime:0 }
  }
};

const POSTES = {
  combattant: {
    nom: "Combattant",
    emoji: "👊",
    desc: "Ta force brute parle pour toi.",
    bonus: { vie: 0, endurance: 2, force: 4, observation: 0, reputation: 0, charisme: 0, intelligence: 0, vitesse: 0, argent: 0, prime:0 }
  },
  epeiste: {
    nom: "Épéiste",
    emoji: "⚔️",
    desc: "Discipline et lame aiguisée.",
    bonus: { vie: 0, endurance: 3, force: 2, observation: 0, reputation: 0, charisme: 0, intelligence: 0, vitesse: 1, argent: 0, prime:0 }
  },
  tireur: {
    nom: "Tireur d'élite",
    emoji: "🎯",
    desc: "Précision avant tout, jamais au contact.",
    bonus: { vie: 0, endurance: 0, force: 0, observation: 3, reputation: 0, charisme: 0, intelligence: 0, vitesse: 3, argent: 0, prime:0 }
  },
  navigateur: {
    nom: "Navigateur",
    emoji: "🧭",
    desc: "Tu lis la mer et le ciel mieux que personne.",
    bonus: { vie: 0, endurance: 0, force: 0, observation: 4, reputation: 0, charisme: 0, intelligence: 2, vitesse: 0, argent: 0, prime:0 }
  },
  medecin: {
    nom: "Médecin de bord",
    emoji: "💊",
    desc: "Indispensable à tout équipage qui compte survivre.",
    bonus: { vie: 1, endurance: 0, force: 0, observation: 1, reputation: 0, charisme: 0, intelligence: 4, vitesse: 0, argent: 0, prime:0 }
  },
  cuisinier: {
    nom: "Cuisinier",
    emoji: "🍳",
    desc: "Le moral d'un équipage passe par son estomac.",
    bonus: { vie: 4, endurance: 0, force: 0, observation: 0, reputation: 0, charisme: 1, intelligence: 0, vitesse: 1, argent: 0, prime:0 }
  },
  musicien: {
    nom: "Musicien",
    emoji: "🎵",
    desc: "Tu portes les légendes en chansons, et parfois tu en écris une nouvelle.",
    bonus: { vie: 0, endurance: 0, force: 0, observation: 0, reputation: 1, charisme: 4, intelligence: 0, vitesse: 1, argent: 0, prime:0 }
  }
};

const ENTOURAGES = {
  mentor: {
    nom: "Mentor pirate retraité",
    emoji: "🧓",
    desc: "Un vieux loup de mer t'a tout appris avant de raccrocher.",
    bonus: { vie: 0, endurance: 0, force: 2, observation: 0, reputation: 2, charisme: 2, intelligence: 0, vitesse: 0, argent: 0, prime:100 }
  },
  famille_marine: {
    nom: "Orphelin",
    emoji: "🕊️",
    desc: "On t'a recueilli dans la rue.",
    bonus: { vie: 0, endurance: 3, force: 0, observation: 1, reputation: 0, charisme: 0, intelligence: 0, vitesse: 2, argent: 0, prime:0 }
  },
  orphelin: {
    nom: "Paysan",
    emoji: "🥕",
    desc: "Tu as grandi dans les champs, loin de la vie maritime.",
    bonus: { vie: 3, endurance: 3, force: 0, observation: 0, reputation: 0, charisme: 0, intelligence: 0, vitesse: 0, argent: 0, prime:0 }
  },
  noble_dechu: {
    nom: "Noble déchu",
    emoji: "👑",
    desc: "Ta famille a tout perdu. Il ne te reste que ton nom... et ta rage.",
    bonus: { vie: 0, endurance: 0, force: 0, observation: 0, reputation: 0, charisme: 2, intelligence: 2, vitesse: 0, argent: 1000, prime:50 }
  }
};

// ---------- 1bis. BANQUE DE NOMS ALÉATOIRES ----------

const PRENOMS_MASCULINS = [
  "Rekko", "Basil", "Dorian", "Fenrick", "Garnet", "Hektor", "Ismar",
  "Joran", "Kelvin", "Lorcan", "Magnus", "Nero", "Osgar", "Pello",
  "Quentin", "Rasko", "Silvan", "Tarek", "Uldric", "Varek","Garp", "Silvers", "Bengar", "Doran", "Kaldor", "Jagger", "Vander", 
  "Corvo", "Gideon", "Roderick", "Bartholemew", "Cyrus", "Zephyr", "Rald"
];

const PRENOMS_FEMININS = [
  "Aria", "Belka", "Cyra", "Delma", "Elira", "Fennia", "Garance",
  "Halia", "Ilse", "Jessamine", "Kessa", "Lorelin", "Marisol", "Noreen",
  "Odalys", "Perrine", "Quila", "Rosalind", "Selke", "Vianne","Belladonna", "Camellia", "Iris", "Azalea", "Isolda", "Giselle", 
  "Tashigi", "Makino", "Stussen", "Alvida", "Freya", "Sola", "Olvia"
];

const NOMS_FAMILLE = [
  "Corvain", "Duskbane", "Feralta", "Grimshaw", "Halveston", "Ironwake",
  "Kestrion", "Lowtide", "Marrow", "Nightsail", "Osprey", "Ravenscar",
  "Saltborn", "Tidewell", "Vasker", "Wraithmoor", "Zephrion","Ravenscar", "Silverberg", "Vanderbilt", "Montblanc", "Donquichote", 
  "Vinsmokin", "Gol", "Portgast", "Karozumite", "Shimoutsukine", "Neferotarsi"
];

function genererNomAleatoire(sexe) {
  const prenoms = sexe === "femme" ? PRENOMS_FEMININS : PRENOMS_MASCULINS;
  const prenom = prenoms[Math.floor(Math.random() * prenoms.length)];
  const famille = NOMS_FAMILLE[Math.floor(Math.random() * NOMS_FAMILLE.length)];
  return `${prenom} ${famille}`;
}

// ---------- 2. ÉTAT DU JOUEUR ----------

let joueur = {
  nom: "",
  sexe: null,
  age:16,
  classe: null,
  classeFruit: null,
  titre: null, 
  race: null,
  origine: null,
  poste: null,
  entourage: null,
  stats: { vie: 100, vieMax: 100, endurance: 100, enduranceMax: 100, force: 0, observation: 0, charisme: 0, intelligence: 0, vitesse: 0, reputation: 0, argent: 1000, prime:0 },
  objets: [],
  competences: [],   
  relations: [],  
  journalArc: [],   
  historique: [],    
  scenesVisitees: [],  // garde une trace des ids de scènes/événements
  flags: {}   // 🏷️ compteurs/états narratifs pour la continuité des événements
};

let etapeActuelle = 0;
const ETAPES = ["sexe", "nom", "race", "origine", "poste", "entourage", "recap"];

// ---------- 3. MOTEUR D'AFFICHAGE ----------

function demarrerCreationPersonnage() {
  const menuPrincipal = document.getElementById("menuPrincipal");
  const jeu = document.getElementById("jeu");
  const ficheWrapper = document.getElementById("ficheWrapper");
  const shipHeader = document.querySelector(".ship-header");
  const woodNav = document.querySelector(".wood-nav");

  if (menuPrincipal) menuPrincipal.style.display = "none";
  if (jeu) jeu.style.display = "block";
  if (ficheWrapper) ficheWrapper.style.display = "none";
  if (shipHeader) shipHeader.style.display = "none";
  if (woodNav) woodNav.style.display = "none";

  etapeActuelle = 0;
  afficherEtape();
}

function afficherEtape() {
  const etape = ETAPES[etapeActuelle];
  const titre = document.getElementById("titreScene");
  const contenu = document.getElementById("contenuJeu");
  if (!contenu) return;

  // On vide le titre global s'il existe pour éviter les doublons
  if (titre) titre.textContent = "";

  // 1. ÉTAPE SEXE
  if (etape === "sexe") {
    contenu.innerHTML = `
      <div class="scene-card">
        <span class="scene-tag tag-creation">CRÉATION DU PERSONNAGE</span>
        <h2 class="scene-titre">Quel est ton sexe ?</h2>
        <p class="scene-texte">AVANT DE PRENDRE LA MER, LE MONDE DOIT SAVOIR QUI TU ES.</p>
        <div class="scene-choix">
          <button class="parchment-strip" onclick="choisirSexe('homme')">♂ UN HOMME</button>
          <button class="parchment-strip" onclick="choisirSexe('femme')">♀ UNE FEMME</button>
        </div>
      </div>`;
  }

  // 2. ÉTAPE NOM
  if (etape === "nom") {
    contenu.innerHTML = `
      <div class="scene-card">
        <span class="scene-tag tag-creation">CRÉATION DU PERSONNAGE</span>
        <h2 class="scene-titre">Quel est ton nom ?</h2>
        <p class="scene-texte">AVANT DE PRENDRE LA MER, LE MONDE DOIT CONNAÎTRE TON NOM.</p>
        <div class="scene-choix" style="display: flex; flex-direction: column; align-items: center; gap: 12px; width: 100%;">
          <input type="text" id="inputNom" placeholder="Nom de ton personnage"
            style="padding: 12px; font-family: inherit; width: 80%; text-align: center; border-radius: 6px; border: 1px solid #7a2318; font-size: 1rem; background: rgba(255,255,255,0.7);">
          
          <button class="parchment-strip" type="button" onclick="tirerNomAleatoire()">
            🎲 Nom aléatoire
          </button>
          
          <button class="parchment-strip" onclick="validerNom()">
            Continuer →
          </button>
        </div>
      </div>`;
  }

  // 3. ÉTAPES RACES, ORIGINES, POSTES, ENTOURAGES
  if (etape === "race") {
    afficherChoixEtape("Qu'es-tu ?", "CHOISIS LA RACE QUI DÉFINIRA TES CAPACITÉS NATURELLES.", RACES, "race");
  }
  if (etape === "origine") {
    afficherChoixEtape("D'où viens-tu ?", "CHAQUE MER FORGE LES MARINS D'UNE FAÇON DIFFÉRENTE.", ORIGINES, "origine");
  }
  if (etape === "poste") {
    afficherChoixEtape("Quel est ton rôle ?", "CHOISIS TA SPÉCIALITÉ À BORD DE TON FUTUR NAVIRE.", POSTES, "poste");
  }
  if (etape === "entourage") {
    afficherChoixEtape("Qui t'a façonné ?", "TON PASSÉ A FORGÉ LA PERSONNE QUE TU ES AUJOURD'HUI.", ENTOURAGES, "entourage");
  }
  if (etape === "recap") {
    afficherRecap();
  }
}

function afficherChoixEtape(question, sousTitre, dictionnaire, cle) {
  const contenu = document.getElementById("contenuJeu");
  
  let html = `
    <div class="scene-card">
      <span class="scene-tag tag-creation">CRÉATION DU PERSONNAGE</span>
      <h2 class="scene-titre">${question.toUpperCase()}</h2>
      <p class="scene-texte">${sousTitre.toUpperCase()}</p>
      <div class="scene-choix">`;
      
  for (const id in dictionnaire) {
    const item = dictionnaire[id];
    html += `
      <button class="parchment-strip" onclick="choisir('${cle}', '${id}')" style="display: flex; flex-direction: column; text-align: left; padding: 10px 15px;">
        <span style="font-weight: bold; font-size: 1.1rem; text-transform: uppercase;">${item.emoji} ${item.nom}</span>
        <span style="font-size: 0.85rem; opacity: 0.9; margin-top: 3px; font-weight: normal; text-transform: uppercase;">${item.desc}</span>
      </button>`;
  }
  
  html += `
      </div>
    </div>`;
  
  contenu.innerHTML = html;
}

function choisirSexe(sexe) {
  joueur.sexe = sexe;
  etapeActuelle++;
  afficherEtape();
}

function tirerNomAleatoire() {
  const input = document.getElementById("inputNom");
  if (input) input.value = genererNomAleatoire(joueur.sexe);
}

function validerNom() {
  const input = document.getElementById("inputNom");
  const val = input ? input.value.trim() : "";
  joueur.nom = val || genererNomAleatoire(joueur.sexe);
  etapeActuelle++;
  afficherEtape();
}

function choisir(categorie, id) {
  const dictionnaires = { race: RACES, origine: ORIGINES, poste: POSTES, entourage: ENTOURAGES };
  const item = dictionnaires[categorie][id];

  joueur[categorie] = id;
  for (const stat in item.bonus) {
    joueur.stats[stat] += item.bonus[stat];
    // Les bonus de vie/endurance à la création reflètent la constitution du personnage :
    // ils augmentent aussi bien le seuil max que la valeur actuelle (pas besoin de modifier
    // les objets RACES/ORIGINES/POSTES/ENTOURAGES existants pour ça).
    if (stat === "vie" || stat === "endurance") {
      joueur.stats[stat + "Max"] += item.bonus[stat];
    }
  }

  etapeActuelle++;
  afficherEtape();
}

function afficherRecap() {
  const r = RACES[joueur.race];
  const o = ORIGINES[joueur.origine];
  const p = POSTES[joueur.poste];
  const e = ENTOURAGES[joueur.entourage];

  document.getElementById("contenuJeu").innerHTML = `
    <div class="scene-card">
      <span class="scene-tag tag-creation">Création du personnage</span>
      <h2 class="scene-titre">📜 Fiche de ${joueur.nom}</h2>
      <p class="scene-texte">Voici les caractéristiques finales de ton personnage avant le grand départ.</p>
      
      <div style="text-align: left; margin: 20px 0; font-size: 0.95rem; line-height: 1.6;">
        <p><strong>Genre :</strong> ${joueur.sexe === 'homme' ? '♂ Homme' : '♀ Femme'}</p>
        <p><strong>Race :</strong> ${r.emoji} ${r.nom}</p>
        <p><strong>Origine :</strong> ${o.emoji} ${o.nom}</p>
        <p><strong>Rôle :</strong> ${p.emoji} ${p.nom}</p>
        <p><strong>Entourage :</strong> ${e.emoji} ${e.nom}</p>
        
        <hr style="border: 0; border-top: 1px dashed #bbb; margin: 15px 0;">
        
        <p><strong>Statistiques :</strong></p>
        <p style="font-size: 0.9rem;">
          ❤️ Vie: ${joueur.stats.vie}/${joueur.stats.vieMax} | 🔋 Endurance: ${joueur.stats.endurance}/${joueur.stats.enduranceMax} | 💪 Force: ${joueur.stats.force} | 👁️ Observation: ${joueur.stats.observation}<br>
          ✨ Charisme: ${joueur.stats.charisme} | 🧠 Intelligence: ${joueur.stats.intelligence} | ⚡ Vitesse: ${joueur.stats.vitesse}<br>
          🏆 Réputation: ${joueur.stats.reputation} | 💰 Argent: ${typeof formaterBerrys === "function" ? formaterBerrys(joueur.stats.argent) : joueur.stats.argent + " Berrys"}
        </p>
      </div>

      <div class="scene-choix">
        <button class="parchment-strip" onclick="lancerAventure()">
          ⛵ Prendre la mer
        </button>
      </div>
    </div>`;
}

function lancerAventure() {
  const jeuContainer = document.getElementById("jeu");
  if (jeuContainer) jeuContainer.style.display = "block";

  if (typeof demarrerScene === "function") {
    demarrerScene("arc1_reveil");
  } else {
    console.error("La fonction demarrerScene() n'est pas accessible. Vérifiez que moteur.js est chargé.");
  }
}

// ---------- 4. BRANCHEMENTS BOUTONS ----------

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("startGame");
  if (btn) btn.addEventListener("click", demarrerCreationPersonnage);

  const btnContinuer = document.getElementById("continuerGame");
  if (btnContinuer && localStorage.getItem("op_sauvegarde")) {
    btnContinuer.style.display = "inline-block";
  }

  const piecesAffichage = document.getElementById("piecesAffichage");
  if (piecesAffichage && typeof chargerPiecesBoutique === "function") {
    piecesAffichage.textContent = `🪙 ${chargerPiecesBoutique()} pièces`;
  }
});