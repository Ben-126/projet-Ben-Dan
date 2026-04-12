import { z } from "zod";
import { ajouterHistorique } from "./history";

export type NiveauDifficulte = "debutant" | "intermediaire" | "avance";

export interface PerformanceChapitre {
  nombreQuizCompletes: number;
  scoreMoyen: number; // pourcentage 0-100
  derniersScores: number[]; // jusqu'à 5 derniers pourcentages
  dernieresErreurs: string[]; // questions du dernier quiz non réussies
}

const PerformanceChapitreSchema = z.object({
  nombreQuizCompletes: z.number().int().min(0),
  scoreMoyen: z.number().min(0).max(100),
  derniersScores: z.array(z.number().min(0).max(100)),
  dernieresErreurs: z.array(z.string()),
});

const StorageSchema = z.record(PerformanceChapitreSchema);

const STORAGE_KEY = "quiz-performances";
const MAX_SCORES = 5;

function getStorage(): Record<string, PerformanceChapitre> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = StorageSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : {};
  } catch {
    return {};
  }
}

function saveStorage(data: Record<string, PerformanceChapitre>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // localStorage indisponible (ex: mode privé saturé)
  }
}

function clePerformance(matiereSlug: string, chapitreSlug: string): string {
  return `${matiereSlug}/${chapitreSlug}`;
}

export function getPerformance(
  matiereSlug: string,
  chapitreSlug: string
): PerformanceChapitre | null {
  const data = getStorage();
  return data[clePerformance(matiereSlug, chapitreSlug)] ?? null;
}

export function getToutesPerformances(): Record<string, PerformanceChapitre> {
  return getStorage();
}

export function sauvegarderPerformance(
  matiereSlug: string,
  chapitreSlug: string,
  scorePourcentage: number,
  questionsRatees: string[],
  meta?: { niveau: string; matiereName: string; chapitreNom: string }
): void {
  const data = getStorage();
  const cle = clePerformance(matiereSlug, chapitreSlug);
  const existant = data[cle];

  const derniersScores = existant
    ? [...existant.derniersScores.slice(-(MAX_SCORES - 1)), scorePourcentage]
    : [scorePourcentage];

  const scoreMoyen = Math.round(
    derniersScores.reduce((a, b) => a + b, 0) / derniersScores.length
  );

  data[cle] = {
    nombreQuizCompletes: (existant?.nombreQuizCompletes ?? 0) + 1,
    scoreMoyen,
    derniersScores,
    dernieresErreurs: questionsRatees,
  };

  saveStorage(data);

  if (meta) {
    ajouterHistorique({
      date: new Date().toISOString(),
      niveau: meta.niveau,
      matiereSlug,
      matiereName: meta.matiereName,
      chapitreSlug,
      chapitreNom: meta.chapitreNom,
      score: scorePourcentage,
    });
  }
}

export function getNiveau(performance: PerformanceChapitre | null): NiveauDifficulte {
  if (!performance || performance.nombreQuizCompletes === 0) return "intermediaire";
  if (performance.scoreMoyen >= 80) return "avance";
  if (performance.scoreMoyen >= 40) return "intermediaire";
  return "debutant";
}
