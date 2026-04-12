import { z } from "zod";

const EntreeHistoriqueSchema = z.object({
  date: z.string(),
  niveau: z.string(),
  matiereSlug: z.string(),
  matiereName: z.string(),
  chapitreSlug: z.string(),
  chapitreNom: z.string(),
  score: z.number().min(0).max(100),
});

export type EntreeHistorique = z.infer<typeof EntreeHistoriqueSchema>;

const HistoriqueSchema = z.array(EntreeHistoriqueSchema);

const HISTORY_KEY = "quiz-history";
const MAX_ENTRIES = 100;

export function getHistorique(): EntreeHistorique[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = HistoriqueSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : [];
  } catch {
    return [];
  }
}

export function ajouterHistorique(entree: EntreeHistorique): void {
  try {
    const history = getHistorique();
    const updated = [entree, ...history].slice(0, MAX_ENTRIES);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  } catch {}
}
