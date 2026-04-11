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

export interface ExplicationAvancee {
  etapes?: string[];
  methode?: string;
  erreurs_frequentes?: string[];
}

export interface QuestionQCM {
  type: "qcm";
  question: string;
  options: string[];
  reponseCorrecte: string;
  explication: string;
  explicationAvancee?: ExplicationAvancee;
}

export interface QuestionVraiFaux {
  type: "vrai_faux";
  question: string;
  reponseCorrecte: boolean;
  explication: string;
  explicationAvancee?: ExplicationAvancee;
}

export interface QuestionReponseCourte {
  type: "reponse_courte";
  question: string;
  reponseCorrecte: string;
  explication: string;
  explicationAvancee?: ExplicationAvancee;
}

export type Question = QuestionQCM | QuestionVraiFaux | QuestionReponseCourte;

export interface Quiz {
  matiere: string;
  chapitre: string;
  questions: Question[];
}

export type NiveauCorrection = "correct" | "partiel" | "incorrect";

export interface FeedbackDetaille {
  pointsPositifs?: string;   // Ce qui est correct dans la réponse
  pointsManquants?: string;  // Ce qui manque ou est inexact
  pourquoi?: string;         // Pourquoi c'est faux, lié à la réponse de l'élève
}

export interface ReponseUtilisateur {
  questionIndex: number;
  reponse: string | boolean;
  correcte: boolean;
  niveauCorrection: NiveauCorrection;
  tempsMs: number;
  pointsObtenus: number; // 0-100
}

export interface ResultatQuiz {
  score: number;
  total: number;
  reponses: ReponseUtilisateur[];
}
