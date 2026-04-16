# Gamification — XP, Niveaux & Badges — Plan d'implémentation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ajouter XP, niveaux et badges à l'app de révision pour motiver les lycéens, stocké en localStorage, visible dans le header et la page Progression.

**Architecture:** La logique métier est centralisée dans `src/lib/gamification.ts` (pattern identique à `history.ts` / `performance.ts`). `QuizRunner` appelle `enregistrerQuizGamification` après chaque quiz et stocke le résultat en state, qu'il passe à `ScoreDisplay` pour afficher le toast. Le header et la page Progression lisent le profil indépendamment.

**Tech Stack:** Next.js 15, React, TypeScript, Tailwind CSS, Zod, localStorage

---

## Fichiers créés / modifiés

| Action | Fichier | Rôle |
|---|---|---|
| Modifié | `src/types/index.ts` | Ajout types gamification |
| Créé | `src/lib/gamification.ts` | Logique XP, niveaux, badges, localStorage |
| Créé | `src/components/gamification/XPToast.tsx` | Toast "+XX XP" après quiz |
| Créé | `src/components/gamification/XPBar.tsx` | Barre XP discrète dans le header |
| Créé | `src/components/gamification/BadgeGrid.tsx` | Grille badges pour Progression |
| Modifié | `src/components/quiz/QuizRunner.tsx` | Appel gamification + state résultat |
| Modifié | `src/components/quiz/ScoreDisplay.tsx` | Affichage XPToast via prop |
| Modifié | `src/components/navigation/Header.tsx` | Intégration XPBar |
| Modifié | `src/app/progression/page.tsx` | Section niveau + badges |

---

## Task 1 : Types gamification

**Files:**
- Modify: `src/types/index.ts`

- [ ] **Step 1 : Ajouter les types à la fin de `src/types/index.ts`**

```typescript
export interface BadgeDebloque {
  id: string;
  dateObtention: string; // "YYYY-MM-DD"
}

export interface ProfilGamification {
  xpTotal: number;
  dernierQuizDate: string | null; // "YYYY-MM-DD"
  streakJours: number;
  badgesDebloques: BadgeDebloque[];
  xpDuJour: number;          // XP cumulés aujourd'hui (plafond 150)
  quizXpDuJour: string[];    // "matiereSlug/chapitreSlug" ayant déjà rapporté XP aujourd'hui
}

export interface ResultatGamification {
  xpGagne: number;
  nouveauNiveau: number | null; // numéro du nouveau niveau, null si pas de level-up
  nouveauxBadges: string[];     // IDs des badges débloqués
  xpTotal: number;
  niveauActuel: number;
}
```

- [ ] **Step 2 : Commit**

```bash
git add src/types/index.ts
git commit -m "feat(gamification): types ProfilGamification, ResultatGamification"
```

---

## Task 2 : Logique métier — `src/lib/gamification.ts`

**Files:**
- Create: `src/lib/gamification.ts`

- [ ] **Step 1 : Créer `src/lib/gamification.ts` avec le contenu complet**

