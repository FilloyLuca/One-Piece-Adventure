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
        suivant: "arc1_apres_proposition"
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

  arc1_apres_proposition: {
      categorie: "Moment de vie",
      titre: "Pensif",
      texte: () => `Cela fait une semaine que Archie t'as parler de cette soif d'aventure. Depuis tu n'arrives pas à savoir si ce que tu ressent est de l'excitation ou de l'apprehension.`,
      choix: [
      {
          texte: "C'est de l'excitation !",
          effets: { force: 1, competences: ["Excité(e)"] },
          suivant: "EVENEMENT"
      },
      {
          texte: "C'est de l'apprehension !",
          effets: { observation: 1, competence: ["Preventif(ve)"] },
          suivant: "EVENEMENT"
      },
    ]
  },

        
  arc1_preparatifs_depart: {
    categorie: "Moment de vie",
    titre: "Les preparatifs",
    texte: () => `Tu te diriges vers le centre du village pour acheter ce que Archie t'as demander. Tu remercie ta mere pour l'argent de poche qu'elle t'as donnée.`,
    choix: [
      {
        texte: "Merci maman",
        effets: {objets: ["argent de poche"]},
        suivant: "arc1_magasin"
      },
    ]
  },

  arc1_magasin: {
  categorie: "Rencontre",
  titre: "Panique à la boutique",
  texte: () => `Aïe, tu te retrouves devant le marchand mais malheur, ta mère ne t'a pas donné assez d'argent. Tu te retrouves devant les deux derniers objets sur la liste, lequel prends-tu ?`,
  choix: [
    { 
      texte: "Une vieille boussole qui fonctionne encore, étonnant.", 
      effets: {
        objets: ["Vieille boussole"],
        objetsRetires: ["argent de poche"],
        observation: 1,
        intelligence: 1
      },
      suivant: "arc1_veille_depart" 
    },
    {
      texte: "Une carte tachée qui apparemment indique le chemin le plus court vers Grand Line.", 
      effets: {
        objets: ["Carte tachée"],
        objetsRetires: ["argent de poche"],
        observation: 1,
        intelligence: 1
      },
      suivant: "arc1_veille_depart"
    }
  ]
},

    arc1_veille_depart: {
        categorie: "Moment de vie",
        titre: "Une derniére soirée",
        texte: () => `Il est enfin l'heure, demain matin au petit aurore le bateau repart,dans votre base secrete Archie et vous fetez votre derniere soirée sur l'ile avant un bon moment.`,
        choix: [
            {
                texte: "Profiter à fond",
                resultat: "Archie te tends un verre rempli d'un liquide qui t'es familier.",
                suivant: "arc1_blackout",
            },
        ]
    },
    arc1_blackout: {
      categorie: "Moment de vie",
      titre:"À la nôtre !",
      texte: () => `Le verre contient effectivement de l'alcool. Ce fameux nectar qui ne pas familier mais dont tu en a tant entendu parler.`,
        choix: [
            {
              texte: "Archie et toi sceller votre amitié , que dis-je votre fraternité pour toujours grâce à ce verre.",
              resultat: "Tu ne resiste pas longtemps avant de tomber à terre.",
              suivant: "arc1_le_depart",
            },
          ]
    },
    arc1_le_depart: {
      categorie: "Destin",
      titre:"Au revoir et à bientôt ?",
      texte: () => `Archie s'est enfuie sans toi , le bateau va partir biento^t et tu dois traverser toute l'île !`,
        choix:[
          {
            texte: "Tu cours aussi vite que tu peux, ton sac sur le dos mais c'est trop tard. Arrivé au port le bateau part sans toi, tu le vois au loin.",
            resultat:"Tu ne peux pas renoncer, tu sautes sur la premiere barque que tu vois et tu donne tout ce que t'as pour essayer de rattraper ce bateau et d'echapper à la colere des villageois.Tu te retournes et crie « Merci du cadeau d'anniverssaire tout le monde ».",
            suivant: "arc2_enMer", finArc: true
          }
        ]
    },

});

// ---------- 2. ÉVÉNEMENTS ALÉATOIRES ----------
EVENEMENTS.push(
  {
    id: "petite_frappe",
    categorie: "Danger",
    titre: "Petite frappe en de ton village",
    texte: () => `Tu tombes sur les 3 cancres de ton village, vous avez le même âge mais eux n'aspire à rien dans la vie à part s'amuser.`,
    poidsBase: 3,
    // 🔒 Confiné à l'arc 1 : historique.length reste à 0 tant que l'arc 1 n'est pas terminé
    condition: (j) => (j.historique.length === 0 ? (j.stats.reputation > 8 ? 2 : 1) : 0),
    choix: [
      { texte: "Ne pas perdre son temps avec eux", effets: { energie: 1 }, suivant: "arc1_preparatifs_depart" },
      {
        texte: "Se débarrasser de ces 3 guignols maintenant",
        issue: (j) => j.stats.force >= 6,
        succes: {
          resultat: "Tu les mets en fuite sans effort, ta réputation grandit.",
          effets: { force: 1, reputation: 3 },
          suivant: "arc1_preparatifs_depart"
        },
        echec: {
          resultat: "Ils sont plus nombreux et plus grand, tu repars avec quelques bleus.",
          effets: { force: 1, vie: -10, endurance: -5, argent: -10 },
          suivant: "arc1_preparatifs_depart"
        }
      },
    ]
  },

  {
    id: "tronc_mysterieux",
    categorie: "Exploration",
    titre: "Ce tronc, il brille non ?",
    texte: () => `En marchant dans la forêt, ton regard est attiré par un tronc sur le côté. Celui qui possède un trou — et dans ce trou, un objet brillant.`,
    poidsBase: 3,
    // 🔒 Confiné à l'arc 1 ET protection anti-répétition (les deux conditions combinées)
    condition: (j) => (
      j.historique.length === 0 && !(j.scenesVisitees || []).includes("tronc_mysterieux") ? 1 : 0
    ),
    choix: [
      {
        texte: "Bingo, une bourse remplie de pièces rien que pour toi.",
        resultat: "Tu fouilles le tronc et en sors une bourse tintante de pièces.",
        effets: { argent: 2000 },
        suivant: "merci_al"
      }
    ]
  });

// Dans Object.assign(SCENES, { ... }) — suite garantie, pas de hasard ici
Object.assign(SCENES, {
  merci_al: {
    categorie: "Moment de vie",
    titre: "Merci Al",
    texte: () => `Tu te souviens qu'Al l'alcoolique délirant avait raconté un jour avoir caché ses économies pour financer ses prochaines aventures de pirate.`,
    choix: [
      {
        texte: "Tu ranges la bourse dans ta poche",
        effets: {},
        suivant: "arc1_preparatifs_depart"
      }
    ]
  }
});