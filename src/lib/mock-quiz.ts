import type { Question } from "@/types";
import { QUESTIONS_PAR_QUIZ } from "./constants";

type BanqueQuestions = Record<string, Record<string, Question[]>>;

const BANQUE: BanqueQuestions = {
  mathematiques: {
    "nombres-et-calculs": [
      {
        type: "qcm",
        question: "Parmi les intervalles suivants, lequel représente l'ensemble des réels x tels que -2 ≤ x < 5 ?",
        options: ["]-2 ; 5[", "[-2 ; 5[", "[-2 ; 5]", "]-2 ; 5]"],
        reponseCorrecte: "[-2 ; 5[",
        explication: "La notation [-2 ; 5[ indique que -2 est inclus (crochet fermé) et 5 est exclu (crochet ouvert).",
        explicationAvancee: {
          etapes: [
            "Repérer la condition : -2 ≤ x signifie -2 est inclus → crochet fermé [",
            "Repérer la condition : x < 5 signifie 5 est exclu → crochet ouvert [",
            "Assembler : [-2 ; 5[",
          ],
          methode: "Lecture des inégalités et notation d'intervalles",
          erreurs_frequentes: [
            "Confondre crochet fermé et ouvert selon le sens de l'inégalité (≤ vs <)",
            "Inverser les crochets : écrire ]-2 ; 5] au lieu de [-2 ; 5[",
          ],
        },
      },
      {
        type: "vrai_faux",
        question: "(a + b)² = a² + b² est une identité remarquable correcte.",
        reponseCorrecte: false,
        explication: "C'est faux. La formule correcte est (a + b)² = a² + 2ab + b². Le terme 2ab est souvent oublié.",
        explicationAvancee: {
          etapes: [
            "Développer (a + b)² = (a + b)(a + b)",
            "Multiplier : a×a + a×b + b×a + b×b",
            "Simplifier : a² + 2ab + b²",
          ],
          methode: "Identité remarquable (carré d'une somme)",
          erreurs_frequentes: [
            "Oublier le terme central 2ab → écrire a² + b² au lieu de a² + 2ab + b²",
            "Confondre (a+b)² avec (a+b)(a-b) = a²-b²",
          ],
        },
      },
      {
        type: "reponse_courte",
        question: "Développez et simplifiez : (x + 3)(x - 3)",
        reponseCorrecte: "x² - 9",
        explication: "On utilise l'identité (a + b)(a - b) = a² - b². Ici a = x et b = 3, donc on obtient x² - 9.",
        explicationAvancee: {
          etapes: [
            "Identifier la forme (a + b)(a - b) avec a = x et b = 3",
            "Appliquer l'identité remarquable : (a + b)(a - b) = a² - b²",
            "Calculer : x² - 3² = x² - 9",
          ],
          methode: "Identité remarquable (différence de deux carrés)",
          erreurs_frequentes: [
            "Développer terme à terme au lieu d'utiliser l'identité remarquable",
            "Oublier le signe moins : écrire x² + 9 au lieu de x² - 9",
            "Confondre avec (x + 3)² = x² + 6x + 9",
          ],
        },
      },
      {
        type: "qcm",
        question: "Quelle est la valeur de √144 ?",
        options: ["10", "11", "12", "14"],
        reponseCorrecte: "12",
        explication: "12 × 12 = 144, donc √144 = 12.",
      },
      {
        type: "vrai_faux",
        question: "Tout nombre entier est un nombre rationnel.",
        reponseCorrecte: true,
        explication: "Vrai. Tout entier n peut s'écrire n/1, ce qui en fait un rationnel. L'ensemble Z est inclus dans Q.",
      },
    ],
    "fonctions": [
      {
        type: "qcm",
        question: "La fonction f(x) = x² est-elle croissante sur ℝ ?",
        options: ["Oui, toujours", "Non, jamais", "Elle est décroissante sur ]-∞ ; 0] et croissante sur [0 ; +∞[", "Elle est croissante sur ]-∞ ; 0]"],
        reponseCorrecte: "Elle est décroissante sur ]-∞ ; 0] et croissante sur [0 ; +∞[",
        explication: "f(x) = x² est une parabole avec un minimum en x = 0. Elle décroît avant 0 et croît après.",
      },
      {
        type: "vrai_faux",
        question: "L'image de 3 par la fonction f(x) = 2x - 1 est 5.",
        reponseCorrecte: true,
        explication: "f(3) = 2 × 3 - 1 = 6 - 1 = 5. C'est correct.",
      },
      {
        type: "reponse_courte",
        question: "Quelle est l'image de -2 par la fonction f(x) = x² + 1 ?",
        reponseCorrecte: "5",
        explication: "f(-2) = (-2)² + 1 = 4 + 1 = 5.",
      },
      {
        type: "qcm",
        question: "Quel est le domaine de définition de f(x) = 1/x ?",
        options: ["ℝ", "ℝ \\ {0}", "ℝ⁺", "[0 ; +∞["],
        reponseCorrecte: "ℝ \\ {0}",
        explication: "On ne peut pas diviser par 0, donc x = 0 est exclu. Le domaine est ℝ privé de 0.",
      },
      {
        type: "vrai_faux",
        question: "Une fonction paire vérifie f(-x) = -f(x) pour tout x.",
        reponseCorrecte: false,
        explication: "C'est la définition d'une fonction impaire. Une fonction paire vérifie f(-x) = f(x).",
      },
    ],
    "statistiques-et-probabilites": [
      {
        type: "qcm",
        question: "Dans une classe de 30 élèves, 12 ont eu une note supérieure à 15. Quelle est la fréquence relative de cet événement ?",
        options: ["12%", "30%", "40%", "50%"],
        reponseCorrecte: "40%",
        explication: "Fréquence = 12/30 = 0,4 soit 40%.",
      },
      {
        type: "vrai_faux",
        question: "La somme de toutes les probabilités d'un univers fini est égale à 1.",
        reponseCorrecte: true,
        explication: "C'est un axiome fondamental des probabilités. La somme de toutes les probabilités doit toujours valoir 1.",
      },
      {
        type: "reponse_courte",
        question: "On lance un dé à 6 faces. Quelle est la probabilité d'obtenir un nombre pair ?",
        reponseCorrecte: "1/2",
        explication: "Les nombres pairs sont 2, 4, 6 : 3 cas favorables sur 6 possibles. P = 3/6 = 1/2.",
      },
      {
        type: "qcm",
        question: "Quelle est la médiane de la série : 2, 4, 5, 7, 9 ?",
        options: ["4", "5", "7", "5,4"],
        reponseCorrecte: "5",
        explication: "La série est déjà ordonnée et comporte 5 valeurs. La médiane est la valeur centrale (3e) : 5.",
      },
      {
        type: "vrai_faux",
        question: "La moyenne d'une série statistique est toujours égale à la médiane.",
        reponseCorrecte: false,
        explication: "C'est faux. La moyenne et la médiane peuvent être différentes, surtout en présence de valeurs extrêmes.",
      },
    ],
  },
  svt: {
    "cellule-unite-du-vivant": [
      {
        type: "qcm",
        question: "Quelle organite est responsable de la production d'énergie dans la cellule ?",
        options: ["Le noyau", "Le ribosome", "La mitochondrie", "Le réticulum endoplasmique"],
        reponseCorrecte: "La mitochondrie",
        explication: "Les mitochondries produisent l'ATP, la molécule énergétique de la cellule, via la respiration cellulaire.",
      },
      {
        type: "vrai_faux",
        question: "Les cellules procaryotes possèdent un noyau délimité par une membrane.",
        reponseCorrecte: false,
        explication: "C'est faux. Les cellules procaryotes (comme les bactéries) n'ont pas de noyau délimité. C'est une caractéristique des cellules eucaryotes.",
      },
      {
        type: "reponse_courte",
        question: "Quel est le rôle principal de l'ADN dans la cellule ?",
        reponseCorrecte: "information génétique",
        explication: "L'ADN contient l'information génétique qui détermine les caractéristiques de l'organisme et contrôle le fonctionnement de la cellule.",
      },
      {
        type: "qcm",
        question: "Lors de la mitose, une cellule mère produit :",
        options: ["1 cellule fille identique", "2 cellules filles identiques", "4 cellules filles différentes", "2 cellules filles différentes"],
        reponseCorrecte: "2 cellules filles identiques",
        explication: "La mitose produit 2 cellules filles génétiquement identiques à la cellule mère, avec le même nombre de chromosomes.",
      },
      {
        type: "vrai_faux",
        question: "Le chloroplaste est présent dans les cellules animales.",
        reponseCorrecte: false,
        explication: "Les chloroplastes ne sont présents que dans les cellules végétales. Ils permettent la photosynthèse.",
      },
    ],
    "biodiversite-et-evolution": [
      {
        type: "qcm",
        question: "Qui a proposé la théorie de la sélection naturelle ?",
        options: ["Lamarck", "Darwin", "Mendel", "Pasteur"],
        reponseCorrecte: "Darwin",
        explication: "Charles Darwin a proposé la théorie de la sélection naturelle en 1859 dans 'L'Origine des espèces'.",
      },
      {
        type: "vrai_faux",
        question: "La sélection naturelle favorise les individus les mieux adaptés à leur environnement.",
        reponseCorrecte: true,
        explication: "C'est le principe fondamental de la sélection naturelle : les individus les mieux adaptés survivent et se reproduisent davantage.",
      },
      {
        type: "qcm",
        question: "Qu'est-ce qu'un homologue anatomique ?",
        options: ["Des organes identiques chez deux espèces", "Des organes de même origine mais de fonctions différentes", "Des organes de fonctions identiques mais d'origines différentes", "Des gènes partagés entre deux espèces"],
        reponseCorrecte: "Des organes de même origine mais de fonctions différentes",
        explication: "Les homologues (ex: bras humain et aile de chauve-souris) ont la même origine embryologique mais des fonctions différentes, témoignant d'une ancêtre commun.",
      },
      {
        type: "vrai_faux",
        question: "Les mutations génétiques sont toujours nocives pour l'organisme.",
        reponseCorrecte: false,
        explication: "Les mutations peuvent être nocives, neutres ou bénéfiques. Elles sont la source de la variation génétique sur laquelle agit la sélection naturelle.",
      },
      {
        type: "reponse_courte",
        question: "Comment appelle-t-on les espèces dont on ne trouve que des restes fossilisés ?",
        reponseCorrecte: "espèces disparues",
        explication: "Les espèces dont on ne trouve que des fossiles sont des espèces disparues ou éteintes. Les fossiles permettent de reconstituer l'histoire de la vie.",
      },
    ],
    "microorganismes-et-sante": [
      {
        type: "qcm",
        question: "Qu'est-ce qu'un antigène ?",
        options: ["Une molécule produite par le système immunitaire", "Une molécule reconnue comme étrangère par l'organisme", "Un type de globule blanc", "Un médicament anti-infectieux"],
        reponseCorrecte: "Une molécule reconnue comme étrangère par l'organisme",
        explication: "Un antigène est toute molécule (souvent à la surface d'un pathogène) reconnue comme étrangère par le système immunitaire, déclenchant une réponse immunitaire.",
      },
      {
        type: "vrai_faux",
        question: "Les antibiotiques sont efficaces contre les infections virales.",
        reponseCorrecte: false,
        explication: "Les antibiotiques n'agissent que sur les bactéries, pas sur les virus. Les utiliser contre un virus est inutile et favorise les résistances bactériennes.",
      },
      {
        type: "qcm",
        question: "Quel type de cellule du système immunitaire produit les anticorps ?",
        options: ["Les lymphocytes T", "Les lymphocytes B", "Les phagocytes", "Les plaquettes"],
        reponseCorrecte: "Les lymphocytes B",
        explication: "Les lymphocytes B se différencient en plasmocytes qui produisent des anticorps spécifiques à l'antigène rencontré.",
      },
      {
        type: "vrai_faux",
        question: "La vaccination déclenche une réponse immunitaire sans provoquer la maladie.",
        reponseCorrecte: true,
        explication: "Les vaccins utilisent des agents pathogènes atténués, inactivés ou des fragments pour déclencher une mémoire immunitaire sans causer la maladie.",
      },
      {
        type: "reponse_courte",
        question: "Comment s'appelle la barrière physique qui protège l'organisme des pathogènes en premier ?",
        reponseCorrecte: "la peau",
        explication: "La peau est la première ligne de défense de l'organisme. Elle constitue une barrière physique empêchant l'entrée des microorganismes.",
      },
    ],
  },
  histoire: {
    "mediterranee-antique": [
      {
        type: "qcm",
        question: "Quelle cité grecque est considérée comme le berceau de la démocratie ?",
        options: ["Sparte", "Corinthe", "Athènes", "Thèbes"],
        reponseCorrecte: "Athènes",
        explication: "Athènes, sous Clisthène puis Périclès (Ve siècle av. J.-C.), a développé la démocratie directe, modèle politique fondateur.",
      },
      {
        type: "vrai_faux",
        question: "L'Empire romain a atteint son apogée sous l'Antiquité tardive, au IVe siècle.",
        reponseCorrecte: false,
        explication: "L'apogée de l'Empire romain se situe aux Ier et IIe siècles après J.-C., sous les règnes des empereurs de la période des Antonins.",
      },
      {
        type: "qcm",
        question: "Qui était Périclès ?",
        options: ["Un général spartiate", "Un stratège athénien qui développa la démocratie", "Un roi macédonien", "Un philosophe grec"],
        reponseCorrecte: "Un stratège athénien qui développa la démocratie",
        explication: "Périclès (495-429 av. J.-C.) fut le principal dirigeant d'Athènes à son apogée, développant la démocratie et finançant de grands travaux comme le Parthénon.",
      },
      {
        type: "vrai_faux",
        question: "Constantin fut le premier empereur romain à se convertir au christianisme.",
        reponseCorrecte: true,
        explication: "Constantin Ier se convertit au christianisme et promulgua l'Édit de Milan (313) qui accordait la liberté de culte dans l'Empire romain.",
      },
      {
        type: "reponse_courte",
        question: "Comment appelle-t-on l'assemblée de citoyens qui votait les lois à Athènes ?",
        reponseCorrecte: "l'Ecclésia",
        explication: "L'Ecclésia était l'assemblée de tous les citoyens athéniens adultes masculins. Elle votait les lois et prenait les décisions importantes de la cité.",
      },
    ],
    "renaissance-humanisme": [
      {
        type: "qcm",
        question: "Quelle invention a joué un rôle crucial dans la diffusion des idées humanistes ?",
        options: ["La boussole", "La poudre à canon", "L'imprimerie", "Le télescope"],
        reponseCorrecte: "L'imprimerie",
        explication: "L'imprimerie à caractères mobiles, inventée par Gutenberg vers 1450, a permis la diffusion massive des livres et des idées humanistes et réformatrices.",
      },
      {
        type: "vrai_faux",
        question: "Martin Luther a traduit la Bible en latin pour la diffuser auprès du peuple.",
        reponseCorrecte: false,
        explication: "Luther a traduit la Bible en allemand (et non en latin) pour la rendre accessible aux fidèles qui ne lisaient pas le latin.",
      },
      {
        type: "qcm",
        question: "Qu'est-ce que l'Humanisme ?",
        options: ["Un mouvement religieux du XVIe siècle", "Un courant culturel mettant l'Homme au centre de la réflexion", "Une philosophie niant l'existence de Dieu", "Un style artistique apparu en Italie"],
        reponseCorrecte: "Un courant culturel mettant l'Homme au centre de la réflexion",
        explication: "L'Humanisme est un mouvement intellectuel de la Renaissance qui place l'être humain et sa dignité au centre, s'inspirant des textes antiques.",
      },
      {
        type: "vrai_faux",
        question: "Léonard de Vinci était uniquement peintre.",
        reponseCorrecte: false,
        explication: "Léonard de Vinci était à la fois peintre, sculpteur, architecte, musicien, mathématicien, ingénieur, inventeur et anatomiste : un exemple parfait de l'homme universel de la Renaissance.",
      },
      {
        type: "reponse_courte",
        question: "Dans quelle ville italienne la Renaissance est-elle née au XIVe-XVe siècle ?",
        reponseCorrecte: "Florence",
        explication: "Florence fut le berceau de la Renaissance, grâce notamment aux Médicis qui financèrent les arts et les lettres.",
      },
    ],
  },
  francais: {
    "poesie-moyen-age-xviiie": [
      {
        type: "qcm",
        question: "Comment appelle-t-on une comparaison sans outil comparatif (comme, tel, ainsi que...) ?",
        options: ["Une comparaison", "Une métaphore", "Une personnification", "Une allégorie"],
        reponseCorrecte: "Une métaphore",
        explication: "La métaphore est une figure de style qui établit une comparaison implicite sans outil comparatif. Ex: 'La vie est un long fleuve tranquille'.",
      },
      {
        type: "vrai_faux",
        question: "Un sonnet est composé de 14 vers.",
        reponseCorrecte: true,
        explication: "Le sonnet est une forme fixe de 14 vers, généralement organisés en deux quatrains (4 vers) et deux tercets (3 vers).",
      },
      {
        type: "qcm",
        question: "Qu'est-ce qu'une allitération ?",
        options: ["La répétition de sons vocaliques", "La répétition de sons consonantiques", "L'opposition de deux idées contraires", "L'exagération d'un trait"],
        reponseCorrecte: "La répétition de sons consonantiques",
        explication: "L'allitération est la répétition d'un même son consonantique dans des mots proches. Ex: 'Pour qui sont ces serpents qui sifflent sur vos têtes' (Racine).",
      },
      {
        type: "vrai_faux",
        question: "L'alexandrin est un vers de 12 syllabes.",
        reponseCorrecte: true,
        explication: "L'alexandrin est le vers de 12 syllabes, le plus utilisé dans la poésie classique française. Il est souvent divisé en deux hémistiches de 6 syllabes.",
      },
      {
        type: "reponse_courte",
        question: "Comment appelle-t-on la figure de style qui consiste à attribuer des caractéristiques humaines à un objet ou un animal ?",
        reponseCorrecte: "la personnification",
        explication: "La personnification prête des caractéristiques humaines à des êtres non-humains ou des objets. Ex: 'Le vent murmure dans les arbres'.",
      },
    ],
    "roman-et-recit": [
      {
        type: "qcm",
        question: "Dans un récit, le narrateur qui participe à l'histoire et dit 'je' est dit :",
        options: ["Narrateur omniscient", "Narrateur externe", "Narrateur interne", "Narrateur zéro"],
        reponseCorrecte: "Narrateur interne",
        explication: "Le narrateur interne (ou homodiégétique) est un personnage du récit qui raconte sa propre histoire à la première personne.",
      },
      {
        type: "vrai_faux",
        question: "Un roman épistolaire est un roman écrit sous forme de lettres.",
        reponseCorrecte: true,
        explication: "Le roman épistolaire est composé d'une série de lettres échangées entre les personnages. Ex: 'Les Liaisons dangereuses' de Laclos.",
      },
      {
        type: "qcm",
        question: "Qu'est-ce que la focalisation zéro dans un récit ?",
        options: ["Le narrateur sait moins que les personnages", "Le narrateur ne connaît que l'extérieur des personnages", "Le narrateur sait tout sur tous les personnages", "L'histoire est racontée à la troisième personne"],
        reponseCorrecte: "Le narrateur sait tout sur tous les personnages",
        explication: "La focalisation zéro (ou omnisciente) signifie que le narrateur a accès aux pensées et sentiments de tous les personnages, et connaît tous les événements.",
      },
      {
        type: "vrai_faux",
        question: "L'in medias res est une technique narrative qui commence le récit au milieu de l'action.",
        reponseCorrecte: true,
        explication: "L'in medias res ('au milieu des choses' en latin) consiste à commencer un récit au cœur de l'action, sans exposé préalable. Les informations antérieures sont données ensuite (analepse).",
      },
      {
        type: "reponse_courte",
        question: "Quel est le terme pour désigner un retour en arrière dans la narration ?",
        reponseCorrecte: "analepse",
        explication: "L'analepse (ou flashback) est un retour en arrière dans le temps de la narration pour raconter des événements antérieurs.",
      },
    ],
  },
  geographie: {
    "societes-et-environnements": [
      {
        type: "qcm",
        question: "Qu'est-ce que la vulnérabilité d'une société face à un risque naturel ?",
        options: ["La force d'un phénomène naturel", "La capacité d'une société à se préparer et à récupérer", "Les dommages potentiels que peut subir une société", "La probabilité qu'un aléa survienne"],
        reponseCorrecte: "Les dommages potentiels que peut subir une société",
        explication: "La vulnérabilité mesure les dommages potentiels (humains, économiques, sociaux) qu'une société peut subir face à un aléa naturel. Elle dépend de la densité de population, des infrastructures, etc.",
      },
      {
        type: "vrai_faux",
        question: "Le changement climatique amplifie l'intensité et la fréquence de certains risques naturels.",
        reponseCorrecte: true,
        explication: "Le réchauffement climatique intensifie des phénomènes comme les canicules, les sécheresses, les inondations et les cyclones tropicaux.",
      },
      {
        type: "qcm",
        question: "Quel pays est soumis au plus grand nombre de risques naturels différents dans le monde ?",
        options: ["Les États-Unis", "Le Japon", "L'Indonésie", "Le Bangladesh"],
        reponseCorrecte: "Le Japon",
        explication: "Le Japon est exposé à presque tous les risques naturels : séismes, tsunamis, éruptions volcaniques, typhons. C'est l'un des pays les plus exposés au monde.",
      },
      {
        type: "vrai_faux",
        question: "Les pays riches sont proportionnellement plus touchés en termes de victimes humaines lors de catastrophes naturelles.",
        reponseCorrecte: false,
        explication: "Ce sont les pays pauvres qui enregistrent le plus de victimes humaines, car ils ont moins de moyens de prévention et de gestion des risques. Les pays riches subissent davantage de pertes économiques.",
      },
      {
        type: "reponse_courte",
        question: "Comment appelle-t-on la capacité d'une société à anticiper, résister et se relever après une catastrophe ?",
        reponseCorrecte: "résilience",
        explication: "La résilience désigne la capacité d'un territoire ou d'une société à faire face à une catastrophe et à se reconstruire. Elle est plus forte dans les pays développés.",
      },
    ],
    "mobilites-humaines": [
      {
        type: "qcm",
        question: "Qu'est-ce qu'un réfugié au sens de la Convention de Genève de 1951 ?",
        options: ["Toute personne qui quitte son pays pour des raisons économiques", "Une personne qui fuit son pays à cause de persécutions liées à sa race, religion, nationalité, opinion politique ou appartenance à un groupe social", "Toute personne qui traverse une frontière internationale", "Un migrant économique cherchant un emploi"],
        reponseCorrecte: "Une personne qui fuit son pays à cause de persécutions liées à sa race, religion, nationalité, opinion politique ou appartenance à un groupe social",
        explication: "La Convention de Genève de 1951 définit précisément le statut de réfugié comme une personne qui craint avec raison d'être persécutée pour ces motifs spécifiques.",
      },
      {
        type: "vrai_faux",
        question: "La majorité des migrations internationales se font du Sud vers le Nord.",
        reponseCorrecte: false,
        explication: "La majorité des migrations (environ 60%) se font entre pays du Sud ou entre pays du Nord. Les migrations Sud-Nord sont médiatisées mais ne représentent pas la majorité.",
      },
      {
        type: "qcm",
        question: "Le terme 'diaspora' désigne :",
        options: ["Un type de visa de travail", "La dispersion d'une population hors de son pays d'origine", "Un flux migratoire illégal", "Un camp de réfugiés"],
        reponseCorrecte: "La dispersion d'une population hors de son pays d'origine",
        explication: "Une diaspora est une communauté de personnes ayant quitté leur territoire d'origine et maintenant des liens avec ce pays. Exemple: la diaspora chinoise ou indienne.",
      },
      {
        type: "vrai_faux",
        question: "Le tourisme est la principale forme de mobilité internationale dans le monde.",
        reponseCorrecte: true,
        explication: "Avec environ 1,5 milliard de touristes internationaux par an (avant la Covid), le tourisme représente de loin la plus grande forme de mobilité internationale.",
      },
      {
        type: "reponse_courte",
        question: "Comment appelle-t-on l'argent envoyé par les migrants à leur famille dans leur pays d'origine ?",
        reponseCorrecte: "remises",
        explication: "Les remises (ou transferts de fonds) sont les sommes envoyées par les migrants à leur famille. Elles représentent une source majeure de revenus pour de nombreux pays en développement.",
      },
    ],
  },
  ses: {
    "comment-creer-richesses": [
      {
        type: "qcm",
        question: "Que mesure le Produit Intérieur Brut (PIB) ?",
        options: ["La richesse totale d'un pays", "La valeur de tous les biens et services produits dans un pays sur une année", "Le revenu moyen des habitants", "Les exportations d'un pays"],
        reponseCorrecte: "La valeur de tous les biens et services produits dans un pays sur une année",
        explication: "Le PIB mesure la valeur de la production de richesses réalisée sur le territoire national pendant une année, indépendamment de la nationalité des producteurs.",
      },
      {
        type: "vrai_faux",
        question: "La valeur ajoutée d'une entreprise correspond à son chiffre d'affaires total.",
        reponseCorrecte: false,
        explication: "La valeur ajoutée = Chiffre d'affaires - Consommations intermédiaires. Elle représente la richesse créée par l'entreprise, pas son chiffre d'affaires total.",
      },
      {
        type: "qcm",
        question: "Qu'est-ce que la croissance économique ?",
        options: ["La hausse des prix", "L'augmentation de la population", "L'augmentation de la production de richesses sur une période", "La réduction du chômage"],
        reponseCorrecte: "L'augmentation de la production de richesses sur une période",
        explication: "La croissance économique désigne l'augmentation du PIB sur une période donnée. Elle se mesure en taux de croissance annuel.",
      },
      {
        type: "vrai_faux",
        question: "Le PIB prend en compte le travail domestique non rémunéré.",
        reponseCorrecte: false,
        explication: "C'est une limite majeure du PIB : il ne comptabilise pas le travail domestique, le bénévolat ni l'économie informelle, ce qui le rend incomplet comme mesure du bien-être.",
      },
      {
        type: "reponse_courte",
        question: "Comment appelle-t-on les biens utilisés pour produire d'autres biens et services ?",
        reponseCorrecte: "consommations intermédiaires",
        explication: "Les consommations intermédiaires sont les biens et services utilisés et transformés dans le processus de production. Exemple : la farine utilisée par un boulanger.",
      },
    ],
    "formation-des-prix": [
      {
        type: "qcm",
        question: "Sur un marché concurrentiel, le prix d'équilibre est déterminé par :",
        options: ["L'État uniquement", "Les producteurs uniquement", "La rencontre de l'offre et de la demande", "Les consommateurs uniquement"],
        reponseCorrecte: "La rencontre de l'offre et de la demande",
        explication: "Sur un marché concurrentiel, le prix s'établit à l'intersection de la courbe d'offre et de la courbe de demande, point où le marché est en équilibre.",
      },
      {
        type: "vrai_faux",
        question: "Lorsque le prix d'un bien augmente, la demande pour ce bien augmente généralement.",
        reponseCorrecte: false,
        explication: "C'est généralement l'inverse : lorsque le prix augmente, la demande diminue (loi de la demande décroissante). Il existe des exceptions appelées 'biens Giffen'.",
      },
      {
        type: "qcm",
        question: "Qu'est-ce qu'une externalité négative ?",
        options: ["Un effet bénéfique d'une activité économique sur des tiers", "Un coût supporté par des agents économiques non impliqués dans une transaction", "Une taxe prélevée par l'État", "Un monopole sur un marché"],
        reponseCorrecte: "Un coût supporté par des agents économiques non impliqués dans une transaction",
        explication: "Une externalité négative est un coût imposé à des tiers non parties à la transaction. Ex: la pollution d'une usine affecte les riverains sans qu'ils soient compensés.",
      },
      {
        type: "vrai_faux",
        question: "Un monopole est une situation où un seul vendeur domine un marché.",
        reponseCorrecte: true,
        explication: "Un monopole (du grec 'polein' = vendre, 'monos' = seul) est une structure de marché où un seul offreur fait face à de nombreux demandeurs.",
      },
      {
        type: "reponse_courte",
        question: "Comment appelle-t-on la capacité d'un consommateur à payer plus que le prix du marché pour un bien ?",
        reponseCorrecte: "surplus du consommateur",
        explication: "Le surplus du consommateur est la différence entre le prix maximum qu'il serait prêt à payer et le prix effectivement payé. C'est un gain pour le consommateur.",
      },
    ],
  },
  "physique-chimie": {
    "constitution-et-transformation": [
      {
        type: "qcm",
        question: "Combien de protons possède un atome d'oxygène (numéro atomique Z = 8) ?",
        options: ["6", "8", "10", "16"],
        reponseCorrecte: "8",
        explication: "Le numéro atomique Z correspond au nombre de protons dans le noyau. Pour l'oxygène, Z = 8, donc l'atome possède 8 protons.",
      },
      {
        type: "vrai_faux",
        question: "Lors d'une réaction chimique, la masse totale des réactifs est égale à la masse totale des produits.",
        reponseCorrecte: true,
        explication: "C'est la loi de conservation de la masse (Lavoisier) : 'Rien ne se perd, rien ne se crée, tout se transforme.' La masse est conservée lors d'une réaction chimique.",
      },
      {
        type: "qcm",
        question: "Qu'est-ce qu'un corps pur ?",
        options: ["Un corps naturel non transformé", "Un corps constitué d'un seul type de molécule ou d'atome", "Un corps sans impuretés chimiques", "Un corps solide à température ambiante"],
        reponseCorrecte: "Un corps constitué d'un seul type de molécule ou d'atome",
        explication: "Un corps pur est constitué d'une seule espèce chimique (un seul type de molécule ou d'atome). Il a des propriétés physiques bien définies (température de fusion, d'ébullition).",
      },
      {
        type: "vrai_faux",
        question: "Les électrons se trouvent dans le noyau de l'atome.",
        reponseCorrecte: false,
        explication: "Les électrons se trouvent dans le cortège électronique autour du noyau. Le noyau contient les protons (chargés positivement) et les neutrons (neutres).",
      },
      {
        type: "reponse_courte",
        question: "Comment appelle-t-on les atomes d'un même élément chimique mais avec un nombre de neutrons différent ?",
        reponseCorrecte: "isotopes",
        explication: "Les isotopes sont des atomes d'un même élément (même nombre de protons) mais avec des nombres de neutrons différents. Ex: ¹²C et ¹⁴C sont deux isotopes du carbone.",
      },
    ],
    "mouvements-et-interactions": [
      {
        type: "qcm",
        question: "Selon la première loi de Newton (principe d'inertie), un objet sur lequel s'exercent des forces dont la résultante est nulle :",
        options: ["S'arrête immédiatement", "Accélère", "Reste en mouvement rectiligne uniforme ou au repos", "Décélère progressivement"],
        reponseCorrecte: "Reste en mouvement rectiligne uniforme ou au repos",
        explication: "Le principe d'inertie stipule que si la somme des forces est nulle, le centre de masse d'un objet est soit au repos, soit en mouvement rectiligne uniforme.",
      },
      {
        type: "vrai_faux",
        question: "La force gravitationnelle entre deux objets augmente lorsque la distance entre eux augmente.",
        reponseCorrecte: false,
        explication: "La loi de la gravitation universelle (Newton) montre que la force gravitationnelle diminue avec le carré de la distance : F = G × m₁ × m₂ / d²",
      },
      {
        type: "qcm",
        question: "L'unité de mesure de la force dans le Système International est :",
        options: ["Le Joule", "Le Watt", "Le Newton", "Le Pascal"],
        reponseCorrecte: "Le Newton",
        explication: "Le Newton (N) est l'unité de force dans le Système International, en hommage à Isaac Newton. 1 N = 1 kg·m·s⁻²",
      },
      {
        type: "vrai_faux",
        question: "Le poids et la masse d'un objet sont des grandeurs équivalentes.",
        reponseCorrecte: false,
        explication: "La masse (en kg) est une propriété intrinsèque de l'objet, constante. Le poids (en N) est la force gravitationnelle qui s'applique sur lui et varie selon le lieu (Terre, Lune...).",
      },
      {
        type: "reponse_courte",
        question: "Quelle est la valeur approximative de l'intensité du champ de pesanteur terrestre g ?",
        reponseCorrecte: "9,8 N/kg",
        explication: "Sur Terre, g ≈ 9,8 N/kg (ou m/s²). Sur la Lune, g ≈ 1,6 N/kg, ce qui explique pourquoi on est plus 'léger' sur la Lune.",
      },
    ],
  },
  snt: {
    "connecter": [
      {
        type: "qcm",
        question: "Qu'est-ce qu'une adresse IP ?",
        options: ["Un identifiant unique d'un appareil sur un réseau", "Le nom d'un site web", "Un protocole de communication", "Un type de câble réseau"],
        reponseCorrecte: "Un identifiant unique d'un appareil sur un réseau",
        explication: "Une adresse IP est un identifiant numérique unique attribué à chaque appareil connecté à un réseau. Elle permet d'identifier et de localiser les appareils.",
      },
      {
        type: "vrai_faux",
        question: "Internet est un réseau centralisé avec un serveur central unique.",
        reponseCorrecte: false,
        explication: "Internet est un réseau décentralisé, sans serveur central. Il est composé de millions de réseaux interconnectés, ce qui le rend résistant aux pannes locales.",
      },
      {
        type: "qcm",
        question: "Que signifie IP dans 'adresse IP' ?",
        options: ["Internet Protocol", "Internal Processing", "Input/Output Port", "Integrated Program"],
        reponseCorrecte: "Internet Protocol",
        explication: "IP signifie 'Internet Protocol'. C'est le protocole de communication fondamental qui régit l'envoi et la réception de données sur Internet.",
      },
      {
        type: "vrai_faux",
        question: "Une adresse IPv4 est composée de 4 nombres séparés par des points, chacun compris entre 0 et 255.",
        reponseCorrecte: true,
        explication: "Une adresse IPv4 est composée de 4 octets (32 bits au total), chacun allant de 0 à 255, séparés par des points. Ex: 192.168.1.1",
      },
      {
        type: "reponse_courte",
        question: "Quel protocole est utilisé pour envoyer des emails ?",
        reponseCorrecte: "SMTP",
        explication: "SMTP (Simple Mail Transfer Protocol) est le protocole standard pour l'envoi d'emails. Pour la réception, on utilise POP3 ou IMAP.",
      },
    ],
    "naviguer": [
      {
        type: "qcm",
        question: "Que signifie HTTPS ?",
        options: ["HyperText Transfer Protocol Secure", "High Transfer Protocol System", "HyperText Transfer Protocol Standard", "Hyper Terminal Protocol Secure"],
        reponseCorrecte: "HyperText Transfer Protocol Secure",
        explication: "HTTPS est la version sécurisée de HTTP. Le 'S' signifie que les données échangées sont chiffrées via SSL/TLS, protégeant la confidentialité.",
      },
      {
        type: "vrai_faux",
        question: "Le HTML est un langage de programmation.",
        reponseCorrecte: false,
        explication: "HTML (HyperText Markup Language) est un langage de balisage, non un langage de programmation. Il structure le contenu d'une page web mais ne contient pas de logique de traitement.",
      },
      {
        type: "qcm",
        question: "Qu'est-ce qu'un cookie dans le contexte du web ?",
        options: ["Un fichier malveillant", "Un petit fichier stocké par le navigateur contenant des informations sur la session", "Un type de virus informatique", "Un protocole de sécurité"],
        reponseCorrecte: "Un petit fichier stocké par le navigateur contenant des informations sur la session",
        explication: "Un cookie est un petit fichier texte stocké par le navigateur sur l'ordinateur de l'utilisateur. Il permet aux sites de retenir des informations (préférences, connexion, panier).",
      },
      {
        type: "vrai_faux",
        question: "Le CSS sert à définir la structure et le contenu d'une page web.",
        reponseCorrecte: false,
        explication: "CSS (Cascading Style Sheets) sert à définir la mise en forme (couleurs, polices, mise en page) d'une page web. C'est le HTML qui définit la structure et le contenu.",
      },
      {
        type: "reponse_courte",
        question: "Quel langage informatique est principalement utilisé pour rendre les pages web interactives ?",
        reponseCorrecte: "JavaScript",
        explication: "JavaScript est le principal langage de programmation utilisé côté client pour rendre les pages web interactives (animations, formulaires dynamiques, mises à jour sans rechargement).",
      },
    ],
  },
  emc: {
    "etat-de-droit": [
      {
        type: "qcm",
        question: "Qu'est-ce que l'État de droit ?",
        options: ["Un État où seul le président décide des lois", "Un État dans lequel tous, y compris les gouvernants, sont soumis à la loi", "Un État sans constitution", "Un État avec un parlement élu"],
        reponseCorrecte: "Un État dans lequel tous, y compris les gouvernants, sont soumis à la loi",
        explication: "L'État de droit est un système dans lequel tous les acteurs, y compris l'État lui-même, sont soumis à la loi. Aucun pouvoir n'est au-dessus du droit.",
      },
      {
        type: "vrai_faux",
        question: "La Déclaration des droits de l'Homme et du Citoyen a été adoptée en 1789.",
        reponseCorrecte: true,
        explication: "La DDHC a été adoptée le 26 août 1789 par l'Assemblée nationale constituante, pendant la Révolution française. Elle proclame des droits naturels et inaliénables.",
      },
      {
        type: "qcm",
        question: "Qu'est-ce que la séparation des pouvoirs selon Montesquieu ?",
        options: ["La distinction entre pouvoir local et pouvoir national", "La séparation entre le pouvoir exécutif, législatif et judiciaire", "La distinction entre public et privé", "La séparation de l'Église et de l'État"],
        reponseCorrecte: "La séparation entre le pouvoir exécutif, législatif et judiciaire",
        explication: "Montesquieu, dans 'De l'Esprit des lois' (1748), a théorisé la séparation des pouvoirs en trois branches : le législatif (faire les lois), l'exécutif (les appliquer) et le judiciaire (les faire respecter).",
      },
      {
        type: "vrai_faux",
        question: "En France, le Conseil constitutionnel peut annuler une loi votée par le Parlement si elle est contraire à la Constitution.",
        reponseCorrecte: true,
        explication: "Le Conseil constitutionnel contrôle la conformité des lois à la Constitution. Il peut censurer une loi inconstitutionnelle avant sa promulgation.",
      },
      {
        type: "reponse_courte",
        question: "Comment s'appelle le principe selon lequel tout individu est présumé innocent jusqu'à preuve du contraire ?",
        reponseCorrecte: "présomption d'innocence",
        explication: "La présomption d'innocence est un droit fondamental inscrit dans la DDHC (art. 9). C'est à l'accusation de prouver la culpabilité, pas au prévenu de prouver son innocence.",
      },
    ],
  },
  anglais: {
    "les-temps": [
      {
        type: "qcm",
        question: "Quelle forme verbale utilise-t-on pour une action en cours au moment où on parle ?",
        options: ["Simple present", "Present continuous", "Present perfect", "Past simple"],
        reponseCorrecte: "Present continuous",
        explication: "Le present continuous (be + V-ing) exprime une action en cours au moment de l'énonciation. Ex: 'She is studying right now.'",
      },
      {
        type: "vrai_faux",
        question: "On utilise le present perfect pour des actions terminées à un moment précis du passé.",
        reponseCorrecte: false,
        explication: "Pour une action terminée à un moment précis du passé, on utilise le past simple. Le present perfect exprime un lien avec le présent ou une action dont le moment n'est pas précisé.",
      },
      {
        type: "qcm",
        question: "Quelle est la traduction correcte de 'I have never been to Paris' ?",
        options: ["Je ne suis jamais allé à Paris (mais j'envisage d'y aller)", "Je ne suis pas allé à Paris hier", "Je n'ai jamais été à Paris (lien avec le présent)", "Je n'irai jamais à Paris"],
        reponseCorrecte: "Je n'ai jamais été à Paris (lien avec le présent)",
        explication: "Le present perfect avec 'never' exprime une expérience (ou son absence) ayant un lien avec le présent. 'I have never been to Paris' = je n'ai jamais eu cette expérience jusqu'à maintenant.",
      },
      {
        type: "vrai_faux",
        question: "Le prétérit simple (past simple) s'utilise pour des actions habituelles dans le passé.",
        reponseCorrecte: true,
        explication: "Le past simple peut exprimer des habitudes passées. On peut aussi utiliser 'used to' + infinitif pour insister sur le caractère habituel révolu.",
      },
      {
        type: "reponse_courte",
        question: "Complétez : 'She _____ (go) to school every day when she was young.' (past simple)",
        reponseCorrecte: "went",
        explication: "'Go' est un verbe irrégulier. Son prétérit simple est 'went'. La phrase décrit une habitude passée.",
      },
    ],
    "groupe-verbal": [
      {
        type: "qcm",
        question: "Quel modal exprime une obligation forte en anglais ?",
        options: ["Can", "Might", "Must", "Should"],
        reponseCorrecte: "Must",
        explication: "'Must' exprime une obligation forte, souvent imposée par le locuteur lui-même. 'Should' exprime un conseil. 'Can' exprime une capacité ou permission.",
      },
      {
        type: "vrai_faux",
        question: "'I enjoy to swim' est une phrase grammaticalement correcte en anglais.",
        reponseCorrecte: false,
        explication: "'Enjoy' est suivi du gérondif (-ing), pas de l'infinitif. La forme correcte est 'I enjoy swimming'. D'autres verbes suivis du gérondif: avoid, finish, suggest...",
      },
      {
        type: "qcm",
        question: "Comment forme-t-on la voix passive au présent simple en anglais ?",
        options: ["Subject + have + past participle", "Subject + be + present participle", "Subject + am/is/are + past participle", "Subject + do + infinitive"],
        reponseCorrecte: "Subject + am/is/are + past participle",
        explication: "La voix passive au présent simple se forme avec le verbe 'to be' conjugué (am/is/are) + le participe passé du verbe principal. Ex: 'The book is read by many students.'",
      },
      {
        type: "vrai_faux",
        question: "'She must to go' est une construction correcte en anglais.",
        reponseCorrecte: false,
        explication: "Après les modaux (must, can, should, will...), on utilise l'infinitif sans 'to'. La forme correcte est 'She must go.'",
      },
      {
        type: "reponse_courte",
        question: "Transformez à la voix passive : 'The teacher corrects the homework.'",
        reponseCorrecte: "The homework is corrected by the teacher.",
        explication: "À la voix passive, l'objet devient sujet, et le sujet devient complément d'agent (by...). Le verbe se met à la forme passive : am/is/are + participe passé.",
      },
    ],
  },
  espagnol: {
    "grammaire-de-base": [
      {
        type: "qcm",
        question: "Quelle est la différence principale entre 'ser' et 'estar' en espagnol ?",
        options: ["Il n'y a pas de différence", "'Ser' exprime des caractéristiques permanentes et 'estar' des états temporaires", "'Ser' est plus formel qu''estar'", "'Estar' exprime l'existence et 'ser' la localisation"],
        reponseCorrecte: "'Ser' exprime des caractéristiques permanentes et 'estar' des états temporaires",
        explication: "En espagnol, 'ser' s'utilise pour des caractéristiques permanentes (nationalité, profession) et 'estar' pour des états temporaires (humeur, localisation temporaire).",
      },
      {
        type: "vrai_faux",
        question: "En espagnol, les adjectifs s'accordent en genre et en nombre avec le nom.",
        reponseCorrecte: true,
        explication: "En espagnol, les adjectifs s'accordent avec le nom qu'ils qualifient. Ex: 'un chico alto' (un garçon grand) → 'una chica alta' (une fille grande).",
      },
      {
        type: "qcm",
        question: "Comment dit-on 'Je m'appelle' en espagnol ?",
        options: ["Me llamo", "Me llamas", "Se llama", "Nos llamamos"],
        reponseCorrecte: "Me llamo",
        explication: "'Llamarse' est un verbe pronominal. 'Me llamo' = 'Je m'appelle' (1ère personne du singulier du présent de l'indicatif).",
      },
      {
        type: "vrai_faux",
        question: "En espagnol, on n'utilise pas le pronom sujet (yo, tú, él...) car la terminaison du verbe suffit à indiquer la personne.",
        reponseCorrecte: true,
        explication: "Effectivement, les terminaisons verbales espagnoles sont suffisamment distinctives pour indiquer la personne. Les pronoms sujets sont utilisés principalement pour l'emphase ou la clarification.",
      },
      {
        type: "reponse_courte",
        question: "Comment se conjugue le verbe 'hablar' (parler) à la 3e personne du pluriel au présent ?",
        reponseCorrecte: "hablan",
        explication: "La terminaison de la 3e personne du pluriel des verbes en -ar au présent est -an. 'Hablar' → ellos/ellas hablan.",
      },
    ],
  },
  allemand: {
    "grammaire-allemande": [
      {
        type: "qcm",
        question: "Quel est l'article défini masculin en allemand au nominatif ?",
        options: ["Die", "Das", "Der", "Den"],
        reponseCorrecte: "Der",
        explication: "En allemand, les articles définis varient selon le genre et le cas. Au nominatif : der (masc.), die (fém.), das (neutre), die (pluriel).",
      },
      {
        type: "vrai_faux",
        question: "En allemand, tous les noms commencent par une majuscule.",
        reponseCorrecte: true,
        explication: "Contrairement au français, tous les noms (substantifs) allemands s'écrivent avec une majuscule, quelle que soit leur position dans la phrase. Ex: das Haus, der Hund.",
      },
      {
        type: "qcm",
        question: "Que signifie 'Ich heiße' en allemand ?",
        options: ["Je suis", "Je veux", "Je m'appelle", "J'ai"],
        reponseCorrecte: "Je m'appelle",
        explication: "'Heißen' signifie 's'appeler'. 'Ich heiße' = 'Je m'appelle'. C'est la formule pour se présenter en allemand.",
      },
      {
        type: "vrai_faux",
        question: "En allemand, le verbe se place toujours en deuxième position dans une phrase affirmative principale.",
        reponseCorrecte: true,
        explication: "C'est la règle de la 'Verbzweitstellung' (V2). Dans une principale affirmative, le verbe conjugué occupe toujours la deuxième position. Ex: 'Heute gehe ich ins Kino.'",
      },
      {
        type: "reponse_courte",
        question: "Comment dit-on 'Merci beaucoup' en allemand ?",
        reponseCorrecte: "Danke schön",
        explication: "'Danke' signifie 'merci' et 'schön' signifie 'beau/bien'. 'Danke schön' est la façon polie de dire 'merci beaucoup' en allemand.",
      },
    ],
  },
};

