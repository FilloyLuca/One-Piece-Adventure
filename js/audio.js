const PLAYLIST_MUSIQUES = [
  "audio/musique1.mp3",
  "audio/musique2.mp3",
  "audio/musique3.mp3"
];

let musiqueActive = false;
let volumeActuel = 0.4;
let derniereMusiqueIndex = -1;

function initAudio() {
  const ambiance = document.getElementById("ambianceVagues");
  const musique = document.getElementById("lecteurMusique");

  ambiance.volume = volumeActuel * 0.5; // ambiance un peu plus discrète que la musique
  musique.volume = volumeActuel;

  // Quand une musique se termine, en jouer une autre au hasard
  musique.addEventListener("ended", jouerMusiqueAleatoire);
}

function jouerMusiqueAleatoire() {
  const musique = document.getElementById("lecteurMusique");
  if (!musiqueActive) return;

  let index;
  do {
    index = Math.floor(Math.random() * PLAYLIST_MUSIQUES.length);
  } while (index === derniereMusiqueIndex && PLAYLIST_MUSIQUES.length > 1);

  derniereMusiqueIndex = index;
  musique.src = PLAYLIST_MUSIQUES[index];
  musique.play().catch(() => {}); // catch pour éviter une erreur si l'autoplay est bloqué
}

function toggleMusique() {
  const ambiance = document.getElementById("ambianceVagues");
  const musique = document.getElementById("lecteurMusique");
  const btn = document.getElementById("btnMusique");

  musiqueActive = !musiqueActive;

  if (musiqueActive) {
    ambiance.play().catch(() => {});
    jouerMusiqueAleatoire();
    btn.textContent = "🎵";
  } else {
    ambiance.pause();
    musique.pause();
    btn.textContent = "🔇";
  }
}

function ajusterVolume(valeur) {
  volumeActuel = valeur / 100;
  document.getElementById("ambianceVagues").volume = volumeActuel * 0.5;
  document.getElementById("lecteurMusique").volume = volumeActuel;
}

function ajusterVolumeBouton(delta) {
  const slider = document.getElementById("volumeSlider");
  let nouvelleValeur = parseInt(slider.value) + delta;
  nouvelleValeur = Math.max(0, Math.min(100, nouvelleValeur)); // reste entre 0 et 100
  slider.value = nouvelleValeur;
  ajusterVolume(nouvelleValeur);
}

document.addEventListener("DOMContentLoaded", initAudio);