```typescript
import { z } from "zod";
import { getToutesPerformances } from "./performance";
import { getHistorique } from "./history";
import type { ProfilGamification, BadgeDebloque, ResultatGamification } from "@/types";

// ─── Constantes niveaux ────────────────────────────────────────────────────────

export interface NiveauGamification {
  numero: number;
  nom: string;
  emoji: string;
  xpRequis: number;
}

export const NIVEAUX_GAMIFICATION: NiveauGamification[] = [
  { numero: 1,  nom: "Novice",    emoji: "🌱", xpRequis: 0    },
  { numero: 2,  nom: "Apprenti",  emoji: "📖", xpRequis: 100  },
  { numero: 3,  nom: "Étudiant",  emoji: "🎒", xpRequis: 250  },
  { numero: 4,  nom: "Appliqué",  emoji: "✏️", xpRequis: 500  },
  { numero: 5,  nom: "Studieux",  emoji: "📚", xpRequis: 900  },
  { numero: 6,  nom: "Brillant",  emoji: "💡", xpRequis: 1400 },
  { numero: 7,  nom: "Expert",    emoji: "🎯", xpRequis: 2100 },
  { numero: 8,  nom: "Savant",    emoji: "🔬", xpRequis: 3000 },
  { numero: 9,  nom: "Génie",     emoji: "🧠", xpRequis: 4500 },
  { numero: 10, nom: "Maître",    emoji: "🏆", xpRequis: 7000 },
];

// ─── Constantes badges ─────────────────────────────────────────────────────────

export interface BadgeInfo {
  id: string;
  nom: string;
  description: string;
  emoji: string;
}

export const BADGES_GENERAUX: BadgeInfo[] = [
  { id: "premier-pas",      nom: "Premier Pas",        description: "Terminer son 1er quiz",           emoji: "🎯"  },
  { id: "dizaine",          nom: "Décuplé",             description: "Compléter 10 quiz",               emoji: "🔟"  },
  { id: "cinquantaine",     nom: "Centurion",           description: "Compléter 50 quiz",               emoji: "🏅"  },
  { id: "score-parfait",    nom: "Score Parfait",       description: "Obtenir 100% une fois",           emoji: "⭐"  },
  { id: "perfectionniste",  nom: "Perfectionniste",     description: "Obtenir 3 scores parfaits",       emoji: "💎"  },
  { id: "serie-3",          nom: "Série ×3",            description: "Jouer 3 jours de suite",          emoji: "🔥"  },
  { id: "serie-7",          nom: "Série ×7",            description: "Jouer 7 jours de suite",          emoji: "🔥🔥"},
  { id: "assidu",           nom: "Assidu",              description: "Jouer 30 jours de suite",         emoji: "🏆"  },
  { id: "niveau-5",         nom: "Studieux Confirmé",   description: "Atteindre le niveau Studieux",    emoji: "🌟"  },
];

export function getBadgesMatiere(matiereSlug: string, matiereNom: string): BadgeInfo[] {
  return [
    { id: `apprenti-${matiereSlug}`, nom: `Apprenti ${matiereNom}`,  description: `Terminer 3 quiz en ${matiereNom}`,                   emoji: "📚" },
    { id: `expert-${matiereSlug}`,   nom: `Expert ${matiereNom}`,    description: `Score moyen ≥ 80 % sur 5+ quiz en ${matiereNom}`,    emoji: "🎓" },
    { id: `as-${matiereSlug}`,       nom: `As de ${matiereNom}`,     description: `Obtenir 100 % en ${matiereNom}`,                     emoji: "💫" },
  ];
}

// ─── Schema Zod ────────────────────────────────────────────────────────────────

const BadgeDebloqueSchema = z.object({
  id: z.string(),
  dateObtention: z.string(),
});

const ProfilGamificationSchema = z.object({
  xpTotal:          z.number().int().min(0),
  dernierQuizDate:  z.string().nullable(),
  streakJours:      z.number().int().min(0),
  badgesDebloques:  z.array(BadgeDebloqueSchema),
  xpDuJour:         z.number().int().min(0),
  quizXpDuJour:     z.array(z.string()),
});

const PROFIL_DEFAULT: ProfilGamification = {
  xpTotal: 0,
  dernierQuizDate: null,
  streakJours: 0,
  badgesDebloques: [],
  xpDuJour: 0,
  quizXpDuJour: [],
};

const STORAGE_KEY = "gamification-profil";
const PLAFOND_XP_JOUR = 150;

// ─── Storage ───────────────────────────────────────────────────────────────────

export function getProfilGamification(): ProfilGamification {
  if (typeof window === "undefined") return { ...PROFIL_DEFAULT };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...PROFIL_DEFAULT };
    const parsed = ProfilGamificationSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : { ...PROFIL_DEFAULT };
  } catch {
    return { ...PROFIL_DEFAULT };
  }
}

function saveProfilGamification(profil: ProfilGamification): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profil));
  } catch {}
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

function getDateAujourdhuiISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function hierISO(aujourd: string): string {
  const d = new Date(aujourd);
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

// ─── Niveaux ───────────────────────────────────────────────────────────────────

export function getNiveauFromXP(xp: number): NiveauGamification {
  for (let i = NIVEAUX_GAMIFICATION.length - 1; i >= 0; i--) {
    if (xp >= NIVEAUX_GAMIFICATION[i].xpRequis) return NIVEAUX_GAMIFICATION[i];
  }
  return NIVEAUX_GAMIFICATION[0];
}

export function getProgressionNiveau(xp: number): {
  xpDansNiveau: number;
  xpPourMonter: number;
  pourcentage: number;
} {
  const niveau = getNiveauFromXP(xp);
  const index = NIVEAUX_GAMIFICATION.findIndex((n) => n.numero === niveau.numero);

  if (index === NIVEAUX_GAMIFICATION.length - 1) {
    return { xpDansNiveau: xp - niveau.xpRequis, xpPourMonter: 0, pourcentage: 100 };
  }

  const suivant = NIVEAUX_GAMIFICATION[index + 1];
  const xpDansNiveau = xp - niveau.xpRequis;
  const xpPourMonter = suivant.xpRequis - niveau.xpRequis;
  return {
    xpDansNiveau,
    xpPourMonter,
    pourcentage: Math.round((xpDansNiveau / xpPourMonter) * 100),
  };
}

// ─── Calcul XP ─────────────────────────────────────────────────────────────────

function calculerXPBrut(
  scorePourcentage: number,
  modeControle: boolean,
  streakActif: boolean,
): number {
  const base = 10;
  const bonusScore   = Math.floor(scorePourcentage / 10);       // 0–10
  const bonusParfait = scorePourcentage === 100 ? 15 : 0;
  const bonusStreak  = streakActif ? 5 : 0;
  const brut = base + bonusScore + bonusParfait + bonusStreak;
  return modeControle ? Math.floor(brut * 1.5) : brut;
}

// ─── Streak ────────────────────────────────────────────────────────────────────

function mettreAJourStreak(profil: ProfilGamification, aujourd: string): number {
  if (!profil.dernierQuizDate) return 1;
  if (profil.dernierQuizDate === aujourd) return profil.streakJours;   // même jour
  if (profil.dernierQuizDate === hierISO(aujourd)) return profil.streakJours + 1; // lendemain
  return 1; // cassé
}

// ─── Badges ────────────────────────────────────────────────────────────────────

function verifierNouveauxBadges(
  profil: ProfilGamification,
  matiereSlug: string,
  nouveauXPTotal: number,
): string[] {
  const deja = new Set(profil.badgesDebloques.map((b) => b.id));
  const nouveaux: string[] = [];

  const performances = getToutesPerformances();
  const historique   = getHistorique();

  const totalQuiz = Object.values(performances).reduce(
    (sum, p) => sum + p.nombreQuizCompletes, 0,
  );
  const scoreParfaitCount = historique.filter((e) => e.score === 100).length;
  const niveauActuel      = getNiveauFromXP(nouveauXPTotal);

  // Badges généraux
  const check = (id: string, cond: boolean) => { if (!deja.has(id) && cond) nouveaux.push(id); };
  check("premier-pas",     totalQuiz >= 1);
  check("dizaine",         totalQuiz >= 10);
  check("cinquantaine",    totalQuiz >= 50);
  check("score-parfait",   scoreParfaitCount >= 1);
  check("perfectionniste", scoreParfaitCount >= 3);
  check("serie-3",         profil.streakJours >= 3);
  check("serie-7",         profil.streakJours >= 7);
  check("assidu",          profil.streakJours >= 30);
  check("niveau-5",        niveauActuel.numero >= 5);

  // Badges matière
  const quizMat = Object.entries(performances)
    .filter(([cle]) => cle.startsWith(`${matiereSlug}/`));
  const totalQuizMat = quizMat.reduce((sum, [, p]) => sum + p.nombreQuizCompletes, 0);
  const scoreMoyenMat = totalQuizMat > 0
    ? Math.round(quizMat.reduce((sum, [, p]) => sum + p.scoreMoyen * p.nombreQuizCompletes, 0) / totalQuizMat)
    : 0;
  const aParfaitMat = historique.some(
    (e) => e.matiereSlug === matiereSlug && e.score === 100,
  );

  check(`apprenti-${matiereSlug}`, totalQuizMat >= 3);
  check(`expert-${matiereSlug}`,   totalQuizMat >= 5 && scoreMoyenMat >= 80);
  check(`as-${matiereSlug}`,       aParfaitMat);

  return nouveaux;
}

// ─── Entrée principale ─────────────────────────────────────────────────────────

export function enregistrerQuizGamification(params: {
  matiereSlug: string;
  chapitreSlug: string;
  scorePourcentage: number;
  modeControle: boolean;
}): ResultatGamification {
  if (typeof window === "undefined") {
    return { xpGagne: 0, nouveauNiveau: null, nouveauxBadges: [], xpTotal: 0, niveauActuel: 1 };
  }

  const { matiereSlug, chapitreSlug, scorePourcentage, modeControle } = params;
  const profil   = getProfilGamification();
  const aujourd  = getDateAujourdhuiISO();
  const cleQuiz  = `${matiereSlug}/${chapitreSlug}`;

  // Streak
  const nouveauStreak = mettreAJourStreak(profil, aujourd);
  const streakActif   = profil.dernierQuizDate === hierISO(aujourd); // bonus XP si nouvel jour avec streak

  // Reset quotidien si nouveau jour
  const estNouveauJour   = profil.dernierQuizDate !== aujourd;
  const quizXpDuJour     = estNouveauJour ? [] : profil.quizXpDuJour;
  const xpDuJour         = estNouveauJour ? 0  : profil.xpDuJour;

  // Déduplication et plafond
  const dejaGagneXP   = quizXpDuJour.includes(cleQuiz);
  const plafondAtteint = xpDuJour >= PLAFOND_XP_JOUR;

  let xpGagne           = 0;
  let quizXpDuJourFinal = quizXpDuJour;
  let xpDuJourFinal     = xpDuJour;

  if (!dejaGagneXP && !plafondAtteint) {
    const xpCalcule  = calculerXPBrut(scorePourcentage, modeControle, streakActif);
    xpGagne          = Math.min(xpCalcule, PLAFOND_XP_JOUR - xpDuJour);
    quizXpDuJourFinal = [...quizXpDuJour, cleQuiz];
    xpDuJourFinal    = xpDuJour + xpGagne;
  }

  const ancienNiveau   = getNiveauFromXP(profil.xpTotal).numero;
  const nouveauXPTotal = profil.xpTotal + xpGagne;
  const niveauApres    = getNiveauFromXP(nouveauXPTotal);
  const levelUp        = niveauApres.numero > ancienNiveau ? niveauApres.numero : null;

  // Profil intermédiaire (streak à jour) pour la vérification des badges
  const profilInter: ProfilGamification = {
    ...profil,
    xpTotal:       nouveauXPTotal,
    dernierQuizDate: aujourd,
    streakJours:   nouveauStreak,
    xpDuJour:      xpDuJourFinal,
    quizXpDuJour:  quizXpDuJourFinal,
  };

  const nouveauxBadgeIds = verifierNouveauxBadges(profilInter, matiereSlug, nouveauXPTotal);
  const nouveauxBadges: BadgeDebloque[] = nouveauxBadgeIds.map((id) => ({
    id,
    dateObtention: aujourd,
  }));

  saveProfilGamification({
    ...profilInter,
    badgesDebloques: [...profil.badgesDebloques, ...nouveauxBadges],
  });

  return {
    xpGagne,
    nouveauNiveau: levelUp,
    nouveauxBadges: nouveauxBadgeIds,
    xpTotal:       nouveauXPTotal,
    niveauActuel:  niveauApres.numero,
  };
}
```

