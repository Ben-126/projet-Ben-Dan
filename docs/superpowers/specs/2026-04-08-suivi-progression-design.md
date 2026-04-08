# Suivi de Progression — Design Spec
**Date :** 2026-04-08
**Statut :** Approuvé

---

## Objectif

Implémenter le suivi de progression V1 défini dans `instructions.md` (lignes 75–81) :
- Statistiques par matière
- Graphique par matière
- Historique des quiz
- Indicateur de maîtrise des chapitres

---

## Données (localStorage)

### Clé existante — `quiz-performances` (inchangée)
Structure actuelle conservée sans migration :
```
{ "[matiereSlug]/[chapitreSlug]": PerformanceChapitre }
```

### Nouvelle clé — `quiz-history`
Liste chronologique des quiz complétés, max 100 entrées (les plus récentes) :

```ts
interface EntreeHistorique {
  date: string;        // ISO 8601, ex: "2026-04-08T14:32:00"
  niveau: string;      // "seconde" | "premiere" | "terminale"
  matiereSlug: string;
  matiereName: string;
  chapitreSlug: string;
  chapitreNom: string;
  score: number;       // pourcentage 0–100
}
```

L'historique commence à partir du premier quiz complété après la mise en production. Aucune migration des données existantes.

---

## Architecture

### Nouveaux fichiers

```
src/
  lib/
    history.ts                    ← lecture/écriture quiz-history
  components/
    progression/
      IndicateurMaitrise.tsx      ← badge couleur + barre de progression
      GraphiqueEvolution.tsx      ← courbe des 5 derniers scores (Recharts LineChart)
      GraphiqueChapitres.tsx      ← barres par chapitre (Recharts BarChart)
      HistoriqueQuiz.tsx          ← liste des derniers quiz groupée par date
      StatsMatiere.tsx            ← résumé : nb quiz complétés, score moyen
  app/
    progression/
      page.tsx                    ← page /progression (client component)
```

### Fichiers modifiés

| Fichier | Modification |
|---------|-------------|
| `src/lib/performance.ts` | `sauvegarderPerformance()` appelle aussi `ajouterHistorique()` |
| `src/components/navigation/ChapitreCard.tsx` | Affiche `IndicateurMaitrise` si données dispo |
| `src/components/navigation/Header.tsx` | Ajout lien "Progression 📊" |

---

## Composants détaillés

### `IndicateurMaitrise`
Props : `{ scoreMoyen: number | null, nombreQuiz: number }`

Rendu :
- Si `nombreQuiz === 0` : badge ⚪ "Pas encore fait", pas de barre
- Si `scoreMoyen < 40` : badge 🔴 rouge + barre rouge
- Si `scoreMoyen < 80` : badge 🟡 orange + barre orange
- Si `scoreMoyen >= 80` : badge 🟢 vert + barre verte

### `GraphiqueEvolution`
Props : `{ entrees: EntreeHistorique[] }` (filtrées par chapitre depuis `quiz-history`)

Recharts `LineChart` responsive, affiche les 5 dernières entrées du chapitre sélectionné.
Axe Y : 0–100, axe X : dates courtes (dd/mm).
Source de données : `quiz-history` filtré par `chapitreSlug`, pas `derniersScores` (qui n'a pas de dates).

### `GraphiqueChapitres`
Props : `{ chapitres: { nom: string, scoreMoyen: number | null }[] }`

Recharts `BarChart` horizontal, une barre par chapitre.
Chapitres non faits affichés en gris.

### `HistoriqueQuiz`
Props : `{ entrees: EntreeHistorique[], filtreMatiere?: string }`

Liste groupée par date (Aujourd'hui / Hier / dd/mm/yyyy).
Chaque entrée : emoji matière + nom matière · nom chapitre + score + badge maîtrise.

### `StatsMatiere`
Props : `{ matiereSlug: string, chapitres: Chapitre[] }`

Calcule depuis `quiz-performances` :
- Nombre total de quiz complétés dans la matière
- Score moyen global de la matière
- Nombre de chapitres maîtrisés (≥ 80%)

---

## Page `/progression`

Structure :
1. **Filtre niveau** — tabs Seconde / Première / Terminale
2. **Résumé global** — total quiz complétés + score moyen toutes matières
3. **Section par matière** — sélecteur matière + `StatsMatiere` + `GraphiqueChapitres` + `GraphiqueEvolution` (chapitre sélectionné par clic sur une barre, ou premier chapitre avec données par défaut)
4. **Historique récent** — `HistoriqueQuiz` sans filtre, 20 dernières entrées

---

## Intégration dans la page matière (`/[niveau]/[matiere]`)

- `StatsMatiere` affiché en haut de la liste des chapitres
- Chaque `ChapitreCard` enrichie avec `IndicateurMaitrise` en bas

---

## Dépendance

- **Recharts** (`recharts`) — graphiques LineChart et BarChart
- Installation : `npm install recharts`

---

## Contraintes

- Tout en localStorage (client-side), pas d'appel API
- Composants graphiques marqués `"use client"`
- Si localStorage vide (premier usage), la page `/progression` affiche un état vide encourageant
- Pas de modification du schéma `quiz-performances` existant

---

## Optimisations client (obligatoires)

### Hydratation Next.js
- Recharts chargé via `dynamic(() => import('recharts'), { ssr: false })` pour éviter les erreurs d'hydratation (Recharts utilise `window`)
- Tous les accès localStorage dans `useEffect` ou gardés par `typeof window !== "undefined"`

### Zéro layout shift
- Les `ChapitreCard` ont une hauteur fixe même sans données de progression — `IndicateurMaitrise` affiche un skeleton discret (`animate-pulse`) pendant l'hydratation côté client

### Animations
- Recharts : animations activées (`isAnimationActive={true}`) pour les graphiques — effet d'apparition fluide au premier rendu
- Barre de progression dans `IndicateurMaitrise` : transition CSS `duration-700` pour l'animation de remplissage

### Mobile-first
- Tous les graphiques Recharts dans un `ResponsiveContainer` (largeur 100%, hauteur fixe 200px)
- `HistoriqueQuiz` : liste compacte, lisible sur petit écran
- Page `/progression` : layout colonne sur mobile, 2 colonnes sur desktop pour les graphiques

### État vide soigné
- Page `/progression` vide : illustration + message "Lance ton premier quiz pour voir ta progression ici 🚀" + bouton vers la page d'accueil
- `ChapitreCard` sans données : badge ⚪ sobre, pas d'espace vide visible
