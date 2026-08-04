// ---------- BARRE DE PROGRESSION D'ARC ----------
// Pas besoin de connaître le nombre exact d'événements de l'arc :
// la barre progresse selon une courbe qui ralentit en se rapprochant de 100%,
// sans jamais l'atteindre avant la vraie fin d'arc (finArc).
// VITESSE_PROGRESSION_ARC contrôle juste le rythme (plus petit = barre qui se remplit plus vite).
// Avec une vitesse de 1.8 :
// 5 événements donneront environ 73% de progression
const VITESSE_PROGRESSION_ARC = 1.8;

function mettreAJourBarreProgressionArc() {
  const fill = document.getElementById("arcProgressFill");
  const boat = document.getElementById("arcProgressBoat");
  if (!fill || !boat) return;

  const totalEv = joueur.journalArc ? joueur.journalArc.length : 0;
  // Si nous sommes au tout premier événement de l'arc, l'avancement est de 0
  const avancement = Math.max(0, totalEv - 1);

  // Courbe asymptotique basée sur les événements suivants
  const ratio = 1 - 1 / (1 + avancement / VITESSE_PROGRESSION_ARC);
  const pourcentage = ratio * 100;

  fill.style.width = `${pourcentage}%`;
  boat.style.left = `${pourcentage}%`;
  fill.classList.remove("complet");
}

// ---------- 3. RENDU D'UNE SCÈNE ----------
function choixEstDisponible(choix) {
  if (choix.requis) {
    if (choix.requis.stats) {
      for (const stat in choix.requis.stats) {
        if ((joueur.stats[stat] || 0) < choix.requis.stats[stat]) return false;
      }
    }
    if (choix.requis.competence && !joueur.competences.includes(choix.requis.competence)) return false;
    if (choix.requis.classe && joueur.classe !== choix.requis.classe) return false;
    if (choix.requis.race && joueur.race !== choix.requis.race) return false;
    if (choix.requis.relation) {
      const rel = joueur.relations.find(r => r.nom === choix.requis.relation.nom);
      if (!rel || rel.statut !== choix.requis.relation.statut) return false;
    }
    if (choix.requis.ageMin && joueur.age < choix.requis.ageMin) return false;
  }
  return true;
}

let sceneActuelleId = null;

function choixEstInterdit(choix) {
  if (!choix.interdit) return false;
  if (choix.interdit.stats) {
    for (const stat in choix.interdit.stats) {
      if ((joueur.stats[stat] || 0) >= choix.interdit.stats[stat]) return true;
    }
  }
  if (choix.interdit.competence && joueur.competences.includes(choix.interdit.competence)) return true;
  if (choix.interdit.classe && joueur.classe === choix.interdit.classe) return true;
  if (choix.interdit.race && joueur.race === choix.interdit.race) return true;
  if (choix.interdit.relation) {
    const rel = joueur.relations.find(r => r.nom === choix.interdit.relation.nom);
    if (rel && rel.statut === choix.interdit.relation.statut) return true;
  };
  if (choix.interdit.siClasseFruit && joueur.classeFruit) return true;
  return false;
}

// Détermine l'état final du choix parmi les 4 catégories
function etatChoix(choix) {
  if (choixEstInterdit(choix)) return "interdit";
  if (!choixEstDisponible(choix)) return "indisponible";
  if (choix.requis && Object.keys(choix.requis).length > 0) return "special";
  return "normal";
}

function raisonIndisponibilite(choix) {
  const labels = { vie: "❤️ Vie", endurance: "🔋 Endurance", force: "💪 Force", charisme: "✨ Charisme", intelligence: "🧠 Intelligence", vitesse: "⚡ Vitesse", reputation: "🏆 Réputation", argent: "💰 Argent" };

  if (choix.requis) {
    if (choix.requis.stats) {
      for (const stat in choix.requis.stats) {
        if ((joueur.stats[stat] || 0) < choix.requis.stats[stat]) {
          return `${labels[stat] || stat} ≥ ${choix.requis.stats[stat]} requis`;
        }
      }
    }
    if (choix.requis.competence && !joueur.competences.includes(choix.requis.competence)) {
      return `Compétence requise : ${choix.requis.competence}`;
    }
    if (choix.requis.classe && joueur.classe !== choix.requis.classe) {
      const nomClasse = CLASSES[choix.requis.classe] ? CLASSES[choix.requis.classe].nom : choix.requis.classe;
      return `Réservé aux ${nomClasse}`;
    }
    if (choix.requis.race && joueur.race !== choix.requis.race) {
        return `Réservé aux ${RACES[choix.requis.race].nom}`;
    }
    if (choix.requis.relation) {
      const rel = joueur.relations.find(r => r.nom === choix.requis.relation.nom);
      if (!rel || rel.statut !== choix.requis.relation.statut) {
        return `Nécessite ${choix.requis.relation.nom} : ${choix.requis.relation.statut}`;
      }
    }
    if (choix.requis.ageMin && joueur.age < choix.requis.ageMin) {
      return `Âge minimum : ${choix.requis.ageMin} ans`;
    }
  }
  return "";
}

function raisonInterdiction(choix) {
  const labels = { vie: "❤️ Vie", endurance: "🔋 Endurance", force: "💪 Force", charisme: "✨ Charisme", intelligence: "🧠 Intelligence", vitesse: "⚡ Vitesse", reputation: "🏆 Réputation", argent: "💰 Argent" };

  if (choix.interdit.stats) {
    for (const stat in choix.interdit.stats) {
      if ((joueur.stats[stat] || 0) >= choix.interdit.stats[stat]) {
        return `Impossible si ${labels[stat] || stat} ≥ ${choix.interdit.stats[stat]}`;
      }
    }
  }
  if (choix.interdit.competence && joueur.competences.includes(choix.interdit.competence)) {
    return `Impossible avec : ${choix.interdit.competence}`;
  }
  if (choix.interdit.classe && joueur.classe === choix.interdit.classe) {
    const nomClasse = CLASSES[choix.interdit.classe] ? CLASSES[choix.interdit.classe].nom : choix.interdit.classe;
    return `Impossible en tant que ${nomClasse}`;
  }
  if (choix.interdit.race && joueur.race === choix.interdit.race) {
    return `Impossible en tant que ${RACES[choix.interdit.race].nom}`;
}
  if (choix.interdit.relation) {
    const rel = joueur.relations.find(r => r.nom === choix.interdit.relation.nom);
    if (rel && rel.statut === choix.interdit.relation.statut) {
      return `Impossible : ${choix.interdit.relation.nom} est ${choix.interdit.relation.statut}`;
    }
  }
  if (choix.interdit.siClasseFruit && joueur.classeFruit) {
    return `Impossible : les utilisateurs de fruit du démon ne peuvent pas nager`;
}
  return "";
}