- [ ] **Step 2 : Commit**

```bash
git add src/lib/gamification.ts
git commit -m "feat(gamification): logique XP, niveaux, badges, localStorage"
```

---

## Task 3 : XPToast — notification après quiz

**Files:**
- Create: `src/components/gamification/XPToast.tsx`

- [ ] **Step 1 : Créer `src/components/gamification/XPToast.tsx`**

```tsx
"use client";
import { useEffect, useState } from "react";
import type { ResultatGamification } from "@/types";
import { NIVEAUX_GAMIFICATION, BADGES_GENERAUX, getBadgesMatiere } from "@/lib/gamification";
import { NIVEAUX } from "@/data/programmes";

interface XPToastProps {
  resultat: ResultatGamification;
  matiereSlug: string;
}

function getBadgeNom(id: string, matiereSlug: string): string {
  const general = BADGES_GENERAUX.find((b) => b.id === id);
  if (general) return general.nom;
  // Chercher dans les badges matière de toutes les matières
  const toutesMatières = NIVEAUX.flatMap((n) => n.matieres);
  for (const mat of toutesMatières) {
    const badges = getBadgesMatiere(mat.slug, mat.nom);
    const found = badges.find((b) => b.id === id);
    if (found) return found.nom;
  }
  return id;
}

export default function XPToast({ resultat, matiereSlug }: XPToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  if (!visible || resultat.xpGagne === 0) return null;

  const niveauInfo = NIVEAUX_GAMIFICATION.find((n) => n.numero === resultat.niveauActuel);

  return (
    <div
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-1.5 animate-bounce-once"
      role="status"
      aria-live="polite"
    >
      {/* XP principal */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-2xl shadow-lg font-bold text-base">
        <span>⚡</span>
        <span>+{resultat.xpGagne} XP</span>
      </div>

      {/* Level-up */}
      {resultat.nouveauNiveau !== null && niveauInfo && (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-400 text-yellow-900 rounded-xl shadow-md font-semibold text-sm">
          <span>{niveauInfo.emoji}</span>
          <span>Niveau {resultat.nouveauNiveau} — {niveauInfo.nom} !</span>
        </div>
      )}

      {/* Badges */}
      {resultat.nouveauxBadges.slice(0, 2).map((id) => (
        <div
          key={id}
          className="flex items-center gap-2 px-3 py-1.5 bg-white border-2 border-indigo-200 text-indigo-700 rounded-xl shadow-sm font-medium text-sm"
        >
          <span>🏅</span>
          <span>Badge : {getBadgeNom(id, matiereSlug)}</span>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 2 : Ajouter l'animation dans `tailwind.config.ts` (ou dans le CSS global si pas de config Tailwind custom)**

Ouvrir `tailwind.config.ts`. S'il existe, ajouter dans `theme.extend`:
```typescript
animation: {
  "bounce-once": "bounceIn 0.4s ease-out",
},
keyframes: {
  bounceIn: {
    "0%":   { opacity: "0", transform: "translateX(-50%) translateY(-10px)" },
    "60%":  { opacity: "1", transform: "translateX(-50%) translateY(4px)" },
    "100%": { transform: "translateX(-50%) translateY(0)" },
  },
},
```

Si `tailwind.config.ts` n'existe pas, chercher `tailwind.config.js`. Si aucun fichier de config custom n'est présent, ajouter dans `src/app/globals.css` :
```css
@keyframes bounceIn {
  0%   { opacity: 0; transform: translateX(-50%) translateY(-10px); }
  60%  { opacity: 1; transform: translateX(-50%) translateY(4px); }
  100% { transform: translateX(-50%) translateY(0); }
}
.animate-bounce-once {
  animation: bounceIn 0.4s ease-out forwards;
}
```

- [ ] **Step 3 : Commit**

```bash
git add src/components/gamification/XPToast.tsx
git commit -m "feat(gamification): composant XPToast notification post-quiz"
```

---

## Task 4 : XPBar — barre discrète dans le header

**Files:**
- Create: `src/components/gamification/XPBar.tsx`

- [ ] **Step 1 : Créer `src/components/gamification/XPBar.tsx`**

```tsx
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getProfilGamification,
  getNiveauFromXP,
  getProgressionNiveau,
} from "@/lib/gamification";

