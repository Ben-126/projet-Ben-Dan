import { z } from "zod";

const PARAMETRES_KEY = "quiz-parametres";

export type ObjectifType = "minimum" | "personnalise";
export type NiveauDefaut = "seconde" | "premiere" | "terminale";
export type QuestionsParQuiz = 3 | 5 | 10;

export interface Parametres {
  objectifType: ObjectifType;
  objectifNombre: number;        // 1 à 10
  seuilReussite: number;         // 50 à 100, par pas de 5
  niveauDefaut: NiveauDefaut;
  explicationsAvanceesOuvertes: boolean;
  questionsParQuiz: QuestionsParQuiz;
  notificationsActivees: boolean;
}

const ParametresSchema = z.object({
  objectifType: z.enum(["minimum", "personnalise"]),
  objectifNombre: z.number().int().min(1).max(10),
  seuilReussite: z.number().min(50).max(100),
  niveauDefaut: z.enum(["seconde", "premiere", "terminale"]),
  explicationsAvanceesOuvertes: z.boolean(),
  questionsParQuiz: z.union([z.literal(3), z.literal(5), z.literal(10)]),
  notificationsActivees: z.boolean(),
});

export const PARAMETRES_DEFAUT: Parametres = {
  objectifType: "minimum",
  objectifNombre: 1,
  seuilReussite: 85,
  niveauDefaut: "seconde",
  explicationsAvanceesOuvertes: false,
  questionsParQuiz: 5,
  notificationsActivees: false,
};

export function getParametres(): Parametres {
  if (typeof window === "undefined") return PARAMETRES_DEFAUT;
  try {
    const raw = localStorage.getItem(PARAMETRES_KEY);
    if (!raw) return PARAMETRES_DEFAUT;
    const merged = { ...PARAMETRES_DEFAUT, ...(JSON.parse(raw) as Partial<Parametres>) };
    const parsed = ParametresSchema.safeParse(merged);
    return parsed.success ? parsed.data : PARAMETRES_DEFAUT;
  } catch {
    return PARAMETRES_DEFAUT;
  }
}

export function saveParametres(parametres: Parametres): void {
  try {
    localStorage.setItem(PARAMETRES_KEY, JSON.stringify(parametres));
  } catch {}
}
