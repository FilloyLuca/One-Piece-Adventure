// ---------- CONTENU DU GUIDE (Manuel du Marin) ----------
// La logique d'affichage (changerPageGuide, afficherGuide, fermerGuide) reste dans moteur-scenes.js.
//
// Pour découper une page trop longue en plusieurs écrans : insère GUIDE_SEPARATEUR
// à l'endroit voulu dans le texte de la page. Le moteur affichera chaque morceau
// avec des boutons "Suite →" / "← Retour" automatiquement (rien à faire côté logique).

const GUIDE_SEPARATEUR = "<!--SUITE-->";

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
      <li><strong>Comment en gagner ?</strong> En terminant ton histoire tu recevras des pièces en fonction de ta prime.</li> <br>
      <li><strong>Bazar :</strong> Utilise tes pièces dans la Boutique pour acheter des bonus pour tes prochaines parties.</li>
    </ul>
  `,
  3: `
    <h2 class="book-title">⚔️ Les Stats</h2>
    <ul style="padding-left:15px; font-size:0.95rem; line-height:1.5;">
      <li><strong>❤️ Vie :</strong> Affichée en <em>actuel/max</em> (ex: 80/100). Ne la laisse pas tomber à zéro ! Le seuil max peut grandir avec l'entraînement ou certains événements — et parfois aussi diminuer, suite à une blessure grave.</li> <br>
      <li><strong>🔋 Endurance :</strong> Affichée en <em>actuel/max</em> elle aussi. Ne la laisse pas tomber trop bas ! Comme la vie, son seuil max peut évoluer au fil de l'aventure.</li> <br>
      <li><strong>💪 Force :</strong> Détermine ta puissance en combat direct.</li>
      <li><strong>✨ Charisme :</strong> Ton aura, ce que tu dégages.</li>
    </ul>
    ${GUIDE_SEPARATEUR}
    <h2 class="book-title">⚔️ Les Stats (suite)</h2>
    <ul style="padding-left:15px; font-size:0.95rem; line-height:1.5;">
      <li><strong>🧠 Intelligence :</strong> Sert à ruser et analyser.</li>
      <li><strong>🏆 Réputation :</strong> Débloque du respect, des alliances... ou des ennemis mortels.</li>
      <li><strong>⚡ Vitesse :</strong> Sert à ruser, esquiver et analyser.</li>
      <li><strong>💰 Argent :</strong> Ton trésor personnel. Sert à acheter de l'équipement, payer les tavernes et négocier sur les marchés.</li>
      <li><strong>🏴‍☠️ Prime :</strong> Ta puissance en chiffre.</li>
    </ul>
    <p style="margin-top:12px; font-size:0.85rem; font-style:italic;">
      🎯 À la fin de chaque arc, tu répartis des points d'entraînement librement entre tes stats — y compris les seuils max de vie et d'endurance, pour devenir durablement plus résistant.
    </p>
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
      <li><strong>Certains succès débloquent des objets à acheter dans la boutique par la suite.</strong></li>
    </ul>
  `
};