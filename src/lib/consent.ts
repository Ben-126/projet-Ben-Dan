/**
 * Gestion centralisée du consentement RGPD.
 * Toutes les clés localStorage non-essentielles passent par ce module.
 */

export const CONSENT_KEY = "cookie-consent";
export const CONSENT_VERSION = "1.1";

export type ConsentValue = "accepted" | "refused" | null;

export interface ConsentRecord {
  value: ConsentValue;
  timestamp: string;   // ISO 8601
  version: string;     // version de la politique au moment du choix
}

/**
 * Parse la valeur brute stockée — supporte l'ancien format (chaîne simple)
 * et le nouveau format (objet JSON enrichi).
 */
function parseConsentRaw(raw: string | null): ConsentRecord | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<ConsentRecord>;
    if (parsed.value === "accepted" || parsed.value === "refused") {
      return {
        value: parsed.value,
        timestamp: parsed.timestamp ?? new Date(0).toISOString(),
        version: parsed.version ?? "1.0",
      };
    }
  } catch {
    // Ancien format : chaîne simple
    if (raw === "accepted" || raw === "refused") {
      return { value: raw, timestamp: new Date(0).toISOString(), version: "1.0" };
    }
  }
  return null;
}

/** Retourne l'enregistrement complet du consentement (avec preuve) */
export function getConsentRecord(): ConsentRecord | null {
  if (typeof window === "undefined") return null;
  return parseConsentRaw(localStorage.getItem(CONSENT_KEY));
}

/** Retourne uniquement la valeur du consentement */
export function getConsentement(): ConsentValue {
  return getConsentRecord()?.value ?? null;
}

/** Retourne true si l'utilisateur a explicitement accepté */
export function aAccepte(): boolean {
  return getConsentement() === "accepted";
}

/** Enregistre le consentement avec timestamp et version */
export function enregistrerConsentement(value: "accepted" | "refused"): void {
  if (typeof window === "undefined") return;
  const record: ConsentRecord = {
    value,
    timestamp: new Date().toISOString(),
    version: CONSENT_VERSION,
  };
  localStorage.setItem(CONSENT_KEY, JSON.stringify(record));
}

/**
 * Clés localStorage considérées comme NON-ESSENTIELLES.
 * Supprimées si l'utilisateur refuse le consentement
 * ou supprime son compte.
 */
export const CLES_NON_ESSENTIELLES = [
  "quiz-history",
  "quiz-performances",
  "gamification-profil",
  "objectifs-personnalises",
  "sync-queue",
  "quiz-notif-storage-key",
  "revision-espacee",
  "streak-notif-derniere-date",
  "audio-groq-consent",   // consentement spécifique envoi audio vers Groq (USA)
] as const;

/**
 * Clés ESSENTIELLES (session, préférences utilisateur explicites).
 * Conservées même si l'utilisateur refuse.
 */
export const CLES_ESSENTIELLES = [
  CONSENT_KEY,
  "quiz-parametres",
] as const;

/** Supprime toutes les données non-essentielles du localStorage */
export function effacerDonneesNonEssentielles(): void {
  if (typeof window === "undefined") return;
  for (const cle of CLES_NON_ESSENTIELLES) {
    localStorage.removeItem(cle);
  }
}

/** Supprime TOUTES les données Révioria du localStorage (utilisé à la suppression de compte) */
export function effacerToutesLesDonnees(): void {
  if (typeof window === "undefined") return;
  for (const cle of CLES_NON_ESSENTIELLES) {
    localStorage.removeItem(cle);
  }
  for (const cle of CLES_ESSENTIELLES) {
    localStorage.removeItem(cle);
  }
}
