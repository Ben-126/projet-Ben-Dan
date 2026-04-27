import { z } from "zod";
import { getHistorique } from "./history";

const STORAGE_KEY = "objectifs-personnalises";

const ObjectifNoteSchema = z.object({
  id: z.string(),
  matiereSlug: z.string(),
  matiereName: z.string(),
  noteVoulue: z.number().int().min(1).max(20),  // note cible sur 20
  dateCreation: z.string(),
});

export type ObjectifNote = z.infer<typeof ObjectifNoteSchema>;

const StorageSchema = z.array(ObjectifNoteSchema);

export interface ProgressionObjectifNote {
  objectif: ObjectifNote;
  noteMoyenne: number | null; // note actuelle sur 20 (null si aucun quiz)
  atteint: boolean;
  nombreQuiz: number;
}

function load(): ObjectifNote[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = StorageSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : [];
  } catch {
    return [];
  }
}

function save(objectifs: ObjectifNote[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(objectifs));
  } catch {}
}

export function getObjectifsNote(): ObjectifNote[] {
  return load();
}

export function ajouterObjectifNote(matiereSlug: string, matiereName: string, noteVoulue: number): ObjectifNote {
  const objectifs = load();
  const nouvel: ObjectifNote = {
    id: `${matiereSlug}-${Date.now()}`,
    matiereSlug,
    matiereName,
    noteVoulue,
    dateCreation: new Date().toISOString().slice(0, 10),
  };
  save([...objectifs, nouvel]);
  return nouvel;
}

export function supprimerObjectifNote(id: string): void {
  const objectifs = load().filter((o) => o.id !== id);
  save(objectifs);
}

export function getProgressionsObjectifsNote(): ProgressionObjectifNote[] {
  const objectifs = load();
  const historique = getHistorique();

  return objectifs.map((objectif) => {
    const quizMatiere = historique.filter((e) => e.matiereSlug === objectif.matiereSlug);
    const nombreQuiz = quizMatiere.length;

    if (nombreQuiz === 0) {
      return { objectif, noteMoyenne: null, atteint: false, nombreQuiz: 0 };
    }

    // Utilise les 10 derniers quiz de la matière pour calculer la moyenne
    const derniers = quizMatiere.slice(0, 10);
    const scoreMoyen = derniers.reduce((sum, e) => sum + e.score, 0) / derniers.length;
    const noteMoyenne = Math.round((scoreMoyen / 100) * 20 * 10) / 10; // arrondi 1 décimale

    return {
      objectif,
      noteMoyenne,
      atteint: noteMoyenne >= objectif.noteVoulue,
      nombreQuiz,
    };
  });
}