function texteConditionHTML(choix) {
  const etat = etatChoix(choix);
  const labels = { vie: "❤️ Vie", endurance: "🔋 Endurance", force: "💪 Force", charisme: "✨ Charisme", intelligence: "🧠 Intelligence", vitesse: "⚡ Vitesse", reputation: "🏆 Réputation", argent: "💰 Argent" };

  if (etat === "interdit") {
    return `<span class="choix-condition-interdit">🚫 ${raisonInterdiction(choix)}</span>`;
  }
  if (etat === "indisponible") {
    return `<span class="choix-condition-indisponible">🔒 ${raisonIndisponibilite(choix)}</span>`;
  }
  if (etat === "special") {
    const parts = [];
    if (choix.requis.stats) {
      for (const stat in choix.requis.stats) parts.push(`${labels[stat] || stat} ≥ ${choix.requis.stats[stat]}`);
    }
    if (choix.requis.competence) parts.push(choix.requis.competence);
    if (choix.requis.classe) parts.push(CLASSES[choix.requis.classe] ? CLASSES[choix.requis.classe].nom : choix.requis.classe);
    if (choix.requis.relation) parts.push(`${choix.requis.relation.nom} : ${choix.requis.relation.statut}`);
    if (parts.length === 0) return "";
    return `<span class="choix-condition-special">⭐ Choix spécial : ${parts.join(" · ")}</span>`;
  }
  return "";
}

function classeTagCategorie(categorie) {
  if (!categorie) return "tag-defaut";
  const slug = categorie
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // enlève les accents
    .replace(/\s+/g, "-");
  return `tag-${slug}`;
}

function demarrerScene(id) {
    sceneActuelleId = id;
  const ficheWrapper = document.getElementById("ficheWrapper");
  if (ficheWrapper) ficheWrapper.style.display = "block";

  mettreAJourFiche();

  const scene = SCENES[id];
  if (!scene) return;
  // dans demarrerScene(), juste après `if (!scene) return;`
    joueur.journalArc.push(scene.titre);
    mettreAJourBarreProgressionArc();

  const texte = typeof scene.texte === "function" ? scene.texte() : scene.texte;

  let html = `<div class="scene-card">`;
  html += `<span class="scene-tag ${classeTagCategorie(scene.categorie)}">${scene.categorie || "Aventure"}</span>`;
  html += `<h2 class="scene-titre">${scene.titre}</h2>`;
  html += `<p class="scene-texte">${texte}</p>`;
  html += `<div class="scene-choix" id="choixContainer">`;

    scene.choix.forEach((choix, index) => {
        const etat = etatChoix(choix);
        const cliquable = (etat === "normal" || etat === "special");
        const conditionHTML = texteConditionHTML(choix);

        let classeBtn = "";
        if (etat === "indisponible") classeBtn = "choix-verrouille";
        if (etat === "interdit") classeBtn = "choix-interdit";
        if (etat === "special") classeBtn = "choix-special";

        html += `
            <button class="parchment-strip ${classeBtn}"
            ${cliquable ? `onclick="choisirDansScene('${id}', ${index})"` : 'disabled'}>
            ${choix.texte}
            ${conditionHTML}
            </button>`;
    });

  html += `</div></div>`;

  document.getElementById("contenuJeu").innerHTML = html;
}

function retourMenuPrincipal() {
  // NE PAS supprimer la sauvegarde ni réinitialiser joueur
  // On cache juste le jeu et affiche le menu, sans toucher à l'état

  const menuPrincipal = document.getElementById("menuPrincipal");
  const jeu = document.getElementById("jeu");
  const shipHeader = document.querySelector(".ship-header");
  const woodNav = document.querySelector(".wood-nav");
  const modal = document.getElementById("modalDetails");

  if (jeu) jeu.style.display = "none";
  if (menuPrincipal) menuPrincipal.style.display = "flex";
  if (shipHeader) shipHeader.style.display = "block";
  if (woodNav) woodNav.style.display = "flex";
  if (modal) modal.style.display = "none";

  // Réaffiche le bouton "Continuer l'aventure" puisque la sauvegarde existe toujours
  const btnContinuer = document.getElementById("continuerGame");
  if (btnContinuer) btnContinuer.style.display = "inline-block";
}

function avancerAge() {
  joueur.age++;

  // Archive les événements de l'arc qui vient de se terminer
  joueur.historique.push({
    numeroArc: joueur.historique.length + 1,
    age: joueur.age,
    evenements: [...joueur.journalArc]
  });

    const fillFinal = document.getElementById("arcProgressFill");
    const boatFinal = document.getElementById("arcProgressBoat");
    if (fillFinal && boatFinal) {
      fillFinal.style.width = "100%";
      boatFinal.style.left = "100%";
      fillFinal.classList.add("complet");
    }
  joueur.journalArc = []; // repart à zéro pour le prochain arc
  mettreAJourBarreProgressionArc();

  mettreAJourFiche();
  if (joueur.age >= 40) {
    finRetraite();
    return true;
  }
  return false;
}

function couleurStatutRelation(statut) {
  const s = statut.toLowerCase();
  if (s.includes("nakama")) return "#b98a1f";                    // doré
  if (s.includes("allié") || s.includes("ami")) return "#1c7a5e"; // vert
  if (s.includes("rival")) return "#c9770f";                      // orange/ambre — neutre, ni ami ni ennemi
  if (s.includes("ennemi")) return "#a13a2b";                     // rouge
  return "#7a2318"; // couleur neutre par défaut
}

let derniereIssue = null; // stocke temporairement le résultat entre le clic sur le choix et "Continuer"

function choisirDansScene(sceneId, indexChoix) {
  const choix = SCENES[sceneId].choix[indexChoix];
  if (!choixEstDisponible(choix)) return;

  let resultat = choix;
  if (choix.issue) {
    const reussite = choix.issue(joueur);
    resultat = reussite ? choix.succes : choix.echec;
  }
  derniereIssue = resultat;

  appliquerEffets(resultat.effets);

  if (resultat.classe) {
    joueur.classe = resultat.classe;
    mettreAJourFiche();
  }

  if (resultat.classeFruit) {
    joueur.classeFruit = resultat.classeFruit;
    mettreAJourFiche();
    }

  if (resultat.titre) {
    joueur.titre = resultat.titre;
    mettreAJourFiche();
  }

  const texteResultat = resultat.resultat || resultat.texte || choix.texte;
  const pillsHTML = formaterEffetsPills(resultat.effets);

  const contenu = document.getElementById("contenuJeu");
  contenu.innerHTML = `
    <div class="scene-card">
      <div class="resultat-card">
        <p class="resultat-texte">${texteResultat}</p>
        <div class="resultat-effets">${pillsHTML || "<em>Aucun effet particulier</em>"}</div>
      </div>
      <button class="parchment-btn" style="margin-top:20px; width:100%;" onclick="continuerApresChoix()">
        Continuer →
      </button>
    </div>`;
}

function continuerApresChoix() {
  const resultat = derniereIssue;
  derniereIssue = null;

  if (etatCritiqueAtteint()) {
    afficherFinPrematuree();
    return;
  }

  if (resultat.finArc && avancerAge()) {
    return;
  }

  if (resultat.suivant === "EVENEMENT") {
    lancerEvenementAleatoire();
  } else if (resultat.suivant === "FIN") {
    finDePartie();
  } else if (resultat.suivant === "AIGUILLAGE_CLASSE") {
    const sceneClasse = `arc2_${joueur.classe}_intro`;
    demarrerScene(sceneClasse);
  } else {
    demarrerScene(resultat.suivant);
  }
}

