"use client";
import { useState } from "react";
import type { ExplicationAvancee as ExplicationAvanceeType } from "@/types";

interface ExplicationAvanceeProps {
  explicationAvancee?: ExplicationAvanceeType;
  defaultExpanded?: boolean;
}

export default function ExplicationAvancee({
  explicationAvancee,
  defaultExpanded = false,
}: ExplicationAvanceeProps) {
  const [ouvert, setOuvert] = useState(defaultExpanded);

  if (!explicationAvancee) return null;

  const { etapes, methode, erreurs_frequentes } = explicationAvancee;
  const aContenu =
    (etapes && etapes.length > 0) ||
    methode ||
    (erreurs_frequentes && erreurs_frequentes.length > 0);

  if (!aContenu) return null;

  return (
    <div className="rounded-xl border border-indigo-100 overflow-hidden">
      <button
        onClick={() => setOuvert((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-2.5 bg-indigo-50 hover:bg-indigo-100 transition-colors text-left"
        aria-expanded={ouvert}
      >
        <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">
          Explication détaillée
        </span>
        <span className="text-indigo-400 text-sm">{ouvert ? "▲" : "▼"}</span>
      </button>

      {ouvert && (
        <div className="bg-white px-4 py-3 space-y-4">
          {methode && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide shrink-0">
                Méthode
              </span>
              <span className="inline-block bg-indigo-100 text-indigo-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                {methode}
              </span>
            </div>
          )}

          {etapes && etapes.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Étapes de résolution
              </p>
              <ol className="space-y-2">
                {etapes.map((etape, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="shrink-0 w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-sm text-gray-700 leading-relaxed">{etape}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {erreurs_frequentes && erreurs_frequentes.length > 0 && (
            <div className="bg-amber-50 rounded-lg p-3 border border-amber-200">
              <p className="text-xs font-semibold text-amber-600 uppercase tracking-wide mb-2">
                Erreurs fréquentes
              </p>
              <ul className="space-y-1.5">
                {erreurs_frequentes.map((erreur, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-amber-800">
                    <span className="shrink-0 mt-0.5">⚠️</span>
                    <span>{erreur}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
