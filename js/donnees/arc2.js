// ---------- 1. BANQUE DE SCÈNES (arc 2) ----------
Object.assign(SCENES, {

    // Scène commune, point d'entrée de l'arc 2 (visée par arc1_choix_destin dans arc1.js)
    arc2_enMer: {
        categorie: "Moment de vie",
        titre: "Le grand large",
        texte: () => {
            const textesParClasse = {
                pirate: `${joueur.nom} largue les amarres, pavillon noir hissé au vent. Personne à bord si ce n'est ses propres ambitions.`,
                marine: `${joueur.nom} embarque sur un navire de guerre, l'uniforme encore raide sur ses épaules. La discipline commence maintenant.`,
                revolutionnaire: `${joueur.nom} rejoint un contact discret sur les quais. L'Armée Révolutionnaire ne recrute pas n'importe qui.`
            };
            return textesParClasse[joueur.classe] || `${joueur.nom} prend la mer, prêt à écrire la suite de son histoire.`;
        },
        choix: [
            {
                texte: "Continuer",
                effets: {},
                suivant: "AIGUILLAGE_CLASSE"
            }
        ]
    },

    // ---------- Intros spécifiques par classe ----------
    arc2_pirate_intro: {
        categorie: "Rencontre",
        titre: "Premiers pas de pirate",
        texte: () => `Sans capitaine ni équipage fixe, ${joueur.nom} doit se faire un nom sur les mers d'East Blue avant d'espérer atteindre Grand Line.`,
        choix: [
            {
                texte: "Chercher à recruter un équipage",
                effets: { charisme: 1, competences: ["Meneur d'hommes"] },
                suivant: "EVENEMENT"
            },
            {
                texte: "Naviguer seul, plus rapide et plus discret",
                effets: { vitesse: 1, reputation: -1 },
                suivant: "EVENEMENT"
            }
        ]
    },

    arc2_marine_intro: {
        categorie: "Rencontre",
        titre: "Premiers pas dans la Marine",
        texte: () => `${joueur.nom} est affecté à une base d'East Blue, sous les ordres d'un capitaine peu commode.`,
        choix: [
            {
                texte: "Obéir sans discuter, gravir les échelons",
                effets: { reputation: 2, moral: -1 },
                suivant: "EVENEMENT"
            },
            {
                texte: "Questionner les méthodes de ta hiérarchie",
                effets: { intelligence: 1, reputation: -1 },
                suivant: "EVENEMENT"
            }
        ]
    },

    arc2_revolutionnaire_intro: {
        categorie: "Rencontre",
        titre: "Premiers pas dans l'ombre",
        texte: () => `${joueur.nom} découvre le fonctionnement clandestin de l'Armée Révolutionnaire : cellules isolées, informations cloisonnées.`,
        choix: [
            {
                texte: "Gagner la confiance de ta cellule",
                effets: { charisme: 1, competences: ["Discrétion"] },
                suivant: "EVENEMENT"
            },
            {
                texte: "Agir en électron libre, quitte à prendre des risques",
                effets: { force: 1, reputation: 1 },
                suivant: "EVENEMENT"
            }
        ]
    },

    // ---------- Scène de convergence ----------
    arc2_epreuve: {
        categorie: "Danger",
        titre: "Une épreuve inattendue",
        texte: () => `Quoi que ${joueur.nom} ait choisi jusqu'ici, la mer se charge de tester sa résolution.`,
        choix: [
            {
                texte: "Faire face avec détermination",
                effets: { force: 1, moral: -1 },
                suivant: "arc2_conclusion"
            },
            {
                texte: "Ruser pour s'en sortir sans heurts",
                effets: { intelligence: 1, moral: 1 },
                suivant: "arc2_conclusion"
            }
        ]
    },

    arc2_conclusion: {
        categorie: "Destin",
        titre: "Une nouvelle étape franchie",
        texte: () => `${joueur.nom} sent que quelque chose a changé en lui. La prochaine étape s'annonce plus vaste encore.`,
        choix: [
            {
                texte: "Poursuivre l'aventure",
                effets: {},
                suivant: "FIN" , finArc: true
            }
        ]
    }

});

// ---------- 2. ÉVÉNEMENTS ALÉATOIRES ----------
EVENEMENTS.push(
    // {
    //     id: "arc2_marchand_ambulant",
    //     categorie: "Rencontre",
    //     titre: "Un marchand ambulant",
    //     texte: () => `Un marchand hèle ${joueur.nom} depuis son étal improvisé sur le pont d'un quai flottant.`,
    //     poidsBase: 3,
    //     condition: (j) => (j.stats.argent > 5 ? 1.5 : 1),
    //     choix: [
    //         { texte: "Négocier quelques fournitures", effets: { argent: -3, endurance: 5 }, suivant: "arc2_epreuve" },
    //         { texte: "Passer ton chemin", effets: { moral: -1 }, suivant: "arc2_epreuve" }
    //     ]
    // },
    // {
    //     id: "arc2_rumeur_grand_line",
    //     categorie: "Moment de vie",
    //     titre: "Rumeurs de Grand Line",
    //     texte: () => `Dans une taverne, on murmure des histoires à propos de Grand Line — la moitié semble inventée, l'autre moitié terrifiante.`,
    //     poidsBase: 2,
    //     condition: (j) => (j.stats.intelligence > 6 ? 1.5 : 1),
    //     choix: [
    //         { texte: "Écouter attentivement et prendre des notes", effets: { intelligence: 1 }, suivant: "arc2_epreuve" },
    //         { texte: "Rire de ces histoires de marins ivres", effets: { moral: 1, reputation: -1 }, suivant: "arc2_epreuve" }
    //     ]
    // },
    // {
    //     id: "arc2_rival_croise",
    //     categorie: "Danger",
    //     titre: "Un rival sur ta route",
    //     texte: () => `Une silhouette familière croise le chemin de ${joueur.nom} — quelqu'un qui semble suivre la même ambition que lui.`,
    //     poidsBase: 2,
    //     condition: (j) => (j.stats.reputation > 5 ? 1.5 : 0.8),
    //     choix: [
    //         {
    //             texte: "Le défier",
    //             issue: (j) => j.stats.force >= 8,
    //             succes: {
    //                 resultat: "Tu prends l'avantage sans peine. Ta réputation grandit.",
    //                 effets: { force: 1, reputation: 2 },
    //                 suivant: "arc2_epreuve"
    //             },
    //             echec: {
    //                 resultat: "Le duel tourne à ton désavantage. Une leçon d'humilité.",
    //                 effets: { moral: -2, force: 1 },
    //                 suivant: "arc2_epreuve"
    //             }
    //         },
    //         {
    //             texte: "Proposer une trêve, pour l'instant",
    //             effets: { charisme: 1, relations: [{ nom: "Rival", statut: "Rival" }] },
    //             suivant: "arc2_epreuve"
    //         }
    //     ]
    // }
);