function appliquerEffets(effets) {
  if (!effets) return;

  for (const cle in effets) {
    if (cle === "competences") {
      if (!joueur.competences) joueur.competences = [];
      effets.competences.forEach(c => {
        if (!joueur.competences.includes(c)) joueur.competences.push(c);
      });
    } else if (cle === "objets") {
      if (!joueur.objets) joueur.objets = [];
      effets.objets.forEach(o => {
        if (!joueur.objets.includes(o)) joueur.objets.push(o);
      });
    } else if (cle === "relations") {
      if (!joueur.relations) joueur.relations = [];
      effets.relations.forEach(r => {
        const existante = joueur.relations.find(x => x.nom === r.nom);
        if (existante) existante.statut = r.statut;
        else joueur.relations.push(r);
      });
    } else if (joueur.stats && cle in joueur.stats) {
        joueur.stats[cle] = (joueur.stats[cle] || 0) + effets[cle];
        if (joueur.stats.vie > 100) joueur.stats.vie = 100;
        if (joueur.stats.endurance > 100) joueur.stats.endurance = 100;
    }
  }
  mettreAJourFiche();
  sauvegarderPartie();
}

function mettreAJourFiche() {
  const fiche = document.getElementById("ficheJoueur");
  if (!fiche) return;

  const objetsHTML = (joueur.objets && joueur.objets.length)
    ? joueur.objets.map(o => `<span class="badge-objet">🎒 ${o}</span>`).join(" ")
    : "";

  const competencesHTML = (joueur.competences && joueur.competences.length)
    ? joueur.competences.map(c => `<span class="badge-competence">📘 ${c}</span>`).join(" ")
    : `<span class="badge-vide">Aucune compétence</span>`;

  const relationsHTML = (joueur.relations && joueur.relations.length)
    ? joueur.relations.map(r => {
        const couleur = couleurStatutRelation(r.statut);
        return `<span class="badge-relation" style="color:${couleur}; border-color:${couleur}; background:${couleur}1a;">🤝 ${r.nom}</span>`;
      }).join(" ")
    : "";

  const classeInfo = joueur.classe ? CLASSES[joueur.classe] : null;
  const classeHTML = classeInfo
    ? `<span class="badge-classe" style="color:${classeInfo.couleur}; border-color:${classeInfo.couleur}; background:${classeInfo.couleur}1a;">${classeInfo.emoji} ${classeInfo.nom}</span>`
    : "";

    const classeFruitInfo = joueur.classeFruit ? CLASSES_FRUIT[joueur.classeFruit] : null;
    const classeFruitHTML = classeFruitInfo
      ? `<span class="badge-classe" style="color:${classeFruitInfo.couleur}; border-color:${classeFruitInfo.couleur}; background:${classeFruitInfo.couleur}1a;">${classeFruitInfo.emoji} ${classeFruitInfo.nom}</span>`
      : "";

    const titreHTML = joueur.titre
      ? `<div style="font-style:italic; font-size:0.9rem; color:#7a2318; margin-top:2px;">« ${joueur.titre} »</div>`
      : "";

    const raceInfo = joueur.race ? RACES[joueur.race] : null;
    const raceHTML = raceInfo
    ? `<span class="badge-classe badge-race">${raceInfo.emoji} ${raceInfo.nom}</span>`
    : "";

  fiche.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:flex-start; width:100%;">
      <div>
        <strong style="font-size:1.1rem; color:#4a150e;">🏴‍☠️ ${joueur.nom || "Pirate"}</strong> ${raceHTML} ${classeHTML} ${classeFruitHTML} ${titreHTML}
        <div style="font-size:0.85rem; margin-top:3px;">
          ❤️ ${joueur.stats.vie} · 🔋 ${joueur.stats.endurance} · 💪 ${joueur.stats.force} · ✨ ${joueur.stats.charisme} · 🧠 ${joueur.stats.intelligence} · ⚡ ${joueur.stats.vitesse} · 🏆 ${joueur.stats.reputation} · 💰 ${formaterBerrys(joueur.stats.argent)} · 📜 ${formaterBerrys(joueur.stats.prime)}
        </div>
      </div>
      <div style="text-align:right; font-family:'Pirata One', cursive; font-size:1.3rem; color:#4a150e;">
        🎂 ${joueur.age} ans
      </div>
    <div style="margin-top:4px; font-size:0.9rem; font-weight:bold; color:#a13a2b;">
        📜 Prime : ${formaterBerrys(joueur.stats.prime)}
    </div>
    </div>
    <div style="margin-top:10px; display:flex; gap:8px; justify-content:flex-end;">
      <button class="parchment-btn" style="margin:0; padding:5px 10px; font-size:0.8rem;" onclick="afficherDetailsPersonnage()">📋 Détail</button>
    </div>
    ${objetsHTML ? `<div style="margin-top:8px; font-size:0.8rem;">${objetsHTML}</div>` : ""}
    <div style="margin-top:6px; font-size:0.8rem;">${competencesHTML}</div>
    ${relationsHTML ? `<div style="margin-top:6px; font-size:0.8rem;">${relationsHTML}</div>` : ""}
  `;
}

function afficherDetailsPersonnage() {
  const modalBody = document.getElementById("modalBody");
  const modalOverlay = document.getElementById("modalDetails");
  if (!modalBody || !modalOverlay) return;

    const classeInfo = joueur.classe ? CLASSES[joueur.classe] : null;
    const classeFruitInfo = joueur.classeFruit ? CLASSES_FRUIT[joueur.classeFruit] : null;
    const raceInfo = joueur.race ? RACES[joueur.race] : null;

    const classesHTML = `
    <p style="text-align:center; margin-bottom:10px;">
        ${raceInfo ? `<span class="badge-classe badge-race">${raceInfo.emoji} ${raceInfo.nom}</span>` : ""}
        ${classeInfo ? `<span class="badge-classe" style="color:${classeInfo.couleur}; border-color:${classeInfo.couleur}; background:${classeInfo.couleur}1a;">${classeInfo.emoji} ${classeInfo.nom}</span>` : ""}
        ${classeFruitInfo ? `<span class="badge-classe" style="color:${classeFruitInfo.couleur}; border-color:${classeFruitInfo.couleur}; background:${classeFruitInfo.couleur}1a;">${classeFruitInfo.emoji} ${classeFruitInfo.nom}</span>` : ""}
    </p>`;

    const objetsHTML = (joueur.objets && joueur.objets.length)
        ? joueur.objets.map(o => `<span class="log-entry" style="display:inline-block; width:auto; border:none; padding:0;">🎒 ${o}</span>`).join("")
        : `<p style="padding:5px 0;">Aucun objet.</p>`;

    const competencesHTML = (joueur.competences && joueur.competences.length)
        ? joueur.competences.map(c => `<span class="log-entry" style="display:inline-block; width:auto; border:none; padding:0;">📘 ${c}</span>`).join("")
        : `<p style="padding:5px 0;">Aucune compétence apprise pour l'instant.</p>`;

    const relationsHTML = (joueur.relations && joueur.relations.length)
        ? joueur.relations.map(r => {
            const couleur = couleurStatutRelation(r.statut);
            return `<span style="display:inline-block;"><span style="color:#2c1d11; font-weight:bold;">${r.nom}</span> : <span style="color:${couleur};">${r.statut}</span></span>`;
            }).join("")
        : `<p style="padding:5px 0;">Aucune relation notable.</p>`;

    modalBody.innerHTML = `
    <h2 class="wanted-title" style="text-align:center;">WANTED</h2>
    <h3 style="text-align:center; font-family:'Cinzel',serif; margin-bottom:5px; color:#7a2318;">${joueur.nom}</h3> ${joueur.titre ? `<p style="text-align:center; font-style:italic; margin-bottom:8px; color:#a13a2b;">« ${joueur.titre} »</p>` : ""}
    <p style="text-align:center; margin-bottom:10px; font-style:italic;">🎂 ${joueur.age} ans</p>
    <p style="text-align:center; margin-bottom:10px; font-size:1.3rem; font-weight:bold; color:#a13a2b;">
        📜 ${formaterBerrys(joueur.stats.prime)}
    </p>
    ${classesHTML}
    
    <div class="log-entry">
        <span class="log-day">Statistiques</span><br>
        ❤️ Vie: ${joueur.stats.vie} | 🔋 Endurance: ${joueur.stats.endurance} |<br>
        💪 Force: ${joueur.stats.force} | ✨ Charisme: ${joueur.stats.charisme} | 🧠 Intelligence: ${joueur.stats.intelligence} |<br>
        ⚡ Vitesse: ${joueur.stats.vitesse} | 🏆 Réputation: ${joueur.stats.reputation} | 💰 Argent: ${formaterBerrys(joueur.stats.argent)}
    </div>
    
    <div style="margin-top:10px; text-align:left;">
        <strong class="log-day" style="display:block; margin-bottom:6px;">Objets :</strong>
        <div style="display:flex; flex-wrap:wrap; gap:8px;">
            ${objetsHTML}
        </div>
    </div>

    <div style="margin-top:10px; text-align:left;">
        <strong class="log-day" style="display:block; margin-bottom:6px;">Compétences :</strong>
        <div style="display:flex; flex-wrap:wrap; gap:8px;">
        ${competencesHTML}
        </div>
    </div>
    
    <div style="margin-top:10px; text-align:left;">
        <strong class="log-day" style="display:block; margin-bottom:6px;">Relations :</strong>
        <div style="display:flex; flex-wrap:wrap; gap:8px;">
        ${relationsHTML}
        </div>
    </div>
    `;
  
  modalOverlay.style.display = "flex";
}

