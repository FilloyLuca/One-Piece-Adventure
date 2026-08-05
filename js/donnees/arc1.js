// ---------- 1. BANQUE DE SCÈNES (arc 1) ----------
Object.assign(SCENES, {
    arc1_reveil: {
        categorie: "Moment de vie",
        titre: "Le reveil",
        texte: () => `Tu te reveilles dans ton lit allerter par un bruit dehors.`,
        choix: [
            {
                texte: "Regarder par la fenêtre.",
                resultat: "Archie ton meilleur ami depuis aussi longtemps que tu t'en souviennes est dehors et te fais signe de venir.",
                effets: {relations: [{ nom: "Archie", statut: "Nakama" }]},
                suivant: "arc1_le_meilleur_ami"
            },
            {
                texte: "Rendors-toi et ignore le bruit.",
                resultat: "Le bruit se fait plus fort, mais tu ne bouges pas. L'instant d'après tu vois Archie ton meilleur ami passer par ta fenêtre.",
                effets: {relations: [{ nom: "Archie", statut: "Nakama" }]},
                suivant: "arc1_le_meilleur_ami"
            }
        ]
    },

  arc1_le_meilleur_ami: {
    categorie: "Moment de vie",
    titre: "Le meilleur ami",
    texte: () => `Pendant que vous marchez le long de la falaise, Archie, qui n'a pas parlé depuis 5 bonnes minutes, te dit : "${joueur.nom}, aimes-tu ta vie au village ?"`,
    choix: [
      {
        texte: "Que veux-tu dire ?",
        resultat: "Archie réplique.",
        suivant: "arc1_archie_propose"
      }
    ]
  },

  arc1_archie_propose: {
    categorie: "Destin",
    titre: "L'appel du large",
    texte: () => `"Ça fait bientôt 17 ans qu'on vit ici et on n'a jamais rien vu d'autre. Il faut partir et explorer le monde. Partons ensemble à l'aventure !"`,
    choix: [
      {
        texte: "Je suis d'accord, partons à l'aventure !",
        resultat: "Archie et toi vous mettez d'accord pour partir à bord du bateau marchand qui réapprovisionne le village, dans un mois.",
        effets: { competences: ["Décidé à partir"], relations: [{ nom: "Archie", statut: "Nakama" }] },
        suivant: "arc1_preparatifs_depart"
      },
      {
        texte: "Non, j'aime bien ma vie ici, je ne veux pas partir.",
        resultat: "Le silence retombe entre vous. Archie hoche la tête, déçu, mais n'insiste pas.",
        finPersonnalisee: {
          titre: "Une vie sans vagues",
          raison: "Loin des tempêtes et des batailles, tu as choisi la tranquillité de ton île natale. Ton nom ne sera jamais gravé dans l'histoire de Grand Line — mais tu as vécu la vie que tu voulais.",
          typeFin: "refus_aventure"
        },
        suivant: "FIN"
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
                suivant: "arc2_enMer",finArc: true ,
            },
            {
                texte: "Rejoindre la Marine",
                resultat: "Tu prêtes serment. Désormais, la justice guide chacun de tes pas.",
                effets: { reputation: 2 },
                classe: "marine",
                suivant: "arc2_enMer",finArc: true
            },
            {
                texte: "Devenir Révolutionnaire",
                resultat: "Tu rejoins l'ombre. Ton combat sera long, mais ta cause est juste.",
                effets: { charisme: 1 },
                classe: "revolutionnaire",
                suivant: "arc2_enMer" ,finArc: true
            }
        ]
    }

});

// ---------- 2. ÉVÉNEMENTS ALÉATOIRES ----------
EVENEMENTS.push(
  {
    id: "petiteFrappe",
    categorie: "Danger",
    titre: "Petite frappe en de ton village",
    texte: () => `Depuis petit ces trois cancres ne cessent d'importuner tout le village et aujourd'hui, c'est ton tour.`,
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