export default function XPBar() {
  const [xpTotal, setXpTotal] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const profil = getProfilGamification();
    setXpTotal(profil.xpTotal);
    setMounted(true);
  }, []);

  if (!mounted || xpTotal === 0) return null;

  const niveau      = getNiveauFromXP(xpTotal);
  const progression = getProgressionNiveau(xpTotal);

  return (
    <Link
      href="/progression"
      className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-indigo-50 transition-colors group"
      title={`Niveau ${niveau.numero} — ${niveau.nom} · ${xpTotal} XP`}
    >
      <span className="text-sm">{niveau.emoji}</span>
      <div className="hidden sm:flex flex-col gap-0.5 min-w-[80px]">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-indigo-700 leading-none">
            Niv. {niveau.numero}
          </span>
          <span className="text-xs text-indigo-400 leading-none">{xpTotal} XP</span>
        </div>
        <div className="w-full h-1.5 bg-indigo-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-500 rounded-full transition-all duration-500"
            style={{ width: `${progression.pourcentage}%` }}
          />
        </div>
      </div>
    </Link>
  );
}
```

- [ ] **Step 2 : Commit**

```bash
git add src/components/gamification/XPBar.tsx
git commit -m "feat(gamification): composant XPBar pour le header"
```

---

## Task 5 : BadgeGrid — grille de badges

**Files:**
- Create: `src/components/gamification/BadgeGrid.tsx`

- [ ] **Step 1 : Créer `src/components/gamification/BadgeGrid.tsx`**

```tsx
import type { BadgeDebloque } from "@/types";
import type { BadgeInfo } from "@/lib/gamification";