function fermerModalDirect() {
  const modal = document.getElementById("modalDetails");
  if (modal) modal.style.display = "none";
}

function fermerModal(e) {
  if (e.target.id === "modalDetails") {
    fermerModalDirect();
  }
}

// ---------- 4. TIRAGE D'ÉVÉNEMENT PONDÉRÉ ----------

function lancerEvenementAleatoire() {
  const pondere = EVENEMENTS.map(ev => ({
    ev,
    poids: ev.poidsBase * ev.condition(joueur)
  }));

  const total = pondere.reduce((acc, p) => acc + p.poids, 0);
  let tirage = Math.random() * total;

  let evenementChoisi = pondere[0].ev;
  for (const p of pondere) {
    if (tirage < p.poids) { evenementChoisi = p.ev; break; }
    tirage -= p.poids;
  }

  afficherEvenement(evenementChoisi);
}

function afficherEvenement(evenement) {
  if (!evenement) return;
  // dans afficherEvenement(), juste après `if (!evenement) return;`
    joueur.journalArc.push(`⚡ ${evenement.titre}`);
    mettreAJourBarreProgressionArc();

  const texte = typeof evenement.texte === "function" ? evenement.texte() : evenement.texte;

  let html = `<div class="scene-card">`;
  html += `<span class="scene-tag ${classeTagCategorie(evenement.categorie)}">${evenement.categorie || "Événement"}</span>`;
  html += `<h2 class="scene-titre">⚡ ${evenement.titre}</h2>`;
  html += `<p class="scene-texte">${texte}</p>`;
  html += `<div class="scene-choix" id="choixContainer">`;

  evenement.choix.forEach((choix, index) => {
    const etat = etatChoix(choix);
    const cliquable = (etat === "normal" || etat === "special");
    const conditionHTML = texteConditionHTML(choix);

    let classeBtn = "";
    if (etat === "indisponible") classeBtn = "choix-verrouille";
    if (etat === "interdit") classeBtn = "choix-interdit";
    if (etat === "special") classeBtn = "choix-special";

    html += `
      <button class="parchment-strip ${classeBtn}"
        ${cliquable ? `onclick="choisirDansEvenement('${evenement.id}', ${index})"` : 'disabled'}>
        ${choix.texte}
        ${conditionHTML}
      </button>`;
  });

  html += `</div></div>`;

  document.getElementById("contenuJeu").innerHTML = html;
}



function choisirDansEvenement(evenementId, indexChoix) {
  const evenement = EVENEMENTS.find(e => e.id === evenementId);
  const choix = evenement.choix[indexChoix];
  if (!choixEstDisponible(choix)) return;

  let resultat = choix;
  if (choix.issue) {
    const reussite = choix.issue(joueur);
    resultat = reussite ? choix.succes : choix.echec;
  }
  derniereIssue = resultat;

  appliquerEffets(resultat.effets);

  if (resultat.classe) {
    joueur.classe = resultat.classe;
    mettreAJourFiche();
  }

  if (resultat.classeFruit) {
    joueur.classeFruit = resultat.classeFruit;
    mettreAJourFiche();
  }

  if (resultat.titre) {
    joueur.titre = resultat.titre;
    mettreAJourFiche();
  }

  const texteResultat = resultat.resultat || resultat.texte || choix.texte;
  const pillsHTML = formaterEffetsPills(resultat.effets);

  const contenu = document.getElementById("contenuJeu");
  contenu.innerHTML = `
    <div class="scene-card">
      <div class="resultat-card">
        <p class="resultat-texte">${texteResultat}</p>
        <div class="resultat-effets">${pillsHTML || "<em>Aucun effet particulier</em>"}</div>
      </div>
      <button class="parchment-btn" style="margin-top:20px; width:100%;" onclick="continuerApresChoix()">
        Continuer →
      </button>
    </div>`;
}

function continuerApresEvenement(evenementId, indexChoix) {
  const evenement = EVENEMENTS.find(e => e.id === evenementId);
  const choix = evenement.choix[indexChoix];

  if (etatCritiqueAtteint()) {
    afficherFinPrematuree();
    return;
  }

  if (choix.suivant === "FIN") {
    finDePartie();
  } else {
    demarrerScene(choix.suivant);
  }
}

// ---------- 5. ÉTATS CRITIQUES & FINS ----------

function etatCritiqueAtteint() {
  return joueur.stats.endurance <= -50 || joueur.stats.vie <= 0; ;
}

function afficherFinPrematuree() {
  let raison, titre, typeFin;
  if (joueur.stats.endurance <= -50)  {
    raison = "Tu n'as pas su gérer ton endurance et ton corps a lâché.";
    titre = "Surmenage fatal";
    typeFin = "premature_endurance";
  }else if (joueur.stats.vie <= 0) {
    raison = "Tu as été gravement blessé et n'as pas survécu à tes blessures.";
    titre = "Mort tragique";
    typeFin = "premature_vie";
  }
  terminerPartie(titre, raison, 0, "bas", typeFin);
}

