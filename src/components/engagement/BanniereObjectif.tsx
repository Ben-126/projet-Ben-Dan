// src/components/engagement/BanniereObjectif.tsx
"use client";
import { useState, useEffect } from "react";
import { getProgressionObjectif, type ProgressionObjectif } from "@/lib/objectif";

export default function BanniereObjectif() {
  const [progression, setProgression] = useState<ProgressionObjectif | null>(null);

  useEffect(() => {
    setProgression(getProgressionObjectif());
  }, []);

  if (!progression) return null;

  const { actuel, cible, atteint, restant } = progression;
  const pourcentage = Math.min(100, Math.round((actuel / cible) * 100));

  const banniereClasses = atteint
    ? "bg-green-50 border-green-200"
    : pourcentage >= 50
    ? "bg-orange-50 border-orange-200"
    : "bg-red-50 border-red-200";

  const barreClasse = atteint
    ? "bg-green-500"
    : pourcentage >= 50
    ? "bg-orange-400"
    : "bg-red-400";

  const message = atteint
    ? "Objectif du jour atteint ! Bravo 🎉"
    : actuel === 0
    ? `Lance ton premier quiz du jour ! (objectif : ${cible} quiz réussi${cible > 1 ? "s" : ""})`
    : `Encore ${restant} quiz pour atteindre ton objectif !`;

  return (
    <div className={`rounded-xl border p-3 mb-4 ${banniereClasses}`} data-testid="banniere-objectif">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-gray-600">🎯 Objectif du jour</span>
        <span className="text-xs font-bold text-gray-700">
          {actuel} / {cible} quiz réussi{cible > 1 ? "s" : ""}
        </span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${barreClasse}`}
          style={{ width: `${pourcentage}%` }}
        />
      </div>
      <p className="text-xs text-gray-600 mt-1.5">{message}</p>
    </div>
  );
}