export function genererQuizMock(
  matiereSlug: string,
  chapitreSlug: string
): Question[] {
  const questionsMatiere = BANQUE[matiereSlug];
  if (!questionsMatiere) {
    return genererQuestionsFallback(matiereSlug, chapitreSlug);
  }

  const questionsChapitre = questionsMatiere[chapitreSlug];
  if (!questionsChapitre || questionsChapitre.length === 0) {
    const premieresCles = Object.keys(questionsMatiere);
    if (premieresCles.length > 0) {
      return questionsMatiere[premieresCles[0]].slice(0, QUESTIONS_PAR_QUIZ);
    }
    return genererQuestionsFallback(matiereSlug, chapitreSlug);
  }

  const melangees = [...questionsChapitre].sort(() => Math.random() - 0.5);
  return melangees.slice(0, QUESTIONS_PAR_QUIZ);
}

function genererQuestionsFallback(
  matiereSlug: string,
  chapitreSlug: string
): Question[] {
  return [
    {
      type: "qcm",
      question: `Question de révision sur ${chapitreSlug.replace(/-/g, " ")} en ${matiereSlug} : Quelle est la définition correcte de ce chapitre ?`,
      options: [
        "Réponse A : première définition possible",
        "Réponse B : deuxième définition possible",
        "Réponse C : troisième définition possible",
        "Réponse D : quatrième définition possible",
      ],
      reponseCorrecte: "Réponse A : première définition possible",
      explication: "Ce chapitre fait partie du programme officiel de Seconde. Consultez votre cours pour plus de détails.",
    },
    {
      type: "vrai_faux",
      question: `Ce chapitre sur "${chapitreSlug.replace(/-/g, " ")}" fait partie du programme officiel de Seconde.`,
      reponseCorrecte: true,
      explication: "Effectivement, ce chapitre est au programme officiel de la classe de Seconde en France.",
    },
    {
      type: "reponse_courte",
      question: `Donnez un mot-clé essentiel lié au chapitre "${chapitreSlug.replace(/-/g, " ")}" en ${matiereSlug}.`,
      reponseCorrecte: "programme",
      explication: "Chaque chapitre du programme de Seconde contient des notions clés à maîtriser. Consultez votre manuel scolaire.",
    },
  ];
}