function finRetraite() {
  const s = joueur.stats;
  const primeBrute = s.prime;

  const finsParClasse = {
    pirate: {
      legende: { titre: "Légende retirée des mers", raison: "À 40 ans, ton nom résonne encore dans tous les ports. Tu raccroches en légende vivante." },
      solitaire: { titre: "Pirate solitaire", raison: "Craint et respecté, mais seul. Ta légende s'achève dans le silence d'une île isolée." },
      aime: { titre: "Capitaine bien-aimé", raison: "Entouré de ton équipage jusqu'au bout, tu prends une retraite paisible, célébré par tous." },
      redoute: { titre: "Pirate redouté, retraité", raison: "Ta prime impressionnante te suit jusqu'à la fin. Tu choisis de disparaître discrètement." },
      normal: { titre: "Vieux loup de mer", raison: "Sans grande gloire, mais sans regret. Tu as vécu ta vie de pirate à ta façon." }
    },
    marine: {
      legende: { titre: "Amiral à la retraite", raison: "Ton nom est gravé dans l'histoire de la Marine. Tu quittes le service en héros de la justice." },
      solitaire: { titre: "Marine austère", raison: "Rigoureux jusqu'au bout, tu pars sans éclat, mais avec le devoir accompli." },
      aime: { titre: "Officier respecté", raison: "Tes hommes te vénèrent. Tu pars en laissant un héritage de loyauté." },
      redoute: { titre: "Marine redouté, retraité", raison: "Ta poigne de fer a fait trembler les pirates. Tu raccroches l'uniforme en silence." },
      normal: { titre: "Vétéran de la Marine", raison: "Sans éclat particulier, mais fidèle au drapeau jusqu'au bout." }
    },
    revolutionnaire: {
      legende: { titre: "Icône de la révolution", raison: "Ton combat a changé le monde. À 40 ans, tu deviens une légende pour les opprimés." },
      solitaire: { titre: "Révolutionnaire de l'ombre", raison: "Ton visage reste inconnu, mais ton influence a marqué les esprits en secret." },
      aime: { titre: "Voix du peuple", raison: "Adoré par ceux que tu as libérés, tu prends une retraite entourée de gratitude." },
      redoute: { titre: "Ennemi juré du gouvernement", raison: "Ta tête est mise à prix, mais ta cause survit. Tu disparais dans la clandestinité." },
      normal: { titre: "Ancien insurgé", raison: "Ton combat n'a pas tout changé, mais tu as fait ta part, à ta façon." }
    },
    chasseurDePrimes: {
      legende: { titre: "Chasseur de primes légendaire", raison: "Ton nom est craint et respecté dans le monde entier. Tu raccroches ton fusil en héros." },
      solitaire: { titre: "Chasseur de primes solitaire", raison: "Tu as traqué les criminels sans relâche, mais seul. Ta légende s'éteint dans l'ombre." },
      aime: { titre: "Chasseur de primes respecté", raison: "Tes exploits sont connus et admirés. Tu prends une retraite paisible, entouré d'admiration." },
      redoute: { titre: "Chasseur de primes redouté", raison: "Ta réputation de chasseur impitoyable te suit jusqu'à la fin. Tu disparais discrètement." },
      normal: { titre: "Vétéran chasseur de primes", raison: "Sans grande gloire, mais avec un sens du devoir accompli. Tu as vécu ta vie de chasseur de primes à ta manière." }
    }
  };

  const fins = finsParClasse[joueur.classe] || finsParClasse.pirate;

  let choix, tierTitre;
  if (primeBrute >= 300_000_000) {
    choix = fins.legende; tierTitre = "legende";
  } else if (s.reputation >= 15 && s.charisme < 8) {
    choix = fins.solitaire; tierTitre = "moyen";
  } else if (s.charisme >= 15) {
    choix = fins.aime; tierTitre = "moyen";
  } else if (primeBrute >= 100_000_000) {
    choix = fins.redoute; tierTitre = "haut";
  } else {
    choix = fins.normal; tierTitre = "bas";
  }

  terminerPartie(choix.titre, choix.raison, primeBrute, tierTitre, "retraite");
}

function finDePartie() {
  const primeBrute = joueur.stats.prime;

  const titresParClasse = {
    pirate: {
      bas: "Pirate débutant",
      moyen: "Menace montante",
      haut: "Pirate redouté",
      legende: "Légende de Grand Line"
    },
    marine: {
      bas: "Simple soldat",
      moyen: "Officier prometteur",
      haut: "Marine respecté",
      legende: "Amiral légendaire"
    },
    revolutionnaire: {
      bas: "Révolutionnaire novice",
      moyen: "Agent de l'ombre",
      haut: "Figure de la révolution",
      legende: "Légende de l'Armée Révolutionnaire"
    },
    chasseurDePrimes: {
      bas: "Chasseur de primes débutant",
      moyen: "Chasseur de primes prometteur",
      haut: "Chasseur de primes redouté",
      legende: "Chasseur de primes légendaire"
    }
  };

  const titres = titresParClasse[joueur.classe] || titresParClasse.pirate;

  let titre, tierTitre;
  if (primeBrute >= 300_000_000) { titre = titres.legende; tierTitre = "legende"; }
  else if (primeBrute >= 100_000_000) { titre = titres.haut; tierTitre = "haut"; }
  else if (primeBrute >= 30_000_000) { titre = titres.moyen; tierTitre = "moyen"; }
  else { titre = titres.bas; tierTitre = "bas"; }

  terminerPartie(titre, "Ton aventure touche à sa fin, pour l'instant...", primeBrute, tierTitre, "normale");
}

function terminerPartie(titre, raison, prime, tierTitre = "bas", typeFin = "normale") {
  supprimerSauvegarde();
  sauvegarderDansPantheon(titre, prime);

  const nombreArcs = joueur.historique.length;

  // Vérifie et débloque les succès correspondant à cette fin de partie
  const contexteSucces = { tierTitre, prime, arcs: nombreArcs, typeFin };
  const resultatSucces = verifierEtDebloquerSucces(contexteSucces);

  const detailPieces = calculerPiecesGagnees(prime, nombreArcs, tierTitre);
  const totalAvecSucces = detailPieces.total + resultatSucces.piecesGagnees;
  const totalPieces = ajouterPiecesBoutique(totalAvecSucces);

  const succesHTML = resultatSucces.debloquesCetteFois.length ? `
    <div class="log-entry" style="margin-top:15px; background:rgba(212,175,55,0.1);">
      <span class="log-day">🏅 Succès obtenus${resultatSucces.piecesGagnees > 0 ? ` (+${resultatSucces.piecesGagnees} 🪙)` : ""}</span>
      <div style="display:flex; flex-wrap:wrap; gap:8px; margin-top:8px;">
        ${resultatSucces.debloquesCetteFois.map(s => `
          <span class="badge-succes">${s.emoji} ${s.nom}${s.compteur > 1 ? ` <small>x${s.compteur}</small>` : ""}</span>
        `).join("")}
      </div>
    </div>` : "";

  const recapArcsHTML = joueur.historique.map(arc => `
    <div class="log-entry" style="text-align:left;">
      <span class="log-day">Arc ${arc.numeroArc} (${arc.age} ans)</span>
      <ul style="margin:5px 0 0 20px; padding:0; font-size:0.85rem;">
        ${arc.evenements.map(e => `<li>${e}</li>`).join("")}
      </ul>
    </div>
  `).join("");

  document.getElementById("titreScene").textContent = "Fin de l'aventure";
  document.getElementById("contenuJeu").innerHTML = `
    <div class="wanted-poster" id="carteResultat">
      <div class="logbook-title">🏴‍☠️ ${joueur.nom}</div>
      <div class="log-entry"><span class="log-day">Titre</span> ${titre}</div>
      <div class="log-entry"><span class="log-day">Prime finale</span> ${formaterBerrys(prime)}</div>
      <div class="log-entry"><span class="log-day">Âge final</span> ${joueur.age} ans</div>
      <p style="margin-top:15px; font-style:italic;">${raison}</p>

      <div class="log-entry" style="margin-top:15px; background:rgba(212,175,55,0.1);">
        <span class="log-day">🪙 Pièces gagnées</span> +${totalAvecSucces} (total : ${totalPieces})
        <div style="font-size:0.75rem; color:#7a2318; margin-top:4px;">
          💰 ${detailPieces.base} (prime) · 📅 ${detailPieces.bonusArcs} (${nombreArcs} arc${nombreArcs > 1 ? "s" : ""} vécu${nombreArcs > 1 ? "s" : ""}) · 🏅 ${detailPieces.bonusTitre} (titre) · 👑 ${resultatSucces.piecesGagnees} (succès)
        </div>
      </div>
      ${succesHTML}

      <div style="margin-top:20px; text-align:left;">
        <h3 style="font-family:'Pirata One', cursive; margin-bottom:10px; color:#4a150e;">📜 Ton parcours</h3>
        ${recapArcsHTML || "<p>Aucun arc terminé.</p>"}
      </div>
    </div>

    <div style="display:flex; gap:10px; margin-top:20px;">
      <button class="parchment-btn" style="flex:1;" onclick="window.location.reload()">Retour au Menu</button>
      <button class="parchment-btn" style="flex:1;" onclick="telechargerCarte()">📥 Télécharger</button>
    </div>
  `;
}

