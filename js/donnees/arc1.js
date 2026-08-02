// ---------- 1. BANQUE DE SCÈNES (arc 1) ----------
Object.assign(SCENES, {
    arc1_reveil: {
        categorie: "Moment de vie",
        titre: "Le grand départ",
        texte: () => `${joueur.nom} quitte enfin les côtes qui l'ont vu grandir. Un petit bateau de fortune tangue sous ses pieds.`,
        choix: [
            {
                texte: "Foncer droit vers le large, sans regarder en arrière",
                resultat: "Tu quittes le port sans un regard en arrière, le cœur léger et déterminé.",
                effets: { moral: 1, reputation: 1 },
                suivant: "arc1_rencontre"
            },
            {
                texte: "Faire une dernière escale au village pour des provisions",
                requis: { stats: { argent: 10 } },
                resultat: "Tu fais le plein de provisions, mais cette hésitation te pèse un peu.",
                effets: { argent: 2, moral: -1 },
                suivant: "arc1_rencontre"
            }
        ]
    },

    arc1_rencontre: {
        titre: "Une voile à l'horizon",
        texte: () => `Un navire croise ta route. Son équipage semble aussi curieux que toi.`,
        choix: [
        {
            texte: "Proposer de rejoindre leur équipage",
            effets: { charisme: 1, reputation: 1, competences: ["Navigation basique"] ,relations: [{ nom: "Luffy", statut: "Allié" }] },
            suivant: "EVENEMENT"
        },
        {
            texte: "Rester prudent et garder tes distances",
            effets: { moral: 1, reputation: -1 },
            suivant: "EVENEMENT"
        },
        {
            
            texte: "Les défier pour prouver ta valeur",
            issue: (j) => j.stats.force >= 6,
            succes: {
                resultat: "Ta force impressionne l'équipage. Ils te respectent instantanément.",
                effets: { force: 1, reputation: 2 },
                suivant: "EVENEMENT"
            },
            echec: {
                resultat: "Le combat tourne court. Tu t'en sors difficilement, la leçon est amère.",
                effets: { force: 1, moral: -2 },
                suivant: "EVENEMENT"
            }
        },
            ]
    },
        
    

  arc1_tempete: {
    titre: "Tempête sur East Blue",
    texte: () => `Le ciel se déchire. ${joueur.nom} doit choisir vite.`,
    requisCompetence: "Navigation basique",
    choix: [
      {
        texte: "Affronter les vagues de front",
        effets: { force: 1, moral: -2 },
        suivant: "arc1_conclusion"
      },
      {
        texte: "Chercher un abri le long des rochers",
        effets: { argent: -2, moral: 1 },
        suivant: "arc1_conclusion"
      }
    ]
  },

  arc1_conclusion: {
    titre: "Le cap est fixé",
    texte: () => `L'horizon s'éclaircit. La légende de ${joueur.nom} ne fait que commencer.`,
    choix: [
      { texte: "Continuer vers Grand Line", effets: {}, suivant: "arc1_choix_destin" }
    ]
  },

    arc1_choix_destin: {
        categorie: "Destin",
        titre: "Le chemin que tu choisis",
        texte: () => `${joueur.nom} se tient à la croisée des chemins. L'avenir du monde t'appartient.`,
        choix: [
            {
                texte: "Devenir Pirate",
                resultat: "Tu hisses ton propre pavillon. Ta légende commence, libre et sans maître.",
                effets: { moral: 1 },
                classe: "pirate",
                suivant: "FIN" , finArc: true
            },
            {
                texte: "Rejoindre la Marine",
                resultat: "Tu prêtes serment. Désormais, la justice guide chacun de tes pas.",
                effets: { reputation: 2 },
                classe: "marine",
                suivant: "FIN" , finArc: true
            },
            {
                texte: "Devenir Révolutionnaire",
                resultat: "Tu rejoins l'ombre. Ton combat sera long, mais ta cause est juste.",
                effets: { charisme: 1 },
                classe: "revolutionnaire",
                suivant: "FIN" ,finArc: true
            }
        ]
    }

});

// ---------- 2. ÉVÉNEMENTS ALÉATOIRES ----------
EVENEMENTS.push(
  {
    id: "marine_patrouille",
    categorie: "Danger",
    titre: "Patrouille de la Marine",
    texte: () => `Une frégate de la Marine s'approche. ${joueur.nom} sent tous les regards se tourner vers lui.`,
    poidsBase: 3,
    condition: (j) => (j.stats.reputation > 8 ? 2 : 1),
    choix: [
      { texte: "Prendre la fuite discrètement", effets: { moral: -1, reputation: 1 }, suivant: "arc1_tempete" },
      { texte: "Affronter la patrouille", effets: { force: 1, reputation: 3, moral: -2 }, suivant: "arc1_tempete" }
    ]
  },
  {
    id: "ile_mysterieuse",
    titre: "Île mystérieuse",
    texte: () => `Une île inconnue apparaît, couverte d'une brume épaisse.`,
    poidsBase: 3,
    condition: (j) => (j.stats.charisme > 8 ? 1.5 : 1),
    choix: [
      { texte: "Explorer l'île", effets: { charisme: 1, argent: 3 }, suivant: "arc1_tempete" },
      { texte: "Repartir sans s'attarder", effets: { moral: 1 }, suivant: "arc1_tempete" }
    ]
  },
  {
    id: "naufrage_survivant",
    titre: "Un naufragé à la dérive",
    texte: () => `Un rescapé s'accroche à une épave. Il semble épuisé.`,
    poidsBase: 2,
    condition: (j) => (j.stats.moral > 6 ? 1.5 : 0.7),
    choix: [
      { texte: "Le secourir", effets: { moral: 2, argent: -1, relations: [{ nom: "Coby", statut: "Allié" }] }, suivant: "arc1_tempete" },
      { texte: "Poursuivre ta route", effets: { moral: -2 }, suivant: "arc1_tempete" }
    ]
  }
);