interface BadgeGridProps {
  allBadges: BadgeInfo[];
  debloques: BadgeDebloque[];
}

export default function BadgeGrid({ allBadges, debloques }: BadgeGridProps) {
  const debloquesSet = new Set(debloques.map((b) => b.id));

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
      {allBadges.map((badge) => {
        const debloque = debloquesSet.has(badge.id);
        return (
          <div
            key={badge.id}
            className={`flex flex-col items-center gap-1 p-3 rounded-xl border text-center transition-all ${
              debloque
                ? "bg-indigo-50 border-indigo-200 shadow-sm"
                : "bg-gray-50 border-gray-100 opacity-40 grayscale"
            }`}
            title={debloque ? badge.description : `🔒 ${badge.description}`}
          >
            <span className="text-2xl">{debloque ? badge.emoji : "🔒"}</span>
            <span className={`text-xs font-medium leading-tight ${debloque ? "text-indigo-800" : "text-gray-500"}`}>
              {badge.nom}
            </span>
          </div>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 2 : Commit**

```bash
git add src/components/gamification/BadgeGrid.tsx
git commit -m "feat(gamification): composant BadgeGrid"
```

---

## Task 6 : Intégration dans QuizRunner

**Files:**
- Modify: `src/components/quiz/QuizRunner.tsx`

- [ ] **Step 1 : Ajouter import et state dans `QuizRunner.tsx`**

En haut du fichier, après les imports existants, ajouter :
```typescript
import { enregistrerQuizGamification } from "@/lib/gamification";
import type { ResultatGamification } from "@/types";
```

Dans le composant `QuizRunner`, ajouter le state après les autres `useState` :
```typescript
const [resultatGamification, setResultatGamification] = useState<ResultatGamification | null>(null);
```

- [ ] **Step 2 : Appeler `enregistrerQuizGamification` dans `handleTerminer`**

Localiser la fonction `handleTerminer` (ligne ~146). Juste après l'appel à `sauvegarderPerformance`, ajouter :

```typescript
const resultatGami = enregistrerQuizGamification({
  matiereSlug,
  chapitreSlug,
  scorePourcentage: pourcentage,
  modeControle: modeQuiz === "controle",
});
setResultatGamification(resultatGami);
```

Résultat final de `handleTerminer` :
```typescript
const handleTerminer = useCallback((reponsesFinales: ReponseUtilisateur[]) => {
  const totalPoints = reponsesFinales.reduce((sum, r) => sum + r.pointsObtenus, 0);
  const maxPoints = questions.length * 100;
  const pourcentage = Math.round((totalPoints / maxPoints) * 100);
  const ratees = reponsesFinales
    .filter((r) => !r.correcte)
    .map((r) => questions[r.questionIndex]?.question ?? "")
    .filter(Boolean);

  sauvegarderPerformance(matiereSlug, chapitreSlug, pourcentage, ratees, {
    niveau: niveauLycee,
    matiereName,
    chapitreNom: titreChapitre,
  });

  const resultatGami = enregistrerQuizGamification({
    matiereSlug,
    chapitreSlug,
    scorePourcentage: pourcentage,
    modeControle: modeQuiz === "controle",
  });
  setResultatGamification(resultatGami);

  setEtat("termine");
}, [questions, matiereSlug, chapitreSlug, niveauLycee, matiereName, titreChapitre, modeQuiz]);
```

- [ ] **Step 3 : Passer `resultatGamification` à `ScoreDisplay`**

Localiser le rendu de `ScoreDisplay` (ligne ~348 dans QuizRunner). Il ressemble à :
```tsx
<ScoreDisplay
  score={score}
  maxScore={maxScore}
  matiereSlug={matiereSlug}
  ...
/>
```

Ajouter **uniquement** la prop `resultatGamification` :
```tsx
<ScoreDisplay
  score={score}
  maxScore={maxScore}
  matiereSlug={matiereSlug}
  chapitreSlug={chapitreSlug}
  niveauLycee={niveauLycee}
  questionsRatees={questionsRateesQuiz}
  modeRevision={modeRevision.actif}
  competences={competences}
  modeControle={modeQuiz === "controle"}
  questions={questions}
  reponses={reponses}
  resultatGamification={resultatGamification}
  onRecommencer={() => {
    if (modeQuiz === "controle") {
      setModeRevision({ actif: false, questionsRatees: [] });
      chargerQuiz(undefined, "controle");
    } else {
      setModeRevision({ actif: false, questionsRatees: [] });
      chargerQuiz();
    }
  }}
  onChoisirMode={() => { setEtat("selection_mode"); }}
  onReviserErreurs={modeQuiz === "entrainement" && questionsRateesQuiz.length > 0 ? handleReviserErreurs : undefined}
/>
```

- [ ] **Step 4 : Commit**

```bash
git add src/components/quiz/QuizRunner.tsx
git commit -m "feat(gamification): QuizRunner appelle enregistrerQuizGamification"
```

---

## Task 7 : Intégration dans ScoreDisplay

**Files:**
- Modify: `src/components/quiz/ScoreDisplay.tsx`

- [ ] **Step 1 : Ajouter l'import XPToast et le prop dans `ScoreDisplay.tsx`**

En haut du fichier, ajouter :
```typescript
import XPToast from "@/components/gamification/XPToast";
import type { ResultatGamification } from "@/types";
```

Dans `ScoreDisplayProps`, ajouter :
```typescript
resultatGamification?: ResultatGamification | null;
```

Dans la déstructuration des props :
```typescript
{ ..., resultatGamification = null }: ScoreDisplayProps
```

- [ ] **Step 2 : Rendre le XPToast en haut du return**

Dans le JSX de `ScoreDisplay`, ajouter juste avant le `<div className="text-center ...">` principal :
```tsx
{resultatGamification && resultatGamification.xpGagne > 0 && (
  <XPToast resultat={resultatGamification} matiereSlug={matiereSlug} />
)}
```

- [ ] **Step 3 : Commit**

```bash
git add src/components/quiz/ScoreDisplay.tsx
git commit -m "feat(gamification): ScoreDisplay affiche XPToast"
```

---

## Task 8 : Intégration dans Header

**Files:**
- Modify: `src/components/navigation/Header.tsx`

- [ ] **Step 1 : Ajouter XPBar dans `Header.tsx`**

En haut du fichier, ajouter :
```typescript
import XPBar from "@/components/gamification/XPBar";
```

Dans le JSX, à l'intérieur de `<div className="ml-auto flex items-center gap-1">`, ajouter `<XPBar />` **avant** le lien Progression :

```tsx
<div className="ml-auto flex items-center gap-1">
  <XPBar />
  <Link
    href="/progression"
    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-indigo-600 hover:bg-indigo-50 transition-colors"
  >
    <span>📊</span>
    <span className="hidden sm:inline">Progression</span>
  </Link>
  <Link
    href="/parametres"
    aria-label="Paramètres"
    className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
  >
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  </Link>
</div>
```

- [ ] **Step 2 : Commit**

```bash
git add src/components/navigation/Header.tsx
git commit -m "feat(gamification): XPBar discrète dans le header"
```

---

## Task 9 : Intégration dans la page Progression

**Files:**
- Modify: `src/app/progression/page.tsx`

- [ ] **Step 1 : Ajouter les imports**

En haut de `src/app/progression/page.tsx`, ajouter :
```typescript
import BadgeGrid from "@/components/gamification/BadgeGrid";
import {
  getProfilGamification,
  getNiveauFromXP,
  getProgressionNiveau,
  BADGES_GENERAUX,
  getBadgesMatiere,
} from "@/lib/gamification";
import type { ProfilGamification } from "@/types";
```

- [ ] **Step 2 : Ajouter le state profil dans le composant**

Dans `ProgressionPage`, après les autres `useState`, ajouter :
```typescript
const [profilGami, setProfilGami] = useState<ProfilGamification | null>(null);
```

Dans le `useEffect` qui charge les données (celui avec `setHistorique`, `setPerformances`, `setMounted`), ajouter :
```typescript
setProfilGami(getProfilGamification());
```

- [ ] **Step 3 : Construire la liste complète des badges**

Après les useMemo existants, ajouter :
```typescript
const tousLesBadges = useMemo(() => {
  const matieres = NIVEAUX.flatMap((n) => n.matieres);
  const badgesMatiere = matieres.flatMap((m) => getBadgesMatiere(m.slug, m.nom));
  return [...BADGES_GENERAUX, ...badgesMatiere];
}, []);
```

- [ ] **Step 4 : Ajouter la section gamification dans le JSX**

Dans le `return` principal, après la section `{totalQuiz > 0 && (...)}` des stats globales (le bloc `bg-gradient-to-r from-indigo-50...`), ajouter un nouveau bloc :

```tsx
{profilGami && profilGami.xpTotal > 0 && (() => {
  const niveau      = getNiveauFromXP(profilGami.xpTotal);
  const progression = getProgressionNiveau(profilGami.xpTotal);
  return (
    <div className="bg-white rounded-2xl border border-indigo-100 shadow-sm p-5 space-y-4">
      {/* Niveau actuel */}
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-center justify-center w-16 h-16 rounded-2xl bg-indigo-50 border-2 border-indigo-200 shrink-0">
          <span className="text-2xl">{niveau.emoji}</span>
          <span className="text-xs font-bold text-indigo-600">Niv. {niveau.numero}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 mb-1">
            <p className="text-lg font-bold text-gray-800">{niveau.nom}</p>
            <p className="text-sm text-indigo-500 font-medium">{profilGami.xpTotal} XP</p>
          </div>
          {progression.xpPourMonter > 0 ? (
            <>
              <div className="w-full h-2.5 bg-indigo-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 rounded-full transition-all duration-700"
                  style={{ width: `${progression.pourcentage}%` }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {progression.xpDansNiveau} / {progression.xpPourMonter} XP pour le niveau suivant
              </p>
            </>
          ) : (
            <p className="text-xs text-yellow-600 font-semibold mt-1">Niveau maximum atteint !</p>
          )}
        </div>
      </div>

      {/* Streak */}
      {profilGami.streakJours > 0 && (
        <div className="flex items-center gap-2 text-sm text-orange-600 font-medium">
          <span>🔥</span>
          <span>Série de {profilGami.streakJours} jour{profilGami.streakJours > 1 ? "s" : ""} consécutif{profilGami.streakJours > 1 ? "s" : ""}</span>
        </div>
      )}

      {/* Badges */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Badges — {profilGami.badgesDebloques.length} / {tousLesBadges.length} débloqués
        </p>
        <BadgeGrid allBadges={tousLesBadges} debloques={profilGami.badgesDebloques} />
      </div>
    </div>
  );
})()}
```

- [ ] **Step 5 : Commit**

```bash
git add src/app/progression/page.tsx
git commit -m "feat(gamification): section niveau + badges dans la page Progression"
```

---

## Task 10 : Vérification finale

- [ ] **Step 1 : Lancer le build pour vérifier l'absence d'erreurs TypeScript**

```bash
cd C:/Users/Benpo/Desktop/Claude-code/projet-Ben-Dan
npm run build
```

Expected: Build réussi sans erreur TypeScript.

- [ ] **Step 2 : Tester manuellement le flux complet**

1. Ouvrir l'app (`npm run dev`)
2. Faire un quiz → vérifier le toast XP apparaît après
3. Vérifier la XPBar dans le header (visible si XP > 0)
4. Aller sur `/progression` → vérifier la section niveau + badges
5. Refaire le même quiz le même jour → vérifier que l'XP n'est pas re-gagné
6. Vérifier la console : aucune erreur

- [ ] **Step 3 : Commit de finalisation**

```bash
git add -A
git commit -m "feat: gamification complète — XP, niveaux, badges"
```