function telechargerCarte() {
  const carte = document.getElementById("carteResultat");
  if (!carte) return;

  const btnTelecharger = event.target;
  btnTelecharger.disabled = true;
  btnTelecharger.textContent = "⏳ Génération...";

  // Neutralise temporairement la rotation/effet penché pour l'export
  const transformOriginal = carte.style.transform;
  carte.style.transform = "none";

  html2canvas(carte, {
    backgroundColor: "#e6d3a7",
    scale: 2
  }).then(canvas => {
    // Remet le style original après la capture
    carte.style.transform = transformOriginal;

    const lien = document.createElement("a");
    lien.download = `${joueur.nom.replace(/\s+/g, "_")}_wanted.png`;
    lien.href = canvas.toDataURL("image/png");
    lien.click();

    btnTelecharger.disabled = false;
    btnTelecharger.textContent = "📥 Télécharger";
  }).catch(err => {
    console.error("Erreur génération image :", err);
    carte.style.transform = transformOriginal; // remet aussi en cas d'erreur
    btnTelecharger.disabled = false;
    btnTelecharger.textContent = "📥 Télécharger";
  });
}

function formaterEffetsPills(effets) {
  if (!effets || Object.keys(effets).length === 0) return "";

  const labels = {
    force: "Force",
    reputation: "Réputation",
    charisme: "Charisme",
    argent: "Argent",
    moral: "Moral"
  };

  const pills = [];

  for (const cle in effets) {
    if (cle === "competences") {
      effets.competences.forEach(c => pills.push(`<span class="effet-pill effet-competence">🧠 ${c}</span>`));
    } else if (cle === "relations") {
      effets.relations.forEach(r => pills.push(`<span class="effet-pill effet-relation">🤝 ${r.nom} : ${r.statut}</span>`));
    } else if (labels[cle]) {
      const valeur = effets[cle];
      const signe = valeur >= 0 ? "+" : "-";
      const montant = cle === "argent" ? formaterBerrys(Math.abs(valeur)) : Math.abs(valeur);
      const classe = valeur >= 0 ? "effet-positif" : "effet-negatif";
      pills.push(`<span class="effet-pill ${classe}">${labels[cle]} ${signe}${montant}</span>`);
    }
  }

  return pills.join("");
}

function formaterBerrys(montant) {
  const abs = Math.abs(montant);
  const signe = montant < 0 ? "-" : "";

  if (abs >= 1_000_000) {
    const valeur = Math.round((abs / 1_000_000) * 10) / 10;
    return signe + valeur + "M ฿";
  }
  if (abs >= 1_000) {
    const valeur = Math.round((abs / 1_000) * 10) / 10;
    return signe + valeur + "K ฿";
  }
  return montant.toLocaleString("fr-FR") + " ฿";
}

// Fonction utilitaire pour cacher TOUTES les sections de menu
function cacherTousLesMenus() {
  const sections = document.querySelectorAll(".menu-section");
  sections.forEach(section => {
    section.style.display = "none";
  });
}

function afficherPantheon() {
  cacherTousLesMenus(); // 👈 Masque la boutique et les autres fenêtres

  const menuPrincipal = document.getElementById("menuPrincipal");
  const pantheon = document.getElementById("pantheon");
  const contenu = document.getElementById("pantheonContenu");
  if (!contenu) return;

  const historique = JSON.parse(localStorage.getItem("op_pantheon") || "[]");

  if (historique.length === 0) {
    contenu.innerHTML = `<p style="text-align:center; padding:20px;">Aucun pirate n'a encore écrit sa légende. Sois le premier !</p>`;
  } else {
    contenu.innerHTML = historique.map((entree, index) => `
      
      <div class="log-entry" style="margin-bottom: 15px; border-bottom: 1px dashed rgba(122,15,15,0.3); padding-bottom: 10px;">
        <div style="font-weight: bold; font-size: 1.1rem; color: #7a0f0f;">
          ${entree.nom} · ${entree.age} ans
        </div>
        
        
        <!-- Surnom / Épithète (masqué si null, undefined ou si c'est la chaîne "null") -->
        ${(entree.surnom && entree.surnom !== "null" && entree.surnom !== "undefined") ? `
          <div style="font-style: italic; color: #3d2314; margin: 3px 0; font-weight: 500;">
            « ${entree.surnom} »
          </div>
        ` : ''}
        
        <div style="font-size: 0.85rem; color: #555;">
          <span>👤 <strong>Race :</strong> ${entree.race}</span> | 
          <span>📍 <strong>Origine :</strong> ${entree.origine}</span>
        </div>
        
        <div style="font-size: 0.85rem; color: #555;">
          <span>⚔️ <strong>Classe :</strong> ${entree.titre || "Inconnue"}</span> | 
          <span>🍇 <strong>Fruit :</strong> ${entree.classeFruit || "n'est pas un utilisateur de fruit du démon"}</span>
        </div>
        
        <div style="margin-top: 5px; font-weight: bold; color: #b98a1f;">
          📜 Prime : ${formaterBerrys(entree.prime)} · <span style="font-size:0.8rem; color:#888;">${entree.date}</span>
        </div>
      </div>
    `).join("");
  }

  if (menuPrincipal) menuPrincipal.style.display = "none";
  if (pantheon) pantheon.style.display = "block";
}

function fermerPantheon() {
  const menuPrincipal = document.getElementById("menuPrincipal");
  const pantheon = document.getElementById("pantheon");

  if (pantheon) pantheon.style.display = "none";
  if (menuPrincipal) menuPrincipal.style.display = "flex";
}

// ---------- SUCCÈS ----------
// Le catalogue SUCCES_CATALOGUE est défini dans js/donnees/succes.js

// Stockage : op_succes = { [id]: nombreDeFois } dans localStorage (persiste entre les parties)
function chargerSucces() {
  return JSON.parse(localStorage.getItem("op_succes") || "{}");
}

