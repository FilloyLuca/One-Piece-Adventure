// ---------- 1. BANQUE DE SCÈNES (arc 2) ----------
Object.assign(SCENES, {

    // Scène commune, point d'entrée de l'arc 2 
    arc2_enMer: {
        categorie: "Moment de vie",
        titre: "Le grand large",
        texte: () => `
            Voila maintenant peut être 2 semaines que tu es en mer ou peut être 3. Impossible de savoir. 
            Fort heuresement l'objet acheter dans la boutique s'avoue être d'une grande aide.
        `,
        choix: [
            {
                texte: "Faire une sieste, la route est toute tracée. Droit devant",
                interdit: {competence: "Prudent(e)"},
                effets: {enduranceMax: 2, endurance: 5},
                suivant: "arc2_drôle_de_rencontre"
            },
            {
                texte: "Rester eveillé tout du long. On ne sait jamais ce qui peux arriver en mer.",
                effets: {intelligence: 2},
                suivant: "EVENEMENT"

            }
        ]
    },

    arc2_drôle_de_rencontre: {
        categorie: "Rencontre",
        titre: "L'homme dans un baril",
        texte: ()=> `
            Tu te reveille par le bruit que ton bateau fait en accostant sur une île. 
            Problème cette île n'est pas celle que tu recherches.
        `,
        choix: [
            {
                texte: "Tu repars , il n'y a pas de temps à perdre pour retrouver Archie.",
                resultat: "Tu entends quelqu'un surgir des buissons derriere toi. En te retournant tu aperçois un petit homme surmonté d'un coiffure afro coincé dans un baril.",
                suivant: "arc2_un_homme_en_detresse"
            },
            {
                texte: "Tu fouilles les buissons , il n'y a pas de mal à vouloir goûter des fruits d'une autre île.",
                resultat: "En t'approchant des buissons , un petit homme surmonté d'un coiffure afro coincé dans un baril te saute dessus.",
                suivant: "arc2_un_homme_en_detresse"
            }
        ],

    },
    arc2_un_homme_en_detresse: {
        categorie: "Rencontre",
        titre: "L'homme dans un baril",
        texte: () => `
            L'homme se présente sous le nom de Brock et s'excuse de cette frayeur, mais t'explique que cela fait plus de 5 ans que son bateau a coulé et qu'il s'est retrouvé coincé dans ce baril en essayant d'échapper à la tempête.
            Il te demande de l'aide pour l'extirper de son baril.
        `,
        choix: [
            {
            texte: "Je vais l'aider.",
            issue: (j) => j.stats.force >= 8,
            succes: {
                resultat: "D'un seul geste, tu arraches les planches et libères Brock de son baril. Des bourses pleuvent autour de vous , en reprenant ses esprits, Brock, ton nouvel ami, t'offre une bourse en guise de remerciement. Tu reprends la mer l'esprit tranquille après que ton nouvel ami soit reparti lui aussi à bord de sa barque.",
                effets: { force: 2, endurance: -5, reputation: 2, argent: 3000, relations: [{ nom: "Brock", statut: "allié" }] },
                suivant: "arc2_premiere_ile"
            },
            echec: {
                resultat: "Tu tires de toutes tes forces, mais le baril reste coincé. Tu tribuches tu te tapes le crâne contre le sol et fais voler Brock. En atterrisant une pluie de bourses s'abat sur vous,en reprenant ses esprits, Brock, ton nouvel ami, t'offre une bourse en guise de remerciement. Tu reprends la mer l'esprit tranquille mais le crâne en miette après que ton nouvel ami soit reparti lui aussi à bord de sa barque.",
                effets: { force: 1, endurance: -5, vie: -5, argent: 3000, relations: [{ nom: "Brock", statut: "allié" }] },
                suivant: "arc2_premiere_ile"
            }
            },
            {
                texte: "Hors question de l'aider !",
                resultat: "Tu met une droite de toute tes forces dans le ventre de cette homme pour le temps perdu. Le baril explose en mille morceaux et une pluie de bourses tombe. Tu les rammasse toutes et reprend la mer.",
                effets: {argent: 20000, reputation: -3, relations: [{ nom: "Brock", statut: "ennemi" }]},
                suivant: "arc2_premiere_ile"
            }
        ]
    },

    arc2_premiere_ile: {
    categorie: "Exploration",
    titre: "Une île à l'horizon",
    texte: () => `Tu aperçois enfin une île qui pourrait être celle que tu cherches...`,
    choix: [
        {
            texte: "Accoster",
            effets: {},
            suivant: "EVENEMENT" // suite à écrire
        }
    ]
},

    

});

// ---------- 2. ÉVÉNEMENTS ALÉATOIRES ----------
EVENEMENTS.push(
    {
        id: "arc2_le_blues_de_mer",
        categorie: "Moment de vie",
        titre: "La mer est calme",
        texte: () => `Tu sens que tu arrives bientôt , ou pas. Une chose et sûre c'est que tu t'ennuies.`,
        poidsBase: 3,                 // 👈 rareté , Un événement avec poidsBase: 6 sort deux fois plus souvent qu'un événement à poidsBase: 3
        condition: (j) => (j.historique.length === 1 ? 1 : 0),  // 👈 uniquement pendant l'arc 2
        choix: [
            { 
                texte: "Tu cris de toutde tes forces à la mer.", 
                resultat: "Tu sens ta force intérieur grandir.",
                effets: { force: 2, endurance: -1 },
                suivant: "arc2_premiere_ile" 
            },
            { 
                texte: "Tu essaye de faire des ricocher sur l'eau.",
                resultat: "Tu te sens que l'execution de tes mouvements est plus rapide.", 
                effets: { vitesse: 2, endurance: -1 }, 
                suivant: "arc2_premiere_ile" 
            }
        ]
    },
);