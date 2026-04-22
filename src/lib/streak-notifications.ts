import type { ProfilGamification, TypeNotification } from "@/types";

const NOTIF_STORAGE_KEY = "streak-notif-derniere-date";

function getDateAujourdhuiISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function hierISO(aujourd: string): string {
  const d = new Date(aujourd + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
}

export interface NotifStreak {
  type: Extract<TypeNotification, "streak_rappel" | "streak_perdu" | "streak_gel_utilise">;
  message: string;
  detail: string;
}

/**
 * Calcule les notifications streak à afficher selon l'état du profil.
 * À appeler au montage de la page progression.
 */
export function getNotificationsStreak(
  profil: ProfilGamification,
): NotifStreak[] {
  if (typeof window === "undefined") return [];

  const aujourd = getDateAujourdhuiISO();
  const hier    = hierISO(aujourd);
  const notifs: NotifStreak[] = [];

  // Gel utilisé automatiquement aujourd'hui (joursGeles contient hier et le quiz d'aujourd'hui est enregistré)
  if (profil.joursGeles.includes(hier) && profil.dernierQuizDate === aujourd) {
    notifs.push({
      type:    "streak_gel_utilise",
      message: "❄️ Gel utilisé automatiquement !",
      detail:  `Tu avais manqué hier. Un gel a protégé ta série de ${profil.streakJours} jours. Il te reste ${profil.gelsRestants} gel${profil.gelsRestants > 1 ? "s" : ""}.`,
    });
  }

  // Rappel quotidien — n'a pas encore joué aujourd'hui
  if (profil.dernierQuizDate !== aujourd) {
    if (profil.streakJours > 0 && profil.dernierQuizDate === hier) {
      notifs.push({
        type:    "streak_rappel",
        message: `🔥 Maintiens ta série de ${profil.streakJours} jours !`,
        detail:  "Tu n'as pas encore fait de quiz aujourd'hui. Joue avant minuit pour ne pas perdre ta série.",
      });
    } else if (profil.streakJours > 0 && profil.dernierQuizDate !== hier) {
      notifs.push({
        type:    "streak_perdu",
        message: "💔 Ta série est en danger !",
        detail:  `Tu n'as pas joué hier ni aujourd'hui. ${profil.gelsRestants > 0 ? `Il te reste ${profil.gelsRestants} gel${profil.gelsRestants > 1 ? "s" : ""} pour la prochaine fois.` : "Tu n'as plus de gels ce mois-ci."}`,
      });
    }
  }

  return notifs;
}

/**
 * Marque les notifications streak comme lues pour aujourd'hui.
 */
export function marquerNotifsStreakLues(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(NOTIF_STORAGE_KEY, getDateAujourdhuiISO());
}

/**
 * Retourne true si les notifications ont déjà été affichées aujourd'hui.
 */
export function notifsStreakDejaMontrees(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(NOTIF_STORAGE_KEY) === getDateAujourdhuiISO();
}
