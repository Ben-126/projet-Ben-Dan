export interface Competence {
  id: string;
  titre: string;
}

export interface Chapitre {
  slug: string;
  titre: string;
  competences: Competence[];
}

export interface Matiere {
  slug: string;
  nom: string;
  emoji: string;
  couleur: string;
  chapitres: Chapitre[];
}

export type TypeQuestion = "qcm" | "vrai_faux" | "reponse_courte";

export interface QuestionQCM {
  type: "qcm";
  question: string;
  options: string[];
  reponseCorrecte: string;
  explication: string;
}

export interface QuestionVraiFaux {
  type: "vrai_faux";
  question: string;
  reponseCorrecte: boolean;
  explication: string;
}

export interface QuestionReponseCourte {
  type: "reponse_courte";
  question: string;
  reponseCorrecte: string;
  explication: string;
}

export type Question = QuestionQCM | QuestionVraiFaux | QuestionReponseCourte;

export interface Quiz {
  matiere: string;
  chapitre: string;
  questions: Question[];
}

export interface ReponseUtilisateur {
  questionIndex: number;
  reponse: string | boolean;
  correcte: boolean;
  tempsMs: number;
  pointsObtenus: number; // 0-100
}

export interface ResultatQuiz {
  score: number;
  total: number;
  reponses: ReponseUtilisateur[];
}
