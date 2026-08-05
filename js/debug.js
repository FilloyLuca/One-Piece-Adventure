// ---------- 🛠️ OUTILS DE DEBUG (dev uniquement) ----------
// Ce fichier est entièrement indépendant du jeu : il ne fait qu'appeler des fonctions
// déjà existantes (demarrerScene, afficherEvenement, mettreAJourFiche...) pour sauter
// directement à une scène/événement sans repasser par la création de personnage.
// Aucun impact si retiré de index.html — le jeu fonctionne normalement sans lui.
// Le panneau visuel ne s'affiche que si l'URL contient ?debug=1.
// Permet de sauter directement à une scène ou un événement, sans repasser
// par la création de personnage ni rejouer tout l'historique depuis le début.
//
// Depuis la console (F12 → onglet Console) :
//   sauterAScene("arc3_debut")
//   sauterAScene("arc5_duel", { force: 20 })        // pour tester un choix requis/interdit
//   sauterAEvenement("naufrage_mysterieux")
//
// Ou visuellement : ouvre le jeu avec index.html?debug=1 dans l'URL,
// un panneau apparaît en haut à gauche avec un bouton par scène/événement.

function sauterAScene(id, champs = {}) {
  if (!SCENES[id]) { console.warn(`Scène inconnue : "${id}"`); return; }
  _preparerJoueurPourDebug(champs);
  demarrerScene(id);
}

function sauterAEvenement(id, champs = {}) {
  const evenement = EVENEMENTS.find(e => e.id === id);
  if (!evenement) { console.warn(`Événement inconnu : "${id}"`); return; }
  _preparerJoueurPourDebug(champs);
  afficherEvenement(evenement);
}

function _preparerJoueurPourDebug(champs) {
  // Valeurs par défaut minimales pour éviter les erreurs sur les scènes
  // qui lisent joueur.classe, joueur.race, etc. — seulement si pas déjà définies
  // (permet d'enchaîner plusieurs sauts sans tout réinitialiser à chaque fois).
  if (!joueur.nom) joueur.nom = "Testeur";
  if (!joueur.classe) joueur.classe = "pirate";
  if (!joueur.race) joueur.race = "humain";

  // Applique les champs personnalisés passés en paramètre (stats ou champs joueur directs)
  for (const cle in champs) {
    if (joueur.stats && cle in joueur.stats) {
      joueur.stats[cle] = champs[cle];
    } else {
      joueur[cle] = champs[cle];
    }
  }

  const menuPrincipal = document.getElementById("menuPrincipal");
  const jeu = document.getElementById("jeu");
  const shipHeader = document.querySelector(".ship-header");
  const woodNav = document.querySelector(".wood-nav");

  if (menuPrincipal) menuPrincipal.style.display = "none";
  if (jeu) jeu.style.display = "block";
  if (shipHeader) shipHeader.style.display = "none";
  if (woodNav) woodNav.style.display = "none";

  mettreAJourFiche();
}

// Panneau visuel listant toutes les scènes/événements cliquables.
// Ne s'affiche QUE si l'URL contient ?debug=1 (ex: index.html?debug=1) —
// invisible pour n'importe quel joueur normal.
function afficherPanneauDebug() {
  if (!new URLSearchParams(window.location.search).has("debug")) return;

  const panneau = document.createElement("div");
  panneau.style.cssText = `
    position:fixed; top:10px; left:10px; z-index:500;
    background:#222; color:#fff; padding:10px;
    max-height:85vh; overflow-y:auto; font-size:0.72rem;
    border-radius:6px; font-family:monospace;
    box-shadow:0 4px 12px rgba(0,0,0,0.6);
  `;

  let html = `<strong style="font-size:0.85rem;">🛠️ DEBUG</strong>`;
  html += `<div style="margin:6px 0; border-bottom:1px solid #555;"></div>`;

  html += `<strong>📜 Scènes (${Object.keys(SCENES).length})</strong><br>`;
  Object.keys(SCENES).forEach(id => {
    html += `<button style="display:block; width:100%; text-align:left; margin:1px 0; background:#333; color:#fff; border:1px solid #555; padding:2px 5px; cursor:pointer;" onclick="sauterAScene('${id}')">${id}</button>`;
  });

  html += `<div style="margin:6px 0; border-bottom:1px solid #555;"></div>`;
  html += `<strong>🎲 Événements (${EVENEMENTS.length})</strong><br>`;
  EVENEMENTS.forEach(ev => {
    html += `<button style="display:block; width:100%; text-align:left; margin:1px 0; background:#333; color:#fff; border:1px solid #555; padding:2px 5px; cursor:pointer;" onclick="sauterAEvenement('${ev.id}')">${ev.id}</button>`;
  });

  panneau.innerHTML = html;
  document.body.appendChild(panneau);
}
document.addEventListener("DOMContentLoaded", afficherPanneauDebug);