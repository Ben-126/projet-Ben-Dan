"use client";

import { useState, useEffect } from "react";
import { getClassementGlobal, getClassementAmis } from "@/lib/social";
import type { EntreeClassement } from "@/types";
import { getNiveauFromXP } from "@/lib/gamification";

interface ClassementProps {
  userId: string;
}

type OngletClassement = "global" | "amis";

export default function Classement({ userId }: ClassementProps) {
  const [onglet, setOnglet] = useState<OngletClassement>("global");
  const [entrees, setEntrees] = useState<EntreeClassement[]>([]);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    const charger = async () => {
      setChargement(true);
      const data =
        onglet === "global"
          ? await getClassementGlobal(100)
          : await getClassementAmis(userId);
      setEntrees(data);
      setChargement(false);
    };
    charger();
  }, [onglet, userId]);

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {(["global", "amis"] as OngletClassement[]).map((o) => (
          <button
            key={o}
            onClick={() => setOnglet(o)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
              onglet === o
                ? "bg-indigo-600 text-white"
                : "bg-white text-indigo-600 border border-indigo-300 hover:border-indigo-500"
            }`}
          >
            {o === "global" ? "🌍 Global" : "👥 Amis"}
          </button>
        ))}
      </div>

      {chargement ? (
        <div className="flex justify-center py-8">
          <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
        </div>
      ) : entrees.length === 0 ? (
        <p className="text-center text-gray-400 py-8 text-sm">
          {onglet === "amis" ? "Ajoute des amis pour voir leur classement !" : "Aucun joueur pour l'instant."}
        </p>
      ) : (
        <ol className="space-y-2">
          {entrees.map((e) => {
            const niveau = getNiveauFromXP(e.xp_total);
            const estMoi = e.id === userId;
            return (
              <li
                key={e.id}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${
                  estMoi ? "bg-indigo-50 border-indigo-300 font-semibold" : "bg-white border-gray-100"
                }`}
              >
                <span className="w-7 text-center font-bold text-gray-500 text-sm">
                  {e.rang === 1 ? "🥇" : e.rang === 2 ? "🥈" : e.rang === 3 ? "🥉" : `#${e.rang}`}
                </span>
                <span className="text-lg">{niveau.emoji}</span>
                <span className="flex-1 text-sm truncate">{e.pseudo}{estMoi ? " (moi)" : ""}</span>
                <span className="text-indigo-600 font-bold text-sm">{e.xp_total} XP</span>
                {e.streak_jours >= 3 && (
                  <span title={`Série de ${e.streak_jours} jours`} className="text-sm">🔥</span>
                )}
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
