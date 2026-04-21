"use client";
import type { ProfilGamification } from "@/types";

interface CalendrierStreakProps {
  profil: ProfilGamification;
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  // Transformer dimanche=0 en lundi=0
  const day = new Date(year, month, 1).getDay();
  return (day + 6) % 7;
}

type EtatJour = "joue" | "gele" | "manque" | "futur" | "aujourd";

const MOIS_NOMS = [
  "Janvier","Février","Mars","Avril","Mai","Juin",
  "Juillet","Août","Septembre","Octobre","Novembre","Décembre",
];

const JOURS_SEMAINE = ["L", "M", "M", "J", "V", "S", "D"];

const CLASSE_PAR_ETAT: Record<EtatJour, string> = {
  joue:    "bg-orange-400 text-white font-bold",
  gele:    "bg-blue-200 text-blue-700 font-medium",
  manque:  "bg-gray-100 text-gray-400",
  futur:   "bg-transparent text-gray-300",
  aujourd: "bg-indigo-600 text-white font-bold ring-2 ring-indigo-300",
};

const TITRE_PAR_ETAT: Record<EtatJour, string> = {
  joue:    "Quiz fait ✅",
  gele:    "Gel utilisé ❄️",
  manque:  "Jour manqué",
  futur:   "",
  aujourd: "Aujourd'hui",
};

export default function CalendrierStreak({ profil }: CalendrierStreakProps) {
  const today    = new Date();
  const year     = today.getFullYear();
  const month    = today.getMonth();
  const todayStr = today.toISOString().slice(0, 10);

  const joursJouesSet = new Set(profil.joursJoues);
  const joursGelesSet = new Set(profil.joursGeles);

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay    = getFirstDayOfMonth(year, month);

  const cellules: (number | null)[] = [
    ...Array<null>(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  function getEtat(day: number): EtatJour {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    if (dateStr === todayStr)          return "aujourd";
    if (dateStr > todayStr)            return "futur";
    if (joursJouesSet.has(dateStr))    return "joue";
    if (joursGelesSet.has(dateStr))    return "gele";
    return "manque";
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">
        📅 {MOIS_NOMS[month]} {year}
      </h3>

      {/* En-têtes jours */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {JOURS_SEMAINE.map((j, i) => (
          <div key={i} className="text-center text-xs font-semibold text-gray-400 py-1">
            {j}
          </div>
        ))}
      </div>

      {/* Cases */}
      <div className="grid grid-cols-7 gap-1">
        {cellules.map((day, idx) => {
          if (day === null) return <div key={`empty-${idx}`} />;
          const etat = getEtat(day);
          return (
            <div
              key={day}
              className={`aspect-square flex items-center justify-center rounded-lg text-xs transition-all ${CLASSE_PAR_ETAT[etat]}`}
              title={TITRE_PAR_ETAT[etat]}
            >
              {day}
            </div>
          );
        })}
      </div>

      {/* Légende */}
      <div className="flex gap-3 mt-3 flex-wrap">
        <LegendItem color="bg-orange-400" label="Quiz fait" />
        <LegendItem color="bg-blue-200"   label="Gel utilisé" />
        <LegendItem color="bg-gray-100"   label="Manqué" />
        <LegendItem color="bg-indigo-600" label="Aujourd'hui" />
      </div>
    </div>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className={`w-3 h-3 rounded ${color}`} />
      <span className="text-xs text-gray-500">{label}</span>
    </div>
  );
}
