// ---------- CONTENU DU GUIDE (Manuel du Marin) ----------
// La logique d'affichage (changerPageGuide, afficherGuide, fermerGuide) reste dans moteur-scenes.js.
// Ce fichier ne contient que le texte des pages du livre affiché dans l'onglet "📕 Guide & Explications".
//
// Pour ajouter une page : ajoute une clé numérique ci-dessous, et un bouton correspondant
// dans le sommaire du guide (index.html, onclick="changerPageGuide(N)").

const pagesGuide = {
  1: `
    <h2 class="book-title">🌊 L'Aventure</h2>
    <ul style="padding-left:15px; font-size:0.95rem; line-height:1.5;">
      <li><strong>Scènes :</strong> Choisis ton destin à chaque étape de l'histoire.</li> <br>
      <li><strong>Événements :</strong> La mer réserve des surprises (tempêtes, marchands, rencontres).</li> <br>
      <li><strong>Fin de partie :</strong> Atteins la fin de l'aventure pour calculer ta prime finale !</li>
    </ul>
  `,
  2: `
    <h2 class="book-title">🪙 Les Pièces</h2>
    <ul style="padding-left:15px; font-size:0.95rem; line-height:1.5;">
      <li><strong>Comment en gagner ?</strong> En termianant ton histoire tu recevras des pièces en fonction de ta prime.</li> <br>
      <li><strong>Bazar :</strong> Utilise tes pièces dans la Boutique pour acheter des bonus pour tes prochaines parties.</li>
    </ul>
  `,
  3: `
    <h2 class="book-title">⚔️ Les Stats</h2>
    <ul style="padding-left:15px; font-size:0.95rem; line-height:1.5;">
      <li><strong>❤️ Vie :</strong> Ne la laisse pas tomber à zéro !</li>
      <li><strong>🔋 Endurance :</strong> Ne la laisse pas tomber à zéro !</li> 
      <li><strong>💪 Force :</strong> Détermine ta puissance en combat direct.</li>
      <li><strong>✨ Charisme :</strong> Ton aura, ce que tu degages.</li>
      <li><strong>🧠 Intelligence :</strong> Sert à ruser et analyser.</li>
      <li><strong>🏆Reputation :</strong> Débloque du respect, des alliances... ou des ennemis mortels.</li>
      <li><strong>⚡Vitesse :</strong> Sert à ruser, esquiver et analyser.</li>
      <li><strong>💰 Argent :</b> Ton trésor personnel. Sert à acheter de l'équipement, payer les tavernes et négocier sur les marchés.</li>
      <li><strong>🏴‍☠️ Prime :</b> Ta puissance en chiffre.</li>
    </ul>
  `,
  4: `
    <h2 class="book-title">🏆 Le Panthéon</h2>
    <ul style="padding-left:15px; font-size:0.95rem; line-height:1.5;">
      <li>Chaque fin de partie enregistre ton Capitaine.</li> <br>
      <li>Tente de battre ton record personnel de prime pour figurer tout en haut du Registre des Légendes !</li>
    </ul>
  `,
  5: `
    <h2 class="book-title">📜 Les Succès</h2>
    <ul style="padding-left:15px; font-size:0.95rem; line-height:1.5;">
      <li><strong>👑 Succès :</strong> Obtenez des distinctions pour vos accomplissements au cours de votre aventure.</li> <br>
      <li><strong>Certains succes debloque des objets à acheter dans la boutique par la suite.</strong></li>
    </ul>
  `
};