function sauvegarderSucces(obj) {
  localStorage.setItem("op_succes", JSON.stringify(obj));
}

// Vérifie tous les succès du catalogue par rapport à l'état du joueur en fin de partie,
// incrémente leur compteur s'ils sont obtenus, et retourne le détail de ce qui a été débloqué.
function verifierEtDebloquerSucces(contexte) {
  const succesActuels = chargerSucces();
  const debloquesCetteFois = [];
  let piecesGagnees = 0;

  SUCCES_CATALOGUE.forEach(succes => {
    let obtenu = false;
    try {
      obtenu = succes.condition(joueur, contexte);
    } catch (e) {
      obtenu = false;
    }
    if (obtenu) {
      const compteurPrecedent = succesActuels[succes.id] || 0;
      const compteur = compteurPrecedent + 1;
      succesActuels[succes.id] = compteur;
      debloquesCetteFois.push({ ...succes, compteur });
      if (succes.recompense && succes.recompense.pieces) {
        piecesGagnees += succes.recompense.pieces;
      }
    }
  });

  sauvegarderSucces(succesActuels);
  return { debloquesCetteFois, piecesGagnees };
}

// Affiche l'onglet Succès : cartes groupées par `groupe`, avec compteur ×N si obtenu plusieurs fois
function afficherSucces() {
  cacherTousLesMenus();

  const menuPrincipal = document.getElementById("menuPrincipal");
  const succesSection = document.getElementById("succes");
  const contenu = document.getElementById("succesContenu");
  if (!contenu) return;

  const succesObtenus = chargerSucces();
  const totalSucces = SUCCES_CATALOGUE.length;
  const totalDebloques = SUCCES_CATALOGUE.filter(s => (succesObtenus[s.id] || 0) > 0).length;

  // Regroupe le catalogue par `groupe`, en conservant l'ordre d'apparition dans SUCCES_CATALOGUE
  const groupes = {};
  const ordreGroupes = [];
  SUCCES_CATALOGUE.forEach(s => {
    if (!groupes[s.groupe]) {
      groupes[s.groupe] = [];
      ordreGroupes.push(s.groupe);
    }
    groupes[s.groupe].push(s);
  });

  let html = `
    <div style="text-align:center; margin-bottom:25px;">
      <span style="font-family:'Pirata One', cursive; font-size:1.4rem; color:#4a150e;">
        🏅 ${totalDebloques} / ${totalSucces} succès débloqués
      </span>
    </div>`;

  ordreGroupes.forEach(nomGroupe => {
    html += `<h3 class="succes-groupe-titre">${nomGroupe}</h3>`;
    html += `<div class="succes-grille">`;
    groupes[nomGroupe].forEach(s => {
      const compteur = succesObtenus[s.id] || 0;
      const debloque = compteur > 0;
      html += `
        <div class="succes-carte ${debloque ? "succes-carte-debloque" : "succes-carte-verrouille"}">
          ${debloque && compteur > 1 ? `<span class="succes-badge-compteur">x${compteur}</span>` : ""}
          <div class="succes-emoji">${s.emoji}</div>
          <div class="succes-nom">${s.nom}</div>
          <div class="succes-desc">${s.desc}</div>
          ${s.recompense && s.recompense.pieces ? `<div class="succes-recompense">🪙 +${s.recompense.pieces}${debloque ? "" : " (à débloquer)"}</div>` : ""}
        </div>`;
    });
    html += `</div>`;
  });

  contenu.innerHTML = html;

  if (menuPrincipal) menuPrincipal.style.display = "none";
  if (succesSection) succesSection.style.display = "block";
}

function fermerSucces() {
  const menuPrincipal = document.getElementById("menuPrincipal");
  const succesSection = document.getElementById("succes");

  if (succesSection) succesSection.style.display = "none";
  if (menuPrincipal) menuPrincipal.style.display = "flex";
}

// ---------- BOUTIQUE ----------
// Le catalogue BOUTIQUE_CATALOGUE et MAX_EQUIPEMENT_BOUTIQUE sont définis dans js/donnees/boutique.js

function chargerAchatsBoutique() {
  return JSON.parse(localStorage.getItem("op_boutique_achats") || "[]");
}

function sauvegarderAchatsBoutique(achats) {
  localStorage.setItem("op_boutique_achats", JSON.stringify(achats));
}

function chargerEquipementBoutique() {
  return JSON.parse(localStorage.getItem("op_boutique_equipement") || "[]");
}

function sauvegarderEquipementBoutique(equipement) {
  localStorage.setItem("op_boutique_equipement", JSON.stringify(equipement));
}

// Achète un objet : vérifie qu'il n'est pas déjà possédé et que le joueur a assez de pièces
function acheterObjetBoutique(id) {
  const item = BOUTIQUE_CATALOGUE.find(i => i.id === id);
  if (!item) return;

  // 🔒 Vérifie le verrouillage même côté logique
  if (item.deblocage && item.deblocage.succes) {
    const succesObtenus = chargerSucces();
    if (!(succesObtenus[item.deblocage.succes] > 0)) return;
  }

  const achats = chargerAchatsBoutique();
  if (achats.includes(id)) return; // déjà possédé

  const pieces = chargerPiecesBoutique();
  if (pieces < item.prix) return; // pas assez de pièces

  localStorage.setItem("op_pieces_boutique", (pieces - item.prix).toString());
  achats.push(id);
  sauvegarderAchatsBoutique(achats);

  mettreAJourBoutique();
}

// Équipe/déséquipe un objet déjà possédé pour la prochaine partie (max MAX_EQUIPEMENT_BOUTIQUE)
function toggleEquipementBoutique(id) {
  const achats = chargerAchatsBoutique();
  if (!achats.includes(id)) return; // pas possédé, rien à faire

  let equipement = chargerEquipementBoutique();
  if (equipement.includes(id)) {
    equipement = equipement.filter(e => e !== id);
  } else {
    if (equipement.length >= MAX_EQUIPEMENT_BOUTIQUE) return; // limite atteinte
    equipement.push(id);
  }
  sauvegarderEquipementBoutique(equipement);
  mettreAJourBoutique();
}

// Applique les objets/bonus équipés au tout début d'une nouvelle partie (appelé depuis lancerAventure)
function appliquerEquipementDepart() {
  const equipement = chargerEquipementBoutique();
  equipement.forEach(id => {
    const item = BOUTIQUE_CATALOGUE.find(i => i.id === id);
    if (item && item.effets) {
      appliquerEffets(item.effets);
    }
  });
}

// Génère dynamiquement le solde et le catalogue dans la page de la boutique
function mettreAJourBoutique() {
  const piecesEl = document.getElementById("boutiquePieces");
  const equipementInfoEl = document.getElementById("boutiqueEquipementInfo");
  const listeEl = document.getElementById("boutiqueListeObjets");
  if (!piecesEl || !listeEl) return;

  const pieces = chargerPiecesBoutique();
  const achats = chargerAchatsBoutique();
  const equipement = chargerEquipementBoutique();
  const succesObtenus = chargerSucces();

  const itemsHTML = BOUTIQUE_CATALOGUE.map(item => {
    const possede = achats.includes(item.id);
    const equipe = equipement.includes(item.id);

    // 🔒 Vérifie si l'objet est verrouillé par un succès
    const verrouille = item.deblocage && item.deblocage.succes
      && !(succesObtenus[item.deblocage.succes] > 0);

    if (verrouille) {
      const succesRequis = SUCCES_CATALOGUE.find(s => s.id === item.deblocage.succes);
      const nomSucces = succesRequis ? succesRequis.nom : "un succès secret";
      return `
        <div class="book-item book-item-verrouille">
          <div>
            <strong>🔒 ???</strong>
            <div style="font-size:0.8rem;">Débloqué par le succès : <em>${nomSucces}</em></div>
          </div>
          <button class="parchment-btn" disabled>Verrouillé</button>
        </div>`;
    }

    const peutAcheter = !possede && pieces >= item.prix;

    let classeItem = "book-item";
    if (possede) classeItem += " book-item-possede";
    if (equipe) classeItem += " book-item-equipe";

    let boutonHTML;
    if (!possede) {
      boutonHTML = `<button class="parchment-btn" ${peutAcheter ? "" : "disabled"} onclick="acheterObjetBoutique('${item.id}')">🪙 ${item.prix}</button>`;
    } else {
      boutonHTML = `<button class="parchment-btn" onclick="toggleEquipementBoutique('${item.id}')">${equipe ? "✅ Équipé" : "Équiper"}</button>`;
    }

    return `
      <div class="${classeItem}">
        <div>
          <strong>${item.emoji} ${item.nom}</strong>
          <div style="font-size:0.8rem;">${item.desc}</div>
        </div>
        ${boutonHTML}
      </div>`;
  }).join("");

  listeEl.innerHTML = itemsHTML;
  piecesEl.textContent = `🪙 ${pieces}`;
  if (equipementInfoEl) {
    equipementInfoEl.textContent = `🎒 ${equipement.length}/${MAX_EQUIPEMENT_BOUTIQUE}`;
  }
}

function afficherBoutique() {
  cacherTousLesMenus(); // 👈 Masque la boutique et les autres fenêtres

  const menuPrincipal = document.getElementById("menuPrincipal");
  const boutique = document.getElementById("boutique");

  if (!boutique) {
    console.error("L'élément HTML #boutique est introuvable !");
    return;
  }

  // Met à jour le solde de pièces si la fonction existe
  if (typeof mettreAJourBoutique === "function") {
    mettreAJourBoutique();
  }

  if (menuPrincipal) menuPrincipal.style.display = "none";
  boutique.style.display = "block"; // Ou "flex" selon ton CSS
}

function fermerBoutique() {
  const menuPrincipal = document.getElementById("menuPrincipal");
  const boutique = document.getElementById("boutique");

  if (boutique) boutique.style.display = "none";
  if (menuPrincipal) menuPrincipal.style.display = "flex";
}

// Le contenu des pages du guide (pagesGuide) est défini dans js/donnees/guide.js

function afficherGuide() {
  cacherTousLesMenus();
  const menuPrincipal = document.getElementById("menuPrincipal");
  const guide = document.getElementById("guideJeu");

  if (!guide) return;

  changerPageGuide(1); // Ouvre la page 1 par défaut
  if (menuPrincipal) menuPrincipal.style.display = "none";
  guide.style.display = "block";
}

function changerPageGuide(numPage) {
  const conteneurPage = document.getElementById("guideContenuPage");
  if (conteneurPage && pagesGuide[numPage]) {
    conteneurPage.innerHTML = pagesGuide[numPage];
  }
}

function fermerGuide() {
  const guideJeu = document.getElementById("guideJeu");
  const menuPrincipal = document.getElementById("menuPrincipal");

  if (guideJeu) guideJeu.style.display = "none";
  if (menuPrincipal) menuPrincipal.style.display = "flex";
}

function sauvegarderDansPantheon(titreFin, prime) {
  const historique = JSON.parse(localStorage.getItem("op_pantheon") || "[]");

  // 1. On déclare la variable proprement avec let
  let surnomFinal = joueur.surnom || joueur.titre || null;

  // 2. Si le surnom est juste une mention par défaut, on l'annule pour ne pas l'afficher
  if (surnomFinal && (surnomFinal.includes("NE POSSEDE PAS") || surnomFinal.includes("SANS TITRE"))) {
    surnomFinal = null;
  }

  // 3. On pousse la sauvegarde
  historique.push({
    nom: joueur.nom || "Pirate Anonyme",
    age: joueur.age || 16,
    surnom: surnomFinal,                // 🏷️ Utilise la variable déclarée juste au-dessus
    titre: titreFin || joueur.classe,   // 🏅 Rang de fin (ex: "Pirate débutant")
    classe: joueur.classe || "Pirate",
    classeFruit: joueur.classeFruit || null,
    race: joueur.race || "Humain",
    origine: joueur.origine || "Grand Line",
    prime: prime || 0,
    date: new Date().toLocaleDateString("fr-FR")
  });

  historique.sort((a, b) => b.prime - a.prime);
  localStorage.setItem("op_pantheon", JSON.stringify(historique.slice(0, 50)));
}

function sauvegarderPartie() {
  const etat = {
    joueur: joueur,
    sceneActuelle: sceneActuelleId // voir remarque plus bas
  };
  localStorage.setItem("op_sauvegarde", JSON.stringify(etat));
}

function chargerPartie() {
  const sauvegarde = localStorage.getItem("op_sauvegarde");
  if (!sauvegarde) return false;

  const etat = JSON.parse(sauvegarde);
  joueur = etat.joueur;

  const menuPrincipal = document.getElementById("menuPrincipal");
  const jeu = document.getElementById("jeu");
  const shipHeader = document.querySelector(".ship-header");
  const woodNav = document.querySelector(".wood-nav");

  if (menuPrincipal) menuPrincipal.style.display = "none";
  if (jeu) jeu.style.display = "block";
  if (shipHeader) shipHeader.style.display = "none";
  if (woodNav) woodNav.style.display = "none";

  if (etat.sceneActuelle) {
    demarrerScene(etat.sceneActuelle);
  }
  return true;
}

function supprimerSauvegarde() {
  localStorage.removeItem("op_sauvegarde");
}

function chargerPiecesBoutique() {
  return parseInt(localStorage.getItem("op_pieces_boutique") || "0", 10);
}

function ajouterPiecesBoutique(montant) {
  const total = chargerPiecesBoutique() + montant;
  localStorage.setItem("op_pieces_boutique", total.toString());
  return total;
}

// Paliers de qualité de fin de partie, utilisés pour le bonus de titre.
// "bas" < "moyen" < "haut" < "legende"
const BONUS_PIECES_PAR_TIER = {
  bas: 0,
  moyen: 10,
  haut: 25,
  legende: 50
};

// Pièces gagnées par arc terminé (= 1 an vécu), en plus de la prime.
const BONUS_PIECES_PAR_ARC = 1;

function calculerPiecesGagnees(prime, nombreArcs = 0, tierTitre = "bas") {
  const base = Math.floor(prime / 100_000);
  const bonusArcs = nombreArcs * BONUS_PIECES_PAR_ARC;
  const bonusTitre = BONUS_PIECES_PAR_TIER[tierTitre] || 0;

  return {
    total: base + bonusArcs + bonusTitre,
    base,
    bonusArcs,
    bonusTitre
  };
}

// Fonction de lancement appelée quand on clique sur "Prendre la mer"
function lancerAventure() {
  if (typeof appliquerEquipementDepart === "function") {
    appliquerEquipementDepart();
  }
  demarrerScene("arc1_reveil");
}